package jmnet.moka.core.tps.mvc.menu.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jmnet.moka.core.tps.mvc.menu.entity.Menu;
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
 * @since 2020. 5. 21. 오전 11:26:14
 * @author ssc
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

    private String menuName;

    private String menuDispName;

    private String menuPath;

    private Integer menuOrder;

    private Integer depth;

    private String useYn;

    private String parentMenuId;

    private String iconName;

    List<MenuNode> nodes;

    /**
     * 노드생성
     * 
     * @param menu Menu Entity
     */
    public MenuNode(Menu menu) {
        this.seq = menu.getSeq();
        this.menuId = menu.getMenuCd();
        this.menuName = menu.getMenuNm();
        this.menuPath = menu.getMenuUrl();
        this.menuOrder = menu.getMenuOrder();
        //this.depth = menu.getDepth();
        this.useYn = menu.getUsedYn();
        //this.parentMenuId = menu.getParentMenuId();
        //this.iconName = menu.getIconName();
    }

    /**
     * 노드 찾기
     * 
     * @param findId 찾을 메뉴 아이디
     * @param rootNode 트리상의 찾기시작할 시작노드
     * @return
     */
    public MenuNode findNode(String findId, MenuNode rootNode) {
        if (findId.equals(rootNode.getMenuId())) {
            return rootNode;
        } else {
            if (rootNode.hasChild()) {
                Iterator<MenuNode> iterator = rootNode.getNodes().iterator();
                while (iterator.hasNext()) {
                    MenuNode menuNode = iterator.next();
                    if (findId.equals(menuNode.getMenuId())) {
                        return menuNode;
                    } else if (menuNode.hasChild()) {
                        MenuNode findNode = findNode(findId, menuNode);
                        if (findNode != null)
                            return findNode;
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
        return this.getNodes() != null && this.getNodes().size() > 0 ? true : false;
    }

    /**
     * 자식노드 추가
     * 
     * @param menuNode
     */
    public void addNode(MenuNode menuNode) {
        if (this.nodes == null)
            this.nodes = new ArrayList<>();
        this.nodes.add(menuNode);
    }

    /**
     * 정렬
     */
    public void sort() {
        if (this.getNodes() != null) {
            // 자식노드가 하나만 있을경우는, 자식의 자식노드를 정렬하도록 한다.
            if (this.getNodes().size() == 1) {
                this.getNodes().get(0).sort();
            } else {
                this.getNodes().sort((a, b) -> {

                    if (a.getNodes() != null && a.getNodes().size() > 0)
                        a.sort();
                    if (b.getNodes() != null && b.getNodes().size() > 0)
                        b.sort();

                    return a.getMenuOrder() - b.getMenuOrder();
                });
            }
        }
    }

}
