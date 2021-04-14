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
public enum ScopeType {
    ALL(0, "ART_TITLE,ART_KWD,ART_REPORTER"),           // 전체
    TITLE_CONTENT(1, "ART_TITLE,ART_CONTENT"),          // 제목 + 내용
    TITLE(2, "ART_TITLE"),                              // 제목
    CONTENT(3, "ART_CONTENT"),                          // 내용
    REPORTER(4, "ART_REPORTER"),                        // 기자명
    KEYWORD(5, "ART_KWD"),                              // 키워드
    TITLE_KEYWORD_REPORTER(6, "ART_TITLE,ART_KWD,ART_REPORTER"); // 제목 + 키워드

    private int code;
    private String value;

    ScopeType(int code, String value) {
        this.code = code;
        this.value = value;
    }
}
