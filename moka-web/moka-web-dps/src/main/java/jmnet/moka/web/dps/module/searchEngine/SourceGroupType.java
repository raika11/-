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
public enum SourceGroupType {
    ALL(0, "1,2,3,4,5,6,9"),        // 전체
    JOONGANG(1, "1"),               //중앙일보
    ILGAN_SPORTS(2, "2"),           // 일간스포츠
    JTBC(3, "3"),                   // JTBC
    JOONGANG_SUNDAY(4, "4"),        // 중앙선데이
    JOONGANG_DAILY(5, "5"),         // 중앙데일리
    JOONGANG_ONLINE(6, "6"),        // 온라인 중앙일보
    JOIND(7, "7"),                  // 조인디
    ETC(9, "9");                    //기타

    private int code;
    private String value;

    SourceGroupType(int code, String value) {
        this.code = code;
        this.value = value;
    }

    public static boolean containsValue(String value) {
        boolean find = false;
        for (SourceGroupType item : SourceGroupType.values()) {
            find = item
                    .getValue()
                    .equals(value);
        }

        return find;
    }
}
