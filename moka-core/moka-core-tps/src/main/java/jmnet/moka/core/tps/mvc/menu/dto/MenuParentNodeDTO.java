package jmnet.moka.core.tps.mvc.menu.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonRootName;
import io.swagger.annotations.ApiModel;
import java.io.Serializable;
import jmnet.moka.core.common.MokaConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 * 메뉴정보(트리구조)
 * 2020. 5. 21. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 5. 21. 오전 11:26:14
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonRootName("menuNode")
@ApiModel("메뉴 트리 DTO")
public class MenuParentNodeDTO implements Serializable {

    private static final long serialVersionUID = 8033550614720880882L;

    private Long seq;

    private String menuId;

    private String menuNm;

    private String menuDisplayNm;

    private String menuUrl;

    private Integer menuOrder;

    private Integer depth;

    private String usedYn;

    private String parentMenuId;

    private String iconName;

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
     * 노드생성
     *
     * @param menu Menu Entity
     */
    public MenuParentNodeDTO(MenuNodeDTO menu) {
        this.seq = menu.getSeq();
        this.menuId = menu.getMenuId();
        this.menuNm = menu.getMenuNm();
        this.menuDisplayNm = menu.getMenuDisplayNm();
        this.menuUrl = menu.getMenuUrl();
        this.menuOrder = menu.getMenuOrder();
        this.depth = menu.getDepth();
        this.usedYn = menu.getUsedYn();
        this.parentMenuId = menu.getParentMenuId();
        this.iconName = menu.getIconName();
        this.usedYn = menu.getUsedYn();
        this.viewYn = menu.getViewYn();
        this.editYn = menu.getEditYn();
    }


}
