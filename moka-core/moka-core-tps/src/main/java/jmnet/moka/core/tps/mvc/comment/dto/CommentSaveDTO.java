package jmnet.moka.core.tps.mvc.comment.dto;

import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import jmnet.moka.core.tps.mvc.comment.code.CommentCode.CommentStatusType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class CommentSaveDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty("부모 댓글 일련번호")
    @NotNull(message = "{tps.comment.error.min.cmtParentSeq}")
    @Min(value = 0, message = "{tps.comment.error.min.cmtParentSeq}")
    private Long cmtParentSeq;

    @ApiModelProperty("URL 일련번호")
    @NotNull(message = "{tps.comment.error.min.urlSeq}")
    @Min(value = 0, message = "{tps.comment.error.min.urlSeq}")
    private Long urlSeq;

    @ApiModelProperty("컨텐츠ID")
    @Size(max = 20, message = "{tps.comment.error.size.contentId}")
    private String contentId;

    /**
     * A:노출,N:관리자삭제,D:사용자삭제
     */
    @ApiModelProperty("상태 A:노출,N:관리자삭제,D:사용자삭제")
    @NotNull(message = "{tps.comment.error.notnull.status}")
    private CommentStatusType status = CommentStatusType.A;

    @ApiModelProperty("댓글")
    @Size(max = 500, message = "{tps.comment.error.size.cont}")
    private String cont;

    @ApiModelProperty("사용자ID")
    @Size(max = 50, message = "{tps.comment.error.size.memId}")
    private String memId;

    @ApiModelProperty("사용자명")
    @Size(max = 300, message = "{tps.comment.error.size.memNm}")
    private String memNm;

    @ApiModelProperty("사용자 사이트")
    @Size(max = 10, message = "{tps.comment.error.size.memSite}")
    private String memSite;

    @ApiModelProperty("사용자 이미지")
    @Size(max = 500, message = "{tps.comment.error.size.memImage}")
    private String memImage;

    @ApiModelProperty("등록기기")
    @Size(max = 1, message = "{tps.comment.error.size.regDev}")
    private String regDev;

    @ApiModelProperty("회원관리번호")
    @Min(value = 0, message = "{tps.comment.error.size.memSeq}")
    private Long memSeq;

    @ApiModelProperty("로그인유형")
    @Size(max = 8, message = "{tps.comment.error.size.loginType}")
    private String loginType;

}
