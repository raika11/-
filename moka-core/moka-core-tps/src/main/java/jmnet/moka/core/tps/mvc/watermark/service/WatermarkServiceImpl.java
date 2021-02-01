package jmnet.moka.core.tps.mvc.watermark.service;

import java.util.List;
import java.util.Optional;

import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.mvc.watermark.entity.Watermark;
import jmnet.moka.core.tps.mvc.watermark.dto.WatermarkSearchDTO;
import jmnet.moka.core.tps.mvc.watermark.repository.WatermarkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.watermark.service
 * ClassName : WatermarkServiceImpl
 * Created : 2021-01-21 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-21 13:41
 */

@Service
public class WatermarkServiceImpl implements WatermarkService {

    @Autowired
    private WatermarkRepository watermarkRepository;

    @Override
    public List<Watermark> findAllWatermark() {
        return watermarkRepository.findAllByUsedYn(MokaConstants.YES);
    }

    @Override
    public Page<Watermark> findAllWatermark(WatermarkSearchDTO search) {
        return watermarkRepository.findAllWatermark(search);
    }

    @Override
    public Optional<Watermark> findById(Long seqNo) {
        return watermarkRepository.findById(seqNo);
    }
}
