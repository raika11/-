package jmnet.moka.core.tps.mvc.style.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * The primary key class for the WMS_STYLE_REF database table.
 * 
 */
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class StyleRefPK implements Serializable {

    private static final long serialVersionUID = 1668564975951616274L;

    @Column(name = "STYLE_SEQ", insertable = false, updatable = false)
    private Long styleSeq;

    @Column(name = "REF_TYPE")
    private String refType;

}
