/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.issue.mapper;

import java.util.List;
import java.util.Map;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.issue.dto.PackageSearchDTO;
import jmnet.moka.core.tps.mvc.issue.vo.IssueDeskingVO;
import jmnet.moka.core.tps.mvc.issue.vo.PackageVO;

/**
 * Description: 이슈 mapper
 *
 * @author ssc
 * @since 2021-03-22
 */
public interface IssueMapper extends BaseMapper<PackageVO, PackageSearchDTO> {

    /**
     * 편집기사 목록조회
     *
     * @param param pkgSeq 패키지순번, compNo 컴포넌트순번, status 상태(SAVE/PUBLISH)
     * @return
     */
    List<IssueDeskingVO> findAllIssueDesking(Map<String, Object> param);
}
