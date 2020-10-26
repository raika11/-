package jmnet.moka.core.tps.mvc.page.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
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
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Nationalized;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;


/**
 * 페이지
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
public class Page extends BaseAudit {

    private static final long serialVersionUID = 2047748626664504285L;

    /**
     * 페이지SEQ
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PAGE_SEQ")
    private Long pageSeq;

    /**
     * 도메인
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "DOMAIN_ID", referencedColumnName = "DOMAIN_ID", nullable = false)
    private Domain domain;

    /**
     * 페이지명
     */
    @Nationalized
    @Column(name = "PAGE_NAME", nullable = false)
    private String pageName;

    /**
     * 페이지서비스명
     */
    @Nationalized
    @Column(name = "PAGE_SERVICE_NAME")
    private String pageServiceName;

    /**
     * 페이지표출명
     */
    @Nationalized
    @Column(name = "PAGE_DISPLAY_NAME")
    private String pageDisplayName;

    /**
     * 부모페이지
     */
    @ToString.Exclude   // self join시 문제가 있어 exclude
    @NotFound(action = NotFoundAction.IGNORE)   // https://eclipse4j.tistory.com/211
    @ManyToOne(fetch = FetchType.EAGER)         // OSVP일때는 EAGER로 한다.
    @JoinColumn(name = "PARENT_PAGE_SEQ", referencedColumnName = "PAGE_SEQ", nullable = true)
    private Page parent;

    /**
     * 페이지유형 text/html, application/json, text/javascript, text/plain, text/xml
     */
    @Column(name = "PAGE_TYPE", nullable = false)
    @Builder.Default
    private String pageType = TpsConstants.PAGE_TYPE_HTML;

    /**
     * 페이지URL
     */
    @Column(name = "PAGE_URL", nullable = false)
    private String pageUrl;

    /**
     * 페이지순서
     */
    @Column(name = "PAGE_ORD", nullable = false)
    @Builder.Default
    private Integer pageOrd = 1;

    /**
     * 페이지본문
     */
    @Nationalized
    @Column(name = "PAGE_BODY")
    @Builder.Default
    private String pageBody = "";

    /**
     * URL파라미터
     */
    @Column(name = "URL_PARAM")
    private String urlParam;

    /**
     * 사용여부
     */
    @Column(name = "USE_YN", columnDefinition = "char", nullable = false)
    @Builder.Default
    private String useYn = MokaConstants.YES;

    /**
     * 파일여부
     */
    @Column(name = "FILE_YN", columnDefinition = "char")
    @Builder.Default
    private String fileYn = MokaConstants.NO;

    /**
     * 키워드
     */
    @Nationalized
    @Column(name = "KWD")
    private String kwd;

    /**
     * 상세정보
     */
    @Nationalized
    @Column(name = "DESCRIPTION")
    private String description;

    /**
     * 이동여부
     */
    @Column(name = "MOVE_YN", columnDefinition = "char", nullable = false)
    @Builder.Default
    private String moveYn = MokaConstants.NO;

    /**
     * 이동URL
     */
    @Column(name = "MOVE_URL")
    private String moveUrl;

    /**
     * 관련아이템
     */
    @Builder.Default
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "page", cascade = {CascadeType.MERGE, CascadeType.REMOVE})
    private Set<PageRel> pageRels = new LinkedHashSet<PageRel>();

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.pageOrd = this.pageOrd == null ? 1 : this.pageOrd;
        this.pageBody = McpString.defaultValue(this.pageBody);
        this.useYn = McpString.defaultValue(this.useYn, MokaConstants.YES);
        this.fileYn = McpString.defaultValue(this.fileYn, MokaConstants.NO);
        this.moveYn = McpString.defaultValue(this.moveYn, MokaConstants.NO);
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
        Optional<PageRel> find = pageRels.stream()
                                         .filter(r -> {
                                             if (r.getRelType()
                                                  .equals(rel.getRelType()) && r.getRelSeq()
                                                                                .equals(rel.getRelSeq())) {
                                                 if (r.getRelParentSeq() == null && rel.getRelParentSeq() == null) {
                                                     return true;
                                                 } else if (r.getRelParentSeq() == null && rel.getRelParentSeq() != null) {
                                                     return false;
                                                 } else if (r.getRelParentSeq() != null && rel.getRelParentSeq() == null) {
                                                     return false;
                                                 } else if (r.getRelParentSeq()
                                                             .equals(rel.getRelParentSeq())) {
                                                     return true;
                                                 }
                                             }
                                             return false;
                                         })
                                         .findFirst();
        if (find.isPresent()) {
            return true;
        }
        return false;
    }
}

