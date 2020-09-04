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
 * <pre>
 * 편집기사 Entity
 * 2020. 8. 5. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 8. 5. 오후 1:55:16
 * @author ssc
 */
@Entity
@Table(name = "WMS_DESKING")
@NamedQuery(name = "Desking.findAll", query = "SELECT w FROM Desking w")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@EqualsAndHashCode(exclude = "deskingRels")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "deskingSeq")
public class Desking implements Serializable {

    private static final long serialVersionUID = 5982313232717473659L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DESKING_SEQ")
    private Long deskingSeq;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "DATASET_SEQ", nullable = false, referencedColumnName = "DATASET_SEQ")
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

    @Column(name = "CREATOR")
    private String creator;

    @Column(name = "CREATE_YMDT")
    private String createYmdt;

    @Column(name = "DESKING_YMDT")
    private String deskingYmdt; // wms_desking_work.create_ymdt == wms_desking.desking_ymdt

    @Builder.Default
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "desking",
            cascade = {CascadeType.MERGE, CascadeType.REMOVE})
    private Set<DeskingRel> deskingRels = new LinkedHashSet<DeskingRel>();

    public void addDeskingRel(DeskingRel deskingRel) {
        if (deskingRel.getDesking() == null) {
            deskingRel.setDesking(this);
            return;
        }

        if (deskingRels.contains(deskingRel)) {
            return;
        } else {
            this.deskingRels.add(deskingRel);
        }
    }

    public void removeDeskingRel(DeskingRel deskingRel) {
        getDeskingRels().remove(deskingRel);
        deskingRel.setDesking(null);

    }
}
