package jmnet.moka.web.dps.module;

import java.util.HashMap;
import java.util.Map;
import jmnet.moka.core.common.encrypt.MokaMembershipCrypt;
import jmnet.moka.core.common.util.HttpHelper;
import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.ApiRequestHelper;
import jmnet.moka.core.dps.api.handler.ModuleRequestHandler;
import jmnet.moka.core.dps.api.handler.module.ModuleInterface;
import jmnet.moka.core.dps.mvc.handler.ApiRequestHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.GenericApplicationContext;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

public class MembershipModule implements ModuleInterface {

    private static final String MEMBERSHIP_COOKIE = "JAMemSSOInfo";
    private static final String PARAM_CLIENT_ID = "client-id";
    private static final String PARAM_JA_MEM_AUTH = "JaMemAuth";

    private String key;
    private String clientId;
    private String api;
    private ApiRequestHandler apiRequestHandler;
    private ApiRequestHelper apiRequestHelper;
    private ModuleRequestHandler moduleRequestHandler;
    private MokaMembershipCrypt mokaMembershipCrypt;

    private String[] names = {"loginTime", "memSeq", "loginSeq", "loginType", "memState", "loginYn"};

    public MembershipModule(ModuleRequestHandler moduleRequestHandler, ApiRequestHandler apiRequestHandler, ApiRequestHelper apiRequestHelper) {
        this.apiRequestHandler = apiRequestHandler;
        this.apiRequestHelper = apiRequestHelper;
        this.moduleRequestHandler = moduleRequestHandler;

        GenericApplicationContext appContext = this.moduleRequestHandler.getApplicationContext();
        this.key = appContext
                        .getBeanFactory()
                        .resolveEmbeddedValue("${membership.key}");
        this.clientId = appContext
                .getBeanFactory()
                .resolveEmbeddedValue("${membership.client-id}");
        this.api = appContext
                .getBeanFactory()
                .resolveEmbeddedValue("${membership.api}");
        this.mokaMembershipCrypt = new MokaMembershipCrypt(key);
    }

    @Override
    public Object invoke(ApiContext apiContext) {
        return null;
    }

    public Object getCookieInfo(ApiContext apiContext)
            throws Exception {
        String memberCookie = (String) apiContext
                .getCheckedParamMap()
                .get(MEMBERSHIP_COOKIE);
        String decoded = this.mokaMembershipCrypt.decrypt(memberCookie);
        Map<String, Object> valueMap = new HashMap<>();
        short count = 0;
        for (String value : decoded.split("\\|")) {
            valueMap.put(names[count++], value);
        }
        return valueMap;
    }

    public Object getMemberInfo(ApiContext apiContext) {
        String memberCookie = (String) apiContext
                .getCheckedParamMap()
                .get(MEMBERSHIP_COOKIE);
        HttpHeaders headers = new HttpHeaders();
        headers.add(PARAM_CLIENT_ID, clientId);
        headers.add(PARAM_JA_MEM_AUTH, memberCookie);
        HttpEntity<String> request = new HttpEntity<>("", headers);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.exchange(api, HttpMethod.GET, request, Map.class);
        return response.getBody();
    }
}
