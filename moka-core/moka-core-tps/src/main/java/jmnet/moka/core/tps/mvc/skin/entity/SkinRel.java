package jmnet.moka.core.tps.mvc.skin.entity;

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
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import javax.persistence.Transient;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


/**
 * The persistent class for the WMS_SKIN_REL database table.
 * 
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@EqualsAndHashCode(exclude = "skin")
//@JsonInclude(Include.NON_NULL)
@Entity
@Table(name = "TB_WMS_SKIN_REL")
public class SkinRel extends BaseAudit {

    private static final long serialVersionUID = -7323814576394751181L;

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ")
    private Long seq;

    /**
     * 도메인
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "DOMAIN_ID", nullable = false, referencedColumnName = "DOMAIN_ID")
    private Domain domain;

    /**
     * 스킨
     */
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "SKIN_SEQ", referencedColumnName = "SKIN_SEQ", nullable = false)
    private Skin skin;

    /**
     * 관련유형 TP:템플릿, CP: 컴포넌트, AD:광고, CT:컨테이너, DS: 데이타셋
     */
    @Column(name = "REL_TYPE", nullable = false)
    private String relType;

    /**
     * 관련SEQ
     */
    @Column(name = "REL_SEQ", nullable = false)
    private Long relSeq;

    /**
     * 관련아이템명
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
    @Column(name = "REL_PARENT_TYPE", nullable = false)
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
    @Column(name = "REL_ORD")
    @Builder.Default
    private Integer relOrd = 1;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.relParentType = this.relParentType == null ? TpsConstants.REL_TYPE_UNKNOWN : this.relParentType;
        this.relOrd = this.relOrd == null ? 1 : this.relOrd;
    }

    public void setSkin(Skin skin) {
        if (skin == null) {
            return;
        }
        this.skin = skin;
        this.skin.addSkinRel(this);
    }
}
