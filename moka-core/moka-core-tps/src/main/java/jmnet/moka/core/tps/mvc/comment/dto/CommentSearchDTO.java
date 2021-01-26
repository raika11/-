package jmnet.moka.core.tps.mvc.comment.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import javax.validation.constraints.Min;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.mvc.comment.code.CommentCode.CommentOrderType;
import jmnet.moka.core.tps.mvc.comment.code.CommentCode.CommentStatusType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.comment.mvc.comment.dto
 * ClassName : CommentSearchDTO
 * Created : 2020-12-28 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-28 15:49
 */

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@ApiModel("댓글 검색 DTO")
public class CommentSearchDTO extends SearchDTO {

    /**
     * TB_COMMENT_URL의 DOMAIN 컬럼 검색용
     */
    @ApiModelProperty("도메인")
    private String domain;

    /**
     * 정렬 순서
     */
    @ApiModelProperty("정렬 순서")
    @Builder.Default
    private CommentOrderType orderType = CommentOrderType.A;

    /**
     * 댓글 상태
     */
    @ApiModelProperty("댓글 상태")
    @Builder.Default
    private CommentStatusType status = CommentStatusType.A;

    /**
     * 검색 시작일
     */
    @ApiModelProperty("검색 시작일")
    private String startDt;

    /**
     * 검색종료일
     */
    @ApiModelProperty("검색 종료일")
    private String endDt;

    /**
     * 사용자 유형, 공백 : 전체, joins : 조인스, me2day :  미투데이, twitter : 트위터, facebook : 페이스북, yozm  : 요즘
     */
    @ApiModelProperty("사용자 유형")
    private String memType;

    /**
     * 매체 검색 그룹 ID
     */
    @ApiModelProperty("매체 검색 그룹 ID")
    @Min(value = 0, message = "{tps.comment.error.min.groupId}")
    private Integer groupId;

    /**
     * 기사ID
     */
    @ApiModelProperty("기사ID")
    private String contentId;



}
