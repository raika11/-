package jmnet.moka.core.tps.common.dto;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.type.TypeReference;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <pre>
 * 히스토리 정보
 * 2020. 5. 21. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 5. 21. 오전 11:17:30
 * @author ssc
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class HistDTO implements Serializable {

    private static final long serialVersionUID = -6295381817079217210L;

    public static final Type TYPE = new TypeReference<List<HistDTO>>() {}.getType();

    @NotNull(message = "{tps.common.error.invalid.seq}")
    private Long seq;

    @NotNull(message = "{tps.common.error.invalid.domainId}")
    private DomainSimpleDTO domain;

    private String body;

    private String workType;

    private String createYmdt;

    private String creator;
}
