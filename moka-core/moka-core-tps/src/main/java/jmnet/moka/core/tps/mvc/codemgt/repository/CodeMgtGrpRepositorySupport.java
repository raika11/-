/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.codemgt.repository;

import jmnet.moka.core.tps.mvc.codemgt.dto.CodeMgtGrpSearchDTO;
import jmnet.moka.core.tps.mvc.codemgt.entity.CodeMgtGrp;
import org.springframework.data.domain.Page;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2021-02-10
 */
public interface CodeMgtGrpRepositorySupport {

    /**
     * 코드 그룹 조회
     *
     * @param search 검색조건
     * @return 그룹목록
     */
    Page<CodeMgtGrp> findAll(CodeMgtGrpSearchDTO search);

    /**
     * 코드 그룹 목록 조회
     *
     * @param secretYn 숨김여부
     * @param usedYn   사용여부
     * @return 코드그룹목록
     */
    //    Page<CodeMgtGrp> findBySecretYnAndUsedYn(String secretYn, String usedYn, Pageable pageable);

    //
    //    Page<CodeMgtGrp> findByUsedYn(String usedYn, Pageable pageable);
}
