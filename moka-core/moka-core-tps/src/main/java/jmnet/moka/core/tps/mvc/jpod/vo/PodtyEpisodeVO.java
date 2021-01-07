package jmnet.moka.core.tps.mvc.jpod.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Date;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.jpod.vo
 * ClassName : PodtyEpisodeVO
 * Created : 2021-01-09 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-09 17:37
 */
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PodtyEpisodeVO {

    /**
     * 채널 ID
     */
    @Getter
    private String castSrl;

    /**
     * 에피소드 ID
     */
    @Getter
    private String episodeSrl;

    /**
     * 아이템명
     */
    @Getter
    private String title;

    /**
     * 작성자
     */
    @Getter
    private String author;

    /**
     * summary
     */
    @Getter
    private String summary;

    /**
     * 출고일시
     */
    @Getter
    private Long itemPubDt;

    /**
     * 재생시간
     */
    @Getter
    private String duration;

    /**
     * 파일 유형
     */
    @Getter
    private String type;

    /**
     * 아이템 길이
     */
    private String length;

    /**
     * 생성일시
     */
    @Getter
    private Long crtDt;


    /**
     * 공유 url
     */
    @Getter
    private String shareUrl;



    /**
     * 파일 url
     */
    private String enclosure;

    @JsonProperty("cast_srl")
    public void setCastSrl(String castSrl) {
        this.castSrl = castSrl;
    }

    @JsonProperty("episode_srl")
    public void setEpisodeSrl(String episodeSrl) {
        this.episodeSrl = episodeSrl;
    }

    @JsonProperty("item_title")
    public void setTitle(String title) {
        this.title = title;
    }

    @JsonProperty("item_author")
    public void setAuthor(String author) {
        this.author = author;
    }

    @JsonProperty("item_summary")
    public void setSummary(String summary) {
        this.summary = summary;
    }

    @JsonProperty("item_pub_date")
    public void setItemPubDt(Long itemPubDt) {
        this.itemPubDt = itemPubDt;
    }

    @JsonProperty("item_duration")
    public void setDuration(String duration) {
        this.duration = duration;
    }

    @JsonProperty("item_type")
    public void setType(String type) {
        this.type = type;
    }

    @JsonProperty("item_length")
    public void setLength(String length) {
        this.length = length;
    }

    @JsonProperty("crt_dt")
    public void setCrtDt(Long crtDt) {
        this.crtDt = crtDt;
    }

    @JsonProperty("share_url")
    public void setShareUrl(String shareUrl) {
        this.shareUrl = shareUrl;
    }

    @JsonProperty("item_enclosure")
    public void setEnclosure(String enclosure) {
        this.enclosure = enclosure;
    }

    @JsonProperty("castSrl")
    public String getCastSrl() {
        return castSrl;
    }

    @JsonProperty("episodeSrl")
    public String getEpisodeSrl() {
        return episodeSrl;
    }

    @JsonProperty("title")
    public String getTitle() {
        return title;
    }

    @JsonProperty("author")
    public String getAuthor() {
        return author;
    }

    @JsonProperty("summary")
    public String getSummary() {
        return summary;
    }

    @JsonProperty("itemPubDt")
    @DTODateTimeFormat
    public Date getItemPubDt() {
        return new Date(itemPubDt);
    }

    @JsonProperty("duration")
    public String getDuration() {
        return duration;
    }

    @JsonProperty("type")
    public String getType() {
        return type;
    }

    @JsonProperty("length")
    public String getLength() {
        return length;
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

    @JsonProperty("enclosure")
    public String getEnclosure() {
        return enclosure;
    }
}
