package jmnet.moka.core.common.encrypt;

import org.jasypt.encryption.StringEncryptor;
import org.jasypt.encryption.pbe.PooledPBEStringEncryptor;
import org.jasypt.encryption.pbe.config.SimpleStringPBEConfig;
import org.jasypt.salt.StringFixedSaltGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource("classpath:moka_enc.properties")
public class MokaEncryptConfiguration {

    public final static Logger logger = LoggerFactory.getLogger(MokaEncryptConfiguration.class);

    @Value("${moka.core.encrypt.key}")
    private String encryptKey;
    @Value("${moka.core.encrypt.salt}")
    private String encryptSalt;
    @Value("${moka.core.encrypt.cbc-key}")
    private String kisaSeedCbcSecretKey;

    @Bean(name = "mokaEncryptor")
    public StringEncryptor stringEncryptor() {
        SimpleStringPBEConfig config = new SimpleStringPBEConfig();
        config.setPassword(encryptKey);
        config.setAlgorithm("PBEWithMD5AndDES");
        config.setKeyObtentionIterations("1000");
        config.setPoolSize("1");
        config.setProviderName("SunJCE");
        config.setSaltGenerator(new StringFixedSaltGenerator(encryptSalt));
        config.setStringOutputType("base64");
        PooledPBEStringEncryptor encryptor = new PooledPBEStringEncryptor();
        encryptor.setConfig(config);
        return encryptor;
    }

    @Bean(name = "mokaCrypt")
    public MokaCrypt mokaCrypt() {
        return new MokaCrypt(kisaSeedCbcSecretKey);
    }
}
