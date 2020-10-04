package jmnet.moka.core.tps.mvc.container.dto;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.core.type.TypeReference;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.tms.merge.item.ContainerItem;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSimpleDTO;
import lombok.*;

/**
 * <pre>
 * 컨테이너 정보
 * 2020. 5. 21. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 5. 21. 오전 11:51:57
 * @author ssc
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "containerSeq")
public class ContainerDTO implements Serializable {

    private static final long serialVersionUID = 3374752127186183436L;

    public static final Type TYPE = new TypeReference<List<ContainerDTO>>() {}.getType();

    @Min(value = 0, message = "{tps.container.error.invalid.containerSeq}")
    private Long containerSeq;

    @NotNull(message = "{tps.page.error.invalid.domainId}")
    private DomainSimpleDTO domain;

    @NotNull(message = "{tps.container.error.invalid.containerName}")
    @Pattern(regexp = ".+", message = "{tps.page.error.invalid.containerName}")
    private String containerName;

    private String containerBody;

    @JsonIgnore
    private Long pageRelCount;

    @JsonIgnore
    private Long skinRelCount;

    private String useYn;

    public void setPageRelCount(Long pageRelCount) {
        this.pageRelCount = pageRelCount;
        if (pageRelCount != null && pageRelCount > 0) {
            this.useYn = "Y";
        }
    }

    public void setSkinRelCount(Long skinRelCount) {
        this.skinRelCount = skinRelCount;
        if (skinRelCount != null && skinRelCount > 0) {
            this.useYn = "Y";
        }
    }

    public String getUseYn() {
        return (this.useYn != null) ? this.useYn : "N";
    }

    public ContainerItem toContainerItem() {
        ContainerItem containerItem = new ContainerItem();
        containerItem.put(ItemConstants.CONTAINER_ID, this.containerSeq);
        containerItem.put(ItemConstants.CONTAINER_DOMAIN_ID, this.domain.getDomainId());
        containerItem.put(ItemConstants.CONTAINER_NAME, this.containerName);
        containerItem.put(ItemConstants.CONTAINER_BODY, this.containerBody);
        return containerItem;
    }
}
