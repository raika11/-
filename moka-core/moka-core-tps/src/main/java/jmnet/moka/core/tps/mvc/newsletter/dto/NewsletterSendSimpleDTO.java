package jmnet.moka.core.tps.mvc.newsletter.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import jmnet.moka.core.tps.common.code.SendStatusCode;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import jmnet.moka.core.tps.mvc.member.dto.MemberSimpleDTO;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.newsletter.dto
 * ClassName : NewsletterSendSimpleDTO
 * Created : 2021-04-20 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-04-20 오후 3:06
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder(toBuilder = true)
@Alias("NewsletterSendSimpleDTO")
public class NewsletterSendSimpleDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<NewsletterSendSimpleDTO>>() {
    }.getType();

    /**
     * 유형
     */
    private String letterType;

    private String letterTypeName;

    @ApiModelProperty("발송일련번호")
    private Long sendSeq;

    @ApiModelProperty("레터일련번호")
    private Long letterSeq;

    /**
     * 제목
     */
    @ApiModelProperty("레터 타이틀")
    private String letterTitle;

    /**
     * 뉴스레터 명
     */
    @ApiModelProperty("뉴스레터 명")
    private String letterName;

    @ApiModelProperty("발송일시")
    @DTODateTimeFormat
    private Date sendDt;

    private String sendStatus;

    @Getter(AccessLevel.NONE)
    private String sendStatusName;

    public String getSendStatusName() {
        return SendStatusCode
                .valueOf(sendStatus)
                .getName();
    }

    @DTODateTimeFormat
    private Date regDt;

    /**
     * 등록자
     */
    private MemberSimpleDTO regMember;

    private String abtestYn;
}
