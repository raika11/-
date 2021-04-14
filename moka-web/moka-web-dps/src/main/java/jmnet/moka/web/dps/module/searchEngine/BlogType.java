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
public enum BlogType {
    ALL(0, "A"),                // 전체
    IMAGE(1, "I"),              // 이미지
    NICK_NAME(2, "N"),          // 이름/별명
    TAG(3, "T");                // 태그

    private int code;
    private String value;

    BlogType(int code, String value) {
        this.code = code;
        this.value = value;
    }
}
