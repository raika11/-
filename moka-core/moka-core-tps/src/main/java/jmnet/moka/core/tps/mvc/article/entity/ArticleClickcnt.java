package jmnet.moka.core.tps.mvc.article.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 기사 - 누적 조회/공유수
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_15RE_ARTICLE_CLICKCNT")
public class ArticleClickcnt implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 서비스기사아이디
     */
    @Id
    @Column(name = "TOTAL_ID", nullable = false)
    private Long totalId;

    /**
     * 조회수
     */
    @Column(name = "CLICK_CNT", nullable = false)
    private Integer clickCnt = 0;

    /**
     * J트랜드순위
     */
    @Column(name = "TREND_RANK", nullable = false)
    private Integer trendRank = 0;

    /**
     * 페북 공유수
     */
    @Column(name = "SHR_FCNT", nullable = false)
    private Integer shrFcnt = 0;

    /**
     * 트위터 공유수
     */
    @Column(name = "SHR_TCNT", nullable = false)
    private Integer shrTcnt = 0;

    /**
     * 인스타그램 공유수
     */
    @Column(name = "SHR_ICNT", nullable = false)
    private Integer shrIcnt = 0;

    /**
     * G+ 공유수
     */
    @Column(name = "SHR_GCNT", nullable = false)
    private Integer shrGcnt = 0;

    /**
     * 카카오스토리 공유수
     */
    @Column(name = "SHR_KSCNT", nullable = false)
    private Integer shrKscnt = 0;

    /**
     * 카카오톡 공유수
     */
    @Column(name = "SHR_KCNT", nullable = false)
    private Integer shrKcnt = 0;

    /**
     * 핀터레스트 공유수
     */
    @Column(name = "SHR_PCNT", nullable = false)
    private Integer shrPcnt = 0;

    /**
     * 이메일 공유수
     */
    @Column(name = "EMAIL_CNT", nullable = false)
    private Integer emailCnt = 0;

    /**
     * 좋아요 수
     */
    @Column(name = "LIKE_CNT", nullable = false)
    private Integer likeCnt = 0;

    /**
     * 싫어요 수
     */
    @Column(name = "HATE_CNT", nullable = false)
    private Integer hateCnt = 0;

    /**
     * 댓글수
     */
    @Column(name = "REPLY_CNT", nullable = false)
    private Integer replyCnt = 0;

    /**
     * 스크랩수
     */
    @Column(name = "SCB_CNT", nullable = false)
    private Integer scbCnt = 0;

}
