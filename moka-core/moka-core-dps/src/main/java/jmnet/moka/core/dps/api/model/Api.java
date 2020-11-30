package jmnet.moka.core.dps.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.dps.api.ApiCacheHelper;
import jmnet.moka.core.dps.api.ApiParser;

public class Api {
    @JsonIgnore
    private ApiConfig apiConfig;
    @JsonProperty("parameter")
    private Map<String, Parameter> parameterMap;
    private String description;
    private String id;
    private long expire;
    private String period;
    private String cors;
    private boolean hasDbRequest = false;
    private boolean hasAsyncRequest = false;
    private boolean hasCookieParameter = false;
    private List<Request> requestList;
    private List<String> keyList = ApiParser.EMPTY_TOKEN_LIST;

    public Api(ApiConfig apiConfig, String id) {
        this(apiConfig, id, 0L, null, null, null);
    }

    public Api(ApiConfig apiConfig, String id, long expire, String period, String description, String cors) {
        this.apiConfig = apiConfig;
        this.id = id;
        this.period = period;
        this.expire = expire;
        this.description = description;
        this.cors = McpString.isNotEmpty(cors)? cors:null;
        this.parameterMap = new LinkedHashMap<String, Parameter>(16);
        this.requestList = new ArrayList<Request>(4);
    }

    public ApiConfig getApiConfig() {
        return this.apiConfig;
    }

    public String getId() {
        return this.id;
    }

    public long getExpire() {
        return this.expire;
    }

    public boolean isExpireUndefined() {
        return this.expire == ApiCacheHelper.EXPIRE_UNDEFINED;
    }

    public void addParamer(Parameter parameter) {
        if (parameter.getType()
                     .equals(ApiParser.PARAM_TYPE_COOKIE)) {
            this.hasCookieParameter = true;
        }
        this.parameterMap.put(parameter.getName(), parameter);
    }

    public void addRequest(Request request) {
        this.requestList.add(request);
        // DbRequest를 포함하는지 확인
        if (request instanceof DbRequest) {
            this.hasDbRequest = true;
        }
        if (request.getAsync()) {
            this.hasAsyncRequest = true;
        }
    }

    public boolean hasDbRequest() {
        return this.hasDbRequest;
    }

    public boolean hasAsyncRequest() {
        return this.hasAsyncRequest;
    }

    public boolean hasCookieParameter() {
        return this.hasCookieParameter;
    }

    public List<Request> getRequestList() {
        return this.requestList;
    }

    public String getPeriod() {
        return this.period;
    }

    public String getDescription() {
        return this.description;
    }

    public String getCors() { return this.cors; }

    public Map<String, Parameter> getParameterMap() {
        return this.parameterMap;
    }

    public void setKeyList(List<String> keyList) {
        this.keyList = keyList;
    }

    public List<String> getKeyList() {
        return this.keyList;
    }
}
