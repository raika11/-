package jmnet.moka.core.tps.mvc.jpod.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.code.JpodTypeCode;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * JPOD - 에피소드
 */
@Entity
@Table(name = "TB_JPOD_EPISODE")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@EqualsAndHashCode(callSuper = true)
public class JpodEpisode extends BaseAudit implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 에피소드일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EPSD_SEQ", nullable = false)
    private Long epsdSeq;

    /**
     * 채널일련번호
     */
    @Column(name = "CHNL_SEQ", nullable = false)
    private Long chnlSeq;

    //bi-directional many-to-one association to Collection
    //@ManyToOne(fetch = FetchType.LAZY)
    //@JoinColumn(name = "CHNL_SEQ", insertable = false, updatable = false)
    //private JpodChannel channel;

    /**
     * 에피소드회차
     */
    @Column(name = "EPSD_NO")
    private String epsdNo;

    /**
     * 사용여부 Y/N
     */
    @Builder.Default
    @Column(name = "USED_YN", nullable = false)
    private String usedYn = MokaConstants.YES;

    /**
     * 플레이타임
     */
    @Column(name = "PLAY_TIME")
    private String playTime;

    /**
     * 에피소드 등록일
     */
    @Column(name = "EPSD_DATE")
    private String epsdDate;

    /**
     * 팟티에피소드SRL
     */
    @Column(name = "PODTY_EPSD_SRL", nullable = false)
    @Builder.Default
    private Integer podtyEpsdSrl = 0;

    /**
     * 팟캐스트 타입(A:AUDIO, V:VIDEO)
     */
    @Column(name = "JPOD_TYPE")
    @Enumerated(value = EnumType.STRING)
    private JpodTypeCode jpodType;

    /**
     * 공유 이미지
     */
    @Column(name = "SHR_IMG")
    private String shrImg;

    /**
     * 카톡공유 이미지
     */
    @Column(name = "KATALK_IMG")
    private String katalkImg;

    /**
     * 에피소드명
     */
    @Column(name = "EPSD_NM", nullable = false)
    private String epsdNm;

    /**
     * 에피소드파일링크
     */
    @Column(name = "EPSD_FILE")
    private String epsdFile;

    /**
     * 에피소드소개
     */
    @Column(name = "EPSD_MEMO", nullable = false)
    private String epsdMemo;

    /**
     * 노출수
     */
    @Column(name = "VIEW_CNT", nullable = false)
    @Builder.Default
    private Integer viewCnt = 0;

    /**
     * 재생수
     */
    @Column(name = "PLAY_CNT", nullable = false)
    @Builder.Default
    private Integer playCnt = 0;

    /**
     * 좋아요
     */
    @Column(name = "LIKE_CNT", nullable = false)
    @Builder.Default
    private Integer likeCnt = 0;

    /**
     * 댓글수
     */
    @Column(name = "REPLY_CNT", nullable = false)
    @Builder.Default
    private Integer replyCnt = 0;

    /**
     * 공유수
     */
    @Column(name = "SHARE_CNT", nullable = false)
    @Builder.Default
    private Integer shareCnt = 0;

    /**
     * 구독수
     */
    @Column(name = "SCB_CNT", nullable = false)
    @Builder.Default
    private Integer scbCnt = 0;


    /**
     * 시즌번호
     */
    @Column(name = "SEASON_NO")
    @Builder.Default
    private Integer seasonNo = 0;

    /**
     * 채널명
     */
    @Transient
    private String chnlNm;

}
