package jmnet.moka.core.tps.mvc.jpod.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * JPOD - 키워드
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Embeddable
@ToString
@EqualsAndHashCode
public class JpodKeywordPK implements Serializable {

    private static final long serialVersionUID = 1L;

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

}
