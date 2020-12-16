package jmnet.moka.core.tps.mvc.menu.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * CMS - 메뉴 순번 정보
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ApiModel("메뉴 순서 변경 DTO")
public class MenuOrderDTO implements Serializable {


    /**
     * 메뉴ID
     */
    @ApiModelProperty("메뉴ID")
    @NotNull(message = "{tps.menu.error.invalid.menuId}")
    @Pattern(regexp = "[0-9]{2,8}$", message = "{tps.menu.error.invalid.menuId}")
    private String menuId;

    /**
     * 정렬순서
     */
    @ApiModelProperty("정렬순서")
    @Builder.Default
    private Integer menuOrder = 1;

}
