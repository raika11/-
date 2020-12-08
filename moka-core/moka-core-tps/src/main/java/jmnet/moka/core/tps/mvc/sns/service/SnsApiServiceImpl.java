package jmnet.moka.core.tps.mvc.sns.service;

import jmnet.moka.core.tps.mvc.sns.dto.SnsDeleteDTO;
import jmnet.moka.core.tps.mvc.sns.dto.SnsPublishDTO;
import org.springframework.beans.factory.annotation.Value;
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



    @Override
    public void publish(SnsPublishDTO snsPublish) {
        
    }

    @Override
    public void delete(SnsDeleteDTO snsDelete) {

    }
}
