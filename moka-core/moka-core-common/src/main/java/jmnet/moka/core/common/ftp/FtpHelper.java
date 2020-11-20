package jmnet.moka.core.common.ftp;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.File;
import java.io.IOException;
import java.util.Map;
import javax.annotation.PostConstruct;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.util.ResourceMapper;
import lombok.extern.slf4j.Slf4j;
import org.jasypt.encryption.StringEncryptor;
import org.jasypt.exceptions.EncryptionOperationNotPossibleException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

    private Map<String, FtpInfo> ftpInfoMap;

    @Autowired
    public StringEncryptor mokaEncryptor;

    @Value("${ftp-info.resource.path:ftp-info.json}")
    public String resourcePath;


    /**
     * ftp_info.json에서 ftp 서버 접속 정보를 로드한다.
     */
    @PostConstruct
    private void init() {
        Resource resource = new ClassPathResource(resourcePath);
        try {

            File file = resource.getFile();
            if (file.exists()) {
                TypeReference<Map<String, FtpInfo>> typeRef = new TypeReference<>() {
                };

                ftpInfoMap = ResourceMapper
                        .getDefaultObjectMapper()
                        .readValue(file, typeRef);
                if (this.mokaEncryptor != null) {
                    ftpInfoMap
                            .keySet()
                            .forEach(key -> {
                                FtpInfo fi = ftpInfoMap.get(key);
                                try {
                                    if (McpString.isNotEmpty(fi.getUser())) {
                                        fi.setUser(mokaEncryptor.decrypt(fi.getUser()));
                                    }
                                } catch (EncryptionOperationNotPossibleException ex) {
                                    log.error("FtpHelper error => exception : {}", ex.toString());
                                }
                            });
                }
            }


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
    public FtpInfo getFtpInfo(String alias) {
        return ftpInfoMap.get(alias);
    }
}
