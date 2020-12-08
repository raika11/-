/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.component.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.component.entity.ComponentHist;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2020-11-19
 */
public interface ComponentHistRepositorySupport {
    /**
     * 히스토리에서 데스크 데이터셋 찾기위해, 전송된 마지막 히스토리 조회
     *
     * @param componentSeq 컴포넌트SEQ
     * @param dataType     데이타타입
     * @return 컴포넌트히스토리
     */
    List<ComponentHist> findLastHist(Long componentSeq, String dataType);

    //    /**
    //     * 예약된 컴포넌트 존재여부 조회
    //     *
    //     * @param componentSeq 컴포넌트SEQ
    //     * @return 예약컴포넌트 히스토리 갯수
    //     */
    //    boolean existsReserveComponentSeq(Long componentSeq);
}
