package jmnet.moka.core.tps.mvc.container.entity;

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
import javax.persistence.Table;
import javax.persistence.Transient;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;


/**
 * 컨테이너
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
public class Container extends BaseAudit {

    private static final long serialVersionUID = -6024609985470746225L;

    /**
     * 컨테이너SEQ
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CONTAINER_SEQ")
    private Long containerSeq;

    /**
     * 도메인
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "DOMAIN_ID", referencedColumnName = "DOMAIN_ID", nullable = false)
    private Domain domain;

    /**
     * 컨테이너명
     */
    @Nationalized
    @Column(name = "CONTAINER_NAME", nullable = false)
    private String containerName;

    /**
     * 컨테이너본문
     */
    @Nationalized
    @Column(name = "CONTAINER_BODY")
    @Builder.Default
    private String containerBody = "";

    /**
     * 페이지 관련갯수
     */
    @Transient
    @Builder.Default
    private Long pageRelCount = (long) 0;

    /**
     * 본문 관련갯수
     */
    @Transient
    @Builder.Default
    private Long skinRelCount = (long) 0;

    /**
     * 관련아이템
     */
    @Builder.Default
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "container", cascade = {CascadeType.MERGE, CascadeType.REMOVE, CascadeType.PERSIST})
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
        Optional<ContainerRel> find = containerRels.stream()
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
