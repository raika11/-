/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.issue.service;

import java.util.List;
import jmnet.moka.core.tps.mvc.issue.dto.IssueDeskingComponentDTO;
import jmnet.moka.core.tps.mvc.issue.dto.IssueDeskingHistDTO;
import jmnet.moka.core.tps.mvc.issue.entity.PackageMaster;

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
    List<IssueDeskingComponentDTO> findAllIssueDesking(PackageMaster packageMaster);

    /**
     * 패키지의 컴포넌트의 편집목록조회
     *
     * @param packageMaster 패키지
     * @param compNo        컴포넌트순번
     * @return 편집목록
     */
    IssueDeskingComponentDTO findIssueDeskingComponent(PackageMaster packageMaster, Integer compNo);

    /**
     * 편집기사 임시저장
     *
     * @param packageMaster            패키지
     * @param issueDeskingComponentDTO 컴포넌트 편집기사
     * @param regId                    작업자ID
     * @return
     */
    IssueDeskingComponentDTO save(PackageMaster packageMaster, IssueDeskingComponentDTO issueDeskingComponentDTO, String regId);

    /**
     * 편집기사 전송
     *
     * @param packageMaster 패키지
     * @param compNo        컴포넌트 순번
     * @param regId         작업자ID
     * @return
     */
    IssueDeskingComponentDTO publish(PackageMaster packageMaster, Integer compNo, String regId);

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

}
