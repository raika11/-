package jmnet.moka.core.tps.mvc.menu.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * CMS - 그룹/사용자별 메뉴 권한
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "TB_CMS_MENU_AUTH")
public class MenuAuth implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO", nullable = false)
    private Long seqNo;

    /**
     * 그룹/사용자구분 (G:그룹, U:사용자)
     */
    @Column(name = "GRP_MEM_DIV", nullable = false)
    private String groupMemberDiv;

    /**
     * 사용여부(Y:사용, N:미사용)
     */
    @Column(name = "USED_YN")
    @Builder.Default
    private String usedYn = "Y";

    /**
     * 그룹코드 / 사용자ID
     */
    @Column(name = "GRP_MEM_ID", nullable = false)
    private String groupMemberId;

    /**
     * 메뉴코드 (TB_CMS_MENU.MENU_CD))
     */
    @Column(name = "MENU_CD", nullable = false)
    private String menuId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MENU_CD", nullable = false, insertable = false, updatable = false)
    private Menu menu;

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
