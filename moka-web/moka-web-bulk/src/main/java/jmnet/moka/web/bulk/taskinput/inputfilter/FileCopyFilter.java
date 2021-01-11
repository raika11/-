package jmnet.moka.web.bulk.taskinput.inputfilter;

import java.io.File;
import java.util.Date;
import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.bulk.common.taskinput.inputfilter.InputFilter;
import jmnet.moka.web.bulk.exception.BulkException;
import jmnet.moka.web.bulk.util.BulkFileUtil;
import jmnet.moka.web.bulk.util.XMLUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.w3c.dom.Node;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.taskinput.inputfilter
 * ClassName : FileCopyFilter
 * Created : 2020-11-18 018 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-18 018 오후 1:47
 */

@Slf4j
public class FileCopyFilter extends InputFilter {
    private String dirSuccess;
    private String fileFilter;

    public FileCopyFilter(Node node, XMLUtil xu)
            throws XPathExpressionException, BulkException {
        super(node, xu);
    }

    @Override
    protected void load(Node node, XMLUtil xu)
            throws XPathExpressionException, BulkException {
        super.load(node, xu);

        this.fileFilter = xu.getString(node, "./@fileFilter", "");
        if (McpString.isNullOrEmpty(this.fileFilter)) {
            throw new BulkException("fileFilter 환경 값 설정이 잘못되었습니다.");
        }

        this.dirSuccess = xu.getString(node, "./@dirSuccess", "");
        if (McpString.isNullOrEmpty(this.dirSuccess)) {
            throw new BulkException("dirSuccess 환경 값 설정이 잘못되었습니다.");
        }
        BulkFileUtil.createDirectories(this.dirSuccess);
    }

    @Override
    public boolean doProcess(File file) {
        if (!FilenameUtils.wildcardMatch(file.getName(), this.fileFilter))
            return false;

        try {
            BulkFileUtil.moveFileToDateDir(file, this.dirSuccess, McpDate.dateStr(new Date(), "yyyyMM/dd"));
            log.info( "파일 이동 완료 {}-{}", file, this.dirSuccess);
            return true;
        } catch (BulkException e) {
            log.error(e.getMessage());
        }
        return false;
    }
}
