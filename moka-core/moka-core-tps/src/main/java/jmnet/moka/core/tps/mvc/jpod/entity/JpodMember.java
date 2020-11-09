package jmnet.moka.core.tps.mvc.jpod.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;
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
     * 멤버 ID
     */
    @EmbeddedId
    private JpodMemberPK id;

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
