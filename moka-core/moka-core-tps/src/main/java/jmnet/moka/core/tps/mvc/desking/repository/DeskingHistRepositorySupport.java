/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.desking.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.desking.entity.DeskingHist;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2020-11-27
 */
public interface DeskingHistRepositorySupport {

    /**
     * componentHistSeq에 해당하는 편집목록 조회
     *
     * @param componentHistSeq 컴포넌트히스토리순번
     * @return 편집목록
     */
    List<DeskingHist> findAllDeskingHist(Long componentHistSeq);

    //    /**
    //     * 예약된 컴포넌트 존재여부 조회
    //     *
    //     * @param datasetSeq 데이타셋SEQ
    //     * @return 예약편집기사 히스토리 존재여부. 있으면 true
    //     */
    //    boolean existsReserveDatasetSeq(Long datasetSeq);

}
