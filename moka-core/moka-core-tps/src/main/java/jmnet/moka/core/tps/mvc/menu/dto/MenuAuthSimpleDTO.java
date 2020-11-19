package jmnet.moka.core.tps.mvc.menu.dto;

import java.io.Serializable;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import jmnet.moka.core.common.MokaConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * CMS - 그룹/사용자별 메뉴 권한
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class MenuAuthSimpleDTO implements Serializable {


    /**
     * 사용여부(Y:사용, N:미사용)
     */
    @Builder.Default
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.common.error.pattern.usedYn}")
    private String usedYn = "Y";

    /**
     * 조회권한여부
     */
    @Builder.Default
    private String viewYn = MokaConstants.YES;

    /**
     * 편집권한여부
     */
    @Builder.Default
    private String editYn = MokaConstants.NO;

    /**
     * 그룹코드 / 사용자 ID
     */
    @Pattern(regexp = "[0-9]{2,8}$", message = "{tps.menu.error.invalid.menuId}")
    private String menuId;

    /**
     * 그룹코드 / 사용자 ID
     */
    @Size(min = 2, max = 30, message = "{tps.menu.auth.error.size.groupMemberId}")
    private String groupMemberId;


}
