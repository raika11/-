package jmnet.moka.core.tps.mvc.component.entity;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import com.fasterxml.jackson.core.type.TypeReference;
import jmnet.moka.core.tps.mvc.ad.entity.Ad;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


/**
 * The persistent class for the TB_WMS_COMPONENT_AD database table.
 * 
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_WMS_COMPONENT_AD")
@NamedQuery(name = "ComponentAd.findAll", query = "SELECT w FROM ComponentAd w")
public class ComponentAd implements Serializable {

    private static final long serialVersionUID = -7273958000859682529L;

    public static final Type TYPE = new TypeReference<List<ComponentAd>>() {
    }.getType();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ")
    private Long seq;

    @Column(name = "COMPONENT_SEQ", nullable = false)
    private Long componentSeq;

    @ManyToOne
    @JoinColumn(name = "AD_SEQ", referencedColumnName = "AD_SEQ", nullable = false)
    private Ad ad;

    @Column(name = "LIST_PARAGRAPH", nullable = false)
    private Integer listParagraph;

    //    @Override
    //    public boolean equals(Object o) {
    //        if (o == null) {
    //            return false;
    //        }
    //        
    //        if (o instanceof ComponentAd == false) {
    //            return false;
    //        }
    //        
    //        ComponentAd other = (ComponentAd) o;
    //        if (other.getAd() == null) {
    //            return false;
    //        }
    //        if (other.getSeq() != this.seq
    //                || other.getComponentSeq() != this.componentSeq
    //                || other.getListParagraph() != this.listParagraph
    //                || other.getAd().getAdSeq() != this.ad.getAdSeq()) {
    //            return false;
    //        }
    //        return true;
    //    }
    //    
    //    @Override
    //    public int hashCode() {
    //        StringBuffer str = new StringBuffer(128);
    //        str.append(seq);
    //        str.append(componentSeq);
    //        str.append(ad.getAdSeq());
    //        str.append(listParagraph);
    //        return str.hashCode();
    //    }
}
