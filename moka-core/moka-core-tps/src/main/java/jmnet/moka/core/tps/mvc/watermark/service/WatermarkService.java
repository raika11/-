package jmnet.moka.core.tps.mvc.watermark.service;

import java.util.List;
import jmnet.moka.core.tps.mvc.watermark.entity.Watermark;

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
}
