package jmnet.moka.web.push.support.httpclient;

import jmnet.moka.web.push.support.message.PushHttpResponse;

/**
 * <pre>
 * Http Client response listener interface
 * Project : moka
 * Package : jmnet.moka.web.push.support.httpclient
 * ClassName : PushHttpResponseListener
 * Created : 2021-02-09 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-09 17:32
 */
public interface PushHttpResponseListener {

    void onSuccess(PushHttpResponse response);

    void onFailure(PushHttpResponse response);
}
