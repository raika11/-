package jmnet.moka.web.push.mvc.sender.dto;

import java.io.Serializable;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 * 푸시 전송 앱 정보
 * Project : moka
 * Package : jmnet.moka.web.push.mvc.sender.dto
 * ClassName : PushAppDTO
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
public class PushAppDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * Device OS (AND, iOS, PWA)
     */
    @ApiModelProperty(value = "Device OS", required = true)
    private String appOs;

    /**
     * 디바이스 구분 (T:Tablet, M:Mobile, PC : P)
     */
    @ApiModelProperty(value = "디바이스 구분 (T:Tablet, M:Mobile, PC : P)", required = true)
    private String devDiv;

    /**
     * 앱 구분(J:중앙일보, M:미세먼지)
     */
    @ApiModelProperty(value = "앱 구분(J:중앙일보, M:미세먼지)", required = true)
    private String appDiv;
}
