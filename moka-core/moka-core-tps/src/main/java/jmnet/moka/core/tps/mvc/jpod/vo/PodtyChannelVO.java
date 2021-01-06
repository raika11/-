package jmnet.moka.core.tps.mvc.jpod.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
@Getter
@Setter
@Builder
public class PodtyChannelVO {

    /**
     * 채널 ID
     */
    @JsonProperty("cast_srl")
    private String castSrl;

    /**
     * 채널 명
     */
    @JsonProperty("cast_name")
    private String castName;

    /**
     * 채널 명
     */
    @JsonProperty("artist_name")
    private String artistName;

    /**
     * 채널 명
     */
    @JsonProperty("keywords")
    private String keywords;

    /**
     * 채널 명
     */
    @JsonProperty("summary")
    private String summary;

    /**
     * 채널 명
     */
    @JsonProperty("crt_dt")
    private Long crtDt;

    /**
     * 채널 명
     */
    @JsonProperty("share_url")
    private String shareUrl;

    /**
     * 채널 명
     */
    @JsonProperty("simpod_category")
    private String simpodCategory;

    /**
     * 채널 명
     */
    @JsonProperty("img_urls")
    private Map<String, String> imgUrlMap;

    /**
     * 채널 명
     */
    @JsonProperty("track_cnt")
    private Integer trackCnt;
}
