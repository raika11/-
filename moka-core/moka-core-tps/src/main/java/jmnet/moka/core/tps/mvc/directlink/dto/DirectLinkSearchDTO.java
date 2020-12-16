/**
 * msp-tps DirectLinkSearchDTO.java 2020. 11. 16. 오전 11:35:05 ssc
 */
package jmnet.moka.core.tps.mvc.directlink.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

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
@Alias("DirectLinkSearchDTO")
@ApiModel("바로가기 검색 DTO")
public class DirectLinkSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1972229889422176779L;

    /**
     * 링크일련번호
     */
    private Long linkSeq;

    /**
     * 사용여부
     */
    private String usedYn;

    /**
     * 노출고정(y:항상노출n:검색시만노출)
     */
    private String fixYn;

    /**
     * 링크타입(s:본창n:새창)
     */
    private String linkType;

    /**
     * 링크 키워드
     */
    private String linkKwd;

    /**
     * 검색 키워드
     */
    private String keyword;


    /**
     * 총갯수 사용여부
     */
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.common.error.pattern.useTotal}")
    private String useTotal;

    /**
     * 총갯수
     */
    private Long total;

    /**
     * 검색결과 성공여부
     */
    private Integer returnValue;

    // 검색 조건의 기본값을 설정
    public DirectLinkSearchDTO() {
        super("linkSeq,desc");
        useTotal = MokaConstants.YES;
        returnValue = TpsConstants.PROCEDURE_SUCCESS;
    }
}
