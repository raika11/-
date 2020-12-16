/**
 * msp-tps DirectLinkSearchDTO.java 2020. 11. 16. 오전 11:35:05 ssc
 */
package jmnet.moka.core.tps.mvc.bulk.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.util.Date;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * 벌크문구 검색 DTO 2020. 11. 16. ssc 최초생성
 *
 * @author ssc
 * @since 2020. 11. 16. 오전 11:35:05
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = true)
@Alias("BulkSearchDTO")
@ApiModel("벌크 검색 DTO")
public class BulkSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1972229889422176779L;

    /**
     * char 1   NO  클릭기사구분 - H(아티클핫클릭) N(벌크)
     */
    @ApiModelProperty("클릭기사구분 - H(아티클핫클릭) N(벌크)")
    @Pattern(regexp = "[H|N]{1}$", message = "{tps.bulk.error.pattern.bulkartDiv}")
    private String bulkartDiv;

    /**
     * varchar  2   NO  출처 - 썬데이[60] 중앙일보[3]
     */
    @ApiModelProperty("출처 - 썬데이[60] 중앙일보[3]")
    private String sourceCode;

    /**
     * char 1   ('N')   NO  서비스여부
     */
    @ApiModelProperty("서비스여부")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.common.error.pattern.useTotal}")
    private String usedYn;

    /**
     * varchar  10  YES 상태 - SAVE(임시) / PUBLISH(전송)
     */
    @ApiModelProperty("상태 - SAVE(임시) / PUBLISH(전송)")
    private String status;

    /**
     * 시작일시
     */
    @ApiModelProperty("시작일시")
    @DTODateTimeFormat
    private Date startDt;

    /**
     * 종료일시
     */
    @ApiModelProperty("종료일시")
    @DTODateTimeFormat
    private Date endDt;

    /**
     * 검색결과 성공여부
     */
    @ApiModelProperty(hidden = true)
    private Integer returnValue;

    // 검색 조건의 기본값을 설정
    public BulkSearchDTO() {
        super("bulkartSeq,desc");
        useTotal = MokaConstants.YES;
        returnValue = TpsConstants.PROCEDURE_SUCCESS;
    }
}
