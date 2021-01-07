package jmnet.moka.core.tps.mvc.jpod.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Date;
import java.util.Map;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.jpod.vo
 * ClassName : PodtyChannelVO
 * Created : 2021-01-09 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-09 17:37
 */
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PodtyChannelVO {

    /**
     * 채널 ID
     */

    private String castSrl;

    /**
     * 채널 명
     */

    private String castName;

    /**
     * 채널 명
     */

    private String artistName;

    /**
     * 채널 명
     */

    private String keywords;

    /**
     * 채널 명
     */

    private String summary;

    /**
     * 채널 명
     */

    private Long crtDt;

    /**
     * 채널 명
     */

    private String shareUrl;

    /**
     * 채널 명
     */

    private String simpodCategory;

    /**
     * 채널 명
     */

    private Map<String, String> imgUrlMap;

    /**
     * 채널 명
     */

    private Integer trackCnt;

    @JsonProperty("cast_srl")
    public void setCastSrl(String castSrl) {
        this.castSrl = castSrl;
    }

    @JsonProperty("cast_name")
    public void setCastName(String castName) {
        this.castName = castName;
    }

    @JsonProperty("artist_name")
    public void setArtistName(String artistName) {
        this.artistName = artistName;
    }

    @JsonProperty("keywords")
    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }

    @JsonProperty("summary")
    public void setSummary(String summary) {
        this.summary = summary;
    }

    @JsonProperty("crt_dt")
    public void setCrtDt(Long crtDt) {
        this.crtDt = crtDt;
    }

    @JsonProperty("share_url")
    public void setShareUrl(String shareUrl) {
        this.shareUrl = shareUrl;
    }

    @JsonProperty("simpod_category")
    public void setSimpodCategory(String simpodCategory) {
        this.simpodCategory = simpodCategory;
    }

    @JsonProperty("img_urls")
    public void setImgUrlMap(Map<String, String> imgUrlMap) {
        this.imgUrlMap = imgUrlMap;
    }

    @JsonProperty("track_cnt")
    public void setTrackCnt(Integer trackCnt) {
        this.trackCnt = trackCnt;
    }


    @JsonProperty("castSrl")
    public String getCastSrl() {
        return castSrl;
    }

    @JsonProperty("getCastName")
    public String getCastName() {
        return castName;
    }

    @JsonProperty("artistName")
    public String getArtistName() {
        return artistName;
    }

    @JsonProperty("keywords")
    public String getKeywords() {
        return keywords;
    }

    @JsonProperty("summary")
    public String getSummary() {
        return summary;
    }

    @JsonProperty("crtDt")
    @DTODateTimeFormat
    public Date getCrtDt() {
        return new Date(crtDt);
    }

    @JsonProperty("shareUrl")
    public String getShareUrl() {
        return shareUrl;
    }

    @JsonProperty("simpodCategory")
    public String getSimpodCategory() {
        return simpodCategory;
    }

    @JsonProperty("imgUrlMap")
    public Map<String, String> getImgUrlMap() {
        return imgUrlMap;
    }

    @JsonProperty("trackCnt")
    public Integer getTrackCnt() {
        return trackCnt;
    }
}
