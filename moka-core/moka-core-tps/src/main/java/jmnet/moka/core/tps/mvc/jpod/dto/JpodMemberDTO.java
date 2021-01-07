package jmnet.moka.core.tps.mvc.jpod.dto;

import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import jmnet.moka.core.tps.common.code.JpodMemberTypeCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * JPOD - 출연진
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class JpodMemberDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 출연진 일련번호
     */
    @ApiModelProperty(value = "출연진 일련번호", hidden = true)
    private Long seqNo;

    /**
     * 채널일련번호
     */
    @ApiModelProperty(value = "채널일련번호", hidden = true)
    private Long chnlSeq;

    /**
     * 에피소드일련번호
     */
    @ApiModelProperty(value = "에피소드일련번호", hidden = true)
    private Long epsdSeq;

    /**
     * CM:채널진행자, CP:채널패널, EG:에피소드게스트
     */
    @ApiModelProperty(value = "멤버구분")
    @NotNull(message = "{tps.jpod-episode.error.notnull.memDiv}")
    private JpodMemberTypeCode memDiv = JpodMemberTypeCode.CM;

    /**
     * 멤버 이름
     */
    @ApiModelProperty(value = "멤버 이름")
    @NotEmpty(message = "{tps.jpod-episode.error.notempty.memNm}")
    @Size(max = 255, message = "{tps.jpod-episode.error.size.memNm}")
    private String memNm;

    /**
     * 기자인경우 REP_SEQ
     */
    @ApiModelProperty(value = "기자인경우 REP_SEQ")
    @Builder.Default
    @Min(value = 0, message = "{tps.jpod-episode.error.min.memRepSeq}")
    private Integer memRepSeq = 0;

    /**
     * 닉네임
     */
    @ApiModelProperty(value = "닉네임")
    @Size(max = 50, message = "{tps.jpod-episode.error.size.nickNm}")
    private String nickNm;

    /**
     * 멤버 소개
     */
    @ApiModelProperty(value = "멤버 소개")
    @Size(max = 50, message = "{tps.jpod-episode.error.size.memMemo}")
    private String memMemo;

    /**
     * 출연진 설명
     */
    @ApiModelProperty(value = "출연진 설명")
    @Size(max = 50, message = "{tps.jpod-episode.error.size.desc}")
    private String desc;

}
