package jmnet.moka.core.tps.mvc.menu.dto;

import java.io.Serializable;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
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
     * 그룹코드 / 사용자 ID
     */
    @Size(min = 2, max = 30, message = "{tps.menu.auth.error.size.groupMemberId}")
    private String groupMemberId;


}
