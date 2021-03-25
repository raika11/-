package jmnet.moka.core.tps.mvc.pkg.entity;

import java.util.Date;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.packagae.entity
 * ClassName : PackageMaster (Package는 예약어라서 오류발생)
 * Created : 2021-03-19 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-03-19 오전 11:32
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_MOKA_PACKAGE")
public class PackageMaster extends BaseAudit {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PKG_SEQ")
    private Long pkgSeq;

    @Column(name = "USED_YN")
    private String usedYn;

    @Column(name = "PKG_DIV")
    private String pkgDiv;

    @Column(name = "SEASON_NO")
    private String seasonNo;

    @Column(name = "EPIS_VIEW")
    private String episView;

    @Column(name = "SCB_YN")
    private String scbYn;

    @Column(name = "SCB_NO")
    private Long scbNo;

    @Column(name = "ART_CNT")
    private Long artCnt;

    @Column(name = "TOTAL_ID1")
    private Long totalId1;

    @Column(name = "CAT_LIST")
    private String catList;

    @Column(name = "PKG_TITLE")
    private String pkgTitle;

    @Column(name = "PKG_DESC")
    private String pkgDesc;

    @Column(name = "RECOMM_PKG")
    private String recommPkg;

    @Column(name = "RESERV_DT")
    private Date reservDt;

    @Column(name = "UPD_DT")
    private Date updDt;

    @Builder.Default
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "packageMaster", cascade = {CascadeType.MERGE, CascadeType.REMOVE, CascadeType.PERSIST})
    private Set<PackageKeyword> packageKeywords = new LinkedHashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "packageMaster", cascade = {CascadeType.MERGE, CascadeType.REMOVE, CascadeType.PERSIST})
    private Set<PackageList> packageLists = new LinkedHashSet<>();

    @Transient
    private Long articleCount;

    @Transient
    private Date lastArticleUpdateDate;
}
