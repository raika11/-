package jmnet.moka.common.cache.infinispan;

import org.infinispan.notifications.Listener;
import org.infinispan.notifications.cachemanagerlistener.annotation.ViewChanged;
import org.infinispan.notifications.cachemanagerlistener.event.ViewChangedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Listener
public class InfinispanClusterListener {
    private static final Logger logger = LoggerFactory.getLogger(InfinispanClusterListener.class);

    @ViewChanged
    public void viewChanged(ViewChangedEvent event) {
        logger.debug("cluster old Member:{}", event.getOldMembers());
        logger.debug("cluster new Member:{}", event.getNewMembers());
    }
}
