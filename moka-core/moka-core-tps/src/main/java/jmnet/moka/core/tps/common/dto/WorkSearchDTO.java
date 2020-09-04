package jmnet.moka.core.tps.common.dto;

import org.apache.ibatis.type.Alias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.mvc.component.vo.DeskingComponentWorkVO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 컴포넌트 검색 DTO
 * 
 * @author jeon
 *
 */
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
@EqualsAndHashCode(callSuper = true)
@Alias("componentWorkSearchDTO")
public class WorkSearchDTO extends SearchDTO {

    private static final long serialVersionUID = -7998111385290877921L;

    private Long pageSeq;
    private String creator;
    private String createYmdt;
    private Long componentSeq;
    private Long datasetSeq;
    private Long editionSeq;

    // 검색 조건의 기본값을 설정
    public WorkSearchDTO() {
        super(DeskingComponentWorkVO.class, "relOrder,asc");
    }

}
