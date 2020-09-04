package jmnet.moka.web.wms.config.infinispan;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.infinispan.Cache;
import org.infinispan.configuration.cache.CacheMode;
import org.infinispan.configuration.cache.Configuration;
import org.infinispan.configuration.cache.ConfigurationBuilder;
import org.infinispan.manager.EmbeddedCacheManager;
import org.infinispan.spring.embedded.provider.SpringEmbeddedCacheManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.security.core.session.SessionDestroyedEvent;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.util.Assert;

/**
 * Default implementation of {@link org.springframework.security.core.session.SessionRegistry
 * SessionRegistry} which listens for
 * {@link org.springframework.security.core.session.SessionDestroyedEvent SessionDestroyedEvent}s
 * published in the Spring application context.
 * <p>
 * For this class to function correctly in a web application, it is important that you register an
 * <a href="
 * {@docRoot}/org/springframework/security/web/session/HttpSessionEventPublisher.html">HttpSessionEventPublisher</a>
 * in the <tt>web.xml</tt> file so that this class is notified of sessions that expire.
 *
 * @author Ben Alex
 * @author Luke Taylor
 */
public class InfinispanSessionRegistry
        implements SessionRegistry, ApplicationListener<SessionDestroyedEvent> {

    // ~ Instance fields
    // ================================================================================================

    //    protected final Log logger = LogFactory.getLog(SessionRegistryImpl.class);
    private static final Logger logger = LoggerFactory.getLogger(InfinispanSessionRegistry.class);

    //    /** <principal:Object,SessionIdSet> */
    //    private final Cache<Object, Set<String>> principals;
    //    /** <sessionId:Object,SessionInformation> */
    //    private final Cache<String, SessionInformation> sessionIds;

    private EmbeddedCacheManager cacheManager;
    private static String PRINCIPALS = "sessionRegistry:principals";
    private static String SESSIONIDS = "sessionRegistry:sessionIds";

    // ~ Methods
    // ========================================================================================================

    public InfinispanSessionRegistry(SpringEmbeddedCacheManager cacheManager) {
        this.cacheManager = cacheManager.getNativeCacheManager();
        Configuration clusteringConfiguration = new ConfigurationBuilder().clustering()
                .cacheMode(CacheMode.DIST_SYNC).build();
        this.cacheManager.defineConfiguration(PRINCIPALS, clusteringConfiguration);
        this.cacheManager.defineConfiguration(SESSIONIDS, clusteringConfiguration);
   }

    private <K, V> Cache<K, V> getCache(String cacheName) {
        Cache<K, V> cache = this.cacheManager.getCache(cacheName);
        return cache;
    }

    private Cache<Object, Set<String>> principalCache() {
        Cache<Object, Set<String>> cache = getCache(PRINCIPALS);
        return cache;
    }

    private Cache<String, SessionInformation> sessionIdCache() {
        Cache<String, SessionInformation> cache = getCache(SESSIONIDS);
        return cache;
    }

    public List<Object> getAllPrincipals() {
        return new ArrayList<>(principalCache().keySet());
    }

    public List<SessionInformation> getAllSessions(Object principal,
            boolean includeExpiredSessions) {
        final Set<String> sessionsUsedByPrincipal = principalCache().get(principal);

        if (sessionsUsedByPrincipal == null) {
            return Collections.emptyList();
        }

        List<SessionInformation> list = new ArrayList<>(sessionsUsedByPrincipal.size());

        for (String sessionId : sessionsUsedByPrincipal) {
            SessionInformation sessionInformation = getSessionInformation(sessionId);

            if (sessionInformation == null) {
                continue;
            }

            if (includeExpiredSessions || !sessionInformation.isExpired()) {
                list.add(sessionInformation);
            }
        }

        return list;
    }

    public SessionInformation getSessionInformation(String sessionId) {
        Assert.hasText(sessionId, "SessionId required as per interface contract");

        return sessionIdCache().get(sessionId);
    }

    public void onApplicationEvent(SessionDestroyedEvent event) {
        String sessionId = event.getId();
        removeSessionInformation(sessionId);
    }

    public void refreshLastRequest(String sessionId) {
        Assert.hasText(sessionId, "SessionId required as per interface contract");

        SessionInformation info = getSessionInformation(sessionId);

        if (info != null) {
            info.refreshLastRequest();
        }
    }

    public void registerNewSession(String sessionId, Object principal) {
        Assert.hasText(sessionId, "SessionId required as per interface contract");
        Assert.notNull(principal, "Principal required as per interface contract");

        //        if (logger.isDebugEnabled()) {
            logger.debug("Registering session " + sessionId + ", for principal " + principal);
        //        }

        if (getSessionInformation(sessionId) != null) {
            removeSessionInformation(sessionId);
        }

        sessionIdCache().put(sessionId, new SessionInformation(principal, sessionId, new Date()));

        //        Set<String> sessionsUsedByPrincipal =
        //                principals.computeIfAbsent(principal, key -> new CopyOnWriteArraySet<>());
        //        sessionsUsedByPrincipal.add(sessionId);
        Set<String> sessionIdSet = principalCache().get(principal);
        if (sessionIdSet == null) {
            sessionIdSet = new HashSet<String>();
        }
        sessionIdSet.add(sessionId);
        principalCache().put(principal, sessionIdSet);

        //        if (logger.isTraceEnabled()) {
        //            logger.trace("Sessions used by '" + principal + "' : " + sessionsUsedByPrincipal);
        //        }
    }

    public void removeSessionInformation(String sessionId) {
        Assert.hasText(sessionId, "SessionId required as per interface contract");

        SessionInformation info = getSessionInformation(sessionId);

        if (info == null) {
            return;
        }

        logger.debug("Removing session " + sessionId + ", for principal " + info.getPrincipal());

        if (logger.isTraceEnabled()) {
            logger.debug("Removing session " + sessionId + " from set of registered sessions");
        }

        sessionIdCache().remove(sessionId);

        Set<String> sessionsUsedByPrincipal = principalCache().get(info.getPrincipal());

        if (sessionsUsedByPrincipal == null) {
            return;
        }

        //        if (logger.isDebugEnabled()) {
        //            logger.debug("Removing session " + sessionId
        //                    + " from principal's set of registered sessions");
        //        }

        sessionsUsedByPrincipal.remove(sessionId);

        if (sessionsUsedByPrincipal.isEmpty()) {
            // No need to keep object in principals Map anymore
            //            if (logger.isDebugEnabled()) {
            //                logger.debug("Removing principal " + info.getPrincipal() + " from registry");
            //            }
            principalCache().remove(info.getPrincipal());
        }

        //        if (logger.isTraceEnabled()) {
        //            logger.trace(
        //                    "Sessions used by '" + info.getPrincipal() + "' : " + sessionsUsedByPrincipal);
        //        }
    }

}
