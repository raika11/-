package jmnet.moka.core.tps.mvc.push.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import jmnet.moka.core.common.dto.DTODateTimeFormat;
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
@ApiModel("푸시앱")
public class PushAppDTO {

    public static final Type TYPE = new TypeReference<List<PushAppDTO>>() {
    }.getType();

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

    /**
     * FCM 발행 API KEY
     */
    @ApiModelProperty(value = "FCM 발행 API KEY")
    private String apiKey;

    /**
     * 등록일시
     */
    @ApiModelProperty(value = "등록일시")
    @DTODateTimeFormat
    private Date regDt;

    /**
     * 수정일시
     */
    @ApiModelProperty(value = "수정일시")
    @DTODateTimeFormat
    private Date modDt;
}
