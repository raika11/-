package jmnet.moka.core.tps.mvc.search.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModelProperty;
import java.util.Date;
import javax.validation.constraints.NotNull;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 사용자 검색 로그
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class SearchKwdLogSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1L;

    /**
     * 탭구분(MAIN, TOT, NEWS, IMG, VOD, JOINS, PEOPLE)
     */
    @ApiModelProperty("탭구분(MAIN, TOT, NEWS, IMG, VOD, JOINS, PEOPLE)")
    private String tabDiv;

    @ApiModelProperty("일자별(DATE), 영역별(TAB)")
    private String statType;

    @ApiModelProperty(value = "시작일시 검색", required = true)
    @DTODateTimeFormat
    @NotNull(message = "{tps.search-keyword-log.error.notnull.startDt}")
    private Date startDt;

    @ApiModelProperty(value = "종료일시 검색", required = true)
    @DTODateTimeFormat
    @NotNull(message = "{tps.search-keyword-log.error.notnull.endDt}")
    private Date endDt;

    public String getOrder() {
        if (sort != null) {
            String sortInfo = McpString.collectionToDelimitedString(sort, "!");
            String[] sortInfos = sortInfo.split("!")[0].split(",");
            return sortInfos[0];
        }
        return "";
    }

    public String getDir() {
        if (sort != null) {
            String sortInfo = McpString.collectionToDelimitedString(sort, "!");
            String[] sortInfos = sortInfo.split("!")[0].split(",");
            return sortInfos.length > 1 ? sortInfos[1] : "asc";
        }
        return "";
    }

}
