package jmnet.moka.core.tps.mvc.menu.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
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
public class MenuNode implements Serializable {

    private static final long serialVersionUID = 8033550614720880882L;

    private Long seq;

    private String menuId;

    private String menuNm;

    private String menuDisplayNm;

    private String menuUrl;

    private Integer menuOrder;

    private Integer depth;

    private String useYn;

    private String parentMenuId;

    private String iconName;

    List<MenuNode> children;

    /**
     * 노드생성
     *
     * @param menu Menu Entity
     */
    public MenuNode(MenuDTO menu) {
        this.seq = menu.getMenuSeq();
        this.menuId = menu.getMenuId();
        this.menuNm = menu.getMenuNm();
        this.menuDisplayNm = menu.getMenuDisplayNm();
        this.menuUrl = menu.getMenuUrl();
        this.menuOrder = menu.getMenuOrder();
        this.depth = menu.getDepth();
        this.useYn = menu.getUsedYn();
        this.parentMenuId = menu.getParentMenuId();
        this.iconName = menu.getIconNm();
    }

    /**
     * 노드 찾기
     *
     * @param findId   찾을 메뉴 아이디
     * @param rootNode 트리상의 찾기시작할 시작노드
     * @return MenuNode
     */
    public MenuNode findNode(String findId, MenuNode rootNode) {
        if (findId.equals(rootNode.getMenuId())) {
            return rootNode;
        } else {
            if (rootNode.hasChild()) {
                for (MenuNode menuNode : rootNode.getChildren()) {
                    if (findId.equals(menuNode.getMenuId())) {
                        return menuNode;
                    } else if (menuNode.hasChild()) {
                        MenuNode findNode = findNode(findId, menuNode);
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
     * @param menuNode MenuNode
     */
    public void addNode(MenuNode menuNode) {
        if (this.children == null) {
            this.children = new ArrayList<>();
        }
        this.children.add(menuNode);
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
