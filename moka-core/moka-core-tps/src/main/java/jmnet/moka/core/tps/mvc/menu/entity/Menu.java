package jmnet.moka.core.tps.mvc.menu.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * The persistent class for the WMS_MENU database table.
 * 
 */
@Entity
@Table(name = "WMS_MENU")
@NamedQuery(name = "Menu.findAll", query = "SELECT m FROM Menu m")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Menu implements Serializable {

    private static final long serialVersionUID = 3591413639637480321L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ")
    private Long seq;

    @Column(name = "MENU_ID")
    private String menuId;

    @Column(name = "MENU_NAME")
    private String menuName;

    @Column(name = "MENU_DISP_NAME")
    private String menuDispName;

    @Column(name = "MENU_PATH")
    private String menuPath;

    @Column(name = "MENU_ORDER")
    private Integer menuOrder;

    @Column(name = "DEPTH")
    private Integer depth;

    @Column(name = "USE_YN", columnDefinition = "char")
    private String useYn;

    @Column(name = "PARENT_MENU_ID")
    private String parentMenuId;

    @Column(name = "ICON_NAME")
    private String iconName;

    @Column(name = "CREATE_YMDT")
    private String createYmdt;

    @Column(name = "CREATOR")
    private String creator;

    @Column(name = "MODIFIED_YMDT")
    private String modifiedYmdt;

    @Column(name = "MODIFIER")
    private String modifier;
}
