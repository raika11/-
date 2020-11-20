/**
 * cls.scd FTPInfo.java 2019. 2. 11. 오후 1:15:32 kspark
 */
package jmnet.moka.core.common.ftp;

import jmnet.moka.core.common.exception.MokaException;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.commons.net.ftp.FTP;

/**
 * <pre>
 * FTP 접속을 위한 url을 파싱한다.
 * 2019. 2. 11. kspark 최초생성
 * </pre>
 *
 * @author kspark
 * @since 2019. 2. 11. 오후 1:15:32
 */
@NoArgsConstructor
@Getter
@Setter(AccessLevel.PACKAGE)
public class FtpInfo {
    public static final int UNASSIGNED = 0;
    private String host;
    private String port;
    private String user;
    private String passwd;
    private boolean passive;
    private String encoding;
    private String tempPath = "/tmp";
    private String remotePath = "";
    private Integer retry = 5;
    private Integer connectTimeout = UNASSIGNED;
    private Integer readTimeout = UNASSIGNED;
    // buffer size
    private Integer bufferSize = 2048;
    // Transfer file type
    private Integer transferFileType = FTP.BINARY_FILE_TYPE;



    /**
     * <pre>
     * FTP 전송 여부
     * </pre>
     *
     * @param url ftp접속 url
     * @return FTP 전송 여부
     */
    public static boolean isFTP(String url) {
        if (url != null) {
            return url.startsWith("ftp://");
        }
        return false;
    }

    /**
     * FTP 접속 url을 파싱한다.
     *
     * @param url ftp 접속 url
     * @throws MokaException 예외
     */
    public FtpInfo(String url, boolean isPassive)
            throws MokaException {
        int index = url.indexOf("ftp://");
        if (index != 0) {
            throw new MokaException(url + " is not ftp protocol");
        }
        url = url.substring(6); // ftp:// 를 버린다.

        index = url.indexOf('?');
        String query = null;
        if (index > 0) {
            if (index < url.length() - 1) { // ?로 끝나는 경우는 제외
                query = url.substring(index + 1);
            }
            url = url.substring(0, index);
        }
        // user 추출
        index = url.indexOf(':');
        this.user = url.substring(0, index);
        url = url.substring(index + 1);
        // passwd추출
        index = url.indexOf('@');
        this.passwd = url.substring(0, index);
        url = url.substring(index + 1);
        // host+port추출
        index = url.indexOf('/');
        this.host = url.substring(0, index);
        this.remotePath = url.substring(index); // path에는 /를 포함
        this.port = "21";
        // host, port 분리
        index = this.host.indexOf(':');
        if (index > 0) {
            this.port = this.host.substring(index + 1);
            this.host = this.host.substring(0, index);
        }

        // passive의 기본값을 준다.
        this.passive = isPassive;

        // query string 처리
        if (query != null) {
            String[] params = query.split("&");
            for (String param : params) {
                String name = param.split("=")[0];
                String value = param.split("=")[1];
                if (name.equals("connectTimeout")) {
                    this.connectTimeout = Integer.parseInt(value);
                } else if (name.equals("readTimeout")) {
                    this.readTimeout = Integer.parseInt(value);
                } else if (name.equals("encoding")) {
                    this.encoding = value;
                } else if (name.equals("passive")) {
                    this.passive = Boolean.valueOf(value);
                }
            }
        }
    }

}
