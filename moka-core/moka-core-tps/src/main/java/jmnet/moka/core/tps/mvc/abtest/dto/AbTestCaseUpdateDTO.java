package jmnet.moka.core.tps.mvc.abtest.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import jmnet.moka.core.common.MokaConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.abTest.dto
 * ClassName : ABTestCaseSaveDTO
 * Created : 2021-04-15
 * </pre>
 *
 * @author
 * @since 2021-04-15 12:04
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@ApiModel("ABTest 정의 DTO")
public class AbTestCaseUpdateDTO {
    public static final Type TYPE = new TypeReference<List<jmnet.moka.core.tps.mvc.board.dto.BoardInfoDTO>>() {
    }.getType();

    /**
     * 에피소드일련번호
     */
    @ApiModelProperty(value = "에피소드일련번호", hidden = true)
    private Integer abtestSeq;

    /**
     * 로그인 여부(전체:', 로그인:Y, 비로그인 : N)
     */
    @ApiModelProperty("로그인 여부(전체:', 로그인:Y, 비로그인 : N)")
    private String loginYn;

    /**
     * 구독여부
     */
    @ApiModelProperty("구독여부")
    @Builder.Default
    private String subscribeYn = MokaConstants.NO;

    /**
     * 구독상품SEQ
     */
    @ApiModelProperty("구독상품SEQ")
    @Builder.Default
    @NotNull(message = "{tps.abTest.error.notnull.subscribeSeq}")
    @Min(value = 0, message = "{tps.abTest.error.min.subscribeSeq}")
    private Long subscribeSeq = 0L;

    /**
     * 디바이스 구분(PC:P/Mobile:M/App:A/전체') - 구분자콤마
     */
    @ApiModelProperty(value = "디바이스 구분(PC:P/Mobile:M/App:A/전체' : 텍스트 Comma(,)로 여러 개 입력)")
    @Size(max = 50, message = "{tps.abTest.error.size.devDiv}")
    private String devDiv;

    /**
     * 브라우저(전체:'/IE:IE/Chrome:CRM/Edge:EDG/Safari:SAF/안드로이드웹:AW/삼성IE:SIE/기타:ETC) - 구분자콤마
     */
    @ApiModelProperty(value = "브라우저(전체:'/IE:IE/Chrome:CRM/Edge:EDG/Safari:SAF/안드로이드웹:AW/삼성IE:SIE/기타:ETC) : 텍스트 Comma(,)로 여러 개 입력)")
    @Size(max = 50, message = "{tps.abTest.error.size.devDiv}")
    private String browser;

    /**
     * 유입처(전체'/네이버:NAVER/구글:GOOGLE/카카오:KAKAO/트위터:TWITTER/기타:ETC) - 구분자콤마
     */
    @ApiModelProperty(value = "유입처(전체'/네이버:NAVER/구글:GOOGLE/카카오:KAKAO/트위터:TWITTER/기타:ETC) : 텍스트 Comma(,)로 여러 개 입력)")
    @Size(max = 50, message = "{tps.abTest.error.size.referer}")
    private String referer;

    /**
     * PWA설정여부
     */
    @ApiModelProperty("PWA설정여부")
    @Builder.Default
    private String pwaYn = MokaConstants.NO;

    /**
     * 푸시설정여부
     */
    @ApiModelProperty("푸시설정여부")
    @Builder.Default
    private String pushYn = MokaConstants.NO;

    /**
     * UTM(SOURCE/MEDIUM/CAMPAIGN/TERM/CONTENT/전체') - 구분자콤마
     */
    @ApiModelProperty(value = "UTM(SOURCE/MEDIUM/CAMPAIGN/TERM/CONTENT/전체')  : 텍스트 Comma(,)로 여러 개 입력)")
    @Size(max = 50, message = "{tps.abTest.error.size.utm}")
    private String utm;

    /**
     * UTM SOURCE 태그
     */
    @ApiModelProperty(value = "UTM SOURCE 태그")
    @Size(max = 100, message = "{tps.abTest.error.size.utmSource}")
    private String utmSource;

    /**
     * UTM MEDIUM 태그
     */
    @ApiModelProperty(value = "UTM MEDIUM 태그")
    @Size(max = 100, message = "{tps.abTest.error.size.utmMedium}")
    private String utmMedium;

    /**
     * UTM CAMPAIGN 태그
     */
    @ApiModelProperty(value = "UTM CAMPAIGN 태그")
    @Size(max = 100, message = "{tps.abTest.error.size.utmCampaign}")
    private String utmCampaign;

    /**
     * UTM TERM 태그
     */
    @ApiModelProperty(value = "UTM TERM 태그")
    @Size(max = 100, message = "{tps.abTest.error.size.utmTerm}")
    private String utmTerm;

    /**
     * UTM CONTENT 태그
     */
    @ApiModelProperty(value = "UTM CONTENT 태그")
    @Size(max = 100, message = "{tps.abTest.error.size.utmContent}")
    private String utmContent;

}
