package jmnet.moka.core.tps.mvc.jpod.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.Min;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.code.JpodTypeCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * JPOD - 에피소드
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ApiModel("J팟 에피소드 DTO")
public class JpodEpisodeDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<JpodEpisodeDTO>>() {
    }.getType();

    /**
     * 에피소드일련번호
     */
    @ApiModelProperty(value = "에피소드일련번호", hidden = true)
    private Long epsdSeq;

    /**
     * 채널일련번호
     */
    @ApiModelProperty(value = "채널일련번호", hidden = true)
    private Long chnlSeq;

    /**
     * 에피소드회차
     */
    @ApiModelProperty("에피소드회차")
    @Size(max = 10, message = "{tps.jpod-episode.error.size.epsdNo}")
    private String epsdNo;

    /**
     * 사용여부 Y/N
     */
    @ApiModelProperty("사용여부")
    @Builder.Default
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.common.error.pattern.usedYn}")
    private String usedYn = MokaConstants.YES;

    /**
     * 플레이타임
     */
    @ApiModelProperty("플레이타임")
    @Size(max = 10, message = "{tps.jpod-episode.error.size.playTime}")
    private String playTime;

    /**
     * 에피소드 등록일
     */
    @ApiModelProperty("에피소드 등록일")
    @Pattern(regexp = "^((19|2[0-9])[0-9]{2})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$", message = "{tps.jpod-channel.error.pattern.epsdDate}")
    private String epsdDate;

    /**
     * 팟티에피소드SRL
     */
    @ApiModelProperty("팟티에피소드SRL")
    @Builder.Default
    @Min(value = 0, message = "{tps.jpod-channel.error.min.podtyEpsdSrl}")
    private Integer podtyEpsdSrl = 0;

    /**
     * 팟캐스트 타입(A:AUDIO, V:VIDEO)
     */
    @ApiModelProperty("팟캐스트 타입(A:AUDIO, V:VIDEO)")
    private JpodTypeCode jpodType;

    /**
     * 공유 이미지
     */
    @ApiModelProperty("공유 이미지")
    @Size(max = 200, message = "{tps.jpod-episode.error.size.shrImg}")
    private String shrImg;

    /**
     * 카톡공유 이미지
     */
    @ApiModelProperty("카톡공유 이미지")
    @Size(max = 200, message = "{tps.jpod-episode.error.size.katalkImg}")
    private String katalkImg;

    /**
     * 에피소드명
     */
    @ApiModelProperty("에피소드명")
    @Size(max = 510, message = "{tps.jpod-episode.error.size.epsdNm}")
    private String epsdNm;

    /**
     * 에피소드파일링크
     */
    @ApiModelProperty("에피소드파일링크")
    @Size(max = 510, message = "{tps.jpod-episode.error.size.epsdFile}")
    private String epsdFile;

    /**
     * 에피소드소개
     */
    @ApiModelProperty("에피소드소개")
    @Size(max = 4000, message = "{tps.jpod-episode.error.size.epsdFile}")
    private String epsdMemo;

    /**
     * 노출수
     */
    @ApiModelProperty(value = "노출수", hidden = true)
    @Builder.Default
    private Integer viewCnt = 0;

    /**
     * 재생수
     */
    @ApiModelProperty(value = "재생수", hidden = true)
    @Builder.Default
    private Integer playCnt = 0;

    /**
     * 좋아요
     */
    @ApiModelProperty(value = "좋아요", hidden = true)
    @Builder.Default
    private Integer likeCnt = 0;

    /**
     * 댓글수
     */
    @ApiModelProperty(value = "댓글수", hidden = true)
    @Builder.Default
    private Integer replyCnt = 0;

    /**
     * 공유수
     */
    @ApiModelProperty(value = "공유수", hidden = true)
    @Builder.Default
    private Integer shareCnt = 0;

    /**
     * 구독수
     */
    @ApiModelProperty(value = "구독수", hidden = true)
    @Builder.Default
    private Integer scbCnt = 0;

    /**
     * 시즌번호
     */
    @ApiModelProperty(value = "시즌번호")
    @Builder.Default
    @Min(value = 0, message = "{tps.jpod-episode.error.min.seasonNo}")
    private Integer seasonNo = 0;



}
