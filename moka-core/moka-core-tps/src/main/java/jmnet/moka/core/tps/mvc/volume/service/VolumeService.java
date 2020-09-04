package jmnet.moka.core.tps.mvc.volume.service;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import jmnet.moka.core.tps.mvc.volume.dto.VolumeSearchDTO;
import jmnet.moka.core.tps.mvc.volume.entity.Volume;

/**
 * <pre>
 * 볼륨 서비스 
 * 2020. 1. 16. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 1. 16. 오후 2:06:54
 * @author ssc
 */
public interface VolumeService {
    /**
     * <pre>
     * 볼륨목록조회
     * </pre>
     * 
     * @param search 검색조건
     * @param pageable 페이징
     * @return 볼륨목록
     */
    public Page<Volume> findList(VolumeSearchDTO search, Pageable pageable);

    /**
     * <pre>
     * 볼륨 정보 조회
     * </pre>
     * 
     * @param volumeId 볼륨ID
     * @return 볼륨정보
     */
    public Optional<Volume> findVolume(String volumeId);

    /**
     * <pre>
     * 볼륨 등록
     * </pre>
     * 
     * @param volume 등록할 볼륨
     * @return 등록된 볼륨
     */
    public Volume insertVolume(Volume volume);

    /**
     * 가장 최신 볼륨의 Id를 조회한다
     * @return 가장 최신 볼륨 Id
     */
    public String getLatestVolumeId();

    /**
     * <pre>
     * 볼륨 수정
     * </pre>
     * 
     * @param volume 수정할 볼륨
     * @return 수정된 볼륨
     */
    public Volume updateVolume(Volume volume);

    /**
     * <pre>
     * 볼륨 삭제
     * </pre>
     * 
     * @param volume 볼륨 정보
     */
    public void deleteVolume(Volume volume);
}
