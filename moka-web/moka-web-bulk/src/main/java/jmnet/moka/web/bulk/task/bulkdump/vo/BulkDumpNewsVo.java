package jmnet.moka.web.bulk.task.bulkdump.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.task.bulkdump.vo
 * ClassName : BulkDumpNewsVo
 * Created : 2020-12-30 030 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-30 030 오전 11:01
 */
@Getter
@Setter
public class BulkDumpNewsVo implements Serializable {
    private static final long serialVersionUID = -3438013357692053677L;

    @JsonProperty(value = "CONTENT_ID")
    private String contentId;

    @JsonProperty(value = "DEP")
    private String dep;

    @JsonProperty(value = "ORG_SOURCE_CODE")
    private String orgSourceCode;

    @JsonProperty(value = "CONTCODE1")
    private String contCode1;

    @JsonProperty(value = "CONTCODE2")
    private String contCode2;

    @JsonProperty(value = "CONTCODE3")
    private String contCode3;

    @JsonProperty(value = "TITLE")
    private String title;

    @JsonProperty(value = "ART_REPORTER")
    private String artReporter;

    @JsonProperty(value = "BLOG_REPORTER")
    private String blogReporter;

    @JsonProperty(value = "CONTENT")
    private String content;

    @JsonProperty(value = "JOINSID")
    private String joinsId;

    @JsonProperty(value = "SERVICEURL")
    private String serviceUrl;

    @JsonProperty(value = "ADDR")
    private String addr;

    @JsonProperty(value = "LAT")
    private String lat;

    @JsonProperty(value = "LNG")
    private String lng;

    @JsonProperty(value = "MYUN")
    private String myun;

    @JsonProperty(value = "PAN")
    private String pan;

    @JsonProperty(value = "CONTENT_TYPE")
    private String contentType;

    @JsonProperty(value = "IMAGEBULK_FLAG")
    private String imageBulkFlag;

    @JsonProperty(value = "SUB_TITLE")
    private String subTitle;

    @JsonProperty(value = "EMAIL")
    private String email;

    @JsonProperty(value = "BULK_SITE")
    private String bulkSite;

    @JsonProperty(value = "DEL_SITE")
    private String delSite;

    @JsonProperty(value = "PRESS_CATEGORY")
    private String pressCategory;

    @JsonProperty(value = "FRST_CODE")
    private String frstCode;

    @JsonProperty(value = "PRESS_DATE")
    private String pressDate;

    @JsonProperty(value = "PRESS_POSITION")
    private String pressPosition;

    @JsonProperty(value = "BREAKING_NEWS")
    private String breakingNews;

    @JsonProperty(value = "BREAKING_NEWS_CNT")
    private String breakingNewsCnt;

    @JsonProperty(value = "ON_THE_SCENE_REPORTING")
    private String onTheSceneReporting;
}
