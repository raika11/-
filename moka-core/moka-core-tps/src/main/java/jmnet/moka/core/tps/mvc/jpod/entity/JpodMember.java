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
import jmnet.moka.core.tps.common.code.JpodMemberTypeCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * JPOD - 출연진
 */
@Entity
@Table(name = "TB_JPOD_MEMBER")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class JpodMember implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 출연진 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO", nullable = false)
    private Long seqNo;

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

    /**
     * 기자인경우 REP_SEQ
     */
    @Column(name = "MEM_REP_SEQ", nullable = false)
    @Builder.Default
    private Integer memRepSeq = 0;

    /**
     * 닉네임
     */
    @Column(name = "NICK_NM")
    private String nickNm;

    /**
     * 멤버 소개
     */
    @Column(name = "MEM_MEMO")
    private String memMemo;

    /**
     * 출연진 설명
     */
    @Column(name = "DESC")
    private String desc;

}
