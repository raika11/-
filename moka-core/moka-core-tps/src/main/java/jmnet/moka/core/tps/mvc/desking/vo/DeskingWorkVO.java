package jmnet.moka.core.tps.mvc.desking.vo;

import java.io.Serializable;
import javax.persistence.Column;
import org.apache.ibatis.type.Alias;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 작업자 편집기사 정보
 * 
 * @author ohtah
 *
 */
@Alias("DeskingWorkVO")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class DeskingWorkVO implements Serializable {

    private static final long serialVersionUID = -6662495708182386809L;

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

    @Column(name = "CONTENTS_ATTR")
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

    @Column(name = "PV_COUNT")
    private Integer pvCount;

    @Column(name = "UV_COUNT")
    private Integer uvCount;

    private Long componentSeq;

}
