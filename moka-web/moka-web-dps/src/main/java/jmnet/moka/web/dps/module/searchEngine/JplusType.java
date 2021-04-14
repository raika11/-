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
public enum JplusType {
    ALL(0, "A"),                // 전체
    WRITER_NAME(1, "N"),        // 필진이름
    WRITER_JOB(2, "J"),         // 필진정보(직업)
    TAG(3, "T");                // 태그

    private int code;
    private String value;

    JplusType(int code, String value) {
        this.code = code;
        this.value = value;
    }
}
