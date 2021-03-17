package jmnet.moka.web.push.mvc.sender.dto;

import java.io.Serializable;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Pattern;

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
     * Device OS (AND, iOS, WIN, MAC)
     */
    @ApiModelProperty(value = "Device OS (AND, iOS, WIN, MAC)", required = true)
    @Pattern(regexp = "[AND|iOS|WIN|MAC]{1}$", message = "{wpush.error.pattern.appOs}")
    private String appOs;

    /**
     * 디바이스 구분 (T:Tablet, M:Mobile, PC : P)
     */
    @ApiModelProperty(value = "디바이스 구분 (T:Tablet, M:Mobile, PC : P)", required = true)
    @Pattern(regexp = "[T|M|P]{1}$", message = "{wpush.error.pattern.devDiv}")
    private String devDiv;

    /**
     * 앱 구분(J:중앙일보, M:미세먼지, PWA : P)
     */
    @ApiModelProperty(value = "앱 구분(J:중앙일보, M:미세먼지, PWA : P)", required = true)
    @Pattern(regexp = "[J|M|p]{1}$", message = "{wpush.error.pattern.appDiv}")
    private String appDiv;
}
