package jmnet.moka.core.common.brightcove;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

/**
 * <pre>
 * 브라이트코브 관련 설정 정보
 * Project : moka
 * Package : jmnet.moka.core.common.brightcove
 * ClassName : BrightcoveProperties
 * Created : 2021-02-17 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-17 12:17
 */
@Configuration
@PropertySource("classpath:bright_cove.properties")
@Data
public class BrightcoveProperties {

    @Value("${brightcove.account}")
    private String account;
    @Value("${brightcove.api-key}")
    private String apiKey;
    @Value("${brightcove.client-id}")
    private String clientId;
    @Value("${brightcove.client-secret}")
    private String clientSecret;
    @Value("${brightcove.address}")
    private String baseUrl;
    @Value("${brightcove.api.token}")
    private String tokenApi;
    @Value("${brightcove.cms.api.base-url}")
    private String cmsBaseUrl;

    @Value("${brightcove.api.bcovlive-url}")
    private String bcovliveUrl;

    @Value("${brightcove.jpod.folder-id}")
    private String jpodFolderId;

    @Value("${brightcove.job-id.channel1}")
    private String channel1JobId;

    @Value("${brightcove.job-id.channel2}")
    private String channel2JobId;

    @Value("${brightcove.cms.api.ingest-url}")
    private String cmsIngestUrl;

    @Value("${brightcove.ovp.limit}")
    private int ovpDefaultLimit;

    @Value("${brightcove.ovp.size}")
    private String ovpDefaultSize;

    @Value("${brightcove.ovp.folder-id}")
    private String ovpFolderId;

    @Value("${brightcove.ovp.before-day}")
    private int ovpBeforeDay;

    @Value("${brightcove.ovp.sort}")
    private String ovpDefaultSort;
}
