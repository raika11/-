package jmnet.moka.core.tps.mvc.watermark.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.watermark.entity.Watermark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface WatermarkRepository extends JpaRepository<Watermark, Integer>, JpaSpecificationExecutor<Watermark> {

    /**
     * Watermark 목록 조회
     *
     * @param usedYn 사용여부
     * @return 워터마크 목록
     */
    List<Watermark> findAllByUsedYn(String usedYn);
}
