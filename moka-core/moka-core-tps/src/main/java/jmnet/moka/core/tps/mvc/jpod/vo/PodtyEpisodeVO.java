package jmnet.moka.core.tps.mvc.jpod.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
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
 * ClassName : PodtyEpisodeVO
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
public class PodtyEpisodeVO {

    /**
     * 채널 ID
     */
    @JsonProperty("cast_srl")
    private String castSrl;

    /**
     * 에피소드 ID
     */
    @JsonProperty("episode_srl")
    private String episodeSrl;

    /**
     * 아이템명
     */
    @JsonProperty("item_title")
    private String title;

    /**
     * 작성자
     */
    @JsonProperty("item_author")
    private String author;

    /**
     * summary
     */
    @JsonProperty("item_summary")
    private String summary;

    /**
     * 출고일시
     */
    @JsonProperty("item_pub_date")
    private Long itemPubDt;

    /**
     * 재생시간
     */
    @JsonProperty("item_duration")
    private String duration;

    /**
     * 파일 유형
     */
    @JsonProperty("item_type")
    private String type;

    /**
     * 아이템 길이
     */
    @JsonProperty("item_length")
    private String length;

    /**
     * 생성일시
     */
    @JsonProperty("crt_dt")
    private Long crtDt;


    /**
     * 공유 url
     */
    @JsonProperty("share_url")
    private String shareUrl;



    /**
     * 파일 url
     */
    @JsonProperty("item_enclosure")
    private String enclosure;
}
