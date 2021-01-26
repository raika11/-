/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.mic.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * 시민마이크 아젠다
 */
@Alias("MicAgendaVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class MicAgendaVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 아젠다일련번호
     */
    @Column(name = "AGND_SEQ", nullable = false)
    private Long agndSeq;

    /**
     * 사용여부
     */
    @Column(name = "USED_YN", nullable = false)
    private String usedYn = "Y";

    /**
     * 아젠다 제목
     */
    @Column(name = "AGND_TITLE", nullable = false)
    private String agndTitle;

    /**
     * 아젠다 키워드
     */
    @Column(name = "AGND_KWD")
    private String agndKwd;

    /**
     * 아젠다 내용
     */
    @Column(name = "AGND_MEMO", nullable = false)
    private String agndMemo;

    /**
     * 아젠다 구분
     */
    @Column(name = "AGND_TYPE", nullable = false)
    private String agndType;

    /**
     * 아젠다 TOP Y/N
     */
    @Column(name = "AGND_TOP", nullable = false)
    private String agndTop = "N";

    /**
     * 시작 문장
     */
    @Column(name = "AGND_S_STR")
    private String agndSStr;

    /**
     * 종료 문장
     */
    @Column(name = "AGND_E_STR")
    private String agndEStr;

    /**
     * 커버이미지
     */
    @Column(name = "AGND_IMG")
    private String agndImg;

    /**
     * 커버이미지 모바일용
     */
    @Column(name = "AGND_IMG_MOB")
    private String agndImgMob;

    /**
     * 썸네일
     */
    @Column(name = "AGND_THUMB")
    private String agndThumb;

    /**
     * 등록자
     */
    @Column(name = "REG_ID", nullable = false)
    private String regId;

    /**
     * 등록일시
     */
    @DTODateTimeFormat
    @Column(name = "REG_DT", nullable = false)
    private Date regDt;

    /**
     * 정렬순서
     */
    @Column(name = "ORD_NO", nullable = false)
    private Integer ordNo = 1;

    /**
     * 아젠다 설명
     */
    @Column(name = "AGND_COMMENT")
    private String agndComment;

    /**
     * 서비스일자
     */
    @DTODateTimeFormat
    @Column(name = "AGND_SERVICE_DT")
    private Date agndServiceDt;

    /**
     * 중앙일보 투표 참조키
     */
    @Column(name = "POLL_SEQ", nullable = false)
    private Integer pollSeq = 0;

    /**
     * 아젠다 설명(요약)
     */
    @Column(name = "AGND_LEAD")
    private String agndLead;

    /**
     * 동영상 HTML코드
     */
    @Column(name = "AGND_MOV")
    private String agndMov;

    /**
     * 기사화 단계(0:해당없음 / 1 : 의견수렴 / 2 : 검토중 / 3 : 취재중 / 4 : 기사화)
     */
    @Column(name = "ART_PROGRESS", nullable = false)
    private Integer artProgress = 0;

    /**
     * 기사화 해당 기사 링크 주소 (URL)
     */
    @Column(name = "ART_LINK")
    private String artLink;

}
