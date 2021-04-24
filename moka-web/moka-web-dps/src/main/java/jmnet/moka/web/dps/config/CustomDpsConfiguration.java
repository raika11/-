package jmnet.moka.web.dps.config;

import java.io.IOException;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.core.common.aspect.CommandControllerIpAllowAspect;
import jmnet.moka.web.dps.module.membership.MembershipHelper;
import jmnet.moka.web.dps.module.menu.PeriodicMenuLoader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

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

    @Value("${menu.load.location}")
    private String menuLocation;

    @Value("${menu.load.interval.minutes}")
    private int menuLoadIntervalMinutes;

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

    @Bean(name = "periodicMenuLoader" , destroyMethod = "shutdown")
    public PeriodicMenuLoader periodicMenuLoader(ThreadPoolTaskScheduler scheduler)
            throws ParserConfigurationException, XPathExpressionException, IOException {
        return new PeriodicMenuLoader(this.menuLocation, scheduler, menuLoadIntervalMinutes);
    }


    @Bean(name = "membershipHelper")
    public MembershipHelper membershipHelper() {
        return new MembershipHelper(this.key, this.clientId, this.api);
    }

}
