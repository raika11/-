package jmnet.moka.core.tps.mvc.container.entity;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.Optional;
import java.util.Set;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import lombok.*;
import org.hibernate.annotations.Nationalized;


/**
 * The persistent class for the TB_WMS_CONTAINER database table.
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
    @JoinColumn(name = "DOMAIN_ID", referencedColumnName = "DOMAIN_ID", nullable = false)
    private Domain domain;

    @Nationalized
    @Column(name = "CONTAINER_NAME", nullable = false, length = 128)
    private String containerName;

    @Nationalized
    @Column(name = "CONTAINER_BODY")
    private String containerBody;

    @Column(name = "REG_DT")
    @Temporal(TemporalType.TIMESTAMP)
    private Date regDt;

    @Column(name = "REG_ID", length = 50)
    private String regId;

    @Column(name = "MOD_DT")
    @Temporal(TemporalType.TIMESTAMP)
    private Date modDt;

    @Column(name = "MOD_ID", length = 50)
    private String modId;

    @Transient
    private Long pageRelCount;

    @Transient
    private Long skinRelCount;

    @PrePersist
    public void prePersist() {
        this.regDt = this.regDt == null ? McpDate.now() : this.regDt;
    }

    @PreUpdate
    public void preUpdate() {
        this.regDt = this.regDt == null ? McpDate.now() : this.regDt;
        this.modDt = this.modDt == null ? McpDate.now() : this.modDt;
    }

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
