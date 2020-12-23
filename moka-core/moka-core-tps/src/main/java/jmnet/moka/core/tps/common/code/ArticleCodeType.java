/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.common.code;

/**
 * Description: 수신기사 분류코드 타입
 *
 * @author ssc
 * @since 2020-12-23
 */
public enum ArticleCodeType {
    MASTER_CODE("1", "분류코드"),
    ATTRIBUTE_CODE("2", "속성코드"),
    ISSUE_CODE("3", "이슈코드");

    private String code;
    private String name;

    ArticleCodeType(String code, String name) {
        this.code = code;
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }
}
