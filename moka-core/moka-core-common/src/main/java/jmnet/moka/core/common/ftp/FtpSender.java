/**
 * cls.scd FtpUploader.java 2019. 1. 28. 오후 2:41:09 kspark
 */
package jmnet.moka.core.common.ftp;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import jmnet.moka.core.common.exception.MokaException;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.net.PrintCommandListener;
import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPReply;

/**
 * <pre>
 * FTP 전송 기능을 구현한다.
 * 2019. 1. 28. kspark 최초생성
 * </pre>
 *
 * @author kspark
 * @since 2019. 1. 28. 오후 2:41:09
 */
@Slf4j
public class FtpSender {
    public static final int UNASSIGNED = -1;
    private FTPClient ftp = null;
    private ByteArrayOutputStream bao = null;
    private boolean passive;
    private String host;
    private int port;
    private String user;
    private String passwd;
    private String encoding;
    private String remotePath;
    private int connectTimeout = UNASSIGNED;
    private int readTimeout = UNASSIGNED;

    /**
     * 생성자
     *
     * @param host    호스트
     * @param port    포트
     * @param user    사용자
     * @param passwd  패스워드
     * @param passive 패시부여부
     */
    public FtpSender(String host, int port, String user, String passwd, boolean passive) {
        this(host, port, user, passwd, passive, UNASSIGNED, UNASSIGNED, null);
    }

    /**
     * 생성자
     *
     * @param host           호스트
     * @param port           포트
     * @param user           사용자
     * @param passwd         패스워드
     * @param passive        패시부여부
     * @param connectTimeout connect Timeout
     * @param readTimeout    read Timeout
     * @param encoding       인코딩
     */
    public FtpSender(String host, int port, String user, String passwd, boolean passive, int connectTimeout, int readTimeout, String encoding) {
        this.host = host;
        this.port = port;
        this.user = user;
        this.passwd = passwd;
        this.passive = passive;
        this.connectTimeout = connectTimeout;
        this.readTimeout = readTimeout;
        this.encoding = encoding;
        init();
    }

    /**
     * 생성자
     *
     * @param ftpInfo ftp정보
     * @throws MokaException 예외
     */
    public FtpSender(FtpInfo ftpInfo)
            throws MokaException {
        this.host = ftpInfo.getHost();
        this.port = ftpInfo.getPort();
        this.user = ftpInfo.getUser();
        this.passwd = ftpInfo.getPasswd();
        this.passive = ftpInfo.isPassive();
        this.connectTimeout = ftpInfo.getConnectTimeout();
        this.readTimeout = ftpInfo.getReadTimeout();
        this.encoding = ftpInfo.getEncoding();
        this.remotePath = ftpInfo.getRemotePath();
        init();
    }

    private void init() {
        ftp = new FTPClient();
        ftp.setConnectTimeout(connectTimeout);
        ftp.setDataTimeout(readTimeout);
        bao = new ByteArrayOutputStream();
        ftp.addProtocolCommandListener(new PrintCommandListener(new PrintWriter(bao), true));
    }

    /**
     * <pre>
     * ftp 서버로 접속한다.
     * </pre>
     *
     * @throws Exception 예외
     */
    public void connect()
            throws Exception {
        ftp.connect(host, port);
        int reply = ftp.getReplyCode();
        if (FTPReply.isPositiveCompletion(reply) == false) {
            log.error("connect error {}", this.getCommandLine());
            ftp.disconnect();
            throw new MokaException("ftp:connect Error");
        }
        boolean loginSuccess = ftp.login(user, passwd);
        if (loginSuccess == false) {
            log.error("login error {}", this.getCommandLine());
            throw new MokaException("ftp:login Error");
        }
    }

    /**
     * <pre>
     * 파일을 전송한다.
     * </pre>
     *
     * @param result 파일내용
     * @throws Exception 예외
     */
    public void store(String result)
            throws Exception {
        if (this.remotePath == null) {
            throw new MokaException("remote savePath is not exists");
        }
        store(this.remotePath, result);
    }

    /**
     * <pre>
     * ftp 서버에 파일을 저장한다.
     * </pre>
     *
     * @param remotePath 서버 저장경로
     * @param result     파일내용
     * @throws Exception 예외
     */
    public void store(String remotePath, String result)
            throws Exception {
        ByteArrayInputStream bai = new ByteArrayInputStream(result.getBytes(this.encoding));
        if (this.passive) {
            ftp.enterLocalPassiveMode();
            ftp.pasv();
        } else {
            ftp.enterLocalActiveMode();
        }
        ftp.setFileType(FTP.BINARY_FILE_TYPE);
        boolean uploadSuccess = ftp.storeFile(remotePath, bai);
        bai.close();
        if (uploadSuccess == false) {
            log.error("store error {}", this.getCommandLine());
            throw new MokaException("ftp:store Error");
        }
    }


    /**
     * <pre>
     * ftp 서버 접속을 해제한다.
     * </pre>
     */
    public void disconnect() {
        if (ftp.isConnected()) {
            try {
                ftp.logout();
                ftp.disconnect();
            } catch (IOException e) {
                log.error(e.toString());
            }
        }
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



}
