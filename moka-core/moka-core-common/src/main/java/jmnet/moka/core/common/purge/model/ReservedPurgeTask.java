package jmnet.moka.core.common.purge.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import org.springframework.web.util.UriComponentsBuilder;
import jmnet.moka.core.common.purge.HttpPurger;

public class ReservedPurgeTask extends PurgeTask {
    public static final String TMS_RESERVED_PURGE = "/command/reservedPurge";
    public static final String TMS_PARAM_DOMAIN_ID = "domainId";
    private Map<String, Object> paramMap;

    public ReservedPurgeTask() {
        super();
    }

    public void setParamMap(Map<String, Object> paramMap) {
        this.paramMap = paramMap;
    }

    public List<PurgeResult> purge() {
        List<PurgeResult> resultList = new ArrayList<PurgeResult>();
        List<String> httpHostList = this.getHttpHostList();
        UriComponentsBuilder builder = UriComponentsBuilder.newInstance();
        builder.path(TMS_RESERVED_PURGE);
        if (this.paramMap != null) {
            for (Entry<String, Object> entry : this.paramMap.entrySet()) {
                builder.queryParam(entry.getKey(), entry.getValue());
            }
        }
        String reservedPurgeUrl = builder.build().encode().toString();

        if (httpHostList != null) {
            int httpPort = this.getHttpPort();
            HttpPurger httpPurger = new HttpPurger();
            for (String httpHost : httpHostList) {
                resultList.add(httpPurger.purge(httpHost, httpPort, reservedPurgeUrl));
            }
        }
        return resultList;
    }
}
