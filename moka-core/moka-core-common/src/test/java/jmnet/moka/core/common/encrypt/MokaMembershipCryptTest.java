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

    private String KEY = "qsx#*03k8f*j3ldd0bkekf39f@(jbnd!";
    private String TEXT = "1617327430615|10000003|4|ML01|MS01|Y";
    private String ENCRYPTED = "I6ofSCX/e0VUhdzJcZthVxXVp/s9bPNp1awDVu6diIoqQ58Hr3yh1hPKGv34Mq1x";

    @Test
    public void membershipDecrypt()
            throws Exception {
        MokaMembershipCrypt mokaCrypt = new MokaMembershipCrypt(KEY);
        logger.info("decrypt:{}",mokaCrypt.decrypt(ENCRYPTED));
    }

    @Test
    public void membershipEncrypt()
            throws Exception {
        MokaMembershipCrypt mokaCrypt = new MokaMembershipCrypt(KEY);
        logger.info("encrypt:{}",mokaCrypt.encrypt(TEXT));
    }

    @Test
    public void membershipInfo() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("client-id", "88f664f31a5c4e40");
        headers.add("JaMemAuth", ENCRYPTED);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.exchange("https://account-api.joongang.co.kr/mem/basicinfo",
                HttpMethod.GET,  new HttpEntity<>(headers), Map.class);
        logger.info("memberInfo:{}", response.getBody());
    }
}
