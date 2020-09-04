package jmnet.moka.core.tps.mvc.volume.repository;

import jmnet.moka.core.tps.mvc.volume.entity.Volume;

/**
 * volume repository support
 * @author jeon
 *
 */
public interface VolumeRepositorySupport {

    public Volume findLatestVolume();
}
