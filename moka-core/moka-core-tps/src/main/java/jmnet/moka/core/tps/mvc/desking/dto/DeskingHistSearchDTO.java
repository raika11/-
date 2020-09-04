package jmnet.moka.core.tps.mvc.desking.dto;

import java.util.List;
import org.apache.ibatis.type.Alias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.mvc.component.vo.DeskingComponentWorkVO;
import jmnet.moka.core.tps.mvc.desking.vo.DeskingHistVO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 데스킹 그룹바이 히스토리 검색객체
 * 
 * @author jeon0525
 *
 */
@Alias("DeskingHistSearchDTO")
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
@EqualsAndHashCode(callSuper = true)
public class DeskingHistSearchDTO extends SearchDTO {

    private static final long serialVersionUID = -2603971576163143861L;

    private String createYmdt;

    private String creator;

    private Long datasetSeq;

    private List<DeskingComponentWorkVO> deskingComponentWorkVOList;

    public DeskingHistSearchDTO() {
        super(DeskingHistVO.class, "createYmdt,asc");
    }

}
