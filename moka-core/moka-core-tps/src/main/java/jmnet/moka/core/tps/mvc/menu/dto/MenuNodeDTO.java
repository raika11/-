package jmnet.moka.core.tps.mvc.menu.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonRootName;
import io.swagger.annotations.ApiModel;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.mvc.menu.vo.MenuVO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonRootName("menuNode")
@ApiModel("메뉴 트리 DTO")
public class MenuNodeDTO implements Serializable {

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

    List<MenuNodeDTO> children;

    /**
     * 노드생성
     *
     * @param menu Menu Entity
     */
    public MenuNodeDTO(MenuVO menu) {
        this.seq = menu.getSeqNo();
        this.menuId = menu.getMenuId();
        this.menuNm = menu.getMenuNm();
        this.menuDisplayNm = menu.getMenuDisplayNm();
        this.menuUrl = menu.getMenuUrl();
        this.menuOrder = menu.getMenuOrder();
        this.depth = menu.getDepth();
        this.usedYn = menu.getUsedYn();
        this.parentMenuId = menu.getParentMenuId();
        this.iconName = menu.getIconNm();
        this.usedYn = menu.getUsedYn();
        this.viewYn = menu.getViewYn();
        this.editYn = menu.getEditYn();
    }

    /**
     * 노드 찾기
     *
     * @param findId   찾을 메뉴 아이디
     * @param rootNode 트리상의 찾기시작할 시작노드
     * @return MenuNode
     */
    public MenuNodeDTO findNode(String findId, MenuNodeDTO rootNode) {
        if (findId.equals(rootNode.getMenuId())) {
            return rootNode;
        } else {
            if (rootNode.hasChild()) {
                for (MenuNodeDTO menuNodeDTO : rootNode.getChildren()) {
                    if (findId.equals(menuNodeDTO.getMenuId())) {
                        return menuNodeDTO;
                    } else if (menuNodeDTO.hasChild()) {
                        MenuNodeDTO findNode = findNode(findId, menuNodeDTO);
                        if (findNode != null) {
                            return findNode;
                        }
                    }
                }
            }
        }

        return null;
    }

    /**
     * 자식존재여부 조사
     *
     * @return 존재여부
     */
    public boolean hasChild() {
        return this.getChildren() != null && this
                .getChildren()
                .size() > 0;
    }

    /**
     * 자식노드 추가
     *
     * @param menuNodeDTO MenuNode
     */
    public void addNode(MenuNodeDTO menuNodeDTO) {
        if (this.children == null) {
            this.children = new ArrayList<>();
        }
        this.children.add(menuNodeDTO);
    }

    /**
     * 정렬
     */
    public void sort() {
        if (this.getChildren() != null) {
            // 자식노드가 하나만 있을경우는, 자식의 자식노드를 정렬하도록 한다.
            if (this
                    .getChildren()
                    .size() == 1) {
                this
                        .getChildren()
                        .get(0)
                        .sort();
            } else {
                this
                        .getChildren()
                        .sort((a, b) -> {

                            if (a.getChildren() != null && a
                                    .getChildren()
                                    .size() > 0) {
                                a.sort();
                            }
                            if (b.getChildren() != null && b
                                    .getChildren()
                                    .size() > 0) {
                                b.sort();
                            }

                            return a.getMenuOrder() - b.getMenuOrder();
                        });
            }
        }
    }

}
