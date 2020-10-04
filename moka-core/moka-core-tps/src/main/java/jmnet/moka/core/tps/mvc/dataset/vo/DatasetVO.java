/**
 * msp-tps DatasetInfoDTO.java 2020. 4. 24. 오후 4:26:55 ssc
 */
package jmnet.moka.core.tps.mvc.dataset.vo;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;

import javax.persistence.Column;

import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <pre>
 * 
 * 2020. 4. 24. ssc 최초생성
 * </pre>
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

    @Column(name = "DATASET_SEQ")
    private Long datasetSeq;

    @Column(name = "DATASET_NAME")
    private String datasetName;

    @Column(name = "AUTO_CREATE_YN")
    private String autoCreateYn;

    @Column(name = "USE_YN")
    private String useYn;
}
