package jmnet.moka.core.tps.mvc.page.entity;

import java.io.Serializable;
import java.util.LinkedHashSet;
import java.util.Optional;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;


/**
 * The persistent class for the WMS_PAGE database table.
 * 
 */
@Entity
@Table(name = "WMS_PAGE")
@NamedQuery(name = "Page.findAll", query = "SELECT p FROM Page p")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@EqualsAndHashCode(exclude = "pageRels")
@JsonInclude(Include.NON_NULL)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "pageSeq")
public class Page implements Serializable {

    private static final long serialVersionUID = 2047748626664504285L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PAGE_SEQ")
    private Long pageSeq;

    @Column(name = "PAGE_NAME")
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

    @Column(name = "PAGE_TYPE")
    private String pageType;

    @Column(name = "PAGE_URL")
    private String pageUrl;

    @Column(name = "PAGE_ORDER")
    private int pageOrder;

    @Lob
    @Column(name = "PAGE_BODY")
    private String pageBody;

    @Column(name = "USE_YN", columnDefinition = "char")
    private String useYn;

    @Column(name = "KEYWORD")
    private String keyword;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "MOVE_YN", columnDefinition = "char")
    private String moveYn;

    @Column(name = "MOVE_URL")
    private String moveUrl;

    @Column(name = "CREATE_YMDT")
    private String createYmdt;

    @Column(name = "CREATOR")
    private String creator;

    @Column(name = "MODIFIED_YMDT")
    private String modifiedYmdt;

    @Column(name = "MODIFIER")
    private String modifier;

    @Builder.Default
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "page",
            cascade = {CascadeType.MERGE, CascadeType.REMOVE})
    private Set<PageRel> pageRels = new LinkedHashSet<PageRel>();

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

    