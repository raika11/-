package jmnet.moka.core.tps.mvc.jpod.entity;

import java.io.Serializable;
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
 * JPOD - 키워드
 */
@Entity
@Table(name = "TB_JPOD_KEYWORD")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class JpodKeyword implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 출연진 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO", nullable = false)
    private Long seqNo;

    /**
     * 채널 SEQ
     */
    @Column(name = "CHNL_SEQ", nullable = false)
    private Long chnlSeq;

    /**
     * 에피소드SEQ
     */
    @Column(name = "EPSD_SEQ", nullable = false)
    private Long epsdSeq;

    /**
     * 순서
     */
    @Column(name = "ORD_NO", nullable = false)
    private Integer ordNo = 1;


    /**
     * 키워드
     */
    @Column(name = "KEYWORD", nullable = false)
    private String keyword;

    /**
     * 에피소드 정보
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EPSD_SEQ", nullable = false, insertable = false, updatable = false)
    private JpodEpisode episode;

}
