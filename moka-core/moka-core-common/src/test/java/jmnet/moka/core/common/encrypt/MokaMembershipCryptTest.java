package jmnet.moka.core.common.encrypt;

import java.util.Map;
import org.jasypt.encryption.StringEncryptor;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.client.RestTemplate;

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

    @Test
    public void membershipInfo() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("client-id", "88f664f31a5c4e40");
        headers.add("JaMemAuth", "WW6L02zpByhrg7RvIHWOT6v9E3lF1H7Ax85yId5SYhF3obiHp4kQTfGj+2jUpB+p");
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.exchange("https://account-api.joongang.co.kr/mem/basicinfo",
                HttpMethod.GET,  new HttpEntity<>(headers), Map.class);
        logger.info("memberInfo:{}", response.getBody());
    }
}
