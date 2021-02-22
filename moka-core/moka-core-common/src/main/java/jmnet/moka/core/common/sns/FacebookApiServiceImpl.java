package jmnet.moka.core.common.sns;

import com.fasterxml.jackson.core.type.TypeReference;
import java.util.Map;
import jmnet.moka.common.utils.MapBuilder;
import jmnet.moka.core.common.rest.RestTemplateHelper;
import jmnet.moka.core.common.util.ResourceMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;

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
public class FacebookApiServiceImpl implements SnsApiService {

    @Value("${sns.share.article-url}")
    private String articleUrl;

    @Value("${sns.facebook.api-url}")
    private String facebookApiUrl;

    @Value("${sns.facebook.feed-api-url}")
    private String facebookFeedUrl;

    @Value("${sns.facebook.page-id}")
    private String facebookPageId;

    @Autowired
    private RestTemplateHelper restTemplateHelper;

    @Override
    public Map<String, Object> publish(SnsPublishDTO snsPublish)
            throws Exception {
        String articleServiceUrl = articleUrl + snsPublish.getTotalId();

        ResponseEntity<String> responseEntity = restTemplateHelper.post(facebookApiUrl, MapBuilder
                .getInstance()
                .add("access_token", snsPublish.getTokenCode())
                .add("id", articleServiceUrl)
                .add("scrape", true)
                .getMultiValueMap());

        String articleFeedUrl = String.format(facebookFeedUrl, facebookPageId);

        ResponseEntity<String> content = restTemplateHelper.post(articleFeedUrl, MapBuilder
                .getInstance()
                .add("access_token", snsPublish.getTokenCode())
                .add("message", snsPublish.getMessage())
                .add("link", articleServiceUrl)
                .getMultiValueMap());

        String response = content.getBody();
        Map<String, Object> map = ResourceMapper
                .getDefaultObjectMapper()
                .readValue(response, new TypeReference<Map<String, Object>>() {
                });

        return map;

    }

    @Override
    public Map<String, Object> delete(SnsDeleteDTO snsDelete)
            throws Exception {

        String url = new StringBuilder(facebookApiUrl)
                .append("/")
                .append(snsDelete.getSnsId())
                .append("?access_token=")
                .append(snsDelete.getTokenCode())
                .toString();
        ResponseEntity<String> responseEntity = restTemplateHelper.delete(url);


        String response = responseEntity.getBody();
        Map<String, Object> map = ResourceMapper
                .getDefaultObjectMapper()
                .readValue(response, new TypeReference<Map<String, Object>>() {
                });

        return map;
    }
}
