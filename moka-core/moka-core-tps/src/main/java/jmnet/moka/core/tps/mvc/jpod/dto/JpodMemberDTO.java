package jmnet.moka.core.tps.mvc.jpod.dto;

import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
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
    private JpodMemberTypeCode memDiv;

    /**
     * 멤버 이름
     */
    @ApiModelProperty(value = "멤버 이름")
    private String memNm;

    /**
     * 기자인경우 REP_SEQ
     */
    @ApiModelProperty(value = "기자인경우 REP_SEQ")
    @Builder.Default
    private Integer memRepSeq = 0;

    /**
     * 닉네임
     */
    @ApiModelProperty(value = "닉네임")
    private String nickNm;

    /**
     * 멤버 소개
     */
    @ApiModelProperty(value = "멤버 소개")
    private String memMemo;

    /**
     * 출연진 설명
     */
    @ApiModelProperty(value = "출연진 설명")
    private String desc;

}
