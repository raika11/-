package jmnet.moka.core.tps.mvc.watermark.repository;

import jmnet.moka.core.tps.mvc.watermark.dto.WatermarkSearchDTO;
import jmnet.moka.core.tps.mvc.watermark.entity.Watermark;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.Watermark.repository
 * ClassName : WatermarkRepositorySupport
 * Created : 2020-10-22 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-01 10:56
 */
public interface WatermarkRepositorySupport {

    /**
     * 그룹 목록 검색
     *
     * @param searchDTO 검색 조건
     * @return 검색 결과
     */
    Page<Watermark> findAllWatermark(WatermarkSearchDTO searchDTO);
}
