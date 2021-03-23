package jmnet.moka.web.dps.module.membership;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import jmnet.moka.core.common.encrypt.MokaMembershipCrypt;
import jmnet.moka.core.common.util.HttpHelper;
import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.ApiRequestHelper;
import jmnet.moka.core.dps.api.handler.ModuleRequestHandler;
import jmnet.moka.core.dps.mvc.handler.ApiRequestHandler;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

public class MembershipHelper {

    private static final String MEMBERSHIP_COOKIE = "JAMemSSOInfo";
    private static final String PARAM_CLIENT_ID = "client-id";
    private static final String PARAM_JA_MEM_AUTH = "JaMemAuth";
    private static final String MEMBERSHIP_PREFIX = "member_";

    private String key;
    private String clientId;
    private String api;
    private ApiRequestHandler apiRequestHandler;
    private ApiRequestHelper apiRequestHelper;
    private ModuleRequestHandler moduleRequestHandler;
    private MokaMembershipCrypt mokaMembershipCrypt;

    private String[] names = {"loginTime", "memSeq", "loginSeq", "loginType", "memState", "loginYn"};

    public MembershipHelper(String key, String clientId, String api) {
        this.key = key;
        this.clientId = clientId;
        this.api = api;
        this.mokaMembershipCrypt = new MokaMembershipCrypt(this.key);
    }

    public Map<String, Object> decodeCookie(String membershipCookie)
            throws Exception {
        String decoded = this.mokaMembershipCrypt.decrypt(membershipCookie);
        Map<String, Object> valueMap = new HashMap<>();
        short count = 0;
        for (String value : decoded.split("\\|")) {
            if (count == 1) {
                valueMap.put(names[count], Integer.parseInt(value));
            } else {
                valueMap.put(names[count], value);
            }
            count++;
        }
        return valueMap;
    }

    public Object getMemberInfo(String membershipCookie) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(PARAM_CLIENT_ID, clientId);
        headers.add(PARAM_JA_MEM_AUTH, membershipCookie);
        HttpEntity<String> request = new HttpEntity<>("", headers);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.exchange(api, HttpMethod.GET, request, Map.class);
        return response
                .getBody()
                .get("data");
    }

    public void setMembershipByCookie(ApiContext apiContext)
            throws Exception {
        setMembership(apiContext, decodeCookie(getMembershipCookie(apiContext)));
    }

    public void setMembershipByApi(ApiContext apiContext) {
        setMembership(apiContext, (Map<String, Object>) getMemberInfo(getMembershipCookie(apiContext)));
    }

    private String getMembershipCookie(ApiContext apiContext) {
        Map<String, String> cookieMap = HttpHelper.getCookieMap(apiContext.getHttpRequest());
        return cookieMap.get(MEMBERSHIP_COOKIE);
    }

    private void setMembership(ApiContext apiContext, Map<String, Object> membership) {
        Map paramMap = apiContext.getCheckedParamMap();
        if (membership != null) {
            for (Entry entry : membership.entrySet()) {
                paramMap.put(MEMBERSHIP_PREFIX + entry.getKey(), entry.getValue());
            }
        }
    }
}
