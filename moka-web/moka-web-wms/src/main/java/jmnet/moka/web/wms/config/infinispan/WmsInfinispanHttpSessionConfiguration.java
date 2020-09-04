package jmnet.moka.web.wms.config.infinispan;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.Objects;
import org.infinispan.manager.DefaultCacheManager;
import org.infinispan.spring.common.provider.SpringCache;
import org.infinispan.spring.embedded.provider.SpringEmbeddedCacheManager;
import org.infinispan.spring.embedded.session.InfinispanEmbeddedSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.GenericApplicationContext;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.session.MapSession;
import org.springframework.session.config.annotation.web.http.EnableSpringHttpSession;

@Configuration
@ConditionalOnProperty(value = "wms.session.registry.type", havingValue = "infinispan",
        matchIfMissing = false)
@EnableSpringHttpSession
//필요하지 않은 경우 로딩되는 경우를 방지하기 위해 소스레벨에서 가져옴
//@EnableInfinispanEmbeddedHttpSession(cacheName = "http-session",
//        maxInactiveIntervalInSeconds = TpsConstants.SESSION_MAX_INACTIVE_INTERVAL)
public class WmsInfinispanHttpSessionConfiguration {

    private String ispnConfigPath;

    private String cacheName;

    private long maxInactiveIntervalInSeconds;

    @Autowired
    public WmsInfinispanHttpSessionConfiguration(GenericApplicationContext appContext) {
        this.ispnConfigPath =
                appContext.getBeanFactory().resolveEmbeddedValue("${infinispan.config.path}");
        this.cacheName =
                appContext.getBeanFactory().resolveEmbeddedValue("${infinispan.config.cacheName}");
        try {
            String timeoutStr =
                    appContext.getBeanFactory().resolveEmbeddedValue("${wms.session.timeout}");
            this.maxInactiveIntervalInSeconds = Long.parseLong(timeoutStr);
        } catch (Exception e) {

        }
    }

    /**
     * <pre>
     * Infinispan 인스턴스를 생성한다.
     * </pre>
     * 
     * @return infinispan spring cacheManager
     * @throws IOException 예외
     */
    @Bean(destroyMethod = "stop")
    public SpringEmbeddedCacheManager defaultCacheManager() throws IOException {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource resource = resolver.getResource(this.ispnConfigPath);
        return new SpringEmbeddedCacheManager(new DefaultCacheManager(resource.getInputStream()));
    }

    @Bean
    public InfinispanEmbeddedSessionRepository sessionRepository(
            SpringEmbeddedCacheManager cacheManager, ApplicationEventPublisher eventPublisher) {
        Objects.requireNonNull(cacheName, "Cache name can not be null");
        Objects.requireNonNull(cacheManager, "Cache Manager can not be null");
        Objects.requireNonNull(eventPublisher, "Event Publisher can not be null");

        SpringCache cacheForSessions = cacheManager.getCache(this.cacheName);

        InfinispanEmbeddedSessionRepository sessionRepository =
                new InfinispanEmbeddedSessionRepository(cacheForSessions) {
                    @Override
                    public MapSession createSession() {
                        //                        MapSession session = super.createSession();
                        //                        session.setMaxInactiveInterval(
                        //                                Duration.ofSeconds(maxInactiveIntervalInSeconds));
                        //                        return session;

                        MapSession result = new MapSession();
                        result.setMaxInactiveInterval(
                                Duration.ofSeconds(maxInactiveIntervalInSeconds));
                        result.setCreationTime(Instant.now());
                        return result;
                    }
                };
        sessionRepository.setApplicationEventPublisher(eventPublisher);

        return sessionRepository;
    }

}
