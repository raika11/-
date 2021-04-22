/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.my.service;

import jmnet.moka.core.tps.mvc.my.dto.MyEmailDTO;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2021-04-22
 */
public interface MyService {
    /**
     * 회원이메일수정
     *
     * @param myEmail 수정정보
     */
    void updateEmail(MyEmailDTO myEmail);
}
