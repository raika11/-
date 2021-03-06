package jmnet.moka.web.push.mvc.sender.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.lang.reflect.Type;
import java.util.List;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.web.push.support.message.FcmMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 * 푸시 앱 토큰 정보
 * Project : moka
 * Package : jmnet.moka.web.push.mvc.sender.dto
 * ClassName : PushAppTokenDTO
 * Created : 2021-02-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-08 15:36
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel("푸시 앱 토큰 DTO")
public class PushAppTokenSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1L;
    public static final Type TYPE = new TypeReference<List<PushAppTokenSearchDTO>>() {
    }.getType();

    /**
     * 토큰 일련번호
     */
    @ApiModelProperty("토큰 일련번호")
    private Long tokenSeq;

    /**
     * 앱 일련번호
     */
    @ApiModelProperty("앱 일련번호")
    private Integer appSeq;

    /**
     * 푸시 유형
     */
    private String pushType;

    /**
     * 컨텐츠 일련번호
     */
    private Long contentSeq;

    /**
     * 최대 토큰 일련번호
     */
    private Long lastTokenSeq;

    /**
     * 최소 토큰 일련번호
     */
    private Long firstTokenSeq;

    /**
     * 푸시 메시지
     */
    private FcmMessage pushMessage;

}
