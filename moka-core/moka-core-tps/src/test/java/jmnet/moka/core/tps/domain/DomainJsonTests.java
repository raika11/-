package jmnet.moka.core.tps.domain;

import jmnet.moka.core.tps.mvc.auth.service.AuthService;
import jmnet.moka.core.tps.mvc.auth.service.AuthServiceImpl;
import jmnet.moka.core.tps.mvc.domain.service.DomainService;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

@RunWith(SpringRunner.class)
@WebMvcTest(controllers = {DomainService.class}, includeFilters = @ComponentScan.Filter(classes = {EnableWebSecurity.class}))
public class DomainJsonTests {
    @MockBean
    AuthService authService;
    @MockBean
    AuthServiceImpl userDetailsService;

    @MockBean
    DomainService domainService;

    @Autowired
    MockMvc mockMvc;

    // @Value("${msp.root}")
    // private String mspRoot;
    //
    // @Test
    // public void filecheck() throws IOException {
    // ResourceMapper.getAbsolutePath(String.join("/",mspRoot,MspConstants.ROOT_TEMPLATE));
    // }
}
