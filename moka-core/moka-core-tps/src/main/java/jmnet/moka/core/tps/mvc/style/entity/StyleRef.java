package jmnet.moka.core.tps.mvc.style.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.MapsId;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


/**
 * The persistent class for the WMS_STYLE_REF database table.
 * 
 */
@Entity
@Table(name = "WMS_STYLE_REF")
@NamedQuery(name = "StyleRef.findAll", query = "SELECT s FROM StyleRef s")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@EqualsAndHashCode(exclude = "style")
@JsonInclude(Include.NON_NULL)
public class StyleRef implements Serializable {

    private static final long serialVersionUID = -130979201510271311L;

    @EmbeddedId
    @Builder.Default
    private StyleRefPK id = new StyleRefPK();

    @Lob
    @Column(name = "STYLE_BODY")
    private String styleBody;

    @MapsId("styleSeq")  // StyleRefPK.styleSeq 매핑
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "STYLE_SEQ", referencedColumnName = "STYLE_SEQ", nullable = false,
            insertable = false, updatable = false)
    private Style style;

    @Column(name = "CREATE_YMDT")
    private String createYmdt;

    @Column(name = "CREATOR")
    private String creator;

    @Column(name = "MODIFIED_YMDT")
    private String modifiedYmdt;

    @Column(name = "MODIFIER")
    private String modifier;

    // public void setStyle(Style style) {
    // if (style == null) {
    // return;
    // }
    // this.style = style;
    // this.style.addStyleRef(this);
    // }

}
