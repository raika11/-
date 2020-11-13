/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.article.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

/**
 * 매체
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_ARTICLE_SOURCE")
public class ArticleSource extends BaseAudit {

    private static final long serialVersionUID = 1L;

    /**
     * 출처
     */
    @Id
    @Column(name = "SOURCE_CODE", columnDefinition = "char", nullable = false)
    private String sourceCode;

    /**
     * 출처명
     */
    @Nationalized
    @Column(name = "SOURCE_NAME", nullable = false)
    private String sourceName;

    /**
     * BASEURL
     */
    @Column(name = "SOURCE_BASEURL")
    private String sourceBaseurl;

    /**
     * 출처이미지URL
     */
    @Column(name = "SOURCE_IMAGE_URL")
    private String sourceImageUrl;

    /**
     * 출처기타
     */
    @Column(name = "SOURCE_ETC")
    private String sourceEtc;

    /**
     * 출처타입
     */
    @Column(name = "SOURCE_TYPE", nullable = false)
    private String sourceType;

    /**
     * 서버구분
     */
    @Column(name = "SERVER_GUBUN")
    private String serverGubun;

    /**
     * 중앙사용
     */
    @Column(name = "JOONGANG_USE", columnDefinition = "char")
    private String joongangUse;

    /**
     * 일간사용
     */
    @Column(name = "ILGAN_USE", columnDefinition = "char")
    private String ilganUse;

    /**
     * CONSALES사용
     */
    @Column(name = "CONSALES_USE", columnDefinition = "char")
    private String consalesUse;

    /**
     * JSTORE사용
     */
    @Column(name = "JSTORE_USE", columnDefinition = "char")
    private String jstoreUse;

    /**
     * 사용여부
     */
    @Column(name = "USED_YN", columnDefinition = "char")
    private String usedYn = MokaConstants.YES;

    /**
     * CP담당자
     */
    @Column(name = "CP_ADMIN")
    private String cpAdmin;

    /**
     * CP담당자 연락처
     */
    @Column(name = "CP_PHONE")
    private String cpPhone;

    /**
     * CP담당자 이메일
     */
    @Column(name = "CP_EMAIL")
    private String cpEmail;

    @Column(name = "LOCAL_ADMIN")
    private String localAdmin;

    /**
     * CP FTP 로컬경로
     */
    @Column(name = "CP_FTP_PATH")
    private String cpFtpPath;

    /**
     * CP등록IP주소
     */
    @Column(name = "CP_REG_IP")
    private String cpRegIp;

    /**
     * 내용편집 필요여부
     */
    @Column(name = "ART_EDIT_YN", columnDefinition = "char")
    private String artEditYn = MokaConstants.NO;

    /**
     * 조인스XML형식
     */
    @Column(name = "JOINS_XML_FORMAT", columnDefinition = "char")
    private String joinsXmlFormat = MokaConstants.YES;

    /**
     * 이미지수신여부
     */
    @Column(name = "IMG_RECEIVE_YN", columnDefinition = "char")
    private String imgReceiveYn = MokaConstants.NO;
}
