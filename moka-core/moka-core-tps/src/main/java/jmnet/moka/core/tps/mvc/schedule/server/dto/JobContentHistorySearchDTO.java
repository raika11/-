package jmnet.moka.core.tps.mvc.schedule.server.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel("작업예약 검색 DTO")
public class JobContentHistorySearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1L;
    public static final Type TYPE = new TypeReference<List<JobContentHistorySearchDTO>>() {
    }.getType();


    @ApiModelProperty("검색 시작일자(필수)")
    @DTODateTimeFormat
    private Date startDay;

    @ApiModelProperty("검색 종료일자(필수)")
    @DTODateTimeFormat
    private Date endDay;

    @ApiModelProperty("작업 번호")
    private Long jobSeq;

    @ApiModelProperty("작업상태 (0,1,2,3,4,9)")
    private String status;

    @ApiModelProperty("작업 식별정보(JOB_CD)")
    private String jobCd;

}
