package jmnet.moka.common.cache.infinispan;

import org.infinispan.notifications.Listener;
import org.infinispan.notifications.cachelistener.annotation.CacheEntriesEvicted;
import org.infinispan.notifications.cachelistener.annotation.CacheEntryActivated;
import org.infinispan.notifications.cachelistener.annotation.CacheEntryCreated;
import org.infinispan.notifications.cachelistener.annotation.CacheEntryExpired;
import org.infinispan.notifications.cachelistener.annotation.CacheEntryLoaded;
import org.infinispan.notifications.cachelistener.annotation.CacheEntryPassivated;
import org.infinispan.notifications.cachelistener.annotation.CacheEntryVisited;
import org.infinispan.notifications.cachelistener.event.CacheEntriesEvictedEvent;
import org.infinispan.notifications.cachelistener.event.CacheEntryActivatedEvent;
import org.infinispan.notifications.cachelistener.event.CacheEntryCreatedEvent;
import org.infinispan.notifications.cachelistener.event.CacheEntryExpiredEvent;
import org.infinispan.notifications.cachelistener.event.CacheEntryLoadedEvent;
import org.infinispan.notifications.cachelistener.event.CacheEntryPassivatedEvent;
import org.infinispan.notifications.cachelistener.event.CacheEntryVisitedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Listener
public class InfinispanCacheListener {
    private static final Logger logger = LoggerFactory.getLogger(InfinispanCacheListener.class);

    public InfinispanCacheListener() {
        logger.debug("InfinispanCacheListener created..");
    }

    @CacheEntryCreated
    public void entryCreated(CacheEntryCreatedEvent<String, String> event) {
        if (event.isPre())
            return;
        logger.debug("Adding key '{}' to cache : {}", event.getKey(), event.getCache().getName());
    }

    @CacheEntryExpired
    public void entryExpired(CacheEntryExpiredEvent<String, String> event) {
        if (event.isPre())
            return;
        logger.debug("Expiring key '{}' from cache : {}", event.getKey(),
                event.getCache().getName());
    }

    @CacheEntryVisited
    public void entryVisited(CacheEntryVisitedEvent<String, String> event) {
        if (event.isPre())
            return;
        logger.debug("Key '{}'  was visited : {}", event.getKey(), event.getCache().getName());
    }

    @CacheEntryActivated
    public void entryActivated(CacheEntryActivatedEvent<String, String> event) {
        if (event.isPre())
            return;
        logger.debug("Activating key '{}' on cache : {}", event.getKey(),
                event.getCache().getName());
    }

    @CacheEntryPassivated
    public void entryPassivated(CacheEntryPassivatedEvent<String, String> event) {
        if (event.isPre())
            return;
        logger.debug("Passivating key '{}' from cache : {}", event.getKey(),
                event.getCache().getName());
    }

    @CacheEntryLoaded
    public void entryLoaded(CacheEntryLoadedEvent<String, String> event) {
        if (event.isPre())
            return;
        logger.debug("Loading key '{}' to cache : {}", event.getKey(), event.getCache().getName());
    }

    @CacheEntriesEvicted
    public void entriesEvicted(CacheEntriesEvictedEvent<String, String> event) {
        if (event.isPre())
            return;
        StringBuilder builder = new StringBuilder();
        event.getEntries().forEach((key, value) -> builder.append(key).append(", "));
        logger.debug("Evicting following entries from cache: {}", builder.toString());
    }

}
