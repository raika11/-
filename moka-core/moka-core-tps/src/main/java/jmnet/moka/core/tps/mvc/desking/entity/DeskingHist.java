package jmnet.moka.core.tps.mvc.desking.entity;

import java.io.Serializable;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jmnet.moka.core.tps.mvc.dataset.entity.Dataset;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


/**
 * The persistent class for the WMS_DESKING_HIST database table.
 * 
 */
@Entity
@Table(name = "WMS_DESKING_HIST")
@NamedQuery(name = "DesingkHist.findAll", query = "SELECT w FROM DeskingHist w")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@EqualsAndHashCode(exclude = "deskingRelHists")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "histSeq")
public class DeskingHist implements Serializable {

    private static final long serialVersionUID = -4303410204561406329L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "HIST_SEQ")
    private Long histSeq;

    @Column(name = "DESKING_SEQ")
    private Long deskingSeq;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "DATASET_SEQ", nullable = true, referencedColumnName = "DATASET_SEQ")
    private Dataset dataset;

    @Column(name = "EDITION_SEQ")
    private Long editionSeq;

    @Column(name = "CONTENTS_ID")
    private String contentsId;

    @Column(name = "CONTENTS_ATTR", columnDefinition = "char")
    private String contentsAttr;

    @Column(name = "LANG")
    private String lang;

    @Column(name = "DIST_YMDT")
    private String distYmdt;

    @Column(name = "CONTENTS_ORDER")
    private Integer contentsOrder;

    @Column(name = "TITLE")
    private String title;

    @Column(name = "MOBILE_TITLE")
    private String mobileTitle;

    @Column(name = "SUBTITLE")
    private String subtitle;

    @Column(name = "NAMEPLATE")
    private String nameplate;

    @Column(name = "TITLE_PREFIX")
    private String titlePrefix;

    @Column(name = "BODY_HEAD")
    private String bodyHead;

    @Column(name = "LINK_URL")
    private String linkUrl;

    @Column(name = "LINK_TARGET")
    private String linkTarget;

    @Column(name = "MORE_URL")
    private String moreUrl;

    @Column(name = "MORE_TARGET")
    private String moreTarget;

    @Column(name = "THUMBNAIL_FILE_NAME")
    private String thumbnailFileName;

    @Column(name = "THUMBNAIL_SIZE")
    private Integer thumbnailSize;

    @Column(name = "THUMBNAIL_WIDTH")
    private Integer thumbnailWidth;

    @Column(name = "THUMBNAIL_HEIGHT")
    private Integer thumbnailHeight;

    @Column(name = "DESKING_YMDT")
    private String deskingYmdt;   // wms_desking.deskingYmdt == wms_desking_hist.deskingYmdt(편집시간)

    @Column(name = "CREATE_YMDT")
    private String createYmdt;  // 편집히스토리에 등록된 시간(전송시간) wms_desking.createYmdt ==
                                // wms_desking_hist.createYmdt

    @Column(name = "CREATOR")
    private String creator;

    @Builder.Default
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "deskingHist",
            cascade = {CascadeType.MERGE, CascadeType.REMOVE})
    private Set<DeskingRelHist> deskingRelHists = new LinkedHashSet<DeskingRelHist>();

    public void addDeskingRelHist(DeskingRelHist deskingRelHist) {
        if (deskingRelHist.getDeskingHist() == null) {
            deskingRelHist.setDeskingHist(this);
            return;
        }

        if (deskingRelHists.contains(deskingRelHist)) {
            return;
        } else {
            this.deskingRelHists.add(deskingRelHist);
        }
    }

    public void removeDeskingRelHist(DeskingRelHist deskingRelHist) {
        getDeskingRelHists().remove(deskingRelHist);
        deskingRelHist.setDeskingHist(null);

    }

}
