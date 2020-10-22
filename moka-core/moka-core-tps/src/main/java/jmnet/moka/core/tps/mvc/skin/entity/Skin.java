package jmnet.moka.core.tps.mvc.skin.entity;

import java.io.Serializable;
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
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import jmnet.moka.core.tps.mvc.style.entity.Style;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;


/**
 * The persistent class for the WMS_SKIN database table.
 * 
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@EqualsAndHashCode(exclude = "skinRels")
//@JsonInclude(Include.NON_NULL)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "skinSeq")
@Entity
@Table(name = "TB_WMS_SKIN")
public class Skin extends BaseAudit {

    private static final long serialVersionUID = -5594061966806120720L;

    /**
     * 스킨SEQ
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SKIN_SEQ")
    private Long skinSeq;

    /**
     * 도메인
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "DOMAIN_ID", referencedColumnName = "DOMAIN_ID", nullable = false)
    private Domain domain;

    /**
     * 스킨명
     */
    @Nationalized
    @Column(name = "SKIN_NAME", nullable = false)
    private String skinName;

    /**
     * 스킨서비스명
     */
    @Nationalized
    @Column(name = "SKIN_SERVICE_NAME")
    private String skinServiceName;

    /**
     * 서비스유형(기타코드)
     */
    @Column(name = "SERVICE_TYPE")
    private String serviceType;

    /**
     * 기본여부
     */
    @Column(name = "DEFAULT_YN", columnDefinition = "char", nullable = false)
    @Builder.Default
    private String defaultYn = "N";

    /**
     * 스킨본문
     */
    @Nationalized
    @Column(name = "SKIN_BODY")
    @Builder.Default
    private String skinBody = "";

    @Builder.Default
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "skin",
            cascade = {CascadeType.MERGE, CascadeType.REMOVE})
    private Set<SkinRel> skinRels = new LinkedHashSet<SkinRel>();

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.skinBody = McpString.defaultValue(this.skinBody, "");
        this.defaultYn = McpString.defaultValue(this.defaultYn, "N");
    }

    /**
     * 관련아이템 추가
     * 
     * @param rel 관련아이템
     */
    public void addSkinRel(SkinRel rel) {
        if (rel.getSkin() == null) {
            rel.setSkin(this);
            return;
        }

        if (skinRels.contains(rel)) {
            return;
        } else {
            this.skinRels.add(rel);
        }
    }

    /**
     * 관련아이템목록에서 type과 id가 동일한것이 있는지 검사한다.
     * 
     * @param rel 관련아이템
     * @return 동일한게 있으면 true
     */
    public boolean isEqualRel(SkinRel rel) {
        Optional<SkinRel> find = skinRels.stream().filter(r -> {
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
