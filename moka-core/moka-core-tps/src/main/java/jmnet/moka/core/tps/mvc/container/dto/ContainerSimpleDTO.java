package jmnet.moka.core.tps.mvc.container.dto;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

/**
 * 간단 컨테이너 : 아이디, 도메인, 컨테이너명
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "containerSeq")
public class ContainerSimpleDTO implements Serializable {

    private static final long serialVersionUID = -4924043058339434576L;

    public static final Type TYPE = new TypeReference<List<ContainerSimpleDTO>>() {}.getType();

    /**
     * 컨테이너SEQ
     */
    @Min(value = 0, message = "{tps.container.error.min.containerSeq}")
    private Long containerSeq;

    /**
     * 도메인
     */
    @NotNull(message = "{tps.domain.error.notnull.domainId}")
    private DomainSimpleDTO domain;

    /**
     * 컨테이너명
     */
    @NotNull(message = "{tps.container.error.notnull.containerName}")
    @Pattern(regexp = ".+", message = "{tps.container.error.pattern.containerName}")
    @Length(min = 1, max = 128, message = "{tps.container.error.length.containerName}")
    private String containerName;

}
