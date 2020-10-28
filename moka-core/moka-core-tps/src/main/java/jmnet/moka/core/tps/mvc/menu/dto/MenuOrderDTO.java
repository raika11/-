package jmnet.moka.core.tps.mvc.menu.dto;

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
public class MenuOrderDTO implements Serializable {


    /**
     * 메뉴코드 (GRP_CD+MID_CD+DTL_CD)
     */
    @NotNull(message = "{tps.menu.error.invalid.menuId}")
    @Pattern(regexp = "[0-9]{2,8}$", message = "{tps.menu.error.invalid.menuId}")
    private String menuId;

    /**
     * 정렬순서
     */
    @Builder.Default
    private Integer menuOrder = 1;

}
