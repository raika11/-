package jmnet.moka.core.tps.mvc.article.vo;

import java.io.Serializable;
import javax.persistence.Column;
import org.apache.ibatis.type.Alias;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("articleVO")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ArticleVO implements Serializable {
    private static final long serialVersionUID = -2341035571977761807L;

    @Column(name = "SEQ")
    private Long seq;

    @Column(name = "AD_SERVICE_YN")
    private String adServiceYn;

    @Column(name = "BYLINE_DEPT_NO")
    private Integer bylineDeptNo;

    @Column(name = "BYLINE_ID")
    private String bylineId;

    @Column(name = "BYLINE_NAME")
    private String bylineName;

    @Column(name = "CMNT_SERVICE_YN")
    private String cmntServiceYn;

    @Column(name = "CONTENTS_BODY")
    private String contentsBody;

    @Column(name = "CONTENTS_ID")
    private String contentsId;

    @Column(name = "CONTENTS_LEVEL")
    private String contentsLevel;

    @Column(name = "CONTENTS_STATUS")
    private String contentsStatus;

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

    @Column(name = "DIST_FLAG")
    private Integer distFlag;

    @Column(name = "DIST_YMDT")
    private String distYmdt;

    @Column(name = "DISTRIBUTOR")
    private String distributor;

    @Column(name = "EMBARGO_FLAG")
    private Integer embargoFlag;

    @Column(name = "EMBARGO_YMDT")
    private String embargoYmdt;

    @Column(name = "LANG")
    private String lang;

    @Column(name = "MEDIA_ID")
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

    @Column(name = "SERVICE_YN")
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
