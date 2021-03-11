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
public class PushAppTokenDTO extends SearchDTO {

    private static final long serialVersionUID = 1L;
    public static final Type TYPE = new TypeReference<List<PushAppTokenDTO>>() {
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
    private Long appSeq;

    /**
     * 푸시 카운트
     */
    @ApiModelProperty("푸시 카운트")
    private Long badge;

    /**
     * 회원ID
     */
    @ApiModelProperty("회원ID")
    private String memId;

    /**
     * 푸시 토큰
     */
    @ApiModelProperty("푸시 토큰")
    private String token;

    @ApiModelProperty("등록일시")
    private Date regDt;

    @ApiModelProperty("수정일시")
    private Date modDt;

}
