package jmnet.moka.common.proxy.http;

import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.GenericApplicationContext;
import jmnet.moka.common.proxy.autoConfig.HttpProxyConfiguration;

/**
 * 
 * <pre>
 * Api용 httpProxy의 중복생성을 방지하기 위해 httpProxy bean을 관리한다.
 * 2020. 4. 21. kspark 최초생성
 * </pre>
 * @since 2020. 4. 21. 오전 8:04:33
 * @author kspark
 */
public class ApiHttpProxyFactory {
    private Map<String, HttpProxy> httpProxyMap;
    private GenericApplicationContext appContext;

    @Autowired
    public ApiHttpProxyFactory(GenericApplicationContext appContext) {
        this.appContext = appContext;
        this.httpProxyMap = new HashMap<String, HttpProxy>(4);
    }

    public HttpProxy getApiHttpProxy(String apiHost, String apiPath) {
        String key = apiHost + "_" + apiPath;
        if (this.httpProxyMap.containsKey(key)) {
            return this.httpProxyMap.get(key);
        }
        synchronized (this) {
            // 선행thread가 생성후 대기중인 thread가 동일한 proxy를 요청할 경우 재생성방지
            if (this.httpProxyMap.containsKey(key)) {
                return this.httpProxyMap.get(key);
            }
            HttpProxy httpProxy = (HttpProxy) appContext
                    .getBean(HttpProxyConfiguration.API_HTTP_PROXY, apiHost, apiPath);
            this.httpProxyMap.put(key, httpProxy);
            return httpProxy;
        }
    }


}
