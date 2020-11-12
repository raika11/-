/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.article.dto;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import jmnet.moka.core.common.MokaConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * 매체
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Alias("ArticleSourceDTO")
public class ArticleSourceDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 출처
     */
    private String sourceCode;

    /**
     * 출처명
     */
    private String sourceName;

    /**
     * BASEURL
     */
    private String sourceBaseurl;

    /**
     * 출처이미지URL
     */
    private String sourceImageUrl;

    /**
     * 출처기타
     */
    private String sourceEtc;

    /**
     * 출처타입
     */
    private String sourceType;

    /**
     * 서버구분
     */
    private String serverGubun;

    /**
     * 중앙사용
     */
    private String joongangUse;

    /**
     * 일간사용
     */
    private String ilganUse;

    /**
     * CONSALES사용
     */
    private String consalesUse;

    /**
     * JSTORE사용
     */
    private String jstoreUse;

    /**
     * 사용여부
     */
    private String usedYn = "Y";

    /**
     * CP담당자
     */
    private String cpAdmin;

    /**
     * CP담당자 연락처
     */
    private String cpPhone;

    /**
     * CP담당자 이메일
     */
    private String cpEmail;

    /**
     *
     */
    private String localAdmin;

    /**
     * CP FTP 로컬경로
     */
    private String cpFtpPath;

    /**
     * CP등록IP주소
     */
    private String cpRegIp;

    /**
     * 내용편집 필요여부
     */
    @Builder.Default
    private String articleEditYn = MokaConstants.NO;

    /**
     * 조인스XML형식
     */
    @Builder.Default
    private String joinsXmlFormat = MokaConstants.YES;

    /**
     * 이미지수신여부
     */
    @Builder.Default
    private String imgReceiveYn = MokaConstants.NO;

    /**
     * 등록일시
     */
    private Date regDt;

    /**
     * 등록자
     */
    private String regId;

    /**
     * 수정일시
     */
    @Column(name = "MOD_DT")
    private Date modDt;

    /**
     * 수정자
     */
    private String modId;

}
