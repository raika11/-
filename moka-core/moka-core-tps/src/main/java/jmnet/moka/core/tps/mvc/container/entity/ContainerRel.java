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
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import javax.persistence.Transient;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


/**
 * 컨테이너 관련아이템
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@EqualsAndHashCode(exclude = "container")
@Entity
@Table(name = "TB_WMS_CONTAINER_REL")
public class ContainerRel implements Serializable {

    private static final long serialVersionUID = -7450080057831221133L;

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ")
    private Long seq;

    /**
     * 컨테이너
     */
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "CONTAINER_SEQ", referencedColumnName = "CONTAINER_SEQ", nullable = false)
    private Container container;

    /**
     * 도메인
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "DOMAIN_ID", referencedColumnName = "DOMAIN_ID", nullable = false)
    private Domain domain;

    /**
     * 관련유형 TP:템플릿, CP: 컴포넌트, AD:광고, CT:컨테이너, DS: 데이타셋
     */
    @Column(name = "REL_TYPE", nullable = false)
    private String relType;

    /**
     * 관련SEQ
     */
    @Column(name = "REL_SEQ")
    private Long relSeq;

    /**
     * 관련 아이템명
     */
    @Transient
    private String relName;

    /**
     * 템플릿SEQ
     */
    @Transient
    private Long templateSeq;

    /**
     * 관련부모유형 NN :없음. CP: 컴포넌트, CT:컨테이너
     */
    @Column(name = "REL_PARENT_TYPE")
    @Builder.Default
    private String relParentType = TpsConstants.REL_TYPE_UNKNOWN;

    /**
     * 관련부모SEQ
     */
    @Column(name = "REL_PARENT_SEQ")
    private Long relParentSeq;

    /**
     * 관련순서
     */
    @Column(name = "REL_ORD", nullable = false)
    @Builder.Default
    private Integer relOrd = 1;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.relParentType = this.relParentType == null ? TpsConstants.REL_TYPE_UNKNOWN : this.relParentType;
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
