package jmnet.moka.core.tps.mvc.desking.entity;

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
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


/**
 * <pre>
 * 관련편집기사 Entity
 * 2020. 8. 5. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 8. 5. 오후 1:54:45
 * @author ssc
 */
@Entity
@Table(name = "WMS_DESKING_REL")
@NamedQuery(name = "DeskingRel.findAll", query = "SELECT d FROM DeskingRel d")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@EqualsAndHashCode(exclude = "desking")
public class DeskingRel implements Serializable {

    private static final long serialVersionUID = 1790930488642328899L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DESKING_REL_SEQ")
    private Long deskingRelSeq;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "DESKING_SEQ", referencedColumnName = "DESKING_SEQ", nullable = false)
    private Desking desking;

    @Column(name = "CONTENTS_ID")
    private String contentsId;

    @Column(name = "REL_CONTENTS_ID")
    private String relContentsId;

    @Column(name = "REL_ORDER")
    private int relOrder;

    @Column(name = "REL_TITLE")
    private String relTitle;

    @Column(name = "CREATE_YMDT")
    private String createYmdt;

    @Column(name = "CREATOR")
    private String creator;

    public void setDesking(Desking desking) {
        if (desking == null) {
            return;
        }
        this.desking = desking;
        this.desking.addDeskingRel(this);
    }
}
