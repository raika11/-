package jmnet.moka.web.wms.config.hazelcast;

import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.GenericApplicationContext;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.session.MapSession;
import org.springframework.session.config.annotation.web.http.SpringHttpSessionConfiguration;
import org.springframework.session.hazelcast.HazelcastFlushMode;
import org.springframework.session.hazelcast.HazelcastSessionRepository;
import org.springframework.session.hazelcast.PrincipalNameExtractor;
import org.springframework.util.StringUtils;
import com.hazelcast.config.Config;
import com.hazelcast.config.MapAttributeConfig;
import com.hazelcast.config.MapIndexConfig;
import com.hazelcast.config.XmlConfigBuilder;
import com.hazelcast.core.Hazelcast;
import com.hazelcast.core.HazelcastInstance;

@Configuration
@ConditionalOnProperty(value = "wms.session.registry.type", havingValue = "hazelcast",
        matchIfMissing = false)
// 필요하지 않은 경우 로딩되는 경우를 방지하기 위해 소스레벨에서 가져옴
//@EnableHazelcastHttpSession(
//        maxInactiveIntervalInSeconds = TpsConstants.SESSION_MAX_INACTIVE_INTERVAL,
//        hazelcastFlushMode = HazelcastFlushMode.IMMEDIATE)

public class WmsHazelcastHttpSessionConfiguration extends SpringHttpSessionConfiguration {

    private String hzConfigPath;

    private Integer maxInactiveIntervalInSeconds = MapSession.DEFAULT_MAX_INACTIVE_INTERVAL_SECONDS;

    private String sessionMapName = HazelcastSessionRepository.DEFAULT_SESSION_MAP_NAME;

    //    private HazelcastFlushMode hazelcastFlushMode = HazelcastFlushMode.ON_SAVE;
    private HazelcastFlushMode hazelcastFlushMode = HazelcastFlushMode.IMMEDIATE;


    private ApplicationEventPublisher applicationEventPublisher;

    @Autowired
    public WmsHazelcastHttpSessionConfiguration(GenericApplicationContext appContext) {
        this.hzConfigPath =
                appContext.getBeanFactory().resolveEmbeddedValue("${hazelcast.config.path}");
        try {
            String timeoutStr =
                    appContext.getBeanFactory().resolveEmbeddedValue("${wms.session.timeout}");
            this.maxInactiveIntervalInSeconds = Integer.parseInt(timeoutStr);
        } catch (Exception e) {

        }
    }

    @Bean
    public HazelcastSessionRepository sessionRepository() throws IOException {
        HazelcastSessionRepository sessionRepository =
                new HazelcastSessionRepository(hazelcastInstance());
        sessionRepository.setApplicationEventPublisher(this.applicationEventPublisher);
        if (StringUtils.hasText(this.sessionMapName)) {
            sessionRepository.setSessionMapName(this.sessionMapName);
        }
        sessionRepository.setDefaultMaxInactiveInterval(maxInactiveIntervalInSeconds);
        sessionRepository.setHazelcastFlushMode(this.hazelcastFlushMode);
        return sessionRepository;
    }

    @Autowired
    public void setApplicationEventPublisher(ApplicationEventPublisher applicationEventPublisher) {
        this.applicationEventPublisher = applicationEventPublisher;
    }
    /**
     * <pre>
     * HazelCast 인스턴스를 생성한다.
     * </pre>
     * 
     * @return HazelCast 인스턴스
     * @throws IOException 예외
     */
    @Bean(destroyMethod = "shutdown")
    public HazelcastInstance hazelcastInstance() throws IOException {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource resource = resolver.getResource(hzConfigPath);
        XmlConfigBuilder configBuilder = new XmlConfigBuilder(resource.getInputStream());
        Config hzConfig = configBuilder.build();
        //        Config hzConfig = new FileSystemXmlConfig(resource.getInputStream());

        MapAttributeConfig attributeConfig = new MapAttributeConfig()
                .setName(HazelcastSessionRepository.PRINCIPAL_NAME_ATTRIBUTE)
                .setExtractor(PrincipalNameExtractor.class.getName());
        hzConfig.getMapConfig(HazelcastSessionRepository.DEFAULT_SESSION_MAP_NAME)
                .addMapAttributeConfig(attributeConfig).addMapIndexConfig(new MapIndexConfig(
                        HazelcastSessionRepository.PRINCIPAL_NAME_ATTRIBUTE, false));

        // session-timeout을 web.xml과도 맞춘다.
        hzConfig.getMapConfig(HazelcastSessionRepository.DEFAULT_SESSION_MAP_NAME)
                .setMaxIdleSeconds(maxInactiveIntervalInSeconds);

        return Hazelcast.getOrCreateHazelcastInstance(hzConfig);

    }

}
