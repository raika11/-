package jmnet.moka.core.tps.mvc.menu.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
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

    private Long seq;

    /**
     * 대메뉴코드
     */
    @NotNull(message = "{tps.menu.error.invalid.menuId}")
    @Pattern(regexp = "[0-9]{2,8}$", message = "{tps.menu.error.invalid.menuId}")
    private String parentMenuId;

    /**
     * 메뉴코드 (GRP_CD+MID_CD+DTL_CD)
     */
    @NotNull(message = "{tps.menu.error.invalid.menuId}")
    @Pattern(regexp = "[0-9]{2,8}$", message = "{tps.menu.error.invalid.menuId}")
    private String menuId;

    /**
     * 메뉴명
     */
    @NotNull(message = "{tps.domain.error.invalid.menuNm1}")
    @Pattern(regexp = ".+", message = "{tps.menu.error.invalid.menuNm1}")
    @Length(min = 1, max = 50, message = "{tps.menu.error.invalid.menuNm2}")
    private String menuNm;

    /**
     * 메뉴 표시 명
     */
    @NotNull(message = "{tps.domain.error.invalid.menuDisplayNm1}")
    @Pattern(regexp = ".+", message = "{tps.menu.error.invalid.menuDisplayNm1}")
    @Length(min = 1, max = 50, message = "{tps.menu.error.invalid.menuDisplayNm2}")
    private String menuDisplayNm;

    @Builder.Default
    private Integer depth = 1;

    /**
     * 사용여부(Y:사용, N:미사용)
     */
    @NotNull(message = "{tps.menu.error.invalid.usedYn}")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.menu.error.invalid.usedYn}")
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
    @NotNull(message = "{tps.domain.error.notnull.domainUrl}")
    @Pattern(regexp = ".+", message = "{tps.domain.error.invalid.menuUrl1}")
    @Length(min = 1, max = 512, message = "{tps.domain.error.invalid.menuUrl2}")
    @Builder.Default
    private String menuUrl = "";

    /**
     * 아이콘 명
     */
    @Length(min = 0, max = 200, message = "{tps.domain.error.invalid.iconNm}")
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
