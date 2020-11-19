package jmnet.moka.core.common.ftp;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.File;
import java.io.IOException;
import java.util.Map;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.util.ResourceMapper;
import lombok.extern.slf4j.Slf4j;
import org.jasypt.encryption.StringEncryptor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.common.ftp
 * ClassName : FtpHelper
 * Created : 2020-11-19 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-19 19:08
 */
@Slf4j
public class FtpHelper {
    public static FtpHelper ftpHelper;

    private Map<String, FTPInfo> ftpInfoMap;

    public static FtpHelper getInstance() {

        synchronized (FtpHelper.class) {
            if (ftpHelper == null) {
                ftpHelper = new FtpHelper();
            }
        }
        return ftpHelper;
    }

    public static FtpHelper getInstance(StringEncryptor stringEncryptor) {

        synchronized (FtpHelper.class) {
            if (ftpHelper == null) {
                ftpHelper = new FtpHelper(stringEncryptor);
            }
        }
        return ftpHelper;
    }

    private FtpHelper() {
    }

    private FtpHelper(StringEncryptor stringEncryptor) {
        init(stringEncryptor);
    }

    /**
     * ftp_info.json에서 ftp 서버 접속 정보를 로드한다.
     */
    private void init(StringEncryptor stringEncryptor) {
        Resource resource = new ClassPathResource("ftp_info.json");
        try {

            File file = resource.getFile();

            TypeReference<Map<String, FTPInfo>> typeRef = new TypeReference<>() {
            };

            ftpInfoMap = ResourceMapper
                    .getDefaultObjectMapper()
                    .readValue(file, typeRef);

            ftpInfoMap
                    .keySet()
                    .forEach(key -> {
                        FTPInfo fi = ftpInfoMap.get(key);
                        if (McpString.isNotEmpty(fi.getUser())) {
                            fi.setUser(stringEncryptor.decrypt(fi.getUser()));
                        }
                    });

        } catch (IOException io) {
            log.error("FtpHelper error => exception : {}", io.getMessage());
        }
    }

    /**
     * ftp 접속 정보
     *
     * @param alias ftp 서버 별칭
     * @return FTPInfo
     */
    public FTPInfo getFtpInfo(String alias) {
        return ftpInfoMap.get(alias);
    }
}
