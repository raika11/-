/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.rcvarticle.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import jmnet.moka.core.tps.common.code.ArticleCodeType;
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
 * @since 2020-12-23
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Embeddable
@ToString
@EqualsAndHashCode
public class RcvArticleCodePK implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 기사 고유 아이디
     */
    @Column(name = "rid", nullable = false, insertable = false, updatable = false)
    private Long rid;

    /**
     * 코드타입(1:분류코드,2:속성코드,3:이슈코드)
     */
    @Column(name = "CODE_TYPE", nullable = false, columnDefinition = "char", insertable = false, updatable = false)
    private ArticleCodeType codeType = ArticleCodeType.MASTER_CODE;

    /**
     * 수신기사코드
     */
    @Column(name = "CODE_ID", insertable = false, updatable = false)
    private String codeId;

    /**
     * 수신기사코드
     */
    @Column(name = "MASTER_CODE", insertable = false, updatable = false)
    private String masterCode;
}
