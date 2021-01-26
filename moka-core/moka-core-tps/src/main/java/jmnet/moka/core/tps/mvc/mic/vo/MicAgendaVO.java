/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.mic.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.persistence.Column;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.code.AgendaArticleProgressCode;
import jmnet.moka.core.tps.common.code.AgendaTypeCode;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;
import org.hibernate.validator.constraints.Length;
import org.springframework.web.multipart.MultipartFile;

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
    @Min(value = 0, message = "{tps.agenda.error.min.agndSeq}")
    @Column(name = "AGND_SEQ", nullable = false)
    private Long agndSeq;

    /**
     * 사용여부
     */
    @NotNull(message = "{tps.agenda.error.notnull.usedYn}")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.agenda.error.pattern.usedYn}")
    @Column(name = "USED_YN", nullable = false)
    @Builder.Default
    private String usedYn = MokaConstants.YES;

    /**
     * 아젠다 제목
     */
    @NotNull(message = "{tps.agenda.error.notnull.agndTitle}")
    @Length(max = 255, message = "{tps.agenda.error.len.agndTitle}")
    @Column(name = "AGND_TITLE", nullable = false)
    private String agndTitle;

    /**
     * 아젠다 키워드(아젠다)
     */
    @Length(max = 50, message = "{tps.agenda.error.len.agndKwd}")
    @Column(name = "AGND_KWD")
    private String agndKwd;

    /**
     * 아젠다 내용(아젠다본문)
     */
    @NotNull(message = "{tps.agenda.error.notnull.agndMemo}")
    @Length(max = 255, message = "{tps.agenda.error.len.agndMemo}")
    @Column(name = "AGND_MEMO", nullable = false)
    private String agndMemo;

    /**
     * 아젠다 구분
     */
    @NotNull(message = "{tps.agenda.error.notnull.agndType}")
    @Column(name = "AGND_TYPE", nullable = false)
    @Builder.Default
    private String agndType = AgendaTypeCode.DEFAULT.getCode();

    /**
     * 아젠다 구분명
     */
    @Builder.Default
    private String agndTypeName = AgendaTypeCode.DEFAULT.getName();

    /**
     * 아젠다 TOP Y/N
     */
    @NotNull(message = "{tps.agenda.error.notnull.agndTop}")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.agenda.error.pattern.agndTop}")
    @Column(name = "AGND_TOP", nullable = false)
    @Builder.Default
    private String agndTop = MokaConstants.NO;

    /**
     * 시작 문장
     */
    @Length(max = 100, message = "{tps.agenda.error.len.agndSStr}")
    @Column(name = "AGND_S_STR")
    private String agndSStr;

    /**
     * 종료 문장
     */
    @Length(max = 100, message = "{tps.agenda.error.len.agndEStr}")
    @Column(name = "AGND_E_STR")
    private String agndEStr;

    /**
     * 커버이미지
     */
    @Length(max = 255, message = "{tps.agenda.error.len.agndImg}")
    @Column(name = "AGND_IMG")
    private String agndImg;

    /**
     * 커버이미지 모바일용
     */
    @Length(max = 255, message = "{tps.agenda.error.len.agndImgMob}")
    @Column(name = "AGND_IMG_MOB")
    private String agndImgMob;

    /**
     * 썸네일
     */
    @Length(max = 255, message = "{tps.agenda.error.len.agndThumb}")
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
    @Builder.Default
    private Integer ordNo = 1;

    /**
     * 아젠다 설명
     */
    @Length(max = 255, message = "{tps.agenda.error.len.agndComment}")
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
    @Builder.Default
    @Column(name = "POLL_SEQ", nullable = false)
    private Long pollSeq = (long) 0;

    /**
     * 아젠다 설명(요약)
     */
    @Length(max = 1000, message = "{tps.agenda.error.len.agndLead}")
    @Column(name = "AGND_LEAD")
    private String agndLead;

    /**
     * 동영상 HTML코드
     */
    @Length(max = 255, message = "{tps.agenda.error.len.agndMov}")
    @Column(name = "AGND_MOV")
    private String agndMov;

    /**
     * 기사화 단계(0:해당없음 / 1 : 의견수렴 / 2 : 검토중 / 3 : 취재중 / 4 : 기사화)
     */
    @Column(name = "ART_PROGRESS", nullable = false)
    @Builder.Default
    private Integer artProgress = Integer.parseInt(AgendaArticleProgressCode.NONE.getCode());

    /**
     * 기사화 단계명
     */
    @Builder.Default
    private String artProgressName = AgendaArticleProgressCode.NONE.getName();

    /**
     * 기사화 해당 기사 링크 주소 (URL)
     */
    @Length(max = 200, message = "{tps.agenda.error.len.artLink}")
    @Column(name = "ART_LINK")
    private String artLink;

    /**
     * 카테고리 목록
     */
    List<MicAgendaCategoryVO> categoryList = new ArrayList<>();

    /**
     * 관련기사 목록
     */
    List<MicRelArticleVO> relArticleList = new ArrayList<>();

    @ApiModelProperty("배경이미지파일(PC)")
    @JsonIgnore
    private MultipartFile agndImgFile;

    @ApiModelProperty("배경이미지파일(모바일)")
    @JsonIgnore
    private MultipartFile agndImgMobFile;

    public void setAgndType(String agndType) {
        this.agndType = agndType;
        if (agndType != null) {
            this.agndTypeName = AgendaTypeCode
                    .get(agndType)
                    .getName();
        }
    }

    public void setArtProgress(Integer artProgress) {
        this.artProgress = artProgress;
        if (artProgress != null) {
            this.artProgressName = AgendaArticleProgressCode
                    .get(artProgress.toString())
                    .getName();
        }
    }

    public void setPollSeq(Long pollSeq) {
        this.pollSeq = pollSeq == null ? (long) 0 : pollSeq;
    }

}
