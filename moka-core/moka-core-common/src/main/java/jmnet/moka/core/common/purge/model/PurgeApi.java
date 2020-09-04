package jmnet.moka.core.common.purge.model;

import java.util.Map;
import java.util.Map.Entry;
import org.springframework.web.util.UriComponentsBuilder;

public class PurgeApi {
    private String apiPath;
    private String apiId;
    private String prefix;
    private Map<String, Object> paramMap;

    public PurgeApi(String apiPath, String apiId) {
        super();
        this.apiPath = apiPath;
        this.apiId = apiId;
    }

    public PurgeApi(String apiPath, String apiId, Map<String, Object> paramMap) {
        super();
        this.apiPath = apiPath;
        this.apiId = apiId;
        this.paramMap = paramMap;
    }

    public PurgeApi(String apiPath, String apiId, String prefix) {
        super();
        this.apiPath = apiPath;
        this.apiId = apiId;
        this.prefix = prefix;
    }

    public boolean usePrefix() {
        return this.prefix != null;
    }

    public String getPurgeString() {
        UriComponentsBuilder builder = UriComponentsBuilder.newInstance();
        if (this.prefix == null) {
            builder.path(ApiPurgeTask.DPS_PURGE);
        } else {
            builder.path(ApiPurgeTask.DPS_PURGE_STARTSWITH);
        }
        builder.queryParam(ApiPurgeTask.DPS_PARAM_API_PATH, this.apiPath)
                .queryParam(ApiPurgeTask.DPS_PARAM_API_ID, this.apiId);
        if (this.prefix != null) {
            builder.queryParam(ApiPurgeTask.DPS_PARAM_PREFIX, this.prefix);
        }
        if (this.paramMap != null) {
            for (Entry<String, Object> entry : this.paramMap.entrySet()) {
                builder.queryParam(entry.getKey(), entry.getValue());
            }
        }
        return builder.build().encode().toString();
    }

    public String getUrlString() {
        UriComponentsBuilder builder = UriComponentsBuilder.newInstance();
        builder.path("/" + String.join("/", this.apiPath, this.apiId));
        if (this.prefix != null) {
            builder.query(this.prefix);
        }
        if (this.paramMap != null) {
            for (Entry<String, Object> entry : this.paramMap.entrySet()) {
                builder.queryParam(entry.getKey(), entry.getValue());
            }
        }
        return builder.build().encode().toString();
    }

}
