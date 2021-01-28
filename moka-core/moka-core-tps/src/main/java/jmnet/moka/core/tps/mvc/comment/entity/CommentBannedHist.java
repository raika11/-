package jmnet.moka.core.tps.mvc.comment.entity;

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
import jmnet.moka.core.tps.mvc.member.entity.MemberSimpleInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

/**
 * 차단/복원 히스토리
 */
@Entity
@Table(name = "TB_COMMENT_BANNED_HIST")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@EqualsAndHashCode(callSuper = true)
public class CommentBannedHist extends jmnet.moka.core.tps.common.entity.RegAudit implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 히스토리일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "HIST_SEQ", nullable = false)
    private Long histSeq;

    /**
     * 차단일련번호
     */
    @Column(name = "BANNED_SEQ", nullable = false)
    private Long bannedSeq;

    /**
     * 사용여부(Y차단,N복원)
     */
    @Column(name = "USED_YN", nullable = false)
    private String usedYn;

    /**
     * 등록자
     */
    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "REG_ID", referencedColumnName = "MEM_ID", insertable = false, updatable = false)
    private MemberSimpleInfo regMember;

}
