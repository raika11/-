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
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import jmnet.moka.core.tps.mvc.style.entity.Style;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


/**
 * The persistent class for the WMS_SKIN database table.
 * 
 */
@Entity
@Table(name = "WMS_SKIN")
@NamedQuery(name = "Skin.findAll", query = "SELECT s FROM Skin s")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@EqualsAndHashCode(exclude = "skinRels")
@JsonInclude(Include.NON_NULL)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "skinSeq")
public class Skin implements Serializable {

    private static final long serialVersionUID = -5594061966806120720L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SKIN_SEQ")
    private Long skinSeq;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "DOMAIN_ID", referencedColumnName = "DOMAIN_ID")
    private Domain domain;

    @Column(name = "SKIN_NAME")
    private String skinName;

    @Column(name = "SKIN_SERVICE_NAME")
    private String skinServiceName;

    @Column(name = "SERVICE_TYPE")
    private String serviceType;

    @Column(name = "DEFAULT_YN", columnDefinition = "char")
    private String defaultYn;

    @Lob
    @Column(name = "SKIN_BODY")
    private String skinBody;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "STYLE_SEQ", referencedColumnName = "STYLE_SEQ")
    private Style style;

    @Column(name = "CREATE_YMDT")
    private String createYmdt;

    @Column(name = "CREATOR")
    private String creator;

    @Column(name = "MODIFIED_YMDT")
    private String modifiedYmdt;

    @Column(name = "MODIFIER")
    private String modifier;

    @Builder.Default
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "skin",
            cascade = {CascadeType.MERGE, CascadeType.REMOVE})
    private Set<SkinRel> skinRels = new LinkedHashSet<SkinRel>();

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
