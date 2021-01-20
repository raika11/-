package jmnet.moka.core.tps.mvc.poll.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import jmnet.moka.core.tps.mvc.poll.code.PollCode.PollRelateTypeCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 투표관련정보
 */
@Entity
@Table(name = "TB_TRENDPOLL_RELATE")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class TrendpollRelate implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO", nullable = false)
    private Long seqNo;

    /**
     * 투표일련번호
     */
    @Column(name = "POLL_SEQ", nullable = false)
    private Long pollSeq;

    /**
     * 관련타입(A:기사 P:투표)
     */
    @Column(name = "REL_TYPE")
    @Enumerated(value = EnumType.STRING)
    private PollRelateTypeCode relType = PollRelateTypeCode.A;

    /**
     * 순서
     */
    @Column(name = "ORD_NO", nullable = false)
    private Integer ordNo = 1;

    /**
     * 관련콘텐트ID(투표일련번호 등)
     */
    @Column(name = "CONTENT_ID")
    private String contentId;

    /**
     * 이미지경로
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
