package jmnet.moka.core.common.encrypt;

import org.jasypt.encryption.StringEncryptor;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@ContextConfiguration(classes = MokaEncryptConfiguration.class)
public class MokaEncryptTest {
    public static final Logger logger = LoggerFactory.getLogger(MokaEncryptTest.class);

    @Autowired
    private StringEncryptor mokaEncryptor;

    private String[] sources = {"USER_JA_WCMS", "user_ja_wcms!@", "wms", "Wms#2019"};

    private String[] ftpStgSources = {"20021", "joongangndnews", "joongang(!)$#@!"};

    private String[] ftpStgAddress =
            {"stg-pds.joongang.co.kr", "stg-static.joongang.co.kr", "stg-images.joongang.co.kr", "stg-wimage.joongang.co.kr", "jup.xdn.kinxcdn.com"};

    private String[] localhost = {"203.249.147.45", "8021", "mokaftp", "ahzk0pvmxlvl"};

    @Test
    public void encrypt() {
        for (String source : ftpStgSources) {
            logger.debug("!!ENC source={} --> encrypted = {} ", source, mokaEncryptor.encrypt(source));
        }
    }

    @Test
    public void stgFtpEncrypt() {
        for (String source : ftpStgAddress) {
            logger.debug("!!ENC source={} --> encrypted = {} ", source, mokaEncryptor.encrypt(source));
        }
    }

    @Test
    public void localFtpEncrypt() {
        for (String source : localhost) {
            logger.debug("!!ENC source={} --> encrypted = {} ", source, mokaEncryptor.encrypt(source));
        }
    }

    @Test
    public void membershipDecript()
            throws Exception {
        MokaCrypt mokaCrypt = new MokaCrypt("qsx#*03k8f*j3ldd0bkekf39f@(jbnd!");
        logger.info("decrypt:{}",mokaCrypt.decrypt("NSRtzCZrFqM/M2W7GUCZNOz2LHHHBKO2+OETkJIInJu/OrGgEkvpbS/By/wNZcI8"));
    }
}
