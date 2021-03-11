package jmnet.moka.web.rcv.taskinput;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.BasicFileAttributes;
import java.nio.file.attribute.FileTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamException;
import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.common.TimeHumanizer;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.rcv.common.object.JaxbObjectManager;
import jmnet.moka.web.rcv.common.taskinput.TaskInput;
import jmnet.moka.web.rcv.common.taskinput.TaskInputData;
import jmnet.moka.web.rcv.common.taskinput.inputfilter.InputFilter;
import jmnet.moka.web.rcv.common.vo.BasicVo;
import jmnet.moka.web.rcv.exception.RcvException;
import jmnet.moka.web.rcv.service.SlackMessageService;
import jmnet.moka.web.rcv.util.RcvFileUtil;
import jmnet.moka.web.rcv.util.RcvUtil;
import jmnet.moka.web.rcv.util.XMLUtil;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.input
 * ClassName : TaskInputFile
 * Created : 2020-10-27 027 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-27 027 오후 5:11
 */

@Getter
@Slf4j
public class FileXmlTaskInput<P, C> extends TaskInput {
    private File dirScan;
    private String dirSuccess;
    private String dirFailed;
    private String fileFilter;
    private int fileWaitTime;
    private int retryCount;
    private final Class<P> parentObjectType;
    private final Class<C> objectType;
    private FileXmlTaskInputFilePreProcess filePreProcess;
    private String sourceBuffer;
    private final List<InputFilter> inputFilters = new ArrayList<>();

    private int alertLimitUse;
    private int alertLimitFileCount;
    private int alertLimitFileTime;

    public FileXmlTaskInput(Class<P> parentObjectType, Class<C> objectType) {
        this.parentObjectType = parentObjectType;
        this.objectType = objectType;
    }

    public void setSourceBuffer(String sourceBuffer) {
        this.sourceBuffer = sourceBuffer;
    }

    public void setFilePreProcess(FileXmlTaskInputFilePreProcess filePreProcess) {
        this.filePreProcess = filePreProcess;
    }

    @Override
    public void load(Node node, XMLUtil xu)
            throws XPathExpressionException, RcvException {
        String dirInput = xu.getString(node, "./@dirInput", "");
        if (McpString.isNullOrEmpty(dirInput)) {
            throw new RcvException("Input Path is Blank");
        }
        if (!RcvFileUtil.createDirectories(dirInput)) {
            throw new RcvException("Input Path can't create");
        }

        this.dirSuccess = xu.getString(node, "./@dirSuccess", "");
        RcvFileUtil.createDirectories(this.dirSuccess);
        this.dirFailed = xu.getString(node, "./@dirFailed", "");
        RcvFileUtil.createDirectories(this.dirFailed);

        fileFilter = xu.getString(node, "./@fileFilter", "*.*");
        fileWaitTime = TimeHumanizer.parse(xu.getString(node, "./@fileWaitTime", "3s"), 3000);
        dirScan = new File(dirInput);
        retryCount = RcvUtil.parseInt(xu.getString(node, "./@retryCount", "3"));

        this.alertLimitUse = RcvUtil.parseInt(xu.getString(node, "./@alertLimitUse", "0"));
        this.alertLimitFileCount = RcvUtil.parseInt(xu.getString(node, "./@allertLimitFileCount", "30"));
        this.alertLimitFileTime = TimeHumanizer.parse(xu.getString(node, "./@allertLimitFileTime", "20m"));
        if (this.alertLimitFileTime < 50) {
            this.alertLimitFileTime = 60000;
        }

        NodeList nl = node.getChildNodes();
        if (nl == null) {
            return;
        }
        for (int i = 0; i < nl.getLength(); i++) {
            if( !nl.item(i).getNodeName().equals("inputFilter")  )
                continue;

            String cls = "";
            try {
                cls = xu.getString(nl.item(i), "./@class", "");
                if (McpString.isNullOrEmpty(cls)) {
                    continue;
                }
                this.inputFilters.add((InputFilter) Class
                        .forName(cls)
                        .getDeclaredConstructor(Node.class, XMLUtil.class)
                        .newInstance(nl.item(i), xu));
            } catch (Exception e) {
                log.error("Can't load inputFilter [{}] {}", cls, e);
            }
        }
        log.debug( "FileTaskInput : InputFilter count : {} Load ", this.inputFilters.size());
    }

    @Override
    @SuppressWarnings("unchecked")
    public TaskInputData getTaskInputData() {
        final File[] fileList = this.dirScan.listFiles();
        if (fileList == null || fileList.length <= 0) {
            return null;
        }

        File file = null;
        for (File f : fileList) {
            if (!f.isFile()) {
                continue;
            }
            if (FilenameUtils.wildcardMatch(f.getName(), fileFilter)) {
                if (System.currentTimeMillis() - f.lastModified() < this.fileWaitTime) {
                    continue;
                }

                if (this.filePreProcess != null) {
                    if (!filePreProcess.preProcess(f)) {
                        continue;
                    }
                }

                file = f;
                break;
            } else {
                for (InputFilter inputFilter : inputFilters) {
                    if (inputFilter.doProcess(f)) {
                        break;
                    }
                }
            }
        }

        if( file == null )
            return null;

        BasicVo objectData = null;
        int retryCount = this.retryCount;
        do {
            try {
                if (McpString.isNullOrEmpty(this.sourceBuffer)) {
                    objectData = JaxbObjectManager.getBasicVoFromXml(file, objectType);
                } else {
                    objectData = JaxbObjectManager.getBasicVoFromString(this.sourceBuffer, objectType);
                }
                break;
            } catch (XMLStreamException | JAXBException e) {
                log.info("FIle [{}] can't make object retry[{}] ", file, this.retryCount - retryCount + 1);
            }
            try {
                Thread.sleep(fileWaitTime);
            } catch (InterruptedException e) {
                break;
            }
        } while (--retryCount > 0);

        if (objectData == null) {
            log.error("FIle [{}] is not normal XML File ", file);
        }

        return new FileXmlTaskInputData<>(file, (C) objectData, this, parentObjectType, objectType);
    }

    private List<File> getDirScanFiles() {
        final File[] fileList = this.dirScan.listFiles();
        if (fileList == null || fileList.length <= 0) {
            return null;
        }

        List<File> files = new ArrayList<>();
        for (File f : fileList) {
            if (!f.isFile()) {
                continue;
            }
            if (FilenameUtils.wildcardMatch(f.getName(), this.fileFilter)) {
                if (System.currentTimeMillis() - f.lastModified() < this.fileWaitTime) {
                    continue;
                }

                if( f.length() != 0)
                    files.add(f);
            }
        }
        if( files.size() <= 0 )
            return null;

        return files;
    }

    @Override
    public void processMonitor(SlackMessageService slackMessageService, String taskName) {
        //noinspection ConstantConditions
        do{
            if( this.alertLimitUse < 1 )
                break;

            List<File> files = getDirScanFiles();
            if( files == null )
                break;

            if (files.size() == 0)
                break;

            StringBuilder sb = new StringBuilder(taskName);
            boolean alert = false;
            if (files.size() > this.alertLimitFileCount) {
                alert = true;
                sb.append(String.format("  : 전송 기사 %d개 대기 !!  ", files.size()));
            }
            try {
                Path path = files.get(0).toPath();
                BasicFileAttributes fileAttributes = Files.readAttributes(path, BasicFileAttributes.class);

                final FileTime tmCreate = fileAttributes.creationTime();
                if (System.currentTimeMillis() - tmCreate.toMillis() > this.alertLimitFileTime) {
                    alert = true;
                    sb.append(String.format("  : [%s] 생성된 기사 %s 대기 !!", McpDate.dateStr(new Date(tmCreate.toMillis()), McpDate.DATETIME_FORMAT),
                            path.toString()));
                }
            } catch (IOException ignore) {
                log.trace("FileXmlTaskInput :: processMonitor Exception" );
            }

            if( !alert)
                break;

            final String message = sb.toString();
            log.error( "{} monitoring Allert {}", taskName, message );
            slackMessageService.sendSms(String.format("%s monitor", taskName ), message);

        }while( false );
    }
}
