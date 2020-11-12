/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.article.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * 매체
 */
@Alias("ArticleSourceVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ArticleSourceVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 출처
     */
    @Id
    @Column(name = "SOURCE_CODE", nullable = false)
    private String sourceCode;

    /**
     * 출처명
     */
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
    @Column(name = "JOONGANG_USE")
    private String joongangUse;

    /**
     * 일간사용
     */
    @Column(name = "ILGAN_USE")
    private String ilganUse;

    /**
     * CONSALES사용
     */
    @Column(name = "CONSALES_USE")
    private String consalesUse;

    /**
     * JSTORE사용
     */
    @Column(name = "JSTORE_USE")
    private String jstoreUse;

    @Column(name = "USED_YN")
    private String usedYn = "Y";

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
    @Column(name = "ARTICLE_EDIT_YN")
    private String articleEditYn = "N";

    /**
     * 조인스XML형식
     */
    @Column(name = "JOINS_XML_FORMAT")
    private String joinsXmlFormat = "Y";

    /**
     * 이미지수신여부
     */
    @Column(name = "IMG_RECEIVE_YN")
    private String imgReceiveYn = "N";

    /**
     * 등록일시
     */
    @Column(name = "REG_DT", nullable = false)
    private Date regDt;

    /**
     * 등록자
     */
    @Column(name = "REG_ID")
    private String regId;

    /**
     * 수정일시
     */
    @Column(name = "MOD_DT")
    private Date modDt;

    /**
     * 수정자
     */
    @Column(name = "MOD_ID")
    private String modId;

}
