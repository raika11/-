package jmnet.moka.core.tps.mvc.menu.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import jmnet.moka.core.tps.mvc.menu.service.MenuService;
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
@ApiModel("메뉴 DTO")
public class MenuDTO implements Serializable {

    public static final Type TYPE = new TypeReference<List<MenuDTO>>() {
    }.getType();

    @ApiModelProperty(hidden = true)
    private Long menuSeq;

    /**
     * 상위메뉴
     */
    @ApiModelProperty("상위메뉴")
    @Builder.Default
    private String parentMenuId = MenuService.ROOT_MENU_ID;

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

    /**
     * 메뉴 표시 명
     */
    @ApiModelProperty("메뉴 표시 명")
    @NotNull(message = "{tps.menu.error.notnull.menuDisplayNm}")
    @Pattern(regexp = ".+", message = "{tps.menu.error.length.menuDisplayNm}")
    @Length(min = 1, max = 50, message = "{tps.menu.error.length.menuDisplayNm}")
    private String menuDisplayNm;

    @ApiModelProperty("메뉴 깊이")
    @Builder.Default
    private Integer depth = 1;

    /**
     * 사용여부(Y:사용, N:미사용)
     */
    @ApiModelProperty("사용여부(Y:사용, N:미사용)")
    @NotNull(message = "{tps.common.error.pattern.usedYn}")
    @Pattern(regexp = "^[Y|N]$", message = "{tps.common.error.pattern.usedYn}")
    @Builder.Default
    private String usedYn = "Y";

    /**
     * 정렬순서
     */
    @ApiModelProperty("정렬순서")
    @Builder.Default
    private Integer menuOrder = 1;

    /**
     * 메뉴 페이지 URL
     */
    @ApiModelProperty("메뉴 페이지 URL")
    @Size(max = 512, message = "{tps.menu.error.length.menuUrl}")
    @Builder.Default
    private String menuUrl = "";

    /**
     * 아이콘 명
     */
    @ApiModelProperty("아이콘 명")
    @Size(max = 200, message = "{tps.menu.error.length.iconNm}")
    private String iconNm;

    /**
     * 등록자
     */
    @ApiModelProperty(hidden = true)
    private String regId = "";

    /**
     * 등록일시
     */
    @ApiModelProperty(hidden = true)
    @DTODateTimeFormat
    protected Date regDt;

    /**
     * 수정자
     */
    @ApiModelProperty(hidden = true)
    private String modId = "";

    /**
     * 수정일시
     */
    @ApiModelProperty(hidden = true)
    @DTODateTimeFormat
    protected Date modDt;
}
