package jmnet.moka.core.tps.mvc.component.dto;

import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import jmnet.moka.core.tps.mvc.ad.dto.AdSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <pre>
 * 컴포넌트의 광고 정보
 * 2020. 5. 21. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 5. 21. 오전 11:27:03
 * @author ssc
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ComponentAdDTO implements Serializable {

    private static final long serialVersionUID = 7067421000499185540L;

    private Long seq;
    
    private Long componentSeq;
    
    private AdSimpleDTO ad;

    private int listParagraph;

}
