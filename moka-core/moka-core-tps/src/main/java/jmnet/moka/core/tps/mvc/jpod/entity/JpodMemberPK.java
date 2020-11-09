package jmnet.moka.core.tps.mvc.jpod.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import jmnet.moka.core.tps.common.code.JpodMemberTypeCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * JPOD - 출연진
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Embeddable
@ToString
@EqualsAndHashCode
public class JpodMemberPK implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 채널일련번호
     */
    @Column(name = "CHNL_SEQ", nullable = false)
    private Long chnlSeq;

    /**
     * 에피소드일련번호
     */
    @Column(name = "EPSD_SEQ", nullable = false)
    private Long epsdSeq;

    /**
     * CM:채널진행자, CP:채널패널, EG:에피소드게스트
     */
    @Column(name = "MEM_DIV", nullable = false)
    @Enumerated(EnumType.STRING)
    private JpodMemberTypeCode memDiv;

    /**
     * 멤버 이름
     */
    @Column(name = "MEM_NM", nullable = false)
    private String memNm;

}
