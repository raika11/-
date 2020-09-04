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
 * The persistent class for the WMS_DESKING_REL_HIST database table.
 * 
 */
@Entity
@Table(name = "WMS_DESKING_REL_HIST")
@NamedQuery(name = "DeskingRelHist.findAll", query = "SELECT w FROM DeskingRelHist w")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@EqualsAndHashCode(exclude = "deskingHist")
public class DeskingRelHist implements Serializable {

    private static final long serialVersionUID = 2787634670506376330L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ")
    private Long seq;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "HIST_SEQ", referencedColumnName = "HIST_SEQ", nullable = false)
    private DeskingHist deskingHist;

    @Column(name = "DESKING_SEQ")
    private Long deskingSeq;

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

    public void setDeskingHist(DeskingHist deskingHist) {
        if (deskingHist == null) {
            return;
        }
        this.deskingHist = deskingHist;
        this.deskingHist.addDeskingRelHist(this);
    }

}
