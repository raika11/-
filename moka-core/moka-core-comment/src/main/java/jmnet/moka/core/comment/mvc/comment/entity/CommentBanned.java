package jmnet.moka.core.comment.mvc.comment.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import jmnet.moka.core.comment.mvc.comment.code.CommentBannedType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 댓글금지
 */
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Table(name = "PA_CMT_BANNED")
public class CommentBanned implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDX", nullable = false)
    private Integer bannedIdx;

    /**
     * 금지타입 I/U/W - 아이피/사용자/단어
     */
    @Column(name = "TAG_TYPE", nullable = false)
    @Enumerated(value = EnumType.STRING)
    private CommentBannedType tagType = CommentBannedType.U;

    /**
     * 설정/해제여부
     */
    @Column(name = "USED_YN", nullable = false)
    private String usedYn = "Y";

    /**
     * 금지IP/금지사용자/금지단어
     */
    @Column(name = "TAG_VALUE")
    private String tagValue;

    @Column(name = "TAG_RESULT")
    private String tagResult;

    /**
     * 등록일시
     */
    @Column(name = "TAG_REGDATE")
    private Date tagRegDt;

    /**
     * 태그설명
     */
    @Column(name = "TAG_DESC")
    private String tagDesc;

}
