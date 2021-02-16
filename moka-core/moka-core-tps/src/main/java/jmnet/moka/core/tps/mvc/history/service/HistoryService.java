/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.history.service;

import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.tps.mvc.history.dto.HistDTO;

/**
 * Description: 히스토리
 *
 * @author ssc
 * @since 2020-11-02
 */
public interface HistoryService {

    HistDTO findPageHist(Long histSeq)
            throws NoDataException;

    HistDTO findArticlePageHist(Long histSeq)
            throws NoDataException;

    HistDTO findContainerHist(Long histSeq)
            throws NoDataException;

    HistDTO findTemplateHist(Long histSeq)
            throws NoDataException;
}
