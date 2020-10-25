/**
 * msp-tps DatasetInfoDTO.java 2020. 4. 24. 오후 4:26:55 ssc
 */
package jmnet.moka.core.tps.mvc.dataset.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * 데이타셋 VO
 * 2020. 4. 24. ssc 최초생성
 * 
 * @since 2020. 4. 24. 오후 4:26:55
 * @author ssc
 */
@Alias("DatasetVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class DatasetVO implements Serializable {

    private static final long serialVersionUID = -4690007468161992681L;

    public static final Type TYPE = new TypeReference<List<DatasetVO>>() {}.getType();

    /**
     * 데이터셋SEQ
     */
    @Column(name = "DATASET_SEQ")
    private Long datasetSeq;

    /**
     * 데이터셋명
     */
    @Column(name = "DATASET_NAME")
    private String datasetName;

    /**
     * 자동생성여부
     */
    @Column(name = "AUTO_CREATE_YN")
    private String autoCreateYn;

    /**
     * 사용여부
     */
    @Column(name = "USE_YN")
    private String useYn;
}
