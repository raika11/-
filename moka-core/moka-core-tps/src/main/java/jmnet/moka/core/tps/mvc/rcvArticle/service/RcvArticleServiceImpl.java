/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.rcvArticle.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.rcvArticle.dto.RcvArticleSearchDTO;
import jmnet.moka.core.tps.mvc.rcvArticle.entity.RcvArticleBasic;
import jmnet.moka.core.tps.mvc.rcvArticle.mapper.RcvArticleMapper;
import jmnet.moka.core.tps.mvc.rcvArticle.repository.RcvArticleBasicRepository;
import jmnet.moka.core.tps.mvc.rcvArticle.vo.RcvArticleBasicVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2020-12-22
 */
@Slf4j
@Service
public class RcvArticleServiceImpl implements RcvArticleService {

    private final RcvArticleMapper rcvArticleMapper;

    private final RcvArticleBasicRepository rcvArticleBasicRepository;

    public RcvArticleServiceImpl(RcvArticleMapper rcvArticleMapper, RcvArticleBasicRepository rcvArticleBasicRepository) {
        this.rcvArticleMapper = rcvArticleMapper;
        this.rcvArticleBasicRepository = rcvArticleBasicRepository;
    }

    @Override
    public List<RcvArticleBasicVO> findAllRcvArticleBasic(RcvArticleSearchDTO search) {
        return rcvArticleMapper.findAll(search);
    }

    @Override
    public Optional<RcvArticleBasic> findRcvArticleBasicById(Long rid) {
        return rcvArticleBasicRepository.findById(rid);
    }
}
