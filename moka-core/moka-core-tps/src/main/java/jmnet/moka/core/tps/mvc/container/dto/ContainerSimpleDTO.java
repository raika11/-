package jmnet.moka.core.tps.mvc.container.dto;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.core.type.TypeReference;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * <pre>
 * 컨테이너아이디, 도메인, 컨테이너명
 * 2020. 4. 21. jeon 최초생성
 * </pre>
 * 
 * @since 2020. 4. 21. 오후 4:51:16
 * @author jeon
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

    @Min(value = 0, message = "{tps.container.error.invalid.containerSeq}")
    private Long containerSeq;

    @NotNull(message = "{tps.common.error.invalid.domainId}")
    private DomainSimpleDTO domain;

    @NotNull(message = "{tps.container.error.invalid.containerName}")
    @Pattern(regexp = ".+", message = "{tps.container.error.invalid.containerName}")
    private String containerName;

}
