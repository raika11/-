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
public enum ImageSearchType {
    IMAGE(0, "I"),      // 리스트형
    LIST(1, "L");       // 이미지형

    private int code;
    private String value;

    ImageSearchType(int code, String value) {
        this.code = code;
        this.value = value;
    }
}
