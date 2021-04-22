/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.issue.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import javax.persistence.Column;
import jmnet.moka.core.common.MokaConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;
import org.hibernate.annotations.Nationalized;

/**
 * 이슈확장형 편집히스토리
 */
@Alias("IssueDeskingHistVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class IssueDeskingHistVO implements Serializable {

    public static final Type TYPE = new TypeReference<List<IssueDeskingHistVO>>() {
    }.getType();


    private static final long serialVersionUID = 1L;

    /**
     * 일련번호
     */
    @Column(name = "SEQ_NO", nullable = false)
    private Long seqNo;

    /**
     * 패키지순번
     */
    @Column(name = "PKG_SEQ", nullable = false)
    private Long pkgSeq;

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
     * 상태 SAVE(임시) / PUBLISH(전송)
     */
    @Column(name = "STATUS")
    private String status;

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
     * 발췌문
     */
    @Nationalized
    @Column(name = "BODY_HEAD")
    private String bodyHead;
}
