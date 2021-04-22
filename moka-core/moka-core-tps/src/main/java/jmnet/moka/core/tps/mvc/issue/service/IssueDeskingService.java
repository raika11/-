/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.issue.service;

import java.util.Date;
import java.util.List;
import jmnet.moka.core.tps.common.code.EditStatusCode;
import jmnet.moka.core.tps.mvc.issue.dto.IssueDeskingHistCompDTO;
import jmnet.moka.core.tps.mvc.issue.dto.IssueDeskingHistDTO;
import jmnet.moka.core.tps.mvc.issue.dto.IssueDeskingHistGroupSearchDTO;
import jmnet.moka.core.tps.mvc.issue.entity.PackageMaster;
import jmnet.moka.core.tps.mvc.issue.vo.IssueDeskingHistGroupVO;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2021-04-13
 */
public interface IssueDeskingService {
    /**
     * 패키지의 모든 편집목록을 컴포넌트별로 조회
     *
     * @param packageMaster 패키지
     * @return 편집목록
     */
    List<IssueDeskingHistCompDTO> findAllIssueDeskingHist(PackageMaster packageMaster);

    /**
     * 패키지의 컴포넌트의 최종 임시저장된 컴포넌트조회
     *
     * @param packageMaster 패키지
     * @param compNo        컴포넌트순번
     * @return 컴포넌트(편집기사포함)
     */
    IssueDeskingHistCompDTO findIssueDeskingHistBySaveComponent(PackageMaster packageMaster, Integer compNo);

    /**
     * 패키지의 최종 컴포넌트조회
     *
     * @param packageMaster 패키지
     * @param compNo        컴포넌트순번
     * @param status        상태(SAVE,PUBLISH)
     * @param approvalYn    배포여부(Y,N)
     * @return 컴포넌트목록(편집기사포함)
     */
    IssueDeskingHistCompDTO findIssueDeskingHistByComp(PackageMaster packageMaster, Integer compNo, EditStatusCode status, String approvalYn);

    /**
     * 편집기사 임시저장
     *
     * @param packageMaster           패키지
     * @param issueDeskingHistCompDTO 컴포넌트 편집기사
     * @param regId                   작업자ID
     */
    void save(PackageMaster packageMaster, IssueDeskingHistCompDTO issueDeskingHistCompDTO, String regId);

    /**
     * 편집기사 전송
     *
     * @param packageMaster 패키지
     * @param compNo        컴포넌트 순번
     * @param regId         작업자ID
     */
    void publish(PackageMaster packageMaster, Integer compNo, String regId)
            throws Exception;

    /**
     * 예약
     *
     * @param packageMaster 패키지
     * @param compNo        컴포넌트순번
     * @param regId         작업자ID
     * @param reserveDt     예약시간
     */
    void reserve(PackageMaster packageMaster, Integer compNo, String regId, Date reserveDt)
            throws Exception;

    /**
     * 자동컴포넌트의 편집기사 저장
     *
     * @param packageMaster 패키지
     * @param regId         작업자ID
     */
    void insertAutoComponentDeskingHist(PackageMaster packageMaster, String regId);

    /**
     * escape
     *
     * @param dto
     */
    void escapeHtml(IssueDeskingHistDTO dto);

    /**
     * 예약삭제
     *
     * @param packageMaster 패키지
     * @param compNo        컴포넌트순번
     */
    void deleteReserve(PackageMaster packageMaster, Integer compNo)
            throws Exception;

    /**
     * 예약편집기사를 서비스에 등록
     *
     * @param packageMaster 패키지
     * @param compNo        컴포넌트순번
     * @throws Exception
     */
    void excuteReserve(PackageMaster packageMaster, Integer compNo)
            throws Exception;

    /**
     * 컴포넌트 히스토리 목록조회
     *
     * @param search 검색조건
     * @return 컴포넌트 히스토리 목록
     */
    List<IssueDeskingHistGroupVO> findIssueDeskingHistGroupByComp(IssueDeskingHistGroupSearchDTO search);

    /**
     * 컴포넌트 히스토리의 편집기사목록조회
     *
     * @param packageMaster 패키지
     * @param search        검색조건
     * @return 컴포넌트(편집기사포함)
     */
    IssueDeskingHistCompDTO findIssueDeskingHistByGroup(PackageMaster packageMaster, IssueDeskingHistGroupSearchDTO search);
}
