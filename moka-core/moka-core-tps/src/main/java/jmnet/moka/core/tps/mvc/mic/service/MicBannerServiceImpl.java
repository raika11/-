/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.mic.service;

import java.util.List;
import jmnet.moka.core.tps.mvc.mic.dto.MicBannerSearchDTO;
import jmnet.moka.core.tps.mvc.mic.mapper.MicMapper;
import jmnet.moka.core.tps.mvc.mic.vo.MicBannerVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Description: 배너서비스 impl
 *
 * @author ssc
 * @since 2021-01-26
 */
@Service
@Slf4j
public class MicBannerServiceImpl implements MicBannerService {
    @Autowired
    private MicMapper micMapper;

    @Override
    public List<MicBannerVO> findAllMicBanner(MicBannerSearchDTO search) {
        return micMapper.findAllMicBanner(search);
    }

    @Override
    public MicBannerVO findMicBannerById(Long bnnrSeq) {
        return micMapper.findMicBannerById(bnnrSeq);
    }
}
