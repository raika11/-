package jmnet.moka.web.bulk.taskinput.inputfilter;

import java.io.File;
import java.util.Date;
import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.bulk.common.taskinput.inputfilter.InputFilter;
import jmnet.moka.web.bulk.config.FtpConfig;
import jmnet.moka.web.bulk.exception.BulkException;
import jmnet.moka.web.bulk.util.FtpUtil;
import jmnet.moka.web.bulk.util.BulkFileUtil;
import jmnet.moka.web.bulk.util.BulkUtil;
import jmnet.moka.web.bulk.util.XMLUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.w3c.dom.Node;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.taskinput.inputfilter
 * ClassName : FtpSenderFilter
 * Created : 2020-11-18 018 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-18 018 오후 1:47
 */

@Slf4j
public class FtpSenderFilter extends InputFilter {
    private String dirSuccess;
    private String fileFilter;
    private FtpConfig ftpConfig;

    public FtpSenderFilter(Node node, XMLUtil xu)
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
        if (!McpString.isNullOrEmpty(this.dirSuccess)) {
            BulkFileUtil.createDirectories(this.dirSuccess);
        }

        ftpConfig = new FtpConfig();
        this.ftpConfig.setIp(xu.getString(node, "./@ftp.ip", ""));
        if (McpString.isNullOrEmpty(this.ftpConfig.getIp())) {
            throw new BulkException("ftp.ip 환경 값 설정이 잘못되었습니다.");
        }

        this.ftpConfig.setUser(xu.getString(node, "./@ftp.user", ""));
        if (McpString.isNullOrEmpty(this.ftpConfig.getUser())) {
            throw new BulkException("ftp.user 환경 값 설정이 잘못되었습니다.");
        }

        this.ftpConfig.setPassword(xu.getString(node, "./@ftp.password", ""));
        if (McpString.isNullOrEmpty(this.ftpConfig.getPassword())) {
            throw new BulkException("ftp.password 환경 값 설정이 잘못되었습니다.");
        }

        this.ftpConfig.setRootDir(xu.getString(node, "./@ftp.rootDir", ""));
        if (McpString.isNullOrEmpty(this.ftpConfig.getRootDir())) {
            throw new BulkException("ftp.rootDir 환경 값 설정이 잘못되었습니다.");
        }

        this.ftpConfig.setPassive(BulkUtil.parseInt(xu.getString(node, "./@ftp.passive", "0")));

        this.ftpConfig.setPort(BulkUtil.parseInt(xu.getString(node, "./@ftp.port", "")));
        if (this.ftpConfig.getPort() == 0) {
            throw new BulkException("ftp.port 환경 값 설정이 잘못되었습니다.");
        }
    }

    @Override
    public boolean doProcess(File file) {
        if (!FilenameUtils.wildcardMatch(file.getName(), this.fileFilter)) {
            return false;
        }

        if (!FtpUtil.uploadFle(this.ftpConfig, file.toString(), "/", file.getName())) {
            log.error("ftp 전송 오류");
            return false;
        }else
            log.info("FtpSenderFilter Ftp 전송 완료 {}", file);

        if (!McpString.isNullOrEmpty(this.dirSuccess)) {
            try {
                BulkFileUtil.moveFileToDateDir(file, this.dirSuccess, McpDate.dateStr(new Date(), "yyyyMM/dd"));
                log.info("FtpSenderFilter 파일 이동 완료 {}-{}", file, this.dirSuccess);
                return true;
            } catch (BulkException e) {
                log.error(e.getMessage());
                return false;
            }
        } else {
            if (!file.delete()) {
                log.error("FtpSenderFilter 파일 삭제 오류 {}", file);
                return false;
            }
        }
        return true;
    }
}
