package jmnet.moka.web.push.mvc.sender.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import jmnet.moka.common.data.support.SearchDTO;
import lombok.*;

import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;

/**
 * <pre>
 * 푸시토큰 전송이력 정보
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
@ApiModel("푸시토큰 전송이력 DTO")
public class PushTokenSendHistDTO extends SearchDTO {

    private static final long serialVersionUID = 1L;
    public static final Type TYPE = new TypeReference<List<PushTokenSendHistDTO>>() {
    }.getType();

    /**
     * 이력 일련번호
     */
    @ApiModelProperty("이력 일련번호")
    private Long histSeq;

    /**
     * 콘텐트 일련번호
     */
    @ApiModelProperty("콘텐트 일련번호")
    private Long contentSeq;

    /**
     * 토큰 일련번호
     */
    @ApiModelProperty("토큰 일련번호")
    private Long tokenSeq;

    /**
     * 앱 일련번호
     */
    @ApiModelProperty("앱 일련번호")
    private Long appSeq;

    /**
     * 전송 여부
     */
    @ApiModelProperty("전송여부")
    private String sendYn;

    @ApiModelProperty("등록일시")
    private Date regDt;

}
