package jmnet.moka.core.tps.mvc.menu.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
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
public class MenuSimple implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO", nullable = false)
    private Long menuSeq;

    /**
     * 메뉴코드 (GRP_CD+MID_CD+DTL_CD)
     */
    @Column(name = "MENU_ID", nullable = false)
    private String menuId;

    /**
     * 메뉴 표시 명
     */
    @Column(name = "MENU_DISP_NM", nullable = false)
    private String menuNm;

}
