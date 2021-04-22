package jmnet.moka.core.tps.mvc.newsletter.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import javax.validation.constraints.Email;
import javax.validation.constraints.Min;
import javax.validation.constraints.Pattern;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import jmnet.moka.core.tps.mvc.member.dto.MemberSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;
import org.hibernate.validator.constraints.Length;
import org.springframework.web.multipart.MultipartFile;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.newsletter.dto
 * ClassName : NewsletterInfoDTO
 * Created : 2021-04-19 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-04-19 오전 9:22
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder(toBuilder = true)
@Alias("NewsletterInfoDTO")
public class NewsletterInfoDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<NewsletterInfoDTO>>() {
    }.getType();

    @ApiModelProperty("레터일련번호")
    @Min(value = 0, message = "{tps.common.error.min.seqNo}")
    private Long letterSeq;

    @ApiModelProperty("발송유형 - 자동:A, 수동:E")
    @Pattern(regexp = "^(A)|(E)$", message = "TODO")
    private String sendType;

    @ApiModelProperty("레터유형 - 오리지널:O, 브리핑:B, 알림:N, 기타:E")
    @Pattern(regexp = "^(O)|(B)|(N)|(E)$", message = "TODO")
    private String letterType;

    @ApiModelProperty("상태 - 활성:Y,임시저장:P,중지:S,종료:Q")
    @Pattern(regexp = "^(Y)|(P)|(S)|(Q)$", message = "TODO")
    private String status;

    @ApiModelProperty("채널타입 - ''(해당없음), TOPIC(토픽), ISSUE(이슈), SERIES(연재), JPOD(J팟), REPORTER(기자), TREND(트랜드뉴스), ARTICLE(기사패키지), STAR(스타기자), DIJEST(다이제스트)")
    @Pattern(regexp = "^()|(TOPIC)|(ISSUE)|(SERIES)|(JPOD)|(REPORTER)|(TREND)|(ARTICLE)|(STAR)|(DIJEST)$", message = "TODO")
    private String channelType;

    @ApiModelProperty("채널아이디 - 이슈번호, JPOD 채널번호, 기자번호 등")
    @Min(value = 0, message = "{tps.common.error.min.seqNo}")
    private Long channelId;

    @ApiModelProperty("채널 데이터 아이디 - 에피소드변호, 기사번호 등")
    private Long channelDateId;

    @ApiModelProperty("발송주기 - W:요일, M:월, C:신규콘텐트")
    @Pattern(regexp = "^(W)|(M)|(C)$", message = "TODO")
    private String sendPeriod;

    @ApiModelProperty("발송요일(일-토:0-6, 복수가능 예를들어 135면 월수금) 또는 발송월)")
    @Pattern(regexp = "^[0-6]{1,10}$", message = "TODO")
    private String sendDay;

    @ApiModelProperty("발송시간 시:분")
    @Pattern(regexp = "^[0-9]{2}:[0-9]{2}$", message = "TODO")
    private String sendTime;

    @ApiModelProperty("신규콘텐트 최소개수")
    private Long sendMinCnt;

    @ApiModelProperty("신규콘텐트 최대개수")
    private Long sendMaxCnt;

    @ApiModelProperty("콘텐트 정렬조건(최신순:N/인기순:H)")
    private String sendOrder;

    @ApiModelProperty("구독상품여부(자동인경우 디폴트Y)")
    private String scbYn;

    @ApiModelProperty("발송자명")
    @Length(max = 100, message = "TODO")
    private String senderName;

    @ApiModelProperty("발송자이메일")
    @Email(message = "TODO")
    private String senderEmail;

    @ApiModelProperty("발송시작일시")
    @DTODateTimeFormat
    private Date sendStartDt;

    @ApiModelProperty("구독자연동여부(Y/N-excel업로드)")
    @Pattern(regexp = "^(Y)|(N)$", message = "TODO")
    private String scbLinkYn;

    @ApiModelProperty("레이아웃SEQ(자동형 또는 수동레이아웃선택형)")
    @Min(value = 0, message = "{tps.common.error.min.seqNo}")
    private Long containerSeq;

    @ApiModelProperty("편집폼일련번호(수동 레이아웃선택형)")
    @Min(value = 0, message = "{tps.common.error.min.seqNo}")
    private Long formSeq;

    @ApiModelProperty("상단이미지(자동, 수동 직접등록형)")
    private String headerImg;

    @ApiModelProperty("이미지파일")
    @JsonIgnore
    private MultipartFile headerImgFile;

    @ApiModelProperty("수동형식 - 지정형(S), 자유형(F)")
    private String editLetterType;

    @ApiModelProperty("AB테스트여부")
    @Pattern(regexp = "^(Y)|(N)$", message = "TODO")
    private String abtestYn;

    @ApiModelProperty("수정된 내용 등 메모")
    @Length(max = 200, message = "TODO")
    private String memo;

    @ApiModelProperty("최근발송일시")
    @DTODateTimeFormat
    private Date lastSendDt;

    @ApiModelProperty("카테고리")
    @Length(max = 100, message = "TODO")
    private String category;

    @ApiModelProperty("레터제목")
    @Length(max = 100, message = "TODO")
    private String letterTitle;

    @ApiModelProperty("광고:A / 레터명:N / 직접입력:E + 기사제목:T")
    private String titleType;

    @ApiModelProperty("레터명")
    @Length(max = 100, message = "TODO")
    private String letterName;

    @ApiModelProperty("레터영문명")
    @Length(max = 100, message = "TODO")
    private String letterEngName;

    @ApiModelProperty("레터이미지")
    @Length(max = 200, message = "TODO")
    private String letterImg;

    @ApiModelProperty("레터설명")
    @Length(max = 1000, message = "TODO")
    private String letterDesc;

    /**
     * 등록자
     */
    private MemberSimpleDTO regMember;
}
