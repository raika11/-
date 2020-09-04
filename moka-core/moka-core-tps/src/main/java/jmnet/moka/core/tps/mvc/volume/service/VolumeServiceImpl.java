package jmnet.moka.core.tps.mvc.volume.service;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import jmnet.moka.core.tps.mvc.volume.dto.VolumeSearchDTO;
import jmnet.moka.core.tps.mvc.volume.entity.Volume;
import jmnet.moka.core.tps.mvc.volume.repository.VolumeRepository;

/**
 * <pre>
 * 볼륨 서비스 Impl
 * 2020. 1. 16. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 1. 16. 오후 2:07:40
 * @author ssc
 */
@Service
public class VolumeServiceImpl implements VolumeService {

    @Autowired
    VolumeRepository volumeRepository;

    @Override
    public Page<Volume> findList(VolumeSearchDTO search, Pageable pageable) {
        return volumeRepository.findAll(pageable);
    }

    @Override
    public Optional<Volume> findVolume(String volumeId) {
        return volumeRepository.findById(volumeId);
    }

    @Override
    public Volume insertVolume(Volume volume) {
        return volumeRepository.save(volume);
    }

    @Override
    public void deleteVolume(Volume volume) {
        volumeRepository.delete(volume);
    }

    @Override
    public Volume updateVolume(Volume volume) {
        return volumeRepository.save(volume);
    }

    @Override
    public String getLatestVolumeId() {
        return volumeRepository.findLatestVolume().getVolumeId();
    }

}
