package jmnet.moka.core.tps.mvc.poll.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 투표항목
 */
@Entity
@Table(name = "TB_TRENDPOLL_ITEM")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class TrendpollItem implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 항목일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ITEM_SEQ", nullable = false)
    private Long itemSeq;

    /**
     * 투표일련번호
     */
    @Column(name = "POLL_SEQ", nullable = false)
    private Long pollSeq;

    /**
     * 순서
     */
    @Column(name = "ORD_NO", nullable = false)
    private Integer ordNo = 1;

    /**
     * 항목별 응모수
     */
    @Column(name = "VOTE_CNT", nullable = false)
    private Integer voteCnt = 0;

    /**
     * 등록일시
     */
    @Column(name = "REG_DT", nullable = false)
    @Builder.Default
    private Date regDt = new Date();

    /**
     * 이미지명
     */
    @Column(name = "IMG_URL")
    private String imgUrl;

    /**
     * 링크URL
     */
    @Column(name = "LINK_URL")
    private String linkUrl;

    /**
     * 제목
     */
    @Column(name = "TITLE")
    private String title;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "POLL_SEQ", referencedColumnName = "POLL_SEQ", nullable = false, insertable = false, updatable = false)
    private Trendpoll poll;


}
