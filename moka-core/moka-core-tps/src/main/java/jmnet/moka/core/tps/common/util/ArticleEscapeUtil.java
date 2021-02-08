/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.common.util;

import com.sun.xml.fastinfoset.util.StringArray;
import org.springframework.util.Assert;
import org.springframework.web.util.HtmlUtils;

/**
 * Description: 기사 text 변환
 *
 * @author ssc
 * @since 2021-02-05
 */
public class ArticleEscapeUtil {
    StringArray from;
    StringArray to;

    public ArticleEscapeUtil() {
    }

    public static String htmlEscape(String input) {
        Assert.notNull(input, "Input is required");

        // 1.html entity 변환
        input = HtmlUtils.htmlEscape(input);

        // 2. 기사변환
        StringBuilder escaped = new StringBuilder(input.length() * 2);

        for (int i = 0; i < input.length(); ++i) {
            char character = input.charAt(i);
            String reference = convert(character);
            if (reference != null) {
                escaped.append(reference);
            } else {
                escaped.append(character);
            }
        }

        return escaped.toString();
    }

    public static String convert(char input) {
        String escaped = String.valueOf(input);
        if (escaped.equals("‘")) {
            escaped = "&#39;";
        } else if (escaped.equals("\\")) {
            escaped = "&#34;";
        } else if (escaped.equals("[")) {
            escaped = "&#91;";
        } else if (escaped.equals("]")) {
            escaped = "&#93;";
        } else if (escaped.equals("…")) {
            escaped = "...";
        }
        return escaped;
    }
}
