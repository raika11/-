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
import org.hibernate.validator.constraints.Length;

/**
 * CMS - 메뉴
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ApiModel("메뉴 간략 DTO")
public class MenuSimpleDTO implements Serializable {

    /**
     * 메뉴코드
     */
    @ApiModelProperty("메뉴코드")
    @NotNull(message = "{tps.menu.error.invalid.menuId}")
    @Pattern(regexp = "[0-9]{2,8}$", message = "{tps.menu.error.invalid.menuId}")
    private String menuId;

    /**
     * 메뉴명
     */
    @ApiModelProperty("메뉴명")
    @NotNull(message = "{tps.menu.error.notnull.menuNm}")
    @Length(min = 1, max = 50, message = "{tps.menu.error.length.menuNm}")
    private String menuNm;

    
}
