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
public enum ImageType {
    ALL(0, ""),             // 전체
    ARTICLE(1, "001"),      // 기사이미지
    PHOTO(2, "002"),        // 포토갤러리
    GALLERY(3, "003");      // 화보

    private int code;
    private String value;

    ImageType(int code, String value) {
        this.code = code;
        this.value = value;
    }
}
