package jmnet.moka.core.tps.mvc.desking.vo;

import java.io.Serializable;
import javax.persistence.Column;
import org.apache.ibatis.type.Alias;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 생성일과 생성자로 group by한 데스킹히스토리 목록 제공
 * 
 * @author jeon0525
 *
 */
@Alias("DeskingHistGroupVO")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class DeskingHistGroupVO implements Serializable {

    private static final long serialVersionUID = 4599769615811508579L;

    @Column(name = "SEQ")
    private Integer seq;

    @Column(name = "CREATE_YMDT")
    private String createYmdt;

    @Column(name = "CREATOR")
    private String creator;

    @Column(name = "DATASET_SEQ")
    private Long datasetSeq;

    @Column(name = "COMPONENT_NAME")
    private String componentName;

}
