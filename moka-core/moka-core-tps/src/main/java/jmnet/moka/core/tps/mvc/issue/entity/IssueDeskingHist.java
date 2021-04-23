/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.issue.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.code.EditStatusCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

/**
 * 이슈확장형 편집히스토리
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_ISSUE_DESKING_HIST")
public class IssueDeskingHist {

    private static final long serialVersionUID = 1L;

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO", nullable = false)
    private Long seqNo;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "PKG_SEQ", referencedColumnName = "PKG_SEQ", nullable = false)
    private PackageMaster packageMaster;

    /**
     * 컴포넌트번호(1-7)
     */
    @Column(name = "COMP_NO", nullable = false)
    private Integer compNo;

    /**
     * 노출여부
     */
    @Column(name = "VIEW_YN")
    private String viewYn;

    /**
     * 상태 - SAVE(임시) / PUBLISH(전송)
     */
    @Column(name = "STATUS", nullable = false)
    @Enumerated(value = EnumType.STRING)
    private EditStatusCode status = EditStatusCode.SAVE;

    /**
     * 예약일시
     */
    @Column(name = "RESERVE_DT", updatable = false)
    private Date reserveDt;

    /**
     * 승인여부 예약일시가 설정되어 있을 경우 예약된 작업이 완료되면 Y로 처리
     */
    @Column(name = "APPROVAL_YN", updatable = false)
    @Builder.Default
    private String approvalYn = MokaConstants.NO;

    /**
     * 콘텐츠ID
     */
    @Column(name = "CONTENTS_ID")
    private String contentsId;

    /**
     * 콘텐츠순서
     */
    @Column(name = "CONTENTS_ORD", nullable = false)
    private Integer contentsOrd;

    /**
     * 채널타입(기사A/사진P/라이브L/영상M/키워드K/차트G)
     */
    @Column(name = "CHANNEL_TYPE")
    private String channelType;

    /**
     * 배부일시
     */
    @Column(name = "DIST_DT")
    private Date distDt;

    /**
     * 제목
     */
    @Nationalized
    @Column(name = "TITLE")
    private String title;

    /**
     * 링크URL
     */
    @Column(name = "LINK_URL")
    private String linkUrl;

    /**
     * 링크TARGET
     */
    @Column(name = "LINK_TARGET")
    private String linkTarget;

    /**
     * 썸네일파일명
     */
    @Column(name = "THUMB_FILE_NAME")
    private String thumbFileName;

    /**
     * 썸네일용량
     */
    @Column(name = "THUMB_SIZE", nullable = false)
    private Integer thumbSize;

    /**
     * 썸네일가로
     */
    @Column(name = "THUMB_WIDTH", nullable = false)
    private Integer thumbWidth;

    /**
     * 썸네일세로
     */
    @Column(name = "THUMB_HEIGHT", nullable = false)
    private Integer thumbHeight;

    /**
     * 배경색상
     */
    @Column(name = "BG_COLOR")
    private String bgColor;

    /**
     * 재생시간
     */
    @Column(name = "DURATION")
    private String duration;

    /**
     * 영상URL
     */
    @Column(name = "VOD_URL")
    private String vodUrl;

    /**
     * 발췌문
     */
    @Nationalized
    @Column(name = "BODY_HEAD")
    private String bodyHead;

    /**
     * 등록자
     */
    @Column(name = "REG_ID", updatable = false)
    protected String regId;

    /**
     * 등록일시
     */
    @Column(name = "REG_DT", updatable = false)
    protected Date regDt;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.contentsOrd = this.contentsOrd == null ? 1 : this.contentsOrd;
        this.thumbSize = this.thumbSize == null ? 0 : this.thumbSize;
        this.thumbWidth = this.thumbWidth == null ? 0 : this.thumbWidth;
        this.thumbHeight = this.thumbHeight == null ? 0 : this.thumbHeight;
        this.status = this.status == null ? EditStatusCode.SAVE : this.status;
        this.approvalYn = McpString.defaultValue(this.approvalYn, MokaConstants.NO);
    }
}
