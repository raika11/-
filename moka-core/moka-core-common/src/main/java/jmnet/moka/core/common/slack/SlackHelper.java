package jmnet.moka.core.common.slack;

import jmnet.moka.common.utils.McpString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.core.common.slack
 * ClassName : SlackHalper
 * Created : 2021-02-19 019 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-19 019 오후 1:32
 */
public class SlackHelper {
    private static final String URL = "http://buzz.joins.com/send/devmessage/";
    private static final String PARAM_TITLE = "tit";
    private static final String PARAM_SUBTITLE = "sub";
    private static final String PARAM_MESSAGE = "txt";

    @Autowired
    RestTemplate restTemplate;
    /**
     * <pre>
     * Slack channel에 Message를 보낸다.
     * </pre>
     *
     * @param channel   채널 정보 ex) SlackChannel.BULK_TEST
     * @param message   메세지 내용
     * @return ResponseEntity
     */
    public boolean sendMessage( SlackChannel channel, String message) {
        return sendMessage( channel, message, null, null );
    }

    /**
     * <pre>
     * Slack channel에 Message를 보낸다.
     * </pre>
     *
     * @param channel   채널 정보 ex) SlackChannel.BULK_TEST
     * @param message   메세지 내용
     * @param title     메세지 제목
     * @return ResponseEntity
     */
    public boolean sendMessage( SlackChannel channel, String message, String title) {
        return sendMessage( channel, message, title, null );
    }

    /**
     * <pre>
     * Slack channel에 Message를 보낸다.
     * </pre>
     *
     * @param channel   채널 정보 ex) SlackChannel.BULK_TEST
     * @param message   메세지 내용
     * @param title     메세지 제목
     * @param subTitle  메세지 부제목
     * @return ResponseEntity
     */
    public boolean sendMessage( SlackChannel channel, String message, String title, String subTitle ) {
        // http://buzz.joins.com/send/devmessage/news_bulk?tit=제목&sub=부제목&txt=내용
        final String channelUrl = channel.getChannelName();
        if( McpString.isNullOrEmpty(channelUrl) || McpString.isNullOrEmpty(message) )
            return false;

        UriComponentsBuilder builder = UriComponentsBuilder.newInstance();
        builder.path(channelUrl);
        if( !McpString.isNullOrEmpty(title))
            builder.queryParam(PARAM_TITLE, title);
        if( !McpString.isNullOrEmpty(subTitle))
            builder.queryParam(PARAM_SUBTITLE, subTitle);
        builder.queryParam(PARAM_MESSAGE, message);
        final String url = URL + builder.build().encode().toString();

        //ResponseEntity<String> response = restTemplateHelper.get(url);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, new HttpEntity<>(new HttpHeaders()), String.class);
        return response.getStatusCode() == HttpStatus.OK;
    }
}
