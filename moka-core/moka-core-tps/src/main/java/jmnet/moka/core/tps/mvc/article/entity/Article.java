package jmnet.moka.core.tps.mvc.article.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * The persistent class for the WMS_ARTICLE database table.
 * 
 */
@Entity
@Table(name = "WMS_ARTICLE")
@NamedQuery(name = "Article.findAll", query = "SELECT w FROM Article w")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Article implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "SEQ")
    private Long seq;

    @Column(name = "AD_SERVICE_YN", columnDefinition = "char")
    private String adServiceYn;

    @Column(name = "BYLINE_DEPT_NO")
    private Integer bylineDeptNo;

    @Column(name = "BYLINE_ID")
    private String bylineId;

    @Column(name = "BYLINE_NAME")
    private String bylineName;

    @Column(name = "CMNT_SERVICE_YN", columnDefinition = "char")
    private String cmntServiceYn;

    @Lob
    @Column(name = "CONTENTS_BODY")
    private String contentsBody;

    @Column(name = "CONTENTS_ID")
    private String contentsId;

    @Column(name = "CONTENTS_LEVEL")
    private String contentsLevel;

    @Column(name = "CONTENTS_STATUS", columnDefinition = "char")
    private String contentsStatus;

    @Lob
    @Column(name = "CONTENTS_TEXT")
    private String contentsText;

    @Column(name = "COPYRIGHT")
    private String copyright;

    @Column(name = "CREATE_YMDT")
    private String createYmdt;

    @Column(name = "CREATOR")
    private String creator;

    @Column(name = "DIST_CHANNEL")
    private String distChannel;

    @Column(name = "DIST_FLAG", columnDefinition = "tinyint", length = 4)
    private Integer distFlag;

    @Column(name = "DIST_YMDT")
    private String distYmdt;

    @Column(name = "DISTRIBUTOR")
    private String distributor;

    @Column(name = "EMBARGO_FLAG", columnDefinition = "tinyint", length = 4)
    private Integer embargoFlag;

    @Column(name = "EMBARGO_YMDT")
    private String embargoYmdt;

    @Column(name = "LANG")
    private String lang;

    @Column(name = "MEDIA_ID", columnDefinition = "char")
    private String mediaId;

    @Column(name = "MODIFIED_YMDT")
    private String modifiedYmdt;

    @Column(name = "MODIFIER")
    private String modifier;

    @Column(name = "ORG_CONTENTS_ID")
    private String orgContentsId;

    @Column(name = "ORG_TITLE")
    private String orgTitle;

    @Column(name = "REF_TYPES")
    private String refTypes;

    @Column(name = "REGIST_TYPE")
    private String registType;

    @Column(name = "SERVICE_TYPE")
    private String serviceType;

    @Column(name = "SERVICE_YN", columnDefinition = "char")
    private String serviceYn;

    @Column(name = "SOURCE")
    private String source;

    @Column(name = "SUBTITLE")
    private String subtitle;

    @Column(name = "THUMBNAIL_FILE_NAME")
    private String thumbnailFileName;

    @Column(name = "THUMBNAIL_FILE_PATH")
    private String thumbnailFilePath;

    @Column(name = "TITLE")
    private String title;

    @Column(name = "URGENCY")
    private String urgency;

    @Column(name = "WEIGHT")
    private String weight;
}
