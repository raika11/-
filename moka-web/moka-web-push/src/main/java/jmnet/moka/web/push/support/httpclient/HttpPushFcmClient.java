package jmnet.moka.web.push.support.httpclient;

import java.io.IOException;
import java.nio.charset.Charset;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.web.push.config.PropertyHolder;
import jmnet.moka.web.push.mvc.sender.entity.MobPushToken;
import jmnet.moka.web.push.support.message.FcmMessage;
import jmnet.moka.web.push.support.message.PushHttpResponse;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okio.BufferedSink;
import org.apache.http.HttpHeaders;
import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * <pre>
 * FCM 전송 Http Client
 * Project : moka
 * Package : jmnet.moka.web.push.support.httpclient
 * ClassName : HttpPushFcmClient
 * Created : 2021-02-09 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-09 17:32
 */
public class HttpPushFcmClient implements HttpPushClient {

    @Autowired
    private PropertyHolder propertyHolder;

    private static final MediaType mediaType = MediaType.parse("application/json");
    protected final OkHttpClient client;
    private String apiKey;

    public HttpPushFcmClient(String apiKey) {
        this.apiKey = apiKey;
        client = PushHttpClientBuilder
                .createDefaultOkHttpClientBuilder()
                .build();
    }


    public PushHttpResponse push(FcmMessage fcmMessage)
            throws Exception {
        final Request request = buildRequest(fcmMessage);
        Response response = null;

        try {
            response = client
                    .newCall(request)
                    .execute();
            return parseResponse(null, fcmMessage, response);
        } catch (Throwable t) {
            return new PushHttpResponse(null, -1, null, t.getMessage(), null);
        } finally {
            if (response != null) {
                response
                        .body()
                        .close();
            }
        }
    }

    public void push(MobPushToken pushToken, FcmMessage fcmMessage, PushHttpResponseListener nrl)
            throws IOException {
        final Request request = buildRequest(fcmMessage);

        client
                .newCall(request)
                .enqueue(new Callback() {
                    @Override
                    public void onFailure(Call call, IOException e) {
                        nrl.onFailure(new PushHttpResponse(pushToken, -1, null, e.getMessage(), null));
                    }

                    @Override
                    public void onResponse(Call call, Response response)
                            throws IOException {

                        PushHttpResponse pushResult = null;

                        try {
                            pushResult = parseResponse(pushToken, fcmMessage, response);
                        } catch (Throwable t) {
                            nrl.onFailure(new PushHttpResponse(pushToken, -1, response
                                    .headers()
                                    .toMultimap(), t.getMessage(), null));
                            return;
                        } finally {
                            if (response != null) {
                                response
                                        .body()
                                        .close();
                            }
                        }

                        if (HttpStatus.SC_OK == response.code()) {
                            nrl.onSuccess(pushResult);
                        } else {
                            nrl.onFailure(pushResult);
                        }
                    }
                });

    }

    protected final Request buildRequest(FcmMessage fcmMessage)
            throws IOException {

        byte[] message = ResourceMapper
                .getDefaultObjectMapper()
                .writeValueAsString(fcmMessage)
                .getBytes(Charset.forName("UTF-8"));
        Request.Builder rb = new Request.Builder()
                .url(propertyHolder.getFcmUrl())
                .post(new RequestBody() {

                    @Override
                    public MediaType contentType() {
                        return mediaType;
                    }

                    @Override
                    public void writeTo(BufferedSink sink)
                            throws IOException {
                        sink.write(message);
                    }
                })
                .header("content-length", message.length + "");

        rb.header(HttpHeaders.AUTHORIZATION, new StringBuilder("key=")
                .append(apiKey)
                .toString());

        return rb.build();
    }

    protected PushHttpResponse parseResponse(MobPushToken pushToken, FcmMessage fcmMessage, Response response)
            throws IOException {
        return new PushHttpResponse(pushToken, response.code(), response
                .headers()
                .toMultimap(), response.message(), response
                .body()
                .string());
    }
}
