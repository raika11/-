package jmnet.moka.web.wms.util;

import javax.annotation.Resource;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.core.common.rest.RestTemplateHelper;
import jmnet.moka.core.tps.common.code.SnsTypeCode;
import jmnet.moka.core.tps.mvc.sns.dto.SnsPublishDTO;
import jmnet.moka.core.tps.mvc.sns.service.SnsApiService;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.web.wms.util
 * ClassName : SnsTest
 * Created : 2020-12-08 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-08 14:50
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Slf4j
public class SnsTest {

    @Autowired
    private RestTemplateHelper restTemplateHelper;

    @Resource(name = "twitterApiService")
    private SnsApiService snsApiService;

    @Test
    public void longAccessToken()
            throws MokaException {

        String clientId = "313824689759637";
        String clientSecret = "2d707637e91ad8d3fdd4172f7acb48dc";
        String accessToken =
                "EAAEdbAEnpZAUBAGuak0goaFgLj4YtbCCZAWnZCIE8P24TmIG0Iyxnf9vR9lzgdkRQZCzvcuzLnXZBWskZBroJkW02KNnZArehYS5zCNjnVcYzR1h5pQ194zTMdjF5Po0H4ZCzkG4b1P1yOfzcBmB57447Sn5yUHlEZCTDOB3Yy8cPVkhS0w4ABIMtA3NeGEgVqZCv7vzzRIEYn34YsV8NFwZBjLqSZBIV95RUuzFf42c9ZCH5EAZDZD";
        ResponseEntity<String> r = restTemplateHelper.get(
                "https://graph.facebook.com/v9.0/oauth/access_token?grant_type=fb_exchange_token&client_id=" + clientId + "&client_secret="
                        + clientSecret + "&fb_exchange_token=" + accessToken);

        log.debug(r.getBody());
    }

    @Test
    public void snsFeedSend()
            throws Exception {

        snsApiService.publish(SnsPublishDTO
                .builder()
                .totalId(22111L)
                .snsType(SnsTypeCode.TW)
                .message("테스트")
                .build());
    }
}
