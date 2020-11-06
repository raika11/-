package jmnet.moka.web.rcv.taskinput;

import java.io.File;
import java.io.FilenameFilter;
import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamException;
import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.common.TimeHumanizer;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.rcv.common.object.JaxbObjectManager;
import jmnet.moka.web.rcv.common.taskinput.TaskInput;
import jmnet.moka.web.rcv.common.taskinput.TaskInputData;
import jmnet.moka.web.rcv.common.vo.BasicVo;
import jmnet.moka.web.rcv.exception.RcvException;
import jmnet.moka.web.rcv.util.RcvFileUtil;
import jmnet.moka.web.rcv.util.RcvUtil;
import jmnet.moka.web.rcv.util.XMLUtil;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.filefilter.WildcardFileFilter;
import org.w3c.dom.Node;

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
public class FileTaskInput<P, C> extends TaskInput {
    private File dirScan;
    private String dirSuccess;
    private String dirFailed;
    private String fileFilter;
    private int fileWaitTime;
    private int retryCount;
    private final Class<P> parentObjectType;
    private final Class<C> objectType;

    public FileTaskInput(Class<P> parentObjectType, Class<C> objectType)
    {
        this.parentObjectType = parentObjectType;
        this.objectType = objectType;
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
        retryCount = RcvUtil.ParseInt(xu.getString(node, "./@retryCount", "3"));
    }

    @Override
    @SuppressWarnings("unchecked")
    public TaskInputData getTaskInputData() {
        File[] files = dirScan.listFiles((FilenameFilter) new WildcardFileFilter(fileFilter) {
            private static final long serialVersionUID = -3664961240348292860L;
            boolean first = true;

            public boolean accept(File dir, String name) {
                if (!first) {
                    return false;
                }
                if (!super.accept(dir, name)) {
                    return false;
                }
                first = false;
                return true;
            }
        });

        if (files == null || files.length <= 0) {
            return null;
        }

        final File file = files[0];
        if (System.currentTimeMillis() - file.lastModified() < this.fileWaitTime) {
            return null;
        }

        BasicVo objectData = null;

        int retryCount = this.retryCount;
        do {
            try {
                objectData = JaxbObjectManager.getBasicVoFromXml(file, objectType);
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

        return new FileTaskInputData<>(file, (C) objectData, this, parentObjectType, objectType);
    }
}
