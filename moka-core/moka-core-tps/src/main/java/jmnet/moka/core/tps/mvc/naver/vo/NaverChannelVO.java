/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.naver.vo;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2020-12-15
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class NaverChannelVO implements Serializable {
    private String editorId;
    private String template;
    private List<Map<String, String>> headlineArticles = new ArrayList<>();
    private String feedbackEmail;
}
