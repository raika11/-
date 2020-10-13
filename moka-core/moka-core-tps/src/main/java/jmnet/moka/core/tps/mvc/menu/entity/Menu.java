package jmnet.moka.core.tps.mvc.menu.entity;

import java.io.Serializable;
import java.util.Date;
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
public class Menu implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO", nullable = false)
    private Long seq;

    /**
     * 대메뉴코드
     */
    @Column(name = "LMENU_CD", nullable = false)
    private String largeMenuCd;

    /**
     * 중메뉴코드
     */
    @Column(name = "MMENU_CD")
    @Builder.Default
    private String middleMenuCd = "";

    /**
     * 소메뉴코드
     */
    @Column(name = "SMENU_CD")
    @Builder.Default
    private String smallMenuCd = "";

    /**
     * 메뉴코드 (GRP_CD+MID_CD+DTL_CD)
     */
    @Column(name = "MENU_CD", nullable = false)
    private String menuCd;

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
     * 메뉴 페이지 URL
     */
    @Column(name = "MENU_URL")
    @Builder.Default
    private String menuUrl = "";

    /**
     * 등록일시
     */
    @Column(name = "REG_DT")
    private Date regDt;

    /**
     * 등록자
     */
    @Column(name = "REG_ID")
    @Builder.Default
    private String regId = "";

    /**
     * 수정일시
     */
    @Column(name = "MOD_DT")
    private Date modDt;

    /**
     * 수정자
     */
    @Column(name = "MOD_ID")
    @Builder.Default
    private String modId = "";

}
