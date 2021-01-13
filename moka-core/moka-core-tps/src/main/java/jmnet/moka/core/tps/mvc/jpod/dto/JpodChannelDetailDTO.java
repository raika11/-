package jmnet.moka.core.tps.mvc.jpod.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import jmnet.moka.core.tps.mvc.jpod.vo.JpodEpisodeStatVO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * JPOD - 채널
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ApiModel("J팟 채널 DTO")
public class JpodChannelDetailDTO implements Serializable {

    public static final Type TYPE = new TypeReference<List<JpodChannelDetailDTO>>() {
    }.getType();

    private static final long serialVersionUID = 1L;

    /**
     * 채널일련번호
     */
    @ApiModelProperty(value = "채널일련번호", hidden = true)
    private Long chnlSeq;

    /**
     * 사용여부
     */
    @ApiModelProperty("사용여부")
    @Builder.Default
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.common.error.pattern.usedYn}")
    private String usedYn = MokaConstants.YES;

    /**
     * 채널명
     */
    @ApiModelProperty("채널명")
    @NotEmpty(message = "{tps.jpod-channel.error.notempth.chnlNm}")
    @Size(min = 2, max = 510, message = "{tps.jpod-channel.error.size.chnlNm}")
    private String chnlNm;

    /**
     * 채널소개
     */
    @ApiModelProperty("채널소개")
    @NotEmpty(message = "{tps.jpod-channel.error.notempth.chnlMemo}")
    @Size(max = 4000, message = "{tps.jpod-channel.error.size.chnlMemo}")
    private String chnlMemo;

    /**
     * 채널 개설일
     */
    @ApiModelProperty(value = "채널 개설일(yyyy-MM-dd)")
    @NotEmpty(message = "{tps.jpod-channel.error.notempth.chnlSdt}")
    @Pattern(regexp = "^((19|2[0-9])[0-9]{2})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$", message = "{tps.jpod-channel.error.pattern.chnlSdt}")
    private String chnlSdt;

    /**
     * 커버이미지
     */
    @ApiModelProperty("커버이미지")
    @Size(min = 2, max = 510, message = "{tps.jpod-channel.error.size.chnlImg}")
    private String chnlImg;

    /**
     * 썸네일이미지
     */
    @ApiModelProperty("썸네일이미지")
    @Size(min = 2, max = 510, message = "{tps.jpod-channel.error.size.chnlThumb}")
    private String chnlThumb;

    /**
     * 팟티채널
     */
    @ApiModelProperty("팟티채널")
    @Size(min = 2, max = 255, message = "{tps.jpod-channel.error.size.podtyUrl}")
    private String podtyUrl;

    /**
     * 채널 종료일
     */
    @Pattern(regexp = "^((19|2[0-9])[0-9]{2})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$", message = "{tps.jpod-channel.error.pattern.chnlEdt}")
    @ApiModelProperty("채널 종료일(yyyy-MM-dd)")
    private String chnlEdt;

    /**
     * 채널 방송 요일
     */
    @ApiModelProperty("채널 방송 요일")
    @Size(max = 10, message = "{tps.jpod-channel.error.size.chnlDy}")
    private String chnlDy;

    /**
     * 모바일용 이미지
     */
    @ApiModelProperty("모바일용 이미지")
    @Size(min = 2, max = 510, message = "{tps.jpod-channel.error.size.chnlImgMob}")
    private String chnlImgMob;

    /**
     * 팟티채널SRL
     */
    @ApiModelProperty("팟티채널SRL")
    @Builder.Default
    @Min(value = 0, message = "{tps.jpod-channel.error.min.podtyChnlSrl}")
    private Integer podtyChnlSrl = 0;


    @ApiModelProperty(value = "등록일시", hidden = true)
    @DTODateTimeFormat
    private Date regDt;

    @ApiModelProperty("키워드 목록")
    private List<JpodKeywordDTO> keywords;

    @ApiModelProperty("방송 진행자 목록")
    private List<JpodMemberDTO> members;

    @ApiModelProperty(value = "방송 통계", hidden = true)
    private JpodEpisodeStatVO episodeStat;

}
