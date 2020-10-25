package jmnet.moka.core.tps.mvc.page.entity;

import java.io.Serializable;
import java.time.LocalDateTime;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import lombok.*;


/**
 * The persistent class for the TB_WMS_PAGE_REL database table.
 * 
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@EqualsAndHashCode(exclude = "page")
//@JsonInclude(Include.NON_NULL)
@Entity
@Table(name = "TB_WMS_PAGE_REL")
@NamedQuery(name = "PageRel.findAll", query = "SELECT p FROM PageRel p")
public class PageRel implements Serializable {

    private static final long serialVersionUID = -371344931799250261L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ")
    private Long seq;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "DOMAIN_ID", referencedColumnName = "DOMAIN_ID", nullable = false)
    private Domain domain;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "PAGE_SEQ", referencedColumnName = "PAGE_SEQ", nullable = false)
    private Page page;

    @Column(name = "REL_TYPE", nullable = false, length = 3)
    private String relType;

    @Column(name = "REL_SEQ")
    private Long relSeq;

    @Transient
    private String relName;

    @Transient
    private Long templateSeq;

    @Column(name = "REL_PARENT_TYPE", nullable = false, length = 3)
    private String relParentType;

    @Column(name = "REL_PARENT_SEQ")
    private Long relParentSeq;

    @Column(name = "REL_ORD", nullable = false)
    private Integer relOrd;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.relParentType = this.relParentType == null ? TpsConstants.REL_TYPE_UNKNOWN : this.relParentType;
        this.relOrd = this.relOrd == null ? 1 : this.relOrd;
    }

    public void setPage(Page page) {
        if (page == null) {
            return;
        }
        this.page = page;
        this.page.addPageRel(this);
    }

}
