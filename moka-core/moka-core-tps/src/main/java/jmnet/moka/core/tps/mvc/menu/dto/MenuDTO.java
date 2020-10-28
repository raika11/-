package jmnet.moka.core.tps.mvc.menu.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
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
public class MenuDTO implements Serializable {

    public static final Type TYPE = new TypeReference<List<MenuDTO>>() {
    }.getType();

    private Long menuSeq;

    /**
     * 대메뉴코드
     */
    @Builder.Default
    private String parentMenuId = "00";

    /**
     * 메뉴코드 (GRP_CD+MID_CD+DTL_CD)
     */
    @NotNull(message = "{tps.menu.error.invalid.menuId}")
    @Pattern(regexp = "[0-9]{2,8}$", message = "{tps.menu.error.invalid.menuId}")
    private String menuId;

    /**
     * 메뉴명
     */
    @NotNull(message = "{tps.menu.error.notnull.menuNm}")
    @Length(min = 1, max = 50, message = "{tps.menu.error.length.menuNm}")
    private String menuNm;

    /**
     * 메뉴 표시 명
     */
    @NotNull(message = "{tps.menu.error.notnull.menuDisplayNm}")
    @Pattern(regexp = ".+", message = "{tps.menu.error.length.menuDisplayNm}")
    @Length(min = 1, max = 50, message = "{tps.menu.error.length.menuDisplayNm}")
    private String menuDisplayNm;

    @Builder.Default
    private Integer depth = 1;

    /**
     * 사용여부(Y:사용, N:미사용)
     */
    @NotNull(message = "{tps.common.error.pattern.usedYn}")
    @Pattern(regexp = "^[Y|N]$", message = "{tps.common.error.pattern.usedYn}")
    @Builder.Default
    private String usedYn = "Y";

    /**
     * 정렬순서
     */
    @Builder.Default
    private Integer menuOrder = 1;

    /**
     * 메뉴 페이지 URL
     */
    @Size(max = 512, message = "{tps.menu.error.length.menuUrl}")
    @Builder.Default
    private String menuUrl = "";

    /**
     * 아이콘 명
     */
    @Size(max = 200, message = "{tps.menu.error.length.iconNm}")
    private String iconNm;

    /**
     * 등록자
     */
    private String regId = "";

    /**
     * 등록일시
     */
    @DTODateTimeFormat
    protected Date regDt;

    /**
     * 수정자
     */
    private String modId = "";

    /**
     * 수정일시
     */
    @DTODateTimeFormat
    protected Date modDt;
}
