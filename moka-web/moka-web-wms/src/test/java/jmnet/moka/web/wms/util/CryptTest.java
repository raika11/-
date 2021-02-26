package jmnet.moka.web.wms.util;

import jmnet.moka.core.common.encrypt.MokaCrypt;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * <pre>
 * KISA SEED CBC 암호화 처리 테스트
 * Project : moka
 * Package : jmnet.moka.web.wms.util
 * ClassName : CryptTest
 * Created : 2020-11-19 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-19 09:02
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Slf4j
public class CryptTest {

    @Autowired
    private MokaCrypt mokaCrypt;

    @Test
    public void cryptTest()
            throws Exception {
        // 암호화
        String encode = mokaCrypt.encrypt("testtesttesttest");
        log.debug(encode);
        // 복호화
        log.debug(mokaCrypt.decrypt(encode));
    }



}
