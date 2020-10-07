/**
 * msp-tps TemplateSearchDTO.java 2020. 2. 14. 오후 4:54:01 ssc
 */
package jmnet.moka.core.tps.mvc.template.dto;

import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.mvc.template.vo.TemplateVO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <pre>
 * 템플릿 검색 DTO
 * 2020. 2. 14. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 2. 14. 오후 4:54:01
 * @author ssc
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
//@JsonInclude(Include.NON_NULL)
@EqualsAndHashCode(callSuper = true)
@Alias("TemplateSearchDTO")
public class TemplateSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 5900493133914418299L;

    private String domainId;
    
    private String tpZone;
    
    private Integer widthMin;
    
    private Integer widthMax;

    private String searchType;

    private String keyword;
    
    private String imageRoot;

    private String useTotal;

    private Long total;      // 목록 총 갯수

    private Integer returnValue;  // 프로시저 호출 결과

    // 검색 조건의 기본값을 설정
    public TemplateSearchDTO() {
        super(TemplateVO.class, "templateSeq,desc");
        imageRoot = "/image/";
        useTotal = "Y";
    }
}
