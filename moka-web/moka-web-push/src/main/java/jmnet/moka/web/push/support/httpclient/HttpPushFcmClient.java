package jmnet.moka.web.push.support.httpclient;

import java.io.IOException;
import java.nio.charset.Charset;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.web.push.mvc.sender.entity.PushAppToken;
import jmnet.moka.web.push.support.message.FcmMessage;
import jmnet.moka.web.push.support.message.PushHttpResponse;
import jmnet.moka.web.push.support.sender.AbstractPushSender;
import lombok.extern.slf4j.Slf4j;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
@Slf4j
public class HttpPushFcmClient implements HttpPushClient {
    private static final Logger logger = LoggerFactory.getLogger(AbstractPushSender.class);

    private static final MediaType mediaType = MediaType.parse("application/json");
    protected final OkHttpClient client;
    private String apiKey;
    private String apiUrl;

    public HttpPushFcmClient(String apiUrl, String apiKey) {
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
        client = PushHttpClientBuilder
                .createDefaultOkHttpClientBuilder()
                .build();
    }


    public PushHttpResponse push(PushAppToken pushToken, FcmMessage fcmMessage)
            throws Exception {
        final Request request = buildRequest(fcmMessage);
        Response response = null;

        try {
            response = client
                    .newCall(request)
                    .execute();
            return parseResponse(pushToken, fcmMessage, response);
        } catch (Throwable t) {
            return new PushHttpResponse(null, -1, null, t.getMessage(), null);
        } finally {
            if (response != null) {
                log.info("finally response=" + response);
                response
                        .body()
                        .close();
            }
        }
    }

    public void push(PushAppToken pushToken, FcmMessage fcmMessage, PushHttpResponseListener nrl)
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
                                log.info("finally response=" + response);
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
        log.info("[ Request buildRequest ]");

        byte[] message = ResourceMapper
                .getDefaultObjectMapper()
                .writeValueAsString(fcmMessage)
                .getBytes(Charset.forName("UTF-8"));

        Request.Builder rb = new Request.Builder().url(apiUrl)
                                                  //.url(propertyHolder.getFcmUrl())
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

    protected PushHttpResponse parseResponse(PushAppToken pushToken, FcmMessage fcmMessage, Response response)
            throws IOException {
        return new PushHttpResponse(pushToken, response.code(), response
                .headers()
                .toMultimap(), response.message(), response
                .body()
                .string());
    }
}
