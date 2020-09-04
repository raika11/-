package jmnet.moka.common.cache.hazelcast;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.hazelcast.core.EntryEvent;
import com.hazelcast.map.listener.EntryAddedListener;
import com.hazelcast.map.listener.EntryEvictedListener;
import com.hazelcast.map.listener.EntryExpiredListener;
import com.hazelcast.map.listener.EntryRemovedListener;

public class HazelcastMapListener
        implements EntryAddedListener<String, String>, EntryEvictedListener<String, String>,
        EntryRemovedListener<String, String>, EntryExpiredListener<String, String> {
    private static final Logger logger = LoggerFactory.getLogger(HazelcastMapListener.class);



    @Override
    public void entryAdded(EntryEvent<String, String> event) {
        logger.debug("Adding key '{}' to cache : {}", event.getKey(), event.getName());
    }
//
//    @Override
//    public void entryUpdated(EntryEvent<String, String> event) {
//        logger.debug("Updating key '{}' to cache : {}", event.getKey(), event.getName());
//
//    }

    @Override
    public void entryRemoved(EntryEvent<String, String> event) {
        logger.debug("Removing key '{}' to cache : {}", event.getKey(), event.getName());

    }

    @Override
    public void entryEvicted(EntryEvent<String, String> event) {
        logger.debug("Evicted key '{}' to cache : {}", event.getKey(), event.getName());

    }

    @Override
    public void entryExpired(EntryEvent<String, String> event) {
        logger.debug("Expired key '{}' to cache : {}", event.getKey(), event.getName());
    }

//    @Override
//    public void mapCleared(MapEvent event) {
//        logger.debug("Cleared Map '{}'", event.getName());
//    }
//
//    @Override
//    public void mapEvicted(MapEvent event) {
//        logger.debug("Evicted Map '{}'", event.getName());
//    }


}
