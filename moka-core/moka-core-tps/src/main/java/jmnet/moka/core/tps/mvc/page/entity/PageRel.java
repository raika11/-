package jmnet.moka.core.tps.mvc.page.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Transient;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


/**
 * The persistent class for the WMS_PAGE_REL database table.
 * 
 */
@Entity
@Table(name = "WMS_PAGE_REL")
@NamedQuery(name = "PageRel.findAll", query = "SELECT p FROM PageRel p")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@EqualsAndHashCode(exclude = "page")
@JsonInclude(Include.NON_NULL)
public class PageRel implements Serializable {

    private static final long serialVersionUID = -371344931799250261L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ")
    private Long seq;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "DOMAIN_ID", nullable = false, referencedColumnName = "DOMAIN_ID")
    private Domain domain;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "PAGE_SEQ", referencedColumnName = "PAGE_SEQ", nullable = false)
    private Page page;

    @Column(name = "REL_TYPE")
    private String relType;

    @Column(name = "REL_SEQ")
    private Long relSeq;

    @Transient
    private String relName;

    @Transient
    private Long templateSeq;

    @Column(name = "REL_PARENT_TYPE")
    private String relParentType;

    @Column(name = "REL_PARENT_SEQ")
    private Long relParentSeq;

    @Column(name = "REL_ORDER")
    private int relOrder;

    public void setPage(Page page) {
        if (page == null) {
            return;
        }
        this.page = page;
        this.page.addPageRel(this);
    }

}
