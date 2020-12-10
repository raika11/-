package jmnet.moka.web.wms.groupware;

import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.web.wms.config.security.groupware.SoapWebServiceGatewaySupport;
import jmnet.moka.web.wms.config.security.groupware.webservice.SetReAuthenticationNumberJBOResponse;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
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
public class GroupWareTest {

    @Autowired
    public SoapWebServiceGatewaySupport groupWareAuthClient;

    @Test
    public void longAccessToken()
            throws MokaException {

        SetReAuthenticationNumberJBOResponse authNumber = groupWareAuthClient.getAuthNumber("kweon.hyukjoo");

        log.debug(authNumber.getSetReAuthenticationNumberJBOResult());
    }

}
