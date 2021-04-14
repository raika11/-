/**
 * msp-tps DirectLinkSearchDTO.java 2020. 11. 16. 오전 11:35:05 ssc
 */
package jmnet.moka.core.tps.mvc.columnist.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import jmnet.moka.core.tps.mvc.columnist.vo.ColumnistVO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;
import org.hibernate.validator.constraints.Length;

/**
 * 기자관리 검색 DTO 2020. 11. 16. ssc 최초생성
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
@Alias("ColumnistSearchDTO")
@ApiModel("칼럼니스트 검색 DTO")
public class ColumnistSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1972229889422176779L;

    @ApiModelProperty(value = "전송시작일자")
    @DTODateTimeFormat
    private String startDt;

    @ApiModelProperty(value = "전송종료일자")
    @DTODateTimeFormat
    private String endDt;

    /**
     * 상태(유효/정지)
     */
    @ApiModelProperty("상태(유효/정지)")
    private String status;

    /**
     * nvarchar	30		NO	칼럼니스트이름
     */
    @ApiModelProperty("칼럼니스트이름")
    @Length(max = 30, message = "{tps.columnist.error.length.columnistNm}")
    private String columnistNm;

    /**
     * 필진타입 (J1:기자필진,J2:외부기자(밀리터리),J3:그룹필진,J0:필진해지,R1:일보기자(더오래),R2:외부기자(더오래))
     */
    @ApiModelProperty("필진타입(J1:기자필진,J2:외부기자(밀리터리),J3:그룹필진,J0:필진해지,R1:일보기자(더오래),R2:외부기자(더오래))")
    private String jplusRepDiv;

    /**
     * 검색결과 성공여부
     */
    @ApiModelProperty(hidden = true)
    private Integer returnValue;

    // 검색 조건의 기본값을 설정
    public ColumnistSearchDTO() {
        super(ColumnistVO.class, "seqNo,desc");
        super.setUseTotal(MokaConstants.YES);
        super.setSearchType(TpsConstants.SEARCH_TYPE_ALL);
        super.setReturnValue(TpsConstants.PROCEDURE_SUCCESS);
    }
}
