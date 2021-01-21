package jmnet.moka.core.tps.mvc.internalinterface.dto;

import jmnet.moka.common.data.support.SearchDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 내부 API 정보
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class InternalInterfaceSearchDTO extends SearchDTO {

    /**
     * API명
     */
    private String apiName;

    /**
     * 사용여부
     */
    private String usedYn = "Y";

    /**
     * API유형(PC:PC,MO:MOBILE,PM:PC+MOBILE,BO:BACK OFFICE)
     */
    private String apiType;

    /**
     * GET/POST/PUT/DELETE
     */
    private String apiMethod;

    /**
     * API설명
     */
    private String apiDesc;


}
