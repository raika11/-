/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.my.mapper;

import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.mvc.my.dto.MyEmailDTO;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2021-04-22
 */
public interface MyMapper extends BaseMapper<MyEmailDTO, SearchDTO> {
    /**
     * 회원 이메일 수정
     *
     * @param myEmail 변경이메일정보
     * @return 성공여부
     */
    int updateEmail(MyEmailDTO myEmail);
}
