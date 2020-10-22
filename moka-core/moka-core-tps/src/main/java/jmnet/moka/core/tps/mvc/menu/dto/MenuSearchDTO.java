package jmnet.moka.core.tps.mvc.menu.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.mvc.menu.service.MenuService;
import jmnet.moka.core.tps.mvc.menu.vo.MenuVO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = true)
public class MenuSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 7741459044517702553L;

    private String searchType;

    private String keyword;

    private String memberId;

    @Builder.Default
    private String parentMenuId = MenuService.ROOT_MENU_ID;

    /**
     * 총갯수 사용여부
     */
    @Builder.Default
    private String useTotal = MokaConstants.NO;

    // 정렬 기본값을 설정
    public MenuSearchDTO() {
        super(MenuVO.class, "menuId,asc,menuOrder,asc");
    }
}
