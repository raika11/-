/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.issue.repository;

import jmnet.moka.core.tps.mvc.issue.entity.PackageMaster;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.issue.repository
 * ClassName : IssueDeskingRepository
 * Created : 2021-03-19
 * </pre>
 *
 * @author ssc
 * @since 2021-03-19 오후 3:24
 */
public interface IssueDeskingHistRepositorySupport {

    /**
     * 예약기사 내역 삭제
     *
     * @param packageMaster 패키지
     * @param compNo        컴포넌트순번
     */
    void deleteReserveHist(PackageMaster packageMaster, Integer compNo);

    /**
     * 예약된 기사가 서비스에 반영되어, 히스토리를 업데이트
     *
     * @param packageMaster 패키지
     * @param compNo        컴포넌트순번
     */
    void excuteReserveDeskingHist(PackageMaster packageMaster, Integer compNo);
}
