package jmnet.moka.core.tps.mvc.container.entity;

import java.io.Serializable;
import java.util.Date;
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
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import lombok.*;


/**
 * The persistent class for the WMS_CONTAINER database table.
 * 
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@EqualsAndHashCode(exclude = "containerRels")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "containerSeq")
@Entity
@Table(name = "TB_WMS_CONTAINER")
@NamedQuery(name = "Container.findAll", query = "SELECT c FROM Container c")
public class Container implements Serializable {

    private static final long serialVersionUID = -6024609985470746225L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CONTAINER_SEQ")
    private Long containerSeq;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "DOMAIN_ID", nullable = false, referencedColumnName = "DOMAIN_ID")
    private Domain domain;

    @Column(name = "CONTAINER_NAME")
    private String containerName;

    @Lob
    @Column(name = "CONTAINER_BODY")
    private String containerBody;

    @Column(name = "REG_DT")
    private Date regDt;

    @Column(name = "REG_ID")
    private String regId;

    @Column(name = "MOD_DT")
    private Date modDt;

    @Column(name = "MOD_ID")
    private String modId;

    @Transient
    private Long pageRelCount;

    @Transient
    private Long skinRelCount;

    @Builder.Default
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "container",
            cascade = {CascadeType.MERGE, CascadeType.REMOVE})
    private Set<ContainerRel> containerRels = new LinkedHashSet<ContainerRel>();

    public void addContainerRel(ContainerRel containerRel) {
        if (containerRel.getContainer() == null) {
            containerRel.setContainer(this);
            return;
        }

        if (containerRels.contains(containerRel)) {
            return;
        } else {
            this.containerRels.add(containerRel);
        }
    }

    public void removeContainerRel(ContainerRel containerRel) {
        getContainerRels().remove(containerRel);
        containerRel.setContainer(null);

    }

    /**
     * 관련아이템목록에서 type과 id가 동일한것이 있는지 검사한다.
     * 
     * @param rel 관련아이템
     * @return 동일한게 있으면 true
     */
    public boolean isEqualRel(ContainerRel rel) {
        Optional<ContainerRel> find = containerRels.stream().filter(r -> {
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
