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
public class MokaMembershipCryptTest {
    public static final Logger logger = LoggerFactory.getLogger(MokaMembershipCryptTest.class);

    @Test
    public void membershipDecrypt()
            throws Exception {
        MokaMembershipCrypt mokaCrypt = new MokaMembershipCrypt("qsx#*03k8f*j3ldd0bkekf39f@(jbnd!");
        logger.info("decrypt:{}",mokaCrypt.decrypt("NSRtzCZrFqM/M2W7GUCZNOz2LHHHBKO2+OETkJIInJu/OrGgEkvpbS/By/wNZcI8"));
    }

    @Test
    public void membershipEncrypt()
            throws Exception {
        MokaMembershipCrypt mokaCrypt = new MokaMembershipCrypt("qsx#*03k8f*j3ldd0bkekf39f@(jbnd!");
        logger.info("encrypt:{}",mokaCrypt.encrypt("1615271079996|10000022|49|ML01|MS01|Y"));
    }
}
