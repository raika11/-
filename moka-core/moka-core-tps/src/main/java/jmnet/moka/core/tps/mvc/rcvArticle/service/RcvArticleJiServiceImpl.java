/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.rcvArticle.service;

import jmnet.moka.core.tps.mvc.rcvArticle.dto.RcvArticleJiSearchDTO;
import jmnet.moka.core.tps.mvc.rcvArticle.entity.RcvArticleJiXml;
import jmnet.moka.core.tps.mvc.rcvArticle.repository.RcvArticleJiXmlRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2021-02-18
 */
@Service
@Slf4j
public class RcvArticleJiServiceImpl implements RcvArticleJiService {

    @Autowired
    private RcvArticleJiXmlRepository rcvArticleJiXmlRepository;

    @Override
    public Page<RcvArticleJiXml> findAllRcvArticleJi(RcvArticleJiSearchDTO search) {
        return rcvArticleJiXmlRepository.findList(search);
    }

}
