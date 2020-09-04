package jmnet.moka.core.tps.mvc.container.entity;

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
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


/**
 * The persistent class for the WMS_CONTAINER_REL database table.
 * 
 */
@Entity
@Table(name = "WMS_CONTAINER_REL")
@NamedQuery(name = "ContainerRel.findAll", query = "SELECT c FROM ContainerRel c")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@EqualsAndHashCode(exclude = "container")
public class ContainerRel implements Serializable {

    private static final long serialVersionUID = -7450080057831221133L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ")
    private Long seq;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "CONTAINER_SEQ", referencedColumnName = "CONTAINER_SEQ", nullable = false)
    private Container container;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "DOMAIN_ID", nullable = false, referencedColumnName = "DOMAIN_ID")
    private Domain domain;

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

    public void setContainer(Container container) {
        if (container == null) {
            return;
        }
        this.container = container;
        this.container.addContainerRel(this);
    }

}
