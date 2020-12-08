package jmnet.moka.core.tps.mvc.sns.service;

import com.fasterxml.jackson.core.type.TypeReference;
import java.util.Map;
import jmnet.moka.common.utils.MapBuilder;
import jmnet.moka.core.common.rest.RestTemplateHelper;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.codemgt.entity.CodeMgt;
import jmnet.moka.core.tps.mvc.codemgt.service.CodeMgtService;
import jmnet.moka.core.tps.mvc.sns.dto.SnsDeleteDTO;
import jmnet.moka.core.tps.mvc.sns.dto.SnsPublishDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.sns.service
 * ClassName : SnsApiServiceImpl
 * Created : 2020-12-08 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-08 12:01
 */
@Slf4j
@Service
public class SnsApiServiceImpl implements SnsApiService {

    @Value("${sns.share.article-url}")
    private String articleUrl;

    @Value("${sns.facebook.api-url}")
    private String facebookApiUrl;

    @Value("${sns.facebook.feed-api-url}")
    private String facebookFeedUrl;

    @Value("${sns.facebook.page-id}")
    private String facebookPageId;

    @Value("${sns.facebook.token-code}")
    private String facebookTokenCode;

    @Value("${sns.twitter.api-url}")
    private String twitterApiUrl;

    @Value("${sns.twitter.consumer-key}")
    private String twitterConsumerKey;

    @Value("${sns.twitter.consumer-key-secret}")
    private String twitterConsumerKeySecret;

    @Value("${sns.twitter.access-token}")
    private String twitterAccessToken;

    @Value("${sns.twitter.access-token-secret}")
    private String twitterAccessTokenSecret;

    private final RestTemplateHelper restTemplateHelper;

    private final CodeMgtService codeMgtService;

    public SnsApiServiceImpl(RestTemplateHelper restTemplateHelper, CodeMgtService codeMgtService) {
        this.restTemplateHelper = restTemplateHelper;
        this.codeMgtService = codeMgtService;
    }



    @Override
    public void publish(SnsPublishDTO snsPublish)
            throws Exception {
        String articleServiceUrl = articleUrl + snsPublish.getTotalId();

        CodeMgt tokenCode = codeMgtService
                .findByDtlCd(facebookTokenCode)
                .orElseThrow(() -> new NoDataException("Not Found Facebook Token"));

        ResponseEntity<String> responseEntity = restTemplateHelper.post(facebookApiUrl, MapBuilder
                .getInstance()
                .add("access_token", tokenCode.getCdNm())
                .add("id", articleServiceUrl)
                .add("scrape", true)
                .getMultiValueMap());

        String articleFeedUrl = String.format(facebookFeedUrl, facebookPageId);

        ResponseEntity<String> content = restTemplateHelper.post(articleFeedUrl, MapBuilder
                .getInstance()
                .add("access_token", tokenCode.getCdNm())
                .add("message", snsPublish.getMessage())
                .add("link", articleServiceUrl)
                .getMultiValueMap());

        String response = content.getBody();
        Map<String, Object> map = ResourceMapper
                .getDefaultObjectMapper()
                .readValue(response, new TypeReference<Map<String, Object>>() {
                });

        log.debug(response);

    }

    @Override
    public void delete(SnsDeleteDTO snsDelete)
            throws Exception {

    }
}
