package jmnet.moka.core.tps.mvc.container.entity;

import java.io.Serializable;
import java.time.LocalDateTime;
import javax.persistence.*;

import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import lombok.*;


/**
 * The persistent class for the TB_WMS_CONTAINER_REL database table.
 * 
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@EqualsAndHashCode(exclude = "container")
@Entity
@Table(name = "TB_WMS_CONTAINER_REL")
@NamedQuery(name = "ContainerRel.findAll", query = "SELECT c FROM ContainerRel c")
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
    @JoinColumn(name = "DOMAIN_ID", referencedColumnName = "DOMAIN_ID", nullable = false)
    private Domain domain;

    @Column(name = "REL_TYPE", nullable = false, length = 3)
    private String relType;

    @Column(name = "REL_SEQ")
    private Long relSeq;

    @Transient
    private String relName;

    @Transient
    private Long templateSeq;

    @Column(name = "REL_PARENT_TYPE", length = 3)
    private String relParentType;

    @Column(name = "REL_PARENT_SEQ")
    private Long relParentSeq;

    @Column(name = "REL_ORD", nullable = false)
    private Integer relOrd;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.relParentType = this.relParentType == null ? "NN" : this.relParentType;
        this.relOrd = this.relOrd == null ? 1 : this.relOrd;
    }

    public void setContainer(Container container) {
        if (container == null) {
            return;
        }
        this.container = container;
        this.container.addContainerRel(this);
    }

}
