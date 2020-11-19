package jmnet.moka.core.common.ftp;

import org.jasypt.encryption.StringEncryptor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.common.ftp
 * ClassName : MokaFtpConfiguration
 * Created : 2020-11-19 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-19 15:57
 */
@Configuration
public class MokaFtpConfiguration {

    public final StringEncryptor mokaEncryptor;

    public MokaFtpConfiguration(StringEncryptor mokaEncryptor) {
        this.mokaEncryptor = mokaEncryptor;
    }

    /**
     * <pre>
     * ftpHelper Bean을 생성한다.
     * </pre>
     *
     * @return ftpHelper
     */
    @Bean
    @DependsOn(value = {"mokaEncryptor"})
    @ConditionalOnProperty(name = "moka.ftp-helper.enable", havingValue = "true")
    public FtpHelper ftpHelper() {
        return new FtpHelper(mokaEncryptor);
    }
}
