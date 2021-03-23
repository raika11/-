package jmnet.moka.core.tps.mvc.push.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import jmnet.moka.common.data.support.SearchDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.push.dto
 * ClassName : PushAppSearchDTO
 * Created : 2021-03-23 ince
 * </pre>
 *
 * @author ince
 * @since 2021-03-23 08:10
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ApiModel("푸시앱 검색")
public class PushAppSearchDTO extends SearchDTO {

    /**
     * Device OS (AND, iOS, WIN, MAC)
     */
    @ApiModelProperty(value = "Device OS")
    private String appOs;

    /**
     * 디바이스 구분 (T:Tablet, M:Mobile, PC : P)
     */
    @ApiModelProperty(value = "디바이스 구분 (T:Tablet, M:Mobile, PC : P)")
    private String devDiv;

    /**
     * 앱 구분(J:중앙일보, M:미세먼지, PWA : P)
     */
    @ApiModelProperty(value = "앱 구분(J:중앙일보, M:미세먼지, PWA : P)")
    private String appDiv;
}
