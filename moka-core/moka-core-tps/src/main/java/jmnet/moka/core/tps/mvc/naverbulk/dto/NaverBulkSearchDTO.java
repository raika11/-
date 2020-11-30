/**
 * msp-tps DirectLinkSearchDTO.java 2020. 11. 16. 오전 11:35:05 ssc
 */
package jmnet.moka.core.tps.mvc.naverbulk.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.*;
import org.apache.ibatis.type.Alias;

import javax.validation.constraints.Pattern;
import java.util.Date;

/**
 * 네이버벌크문구 검색 DTO
 * 2020. 11. 16. ssc 최초생성
 * 
 * @since 2020. 11. 16. 오전 11:35:05
 * @author ssc
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = true)
@Alias("NaverBulkSearchDTO")
public class NaverBulkSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1972229889422176779L;

    /**
     * int   10,0    NO  클릭기사일련번호
     */
    Long clickartSeq;

    /**
     * char 1   NO  클릭기사구분 - H(아티클핫클릭) N(네이버벌크)
     */
    @Pattern(regexp = "[H|N]{1}$", message = "{tps.naver-bulk.error.pattern.clickartDiv}")
    String clickartDiv;

    /**
     * varchar  2   NO  출처 - 썬데이[60] 중앙일보[3]
     */
    String sourceCode;

    /**
     * char 1   ('N')   NO  서비스여부
     */
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.common.error.pattern.useTotal}")
    String usedYn;

    /**
     * varchar  10  YES 상태 - SAVE(임시) / PUBLISH(전송)
     */
    String status;

    /**
     * 총갯수 사용여부
     */
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.common.error.pattern.useTotal}")
    private String useTotal;

    /**
     * 시작일시
     */
    @DTODateTimeFormat
    private Date startDt;

    /**
     * 종료일시
     */
    @DTODateTimeFormat
    private Date endDt;

    /**
     * 총갯수
     */
    private Long total;

    /**
     * 검색결과 성공여부
     */
    private Integer returnValue;

    // 검색 조건의 기본값을 설정
    public NaverBulkSearchDTO() {
        super("clickartSeq,desc");
        useTotal = MokaConstants.YES;
        returnValue = TpsConstants.PROCEDURE_SUCCESS;
    }
}
