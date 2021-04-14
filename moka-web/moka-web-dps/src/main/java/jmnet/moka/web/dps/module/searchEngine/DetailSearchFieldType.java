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
public enum DetailSearchFieldType {
    TITLE(0, "ART_TITLE"),
    SUBTITLE(1, "ART_SUBTITLE"),
    CONTENT(2, "ART_CONTENT"),
    REPORTER(3, "ART_REPORTER"),
    KEYWORD(4, "ART_KWD");

    private int code;
    private String value;

    DetailSearchFieldType(int code, String value) {
        this.code = code;
        this.value = value;
    }

    public static boolean containsValue(String value) {
        boolean find = false;
        for (DetailSearchFieldType item : DetailSearchFieldType.values()) {
            find = item
                    .getValue()
                    .equals(value);
        }

        return find;
    }

    public static String getValue(int code) {
        for (DetailSearchFieldType item : DetailSearchFieldType.values()) {
            if (item.getCode() == code) {
                return item.getValue();
            }
        }
        return null;
    }
}
