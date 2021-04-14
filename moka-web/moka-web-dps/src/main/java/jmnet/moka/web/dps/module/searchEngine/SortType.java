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
public enum SortType {
    NEW(0, "DATE/DESC,RANK/DESC"),                  // 최신 순
    ACCURACY(1, "RANK/DESC,DATE/DESC"),             // 정확도
    REPORTER_NAME(2, "REP_NAME/ASC,DATE/DESC");     //기자명(가나다순)

    private int code;
    private String value;

    SortType(int code, String value) {
        this.code = code;
        this.value = value;
    }
}
