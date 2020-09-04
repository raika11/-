package jmnet.moka.core.tps.mvc.style.entity;

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
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


/**
 * The persistent class for the WMS_STYLE database table.
 * 
 */
@Entity
@Table(name = "WMS_STYLE")
@NamedQuery(name = "Style.findAll", query = "SELECT s FROM Style s")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@EqualsAndHashCode(exclude = "styleRefs")
@JsonInclude(Include.NON_NULL)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "styleSeq")
public class Style implements Serializable {

    private static final long serialVersionUID = -4235625173896860423L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "STYLE_SEQ")
    private Long styleSeq;

    @Column(name = "STYLE_NAME")
    private String styleName;

    @Column(name = "CREATE_YMDT")
    private String createYmdt;

    @Column(name = "CREATOR")
    private String creator;

    @Column(name = "MODIFIED_YMDT")
    private String modifiedYmdt;

    @Column(name = "MODIFIER")
    private String modifier;

    @Builder.Default
    @OneToMany(fetch = FetchType.EAGER, mappedBy = "style",
            cascade = {CascadeType.MERGE, CascadeType.REMOVE})
    private Set<StyleRef> styleRefs = new LinkedHashSet<StyleRef>();

    // public void setStyleRefs(Set<StyleRef> styleRefs) {
    // this.styleRefs = styleRefs;
    // if (this.styleRefs != null && this.styleRefs.size() > 0) {
    // for (StyleRef c : styleRefs) {
    // c.setCreateYmdt(this.createYmdt);
    // c.setCreator(this.creator);
    // c.setStyle(this);
    // }
    // }
    // }

    /**
     * 관련소재 추가
     *
     * @param ref 관련소재
     */
    public void addStyleRef(StyleRef ref) {
        if (ref.getStyle() == null) {
            ref.setStyle(this);
            return;
        }

        if (styleRefs.contains(ref)) {
            return;
        } else {
            this.styleRefs.add(ref);
        }
    }

    /**
     * 관련소재목록에서 type이 동일한것이 있는지 검사한다.
     *
     * @param ref 관련소재
     * @return 동일한게 있으면 true
     */
    public boolean isEqualRef(StyleRef ref) {
        Optional<StyleRef> find = styleRefs.stream()
                .filter(r -> r.getId().getRefType().equals(ref.getId().getRefType())).findFirst();
        if (find.isPresent())
            return true;
        return false;
    }
}
