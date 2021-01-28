package jmnet.moka.core.tps.mvc.poll.entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import jmnet.moka.core.tps.mvc.poll.code.PollCode.PollDivCode;
import jmnet.moka.core.tps.mvc.poll.code.PollCode.PollStatusCode;
import jmnet.moka.core.tps.mvc.poll.code.PollCode.PollTypeCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 투표
 */
@Entity
@Table(name = "TB_TRENDPOLL")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class TrendpollDetail extends BaseAudit implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 투표일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "POLL_SEQ", nullable = false)
    private Long pollSeq;

    /**
     * 투표그룹
     */
    @Column(name = "POLL_GROUP")
    private String pollGroup;

    /**
     * 투표분류
     */
    @Column(name = "POLL_CATEGORY")
    private String pollCategory;

    /**
     * 투표구분(일반형:W, 비교형:V)
     */
    @Column(name = "POLL_DIV")
    @Enumerated(value = EnumType.STRING)
    @Builder.Default
    private PollDivCode pollDiv = PollDivCode.W;

    /**
     * 레이아웃(T:TEXT, M:이미지+TEXT, P:이미지)
     */
    @Column(name = "POLL_TYPE", nullable = false)
    @Enumerated(value = EnumType.STRING)
    @Builder.Default
    private PollTypeCode pollType = PollTypeCode.T;

    /**
     * 항목수
     */
    @Column(name = "ITEM_CNT", nullable = false)
    @Builder.Default
    private Integer itemCnt = 4;

    /**
     * 중복허용답변수
     */
    @Column(name = "ALLOW_ANSW_CNT", nullable = false)
    @Builder.Default
    private Integer allowAnswCnt = 1;

    /**
     * 투표 총 응모수
     */
    @Column(name = "VOTE_CNT", nullable = false)
    @Builder.Default
    private Integer voteCnt = 0;

    /**
     * 시작일시
     */
    @Column(name = "START_DT")
    private String startDt;

    /**
     * 종료일시
     */
    @Column(name = "END_DT")
    private String endDt;

    /**
     * 로그인여부
     */
    @Column(name = "LOGIN_YN")
    @Builder.Default
    private String loginYn = MokaConstants.NO;

    /**
     * 중복투표여부
     */
    @Column(name = "REPETITION_YN")
    @Builder.Default
    private String repetitionYn = MokaConstants.NO;

    /**
     * 메인노출여부
     */
    @Column(name = "MAIN_YN")
    @Builder.Default
    private String mainYn = MokaConstants.NO;

    /**
     * 게시판여부
     */
    @Column(name = "BBS_YN")
    @Builder.Default
    private String bbsYn = MokaConstants.NO;

    /**
     * 게시판URL
     */
    @Column(name = "BBS_URL")
    private String bbsUrl;

    /**
     * 댓글여부
     */
    @Column(name = "REPLY_YN", nullable = false)
    @Builder.Default
    private String replyYn = MokaConstants.NO;

    /**
     * 댓글개수
     */
    @Column(name = "REPLY_CNT", nullable = false)
    @Builder.Default
    private Integer replyCnt = 0;

    /**
     * 상태 S:서비스, D:삭제, T:일시중지
     */
    @Column(name = "STATUS", nullable = false)
    @Builder.Default
    @Enumerated(value = EnumType.STRING)
    private PollStatusCode status = PollStatusCode.T;

    /**
     * 제목
     */
    @Column(name = "TITLE")
    private String title;

    @Builder.Default
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "poll")
    @OrderBy("ordNo")
    private List<TrendpollItem> pollItems = new ArrayList<>();

    @Builder.Default
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "poll")
    @OrderBy("ordNo")
    private List<TrendpollRelate> pollRelateContents = new ArrayList<>();


}
