package jmnet.moka.core.tps.mvc.menu.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.NotNull;
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
public class MenuAuthDTO implements Serializable {

    public static final Type TYPE = new TypeReference<List<MenuAuthDTO>>() {
    }.getType();

    /**
     * 일련번호
     */
    private Long seqNo;

    /**
     * 그룹/사용자구분 (G:그룹, U:사용자)
     */
    @NotNull(message = "{tps.menu.error.invalid.domainId}")
    @Pattern(regexp = "[0-9]{8}$", message = "{tps.domain.error.invalid.domainId}")
    private String groupMemberDiv;

    /**
     * 사용여부(Y:사용, N:미사용)
     */
    @Builder.Default
    private String usedYn = "Y";

    /**
     * 그룹코드 / 사용자 ID
     */
    private String groupMemberId;

    /**
     * 메뉴코드 (TB_CMS_MENU.MENU_CD))
     */
    private String menuId;

    /**
     * 등록자
     */
    @Builder.Default
    private String regId = "";

    /**
     * 수정자
     */
    @Builder.Default
    private String modId = "";

}
