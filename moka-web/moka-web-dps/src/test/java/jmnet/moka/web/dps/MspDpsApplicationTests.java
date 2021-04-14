package jmnet.moka.web.dps;

import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@Slf4j
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
public class MspDpsApplicationTests {

    @Test
    public void selectTest() {
        String test = "서소문|AAA|BBBB";
        String[] a = test.split("\\|");
        log.debug("{}", a.length);
    }

}
