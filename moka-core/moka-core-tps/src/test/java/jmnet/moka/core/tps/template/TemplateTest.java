package jmnet.moka.core.tps.template;

import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import jmnet.moka.core.tps.mvc.template.service.TemplateService;
import jmnet.moka.core.tps.mvc.user.service.UserService;
import jmnet.moka.core.tps.mvc.user.service.UserServiceImpl;

@RunWith(SpringRunner.class)
@WebMvcTest(controllers = {TemplateService.class},
        includeFilters = @ComponentScan.Filter(classes = {EnableWebSecurity.class}))
public class TemplateTest {

    @MockBean
    UserService userService;

    @MockBean
    UserServiceImpl userDetailsService;

    @MockBean
    TemplateService templateService;

    @Autowired
    MockMvc mockMvc;

    // @Value("${msp.root}")
    // private String mspRoot;
    //
    // @Test
    // public void getFile() throws IOException {
    // String domainIdStr = String.format("%04d", 1000);
    // String tpPath = MspResourceMapper.getTemplatePath(mspRoot, domainIdStr, "");
    // Template tp = new Template();
    // tp.setTemplateId(5774);
    // tp.setTemplateName("테스트");
    // tp.setTemplateData("2019-10-02T23:39:28+09:00");
    // ResourceMapper.writeJson(new File(tpPath + "5774"), tp);
    // }
}
