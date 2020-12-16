/**
 * msp-tps ReservedDTO.java 2020. 6. 17. 오전 11:41:42 ssc
 */
package jmnet.moka.core.tps.mvc.reserved.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.validator.constraints.Length;

/**
 * 예약어 DTO 2020. 6. 17. ssc 최초생성
 *
 * @author ssc
 * @since 2020. 6. 17. 오전 11:41:42
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(exclude = "domain")
@ApiModel("예약어 DTO")
public class ReservedDTO implements Serializable {

    private static final long serialVersionUID = -3909058066495143951L;

    public static final Type TYPE = new TypeReference<List<ReservedDTO>>() {
    }.getType();

    @ApiModelProperty("예약어SEQ")
    @Min(value = 0, message = "{tps.reserved.error.min.reservedSeq}")
    private Long reservedSeq;

    @ApiModelProperty("도메인(필수)")
    @ToString.Exclude
    @NotNull(message = "{tps.domain.error.notnull.domainId}")
    private DomainSimpleDTO domain;

    @ApiModelProperty("예약어ID(필수)")
    @NotNull(message = "{tps.reserved.error.notnull.reservedId}")
    @Pattern(regexp = "^[a-zA-Z]{1}[a-zA-Z0-9_/-].+", message = "{tps.reserved.error.pattern.reservedId}")
    @Length(max = 24, message = "{tps.reserved.error.length.reservedId}")
    private String reservedId;

    @ApiModelProperty("예약어값(필수)")
    @NotNull(message = "{tps.reserved.error.notnull.reservedValue}")
    @Pattern(regexp = ".+", message = "{tps.reserved.error.pattern.reservedValue}")
    @Length(max = 128, message = "{tps.reserved.error.length.reservedValue}")
    private String reservedValue;

    @ApiModelProperty("상세정보")
    @Length(max = 4000, message = "{tps.reserved.error.length.description}")
    private String description;

    @ApiModelProperty("사용여부(Y:사용, N:미사용)(필수)")
    @NotNull(message = "{tps.reserved.error.notnull.usedYn}")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.reserved.error.pattern.usedYn}")
    @Builder.Default
    private String usedYn = MokaConstants.YES;



}
