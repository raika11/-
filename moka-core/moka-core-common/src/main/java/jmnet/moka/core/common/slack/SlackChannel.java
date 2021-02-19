package jmnet.moka.core.common.slack;

import lombok.Getter;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.core.common.slack
 * ClassName : SlackChannel
 * Created : 2021-02-19 019 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-19 019 오후 1:35
 */
@Getter
public enum SlackChannel {
    BULK_TEST("bulk_test"),
    NEWS_BULK("news_bulk");

    private final String channelName;
    SlackChannel(String channelName) {
        this.channelName = channelName;
    }
}
