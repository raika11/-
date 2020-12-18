/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.articlesource.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * CP 분류와 중앙 분류 매핑
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_RCV_CODE_CONV")
public class RcvCodeConv implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO", nullable = false)
    private Long seqNo;

    /**
     * FR코드
     */
    @Column(name = "FR_CODE", nullable = false)
    private String frCode;

    /**
     * TO코드
     */
    @Column(name = "TO_CODE", nullable = false)
    private String toCode;

    /**
     * TO코드PRIME
     */
    @Column(name = "TO_CODE_PRIME")
    private String toCodePrime;

    /**
     * 코드타입
     */
    @Column(name = "CODE_TYPE")
    private String codeType;

    /**
     * JAM중분류코드
     */
    @Column(name = "SECTCODE")
    private String sectcode;

    /**
     * 매체
     */
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "SOURCE_CODE", referencedColumnName = "SOURCE_CODE", nullable = false)
    private ArticleSource articleSource;

}
