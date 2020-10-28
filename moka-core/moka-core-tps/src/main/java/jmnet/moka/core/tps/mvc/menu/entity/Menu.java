package jmnet.moka.core.tps.mvc.menu.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


/**
 * CMS 메뉴
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "TB_CMS_MENU")
public class Menu extends BaseAudit {

    private static final long serialVersionUID = 1L;

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO", nullable = false)
    private Long menuSeq;

    /**
     * 대메뉴코드
     */
    @Column(name = "PARENT_MENU_ID", nullable = false)
    private String parentMenuId;

    /**
     * 메뉴코드 (GRP_CD+MID_CD+DTL_CD)
     */
    @Column(name = "MENU_ID", nullable = false)
    private String menuId;

    @Column(name = "DEPTH", nullable = false)
    private Integer depth;

    /**
     * 사용여부(Y:사용, N:미사용)
     */
    @Column(name = "USED_YN")
    @Builder.Default
    private String usedYn = "Y";

    /**
     * 정렬순서
     */
    @Column(name = "ORD_NO")
    @Builder.Default
    private Integer menuOrder = 0;

    /**
     * 메뉴명
     */
    @Column(name = "MENU_NM", nullable = false)
    private String menuNm;

    /**
     * 메뉴 표시 명
     */
    @Column(name = "MENU_DISP_NM", nullable = false)
    private String menuDisplayNm;

    /**
     * 메뉴 페이지 URL
     */
    @Column(name = "MENU_URL")
    @Builder.Default
    private String menuUrl = "";

    /**
     * 아이콘 명
     */
    @Column(name = "ICON_NM", nullable = false)
    private String iconNm;
}
