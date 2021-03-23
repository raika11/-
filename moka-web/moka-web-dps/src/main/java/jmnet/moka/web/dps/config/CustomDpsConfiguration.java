package jmnet.moka.web.dps.config;

import java.io.IOException;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.core.common.aspect.CommandControllerIpAllowAspect;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.web.dps.module.category.CategoryParser;
import jmnet.moka.web.dps.module.membership.MembershipHelper;
import jmnet.moka.web.dps.module.menu.MenuParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourcePatternResolver;

@Configuration
public class CustomDpsConfiguration {

    public static final Logger logger = LoggerFactory.getLogger(CustomDpsConfiguration.class);

    @Value("${command.allow.ips}")
    private String commandAllowIps;

    @Value("${membership.key}")
    private String key;
    @Value("${membership.client-id}")
    private String clientId;
    @Value("${membership.api}")
    private String api;

    //    @Autowired
    //    private GenericApplicationContext appContext;

    /**
     * <pre>
     * Command Api를 IP 기반의 접근제어를 설정한다.
     * </pre>
     *
     * @return
     */
    @Bean
    public CommandControllerIpAllowAspect commandControllerIpAllowAspect() {
        return new CommandControllerIpAllowAspect(commandAllowIps);
    }

    @Bean(name = "pcMenuParser")
    public MenuParser pcMenuParser()
            throws ParserConfigurationException, XPathExpressionException, IOException {
        ResourcePatternResolver patternResolver = ResourceMapper.getResouerceResolver();
        Resource resource = patternResolver.getResource("classpath:/Menu.xml");
        return new MenuParser(resource);
    }

    @Bean(name = "categoryParser")
    public CategoryParser categoryParser()
            throws ParserConfigurationException, XPathExpressionException, IOException {
        ResourcePatternResolver patternResolver = ResourceMapper.getResouerceResolver();
        Resource resource = patternResolver.getResource("classpath:/CategoryDefinition.xml");
        return new CategoryParser(resource);
    }

    @Bean(name = "membershipHelper")
    public MembershipHelper membershipHelper() {
        return new MembershipHelper(this.key, this.clientId, this.api);
    }

}
