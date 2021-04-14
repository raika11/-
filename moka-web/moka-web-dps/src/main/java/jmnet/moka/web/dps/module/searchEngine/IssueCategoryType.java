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
public enum IssueCategoryType {
    ALL(0, ""),      // 전체
    GA(1, "ㄱ"),     // 가
    NA(2, "ㄴ"),     // 나
    DA(3, "ㄷ"),     // 다
    RA(4, "ㄹ"),     // 라
    MA(5, "ㅁ"),     // 마
    BA(6, "ㅂ"),     // 바
    SA(7, "ㅅ"),     // 사
    AH(8, "ㅇ"),     // 아
    JA(9, "ㅈ"),     // 자
    CHA(10, "ㅊ"),    // 차
    KA(11, "ㅋ"),     // 카
    TA(12, "ㅌ"),     // 타
    PA(13, "ㅍ"),     // 파
    HA(14, "ㅎ"),     // 하
    ETC(15, "ETC");   // etc

    private int code;
    private String value;

    IssueCategoryType(int code, String value) {
        this.code = code;
        this.value = value;
    }
}
