package jmnet.moka.web.push.support.httpclient;

import java.util.concurrent.TimeUnit;
import jmnet.moka.web.push.mvc.sender.entity.PushApp;
import okhttp3.ConnectionPool;
import okhttp3.OkHttpClient;

/**
 * <pre>
 * Http Client 생성 Builder
 * Project : moka
 * Package : jmnet.moka.web.push.support.httpclient
 * ClassName : PushHttpClientBuilder
 * Created : 2021-02-09 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-09 17:32
 */
public class PushHttpClientBuilder {

    private PushApp pushApp;
    private OkHttpClient.Builder builder;
    private ConnectionPool connectionPool;

    public static OkHttpClient.Builder createDefaultOkHttpClientBuilder() {
        OkHttpClient.Builder builder = new OkHttpClient.Builder();
        builder
                .connectTimeout(10, TimeUnit.SECONDS)
                .writeTimeout(10, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS);
        builder.connectionPool(new ConnectionPool(10, 10, TimeUnit.MINUTES));

        return builder;
    }

    public PushHttpClientBuilder setPushApp(PushApp pushApp) {
        this.pushApp = pushApp;
        return this;
    }

    public HttpPushClient build() {
        synchronized (PushHttpClientBuilder.class) {
            if (builder == null) {
                builder = createDefaultOkHttpClientBuilder();
            }

            if (connectionPool != null) {
                builder.connectionPool(connectionPool);
            }
        }
        return new HttpPushFcmClient(pushApp.getFcmKey());
    }
}
