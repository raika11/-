/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.history.service;

import java.util.List;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.history.dto.HistDTO;
import jmnet.moka.core.tps.mvc.history.dto.HistSearchDTO;
import jmnet.moka.core.tps.mvc.history.dto.HistSimpleDTO;

/**
 * Description: 히스토리
 *
 * @author ssc
 * @since 2020-11-02
 */
public interface HistoryService {
    List<HistSimpleDTO> findAllPageHist(HistSearchDTO search);

    List<HistSimpleDTO> findAllSkinHist(HistSearchDTO search);

    List<HistSimpleDTO> findAllContainerHist(HistSearchDTO search);

    List<HistSimpleDTO> findAllTemplateHist(HistSearchDTO search);

    HistDTO findPageHist(Long histSeq)
            throws NoDataException;

    HistDTO findSkinHist(Long histSeq);

    HistDTO findContainerHist(Long histSeq)
            throws NoDataException;

    HistDTO findTemplateHist(Long histSeq)
            throws NoDataException;
}
