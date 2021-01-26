package jmnet.moka.core.tps.mvc.comment.entity;

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
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import jmnet.moka.core.tps.mvc.codemgt.entity.CodeSimple;
import jmnet.moka.core.tps.mvc.comment.code.CommentCode.CommentBannedType;
import jmnet.moka.core.tps.mvc.member.entity.MemberSimpleInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

/**
 * 댓글금지
 */
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Table(name = "TB_COMMENT_BANNED")
public class CommentBanned extends BaseAudit {

    private static final long serialVersionUID = 1L;

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO", nullable = false)
    private Long seqNo;

    /**
     * 금지타입 I/U/W - 아이피/사용자/단어
     */
    @Column(name = "TAG_TYPE", nullable = false)
    @Enumerated(value = EnumType.STRING)
    @Builder.Default
    private CommentBannedType tagType = CommentBannedType.U;

    /**
     * 설정/해제여부
     */
    @Column(name = "USED_YN", nullable = false)
    @Builder.Default
    private String usedYn = MokaConstants.YES;

    /**
     * 금지IP/금지사용자/금지단어
     */
    @Column(name = "TAG_VALUE")
    @Builder.Default
    private String tagValue = "";

    @Column(name = "TAG_DIV")
    @Builder.Default
    private String tagDiv = "";

    @ManyToOne(fetch = FetchType.EAGER)
    @NotFound(action = NotFoundAction.IGNORE)
    @JoinColumn(name = "TAG_DIV", referencedColumnName = "DTL_CD", insertable = false, updatable = false)
    private CodeSimple tagDivCode;

    /**
     * 태그설명
     */
    @Column(name = "TAG_DESC")
    private String tagDesc;

    /**
     * 등록자
     */
    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "REG_ID", referencedColumnName = "MEM_ID", insertable = false, updatable = false)
    private MemberSimpleInfo regMember;

}
