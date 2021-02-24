/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.rcvarticle.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 선데이/중앙 조판기사(XML)
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_RCV_ARTICLE_JI_XML")
public class RcvArticleJiXml implements Serializable {

    private static final long serialVersionUID = 1L;

    @EmbeddedId
    @Builder.Default
    private RcvArticleJiXmlPK id = new RcvArticleJiXmlPK();

    /**
     * 출판일자
     */
    @Column(name = "PRESS_DATE", nullable = false)
    private String pressDate;


    /**
     * 등록일시
     */
    @Column(name = "REG_DT", nullable = false)
    private Date regDt;

    /**
     * 수신기사xml본문
     */
    @Column(name = "XML_BODY")
    private String xmlBody;

}
