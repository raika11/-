package jmnet.moka.core.tps.mvc.articlePackage.entity;

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
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import jmnet.moka.core.tps.mvc.member.entity.MemberSimpleInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.articlePackage.entity
 * ClassName : ArticlePackage
 * Created : 2021-05-03 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-05-03 오후 3:47
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_ARTICLE_PACKAGE")
public class ArticlePackage extends BaseAudit {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PKG_SEQ")
    private Long pkgSeq;

    @Column(name = "USED_YN")
    private String usedYn;

    @Column(name = "SCB_YN")
    private String scbYn;

    @Column(name = "PKG_DIV")
    private String pkgDiv;

    @Column(name = "ART_CNT")
    private Long artCnt;

    @Column(name = "TOTAL_ID1")
    private Long totalId1;

    @Column(name = "CAT_LIST")
    private String catList;

    @Column(name = "EXCEPT_CAT_LIST")
    private String exceptCatList;

    @Column(name = "EXCEPT_AND_OR")
    private String exceptAndOr;

    @Column(name = "EXCEPT_TAG_LIST")
    private String exceptTagList;

    @Column(name = "DIST_DT")
    private Date distDt;

    @Column(name = "BEFORE_AFTER")
    private String beforeAfter;

    @Column(name = "DIST_PERIOD")
    private Long distPeriod;

    @Column(name = "PKG_TITLE")
    private String pkgTitle;

    /**
     * 등록자
     */
    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "REG_ID", insertable = false, updatable = false)
    private MemberSimpleInfo regMember;

    /**
     * 수정자
     */
    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "MOD_ID", insertable = false, updatable = false)
    private MemberSimpleInfo modMember;

    @Column(name = "UPD_DT")
    private Date updDt;

    @Column(name = "S_DATE")
    private String sDate;

    @Column(name = "E_DATE")
    private String eDate;

    @Column(name = "END_DT")
    private Date endDt;

    @Builder.Default
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "articlePackage", cascade = {CascadeType.MERGE, CascadeType.REMOVE, CascadeType.PERSIST})
    private Set<ArticlePackageKwd> keywords = new LinkedHashSet<>();
}
