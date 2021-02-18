/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.rcvArticle.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

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
@Embeddable
@ToString
@EqualsAndHashCode
public class RcvArticleJiXmlPK implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 출처구분(CP)
     */
    @Column(name = "SOURCE_CODE", nullable = false)
    private String sourceCode;

    /**
     * 호(회차)
     */
    @Column(name = "HO", nullable = false)
    private Integer ho;

    /**
     * 면
     */
    @Column(name = "MYUN", nullable = false)
    private String myun;

    /**
     * 판
     */
    @Column(name = "PAN", nullable = false)
    private String pan;

    /**
     * 섹션
     */
    @Column(name = "SECTION", nullable = false)
    private String section;

    /**
     * 수정버전
     */
    @Column(name = "REVISION", nullable = false)
    private String revision;
}
