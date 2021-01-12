package jmnet.moka.core.tps.mvc.comment.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import jmnet.moka.core.tps.mvc.codemgt.dto.CodeMgtDTO;
import jmnet.moka.core.tps.mvc.comment.code.CommentCode.CommentBannedType;
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

    public static final Type TYPE = new TypeReference<List<CommentBannedDTO>>() {
    }.getType();

    /**
     * 일련번호
     */
    private Long seqNo;

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

    /**
     * 태그 구분
     */
    private String tagDiv;

    /**
     * 태그 구분 코드
     */
    private CodeMgtDTO tagDivCode;

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
