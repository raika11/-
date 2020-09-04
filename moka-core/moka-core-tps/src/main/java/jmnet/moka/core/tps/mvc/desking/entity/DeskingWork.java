package jmnet.moka.core.tps.mvc.desking.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * The persistent class for the WMS_DESKING_WORK database table.
 * 
 */
@Entity
@Table(name = "WMS_DESKING_WORK")
@NamedQuery(name = "DeskingWork.findAll", query = "SELECT w FROM DeskingWork w")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@JsonInclude(Include.NON_NULL)
public class DeskingWork implements Serializable, Cloneable {

    private static final long serialVersionUID = 7423222573590183603L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ")
    private Long seq;

    @Column(name = "DESKING_SEQ")
    private Long deskingSeq;

    @Column(name = "CREATOR")
    private String creator;

    @Column(name = "DATASET_SEQ")
    private Long datasetSeq;

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

    @Column(name = "CREATE_YMDT")
    private String createYmdt;

    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
