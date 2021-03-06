/**
 * cls.scd FtpUploader.java 2019. 1. 28. 오후 2:41:09 kspark
 */
package jmnet.moka.core.common.ftp;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.concurrent.atomic.AtomicInteger;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPReply;
import org.apache.commons.pool2.BasePooledObjectFactory;
import org.apache.commons.pool2.PooledObject;
import org.apache.commons.pool2.impl.DefaultPooledObject;

/**
 * <pre>
 * FTP 전송 기능을 구현한다.
 * Project : moka
 * Package : jmnet.moka.core.common.ftp
 * ClassName : FtpClientFactory
 * Created : 2020-11-20 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-20 10:39
 */
@Slf4j
public class FtpClientFactory extends BasePooledObjectFactory<FTPClient> {
    public static final int UNASSIGNED = -1;
    public static final int MAX_RECONNECT = 5;
    private ByteArrayOutputStream bao = null;
    private FtpInfo ftpInfo;


    public FtpClientFactory(FtpInfo ftpInfo) {
        this.ftpInfo = ftpInfo;
        bao = new ByteArrayOutputStream();
    }

    public FtpInfo getFtpInfo() {
        return ftpInfo;
    }

    /**
     * <pre>
     * ftp 서버와 통신 결과를 반환한다.
     * </pre>
     *
     * @return 통신결과
     */
    public String getCommandLine() {
        return bao.toString();
    }



    @Override
    public FTPClient create()
            throws Exception {
        FTPClient ftpClient = new FTPClient();
        ftpClient.setConnectTimeout(ftpInfo.getConnectTimeout());
        ftpClient.setDataTimeout(ftpInfo.getReadTimeout());
        try {

            ftpClient.connect(ftpInfo.getHost(), Integer.parseInt(ftpInfo.getPort()));
            int replyCode = ftpClient.getReplyCode();
            if (!FTPReply.isPositiveCompletion(replyCode)) {
                ftpClient.disconnect();
                replyCode = tryReconnection(ftpClient);
                if (!FTPReply.isPositiveCompletion(replyCode)) {
                    log.warn("FTPServer refused connection,replyCode:{}", replyCode);
                }
            }

            if (!ftpClient.login(ftpInfo.getUser(), ftpInfo.getPasswd())) {
                log.warn("ftpClient login failed... username is {}; password: {}", ftpInfo.getUser(), ftpInfo.getPasswd());
            }

            ftpClient.setBufferSize(ftpInfo.getBufferSize());
            ftpClient.setFileType(ftpInfo.getTransferFileType());
            if (ftpInfo.isPassive()) {
                ftpClient.enterLocalPassiveMode();
            }

        } catch (IOException e) {
            log.error(e.toString());
        }
        return ftpClient;
    }

    private int tryReconnection(FTPClient ftpClient) {
        int replyCode = 0;
        try {
            AtomicInteger reconnCnt = new AtomicInteger(MAX_RECONNECT);
            while (reconnCnt.decrementAndGet() > 0) {
                ftpClient.connect(ftpInfo.getHost(), Integer.parseInt(ftpInfo.getPort()));
                replyCode = ftpClient.getReplyCode();
                if (!FTPReply.isPositiveCompletion(replyCode)) {
                    ftpClient.disconnect();
                    log.warn("FTPServer refused connection,replyCode:{}", replyCode);
                } else {
                    reconnCnt.set(0);
                }
            }

        } catch (IOException e) {
            log.error(e.toString());
        }

        return replyCode;
    }

    @Override
    public PooledObject<FTPClient> wrap(FTPClient ftpClient) {
        return new DefaultPooledObject<>(ftpClient);
    }

    /**
     * Destroy FtpClient object
     */
    @Override
    public void destroyObject(PooledObject<FTPClient> ftpPooled) {
        if (ftpPooled == null) {
            return;
        }

        FTPClient ftpClient = ftpPooled.getObject();

        try {
            if (ftpClient.isConnected()) {
                ftpClient.logout();
            }
        } catch (IOException io) {
            log.error("ftp client logout failed...{}", io);
        } finally {
            try {
                ftpClient.disconnect();
            } catch (IOException io) {
                log.error("close ftp client failed...{}", io);
            }
        }
    }

    /**
     * Verify the FtpClient object
     */
    @Override
    public boolean validateObject(PooledObject<FTPClient> ftpPooled) {
        try {
            FTPClient ftpClient = ftpPooled.getObject();
            return ftpClient.sendNoOp();
        } catch (IOException e) {
            log.error("Failed to validate client: {}", e.toString());
        }
        return false;
    }
}
