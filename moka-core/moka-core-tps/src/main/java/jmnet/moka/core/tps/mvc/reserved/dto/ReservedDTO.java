/**
 * msp-tps ReservedDTO.java 2020. 6. 17. 오전 11:41:42 ssc
 */
package jmnet.moka.core.tps.mvc.reserved.dto;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * <pre>
 * 
 * 2020. 6. 17. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 6. 17. 오전 11:41:42
 * @author ssc
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(exclude = "domain")
public class ReservedDTO implements Serializable {

    private static final long serialVersionUID = -3909058066495143951L;

    public static final Type TYPE = new TypeReference<List<ReservedDTO>>() {}.getType();

    private Long reservedSeq;

    @ToString.Exclude
    @NotNull(message = "{tps.reserved.error.invalid.domainId}")
    private DomainSimpleDTO domain;

    @NotNull(message = "{tps.reserved.error.invalid.reservedId}")
    @Pattern(regexp = "^[a-zA-Z]{1}[a-zA-Z0-9_/-].+",
            message = "{tps.reserved.error.invalid.reservedId}")
    private String reservedId;

    @NotNull(message = "{tps.reserved.error.invalid.reservedValue}")
    @Pattern(regexp = ".+", message = "{tps.reserved.error.invalid.reservedValue}")
    private String reservedValue;

    @NotNull(message = "{tps.reserved.error.invalid.useYn}")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.reserved.error.invalid.useYn}")
    private String useYn;

    private String description;

}
