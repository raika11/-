/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.web.dps.module.searchEngine;

import lombok.Getter;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2021-04-13
 */
@Getter
public enum PeriodType {
    ALL(0, "A"),            // 전체
    ONE_DAY(1, "D"),        // 1일
    ONE_WEEK(2, "W"),       //1주
    ONE_MONTH(3, "M"),      //1개월
    DIRECT_INPUT(4, "I");   //직접입력

    private int code;
    private String value;

    PeriodType(int code, String value) {
        this.code = code;
        this.value = value;
    }
}
