package jmnet.moka.core.tps.mvc.page.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.Optional;
import java.util.Set;
import javax.persistence.*;

import jmnet.moka.common.utils.McpDate;
import lombok.*;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;


/**
 * The persistent class for the WMS_PAGE database table.
 * 
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@EqualsAndHashCode(exclude = "pageRels")
//@JsonInclude(Include.NON_NULL)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "pageSeq")
@Entity
@Table(name = "TB_WMS_PAGE")
@NamedQuery(name = "Page.findAll", query = "SELECT p FROM Page p")
public class Page implements Serializable {

    private static final long serialVersionUID = 2047748626664504285L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PAGE_SEQ")
    private Long pageSeq;

    @Column(name = "PAGE_NAME", nullable = false)
    private String pageName;

    @Column(name = "PAGE_SERVICE_NAME")
    private String pageServiceName;

    @Column(name = "PAGE_DISPLAY_NAME")
    private String pageDisplayName;

    @ToString.Exclude   // self join시 문제가 있어 exclude
    @NotFound(action = NotFoundAction.IGNORE)   // https://eclipse4j.tistory.com/211
    @ManyToOne(fetch = FetchType.EAGER)         // OSVP일때는 EAGER로 한다.
    @JoinColumn(name = "PARENT_PAGE_SEQ", referencedColumnName = "PAGE_SEQ", nullable = true)
    private Page parent;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "DOMAIN_ID", nullable = false, referencedColumnName = "DOMAIN_ID")
    private Domain domain;

    @Column(name = "PAGE_TYPE", nullable = false)
    private String pageType;

    @Column(name = "PAGE_URL", nullable = false)
    private String pageUrl;

    @Column(name = "PAGE_ORD", nullable = false)
    private Integer pageOrd;

    @Lob
    @Column(name = "PAGE_BODY")
    private String pageBody;

    @Column(name = "URL_PARAM")
    private String urlParam;

    @Column(name = "USE_YN", columnDefinition = "char", nullable = false)
    private String useYn;

    @Column(name = "FILE_YN", columnDefinition = "char")
    private String fileYn;

    @Column(name = "KWD")
    private String kwd;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "MOVE_YN", columnDefinition = "char", nullable = false)
    private String moveYn;

    @Column(name = "MOVE_URL")
    private String moveUrl;

    @Column(name = "REG_DT")
    private Date regDt;

    @Column(name = "REG_ID")
    private String regId;

    @Column(name = "MOD_DT")
    private Date modDt;

    @Column(name = "MOD_ID")
    private String modId;

    @Builder.Default
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "page",
            cascade = {CascadeType.MERGE, CascadeType.REMOVE})
    private Set<PageRel> pageRels = new LinkedHashSet<PageRel>();

    @PrePersist
    public void prePersist() {
        this.pageOrd = this.pageOrd == null ? 1 : this.pageOrd;
        this.useYn = this.useYn == null ? "Y" : this.useYn;
        this.fileYn = this.fileYn == null ? "N" : this.fileYn;
        this.moveYn = this.moveYn == null ? "N" : this.moveYn;
        this.regDt = this.regDt == null ? McpDate.now() : this.regDt;
    }

    /**
     * 관련아이템 추가
     * 
     * @param rel 관련아이템
     */
    public void addPageRel(PageRel rel) {
        if (rel.getPage() == null) {
            rel.setPage(this);
            return;
        }

        if (pageRels.contains(rel)) {
            return;
        } else {
            this.pageRels.add(rel);
        }
    }

    /**
     * 관련아이템목록에서 type과 id가 동일한것이 있는지 검사한다.
     * 
     * @param rel 관련아이템
     * @return 동일한게 있으면 true
     */
    public boolean isEqualRel(PageRel rel) {
        Optional<PageRel> find = pageRels.stream().filter(r -> {
            if (r.getRelType().equals(rel.getRelType()) && r.getRelSeq().equals(rel.getRelSeq())) {
                if (r.getRelParentSeq() == null && rel.getRelParentSeq() == null) {
                	return true;
                } else if (r.getRelParentSeq() == null && rel.getRelParentSeq() != null) {
                	return false;
                } else if (r.getRelParentSeq() != null && rel.getRelParentSeq() == null) {
                	return false;
                } else if (r.getRelParentSeq().equals(rel.getRelParentSeq())) {
                	return true;
                }
            }
            return false;
        }).findFirst();
        if (find.isPresent())
            return true;
        return false;
    }
}

