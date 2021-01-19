package jmnet.moka.core.tps.mvc.poll.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.util.ArrayList;
import java.util.List;
import javax.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * 투표
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
@ApiModel("투표상세정보")
public class TrendpollDetailDTO extends TrendpollDTO {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "투표 아이템 목록")
    @Builder.Default
    private List<@Valid TrendpollItemDTO> pollItems = new ArrayList<>();

    @ApiModelProperty(value = "투표 관련정보 목록")
    @Builder.Default
    private List<@Valid TrendpollRelateDTO> pollRelateContents = new ArrayList<>();

}
