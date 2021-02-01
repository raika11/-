package jmnet.moka.core.tps.mvc.watermark.service;

import java.util.List;
import jmnet.moka.core.tps.mvc.watermark.entity.Watermark;
import jmnet.moka.core.tps.mvc.watermark.dto.WatermarkSearchDTO;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.watermark.service
 * ClassName : WatermarkService
 * Created : 2021-01-21 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-21 13:39
 */
public interface WatermarkService {

    /**
     * 사용중인 워터마크 목록 조회
     *
     * @return 워터마크
     */
    List<Watermark> findAllWatermark();


    /**
     * 사용중인 워터마크 목록 조회
     *
     * @return 워터마크
     */
    Page<Watermark> findAllWatermark(WatermarkSearchDTO search);
}
