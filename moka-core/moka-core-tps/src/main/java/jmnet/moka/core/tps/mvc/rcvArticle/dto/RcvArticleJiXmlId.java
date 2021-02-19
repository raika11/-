/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.rcvArticle.dto;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2021-02-18
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Alias("RcvArticleJiXmlPKDTO")
public class RcvArticleJiXmlId implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 출처구분(CP)
     */
    private String sourceCode;

    /**
     * 호(회차)
     */
    private Integer ho;

    /**
     * 면
     */
    private String myun;

    /**
     * 판
     */
    private String pan;

    /**
     * 섹션
     */
    private String section;

    /**
     * 수정버전
     */
    private String revision;
}
