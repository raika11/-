/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.issue.mapper;

import java.util.List;
import java.util.Map;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.issue.dto.IssueDeskingHistGroupSearchDTO;
import jmnet.moka.core.tps.mvc.issue.dto.PackageSearchDTO;
import jmnet.moka.core.tps.mvc.issue.vo.IssueDeskingHistGroupVO;
import jmnet.moka.core.tps.mvc.issue.vo.PackageVO;
import org.springframework.stereotype.Repository;

/**
 * Description: 이슈 mapper
 *
 * @author ssc
 * @since 2021-03-22
 */
@Repository
public interface IssueMapper extends BaseMapper<PackageVO, PackageSearchDTO> {

    /**
     * 최종 작업된 컴포넌트목록,편집기사목록 조회
     *
     * @param param pkgSeq 패키지순번, compNo 컴포넌트순번, status 상태(SAVE/PUBLISH), approvalYn 배포여부(Y/N)
     * @return 컴포넌트목록, 편집기사목록
     */
    List<List<Object>> findAllIssueDeskingHistLast(Map<String, Object> param);

    /**
     * 컴포넌트별 히스토리그룹목록 조회
     *
     * @param search 검색조건
     * @return 히스토리그룹목록
     */
    List<IssueDeskingHistGroupVO> findIssueDeskingHistGroupByComp(IssueDeskingHistGroupSearchDTO search);

    /**
     * 작업 히스토리의 상세 기사목록조회
     *
     * @param search 검색조건
     * @return 컴포넌트, 편집기사목록
     */
    List<List<Object>> findIssueDeskingHistByGroup(IssueDeskingHistGroupSearchDTO search);

    /**
     * 패키지 입력/수정 시 기사 묶기 위한 프호시저
     *
     * @param pkgSeq 패키지 일련번호.
     */
    void updatePackageTotalId(Long pkgSeq);
}
