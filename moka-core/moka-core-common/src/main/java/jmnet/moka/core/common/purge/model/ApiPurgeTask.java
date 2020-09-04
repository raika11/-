package jmnet.moka.core.common.purge.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import jmnet.moka.core.common.purge.HttpPurger;
import jmnet.moka.core.common.purge.VarnishPurger;

public class ApiPurgeTask extends PurgeTask {
    public static final String DPS_PURGE = "/command/purge";
    public static final String DPS_PURGE_STARTSWITH = "/command/purgeStartsWith";
    public static final String DPS_PARAM_API_PATH = "apiPath";
    public static final String DPS_PARAM_API_ID = "apiId";
    public static final String DPS_PARAM_PREFIX = "prefix";
    private List<PurgeApi> purgeApiList;
    private String[] domain;

    public ApiPurgeTask(String... domain) {
        super();
        this.domain = domain;
        this.purgeApiList = new ArrayList<PurgeApi>();
    }

    public void addPurgeApi(String apiPath, String apiId, String prefix) {
        this.purgeApiList.add(new PurgeApi(apiPath, apiId, prefix));
    }

    public void addPurgeApi(String apiPath, String apiId, Map<String, Object> paramMap) {
        this.purgeApiList.add(new PurgeApi(apiPath, apiId, paramMap));
    }

    public List<PurgeApi> getPurgeApiList() {
        return this.purgeApiList;
    }

    public String[] getDomain() {
        return this.domain;
    }

    public List<PurgeResult> purge() {
        List<PurgeResult> resultList = new ArrayList<PurgeResult>();
        List<String> httpHostList = this.getHttpHostList();
        List<PurgeApi> purgeApiList = this.getPurgeApiList();
        if (httpHostList != null) {
            int httpPort = this.getHttpPort();
            HttpPurger httpPurger = new HttpPurger();
            for (String httpHost : httpHostList) {
                for (PurgeApi purgeApi : purgeApiList) {
                    resultList.add(httpPurger.purge(httpHost, httpPort, purgeApi.getPurgeString()));
                }
            }
        }
        List<String> varnishHostList = this.getVarnishHostList();
        if (varnishHostList != null) {
            int varnishPort = this.getVarnishPort();
            VarnishPurger varnishPurger = new VarnishPurger();
            for (String varnishHost : varnishHostList) {
                for (String domain : this.getDomain()) {
                    for (PurgeApi purgeApi : purgeApiList) {
                        if (purgeApi.usePrefix()) {
                            resultList.add(varnishPurger.ban(varnishHost, varnishPort, domain,
                                    purgeApi.getUrlString()));
                        } else {
                            resultList.add(varnishPurger.purge(varnishHost, varnishPort, domain,
                                    purgeApi.getUrlString()));
                        }

                    }
                }
            }
        }
        return resultList;
    }
}
