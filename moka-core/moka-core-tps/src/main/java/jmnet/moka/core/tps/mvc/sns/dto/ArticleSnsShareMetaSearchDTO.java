package jmnet.moka.core.tps.mvc.sns.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import java.util.Date;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.common.code.SnsTypeCode;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 기사 SNS메타
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel("SNS 메타 검색 DTO")
public class ArticleSnsShareMetaSearchDTO extends SearchDTO {

    @Builder.Default
    private SnsTypeCode snsType = SnsTypeCode.FB;

    /**
     * 기간 검색 시작일
     */
    @Builder.Default
    @DTODateTimeFormat
    private Date startDt = new Date();

    /**
     * 기간 검색 기준일
     */
    @Builder.Default
    @DTODateTimeFormat
    private Date endDt = new Date();

}
