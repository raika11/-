package jmnet.moka.core.tps.mvc.menu.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.util.List;
import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * CMS - 그룹/사용자별 메뉴 권한
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ApiModel("메뉴 일괄 저장 DTO")
public class MenuAuthBatchDTO implements Serializable {
    /**
     * 메뉴 ID 목록
     */
    @ApiModelProperty("메뉴 ID 목록")
    @NotEmpty(message = "{tps.menu.error.notempty.menuIds}")
    private List<@Pattern(regexp = "[0-9]{2,8}$", message = "{tps.menu.error.length.menuId}") String> menuIds;

    /**
     * 메뉴 권한 목록
     */
    @ApiModelProperty("메뉴 권한 목록")
    @NotEmpty(message = "{tps.menu.error.notempty.menuAuthDTOS}")
    private List<@Valid MenuAuthSimpleDTO> menuAuths;



}
