package jmnet.moka.web.bulk.taskinput;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.common.TimeHumanizer;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.bulk.common.taskinput.TaskInput;
import jmnet.moka.web.bulk.common.taskinput.TaskInputData;
import jmnet.moka.web.bulk.common.taskinput.inputfilter.InputFilter;
import jmnet.moka.web.bulk.exception.BulkException;
import jmnet.moka.web.bulk.util.BulkFileUtil;
import jmnet.moka.web.bulk.util.XMLUtil;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.w3c.dom.Node;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.taskinput
 * ClassName : FileTaskInput
 * Created : 2021-01-26 026 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-01-26 026 오후 1:15
 */
@Getter
@Setter
@Slf4j
public class FileTaskInput extends TaskInput {
    private File dirScan;
    private String fileFilter;
    private int fileWaitTime;
    private final boolean isLoadDirect;

    public FileTaskInput() {
        this.isLoadDirect= false;
    }

    public FileTaskInput(boolean isLoadDirect) {
        super();
        this.isLoadDirect= isLoadDirect;
    }

    @Override
    public void load(Node node, XMLUtil xu)
        throws XPathExpressionException, BulkException {

        if( this.isLoadDirect )
            return;

        loadDirect(node, xu);
    }

    public void loadDirect( Node node, XMLUtil xu )
            throws XPathExpressionException, BulkException {
        if( this.dirScan == null ) {
            final String dirInput = xu.getString(node, "./@dirInput", "");
            if (McpString.isNullOrEmpty(dirInput)) {
                throw new BulkException("Input Path is Blank");
            }
            if (!BulkFileUtil.createDirectories(dirInput)) {
                throw new BulkException("Input Path can't create");
            }
            this.dirScan = new File(dirInput);
        }

        this.fileFilter = xu.getString(node, "./@fileFilter", "*.*");
        this.fileWaitTime = TimeHumanizer.parse(xu.getString(node, "./@fileWaitTime", "3s"), 3000);
    }

    @Override
    public TaskInputData getTaskInputData() {
        if( this.dirScan == null ) {
            log.error("FileTaskInput Init Error");
            return null;
        }

        List<File> files = BulkFileUtil.getDirScanFiles( this.dirScan, this.fileFilter, this.fileWaitTime );
        if( files == null )
            return null;

        return new FileTaskInputData(files);
    }
}
