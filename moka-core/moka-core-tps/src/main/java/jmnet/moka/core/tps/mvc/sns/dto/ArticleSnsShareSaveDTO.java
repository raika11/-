package jmnet.moka.core.tps.mvc.sns.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.util.Date;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.sns.SnsTypeCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * 기사 SNS메타
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ApiModel("SNS 저장 DTO")
public class ArticleSnsShareSaveDTO implements Serializable {

    /**
     * SNS 타입{FB:페이스북, TW:트위터}
     */
    @ApiModelProperty("SNS 타입{FB:페이스북, TW:트위터}")
    @Builder.Default
    private SnsTypeCode snsType = SnsTypeCode.FB;

    /**
     * 사용여부
     */
    @ApiModelProperty("사용여부")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.common.error.pattern.usedYn}")
    @Builder.Default
    private String usedYn = MokaConstants.YES;

    /**
     * SNS 전송일시(업데이트시 수정됨)
     */
    @ApiModelProperty("SNS 전송일시(업데이트시 수정됨)")
    @DateTimeFormat
    private Date snsInsDt;

    /**
     * SNS 등록일시
     */
    @ApiModelProperty("SNS 등록일시")
    @DateTimeFormat
    private Date snsRegDt;

    /**
     * SNS 기사ID
     */
    @ApiModelProperty("SNS 기사ID")
    @Length(max = 50, message = "{tps.sns.error.length.snsId}")
    private String snsArtId;


    /**
     * 예약일시
     */
    @ApiModelProperty("예약일시")
    @DateTimeFormat
    private Date reserveDt;

    /**
     * 포스트 메시지
     */
    @ApiModelProperty("포스트 메시지")
    @Length(max = 300, message = "{tps.sns.error.length.snsPostMsg}")
    private String snsPostMsg;

    /**
     * 이미지
     */
    @ApiModelProperty("이미지")
    private String imgUrl;

    /**
     * 기사제목
     */
    @ApiModelProperty("기사제목")
    @NotEmpty(message = "{tps.sns.error.notempty.artTitle}")
    @Length(max = 510, message = "{tps.sns.error.length.artTitle}")
    private String artTitle;

    /**
     * 메타데이터 추가 키워드
     */
    @ApiModelProperty("메타데이터 추가 키워드")
    @Length(max = 250, message = "{tps.sns.error.length.artKeyword}")
    private String artKeyword;

    /**
     * 설명
     */
    @ApiModelProperty("설명")
    @Length(max = 300, message = "{tps.sns.error.length.artSummary}")
    private String artSummary;

}
