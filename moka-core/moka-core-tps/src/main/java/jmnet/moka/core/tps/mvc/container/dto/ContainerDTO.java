package jmnet.moka.core.tps.mvc.container.dto;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tms.merge.item.ContainerItem;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

/**
 * 컨테이너 DTO
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "containerSeq")
@ApiModel("컨테이너 DTO")
public class ContainerDTO implements Serializable {

    private static final long serialVersionUID = 3374752127186183436L;

    public static final Type TYPE = new TypeReference<List<ContainerDTO>>() {}.getType();

    @ApiModelProperty("컨테이너SEQ")
    @Min(value = 0, message = "{tps.container.error.min.containerSeq}")
    private Long containerSeq;

    @ApiModelProperty("도메인(필수)")
    @NotNull(message = "{tps.domain.error.notnull.domainId}")
    private DomainSimpleDTO domain;

    @ApiModelProperty("컨테이너명(필수)")
    @NotNull(message = "{tps.container.error.notnull.containerName}")
    @Pattern(regexp = ".+", message = "{tps.container.error.pattern.containerName}")
    @Length(min = 1, max = 128, message = "{tps.container.error.length.containerName}")
    private String containerName;

    @ApiModelProperty("컨테이너본문")
    @Builder.Default
    private String containerBody = "";

    @ApiModelProperty("페이지 관련갯수")
    @JsonIgnore
    private Long pageRelCount = (long)0;

    @ApiModelProperty("기사페이지 관련갯수")
    @JsonIgnore
    private Long skinRelCount = (long)0;

    @ApiModelProperty("사용여부")
    private String useYn = MokaConstants.NO;

    public void setPageRelCount(Long pageRelCount) {
        this.pageRelCount = pageRelCount;
        if (pageRelCount != null && pageRelCount > 0) {
            this.useYn = MokaConstants.YES;
        }
    }

    public void setSkinRelCount(Long skinRelCount) {
        this.skinRelCount = skinRelCount;
        if (skinRelCount != null && skinRelCount > 0) {
            this.useYn = MokaConstants.YES;
        }
    }

    public String getUseYn() {
        return (this.useYn != null) ? this.useYn : MokaConstants.NO;
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
