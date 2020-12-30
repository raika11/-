package jmnet.moka.core.comment.mvc.comment.dto;

import java.io.Serializable;
import java.util.Date;
import jmnet.moka.core.comment.mvc.comment.code.CommentBannedType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * 댓글금지
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class CommentBannedDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 일련번호
     */
    private Integer bannedIdx;

    /**
     * 금지타입 I/U/W - 아이피/사용자/단어
     */
    private CommentBannedType tagType = CommentBannedType.W;

    /**
     * 설정/해제여부
     */
    private String usedYn = "Y";

    /**
     * 금지IP/금지사용자/금지단어
     */
    private String tagValue;

    private String tagResult;

    /**
     * 등록일시
     */
    @DateTimeFormat
    private Date tagRegDt;

    /**
     * 태그설명
     */
    private String tagDesc;

}
