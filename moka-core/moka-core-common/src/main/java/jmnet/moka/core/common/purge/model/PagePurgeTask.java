package jmnet.moka.core.common.purge.model;

import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;
import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import jmnet.moka.core.common.purge.HttpPurger;
import jmnet.moka.core.common.purge.VarnishPurger;
import jmnet.moka.core.common.util.ResourceMapper;

public class PagePurgeTask extends PurgeTask {
    public final static Logger logger = LoggerFactory.getLogger(PagePurgeTask.class);
    public static final String TMS_BULK_PURGE = "/command/bulkPurge";
    public static final String TMS_BULK_PURGE_PARAM = "json";
    private List<PurgeItem> purgeItemList;

    
    public PagePurgeTask() {
        super();
        this.purgeItemList = new ArrayList<PurgeItem>();

    }

    public void addPurgeItem(String domainId, String itemType, String itemId) {
        this.purgeItemList.add(new PurgeItem(domainId, itemType, itemId));
    }
    
    public String getUrlString() throws JsonGenerationException, JsonMappingException, IOException {
        Writer writer = new StringWriter();
        ResourceMapper.getDefaultObjectMapper().writeValue(writer, this.purgeItemList);
        UriComponents component = UriComponentsBuilder.newInstance()
                .path(PagePurgeTask.TMS_BULK_PURGE)
                .queryParam(PagePurgeTask.TMS_BULK_PURGE_PARAM, writer.toString()).build().encode();

        return component.toString();
    }
    
    public List<PurgeResult> purge() {
        List<PurgeResult> resultList = new ArrayList<PurgeResult>();
        List<String> httpHostList = this.getHttpHostList();
        if (httpHostList != null) {

            String urlString;
            try {
                urlString = this.getUrlString();
                int httpPort = this.getHttpPort();
                HttpPurger httpPurger = new HttpPurger();
                for (String httpHost : httpHostList) {
                    resultList.add(httpPurger.purge(httpHost, httpPort, urlString));
                }
            } catch (Exception e) {
                PurgeResult purgeResult = new PurgeResult("HTTP-ALL");
                purgeResult.setSuccess(false);
                purgeResult.setResponseCode(PurgeResult.PURGE_FAIL);
                purgeResult.setResponseMessage(e.getMessage());
                logger.error("Purge HTTP ALL Fail :{}", e, e);
            }

        }
        List<String> varnishHostList = this.getVarnishHostList();
        if (varnishHostList != null) {
            List<PurgeUrl> purgeUrlList = this.getPurgeUrlList();
            int varnishPort = this.getVarnishPort();
            VarnishPurger varnishPurger = new VarnishPurger();
            for (String varnishHost : varnishHostList) {
                for (PurgeUrl purgeUrl : purgeUrlList) {
                    if (purgeUrl.isRegExpr()) {
                        resultList.add(varnishPurger.ban(varnishHost, varnishPort,
                                purgeUrl.getDomain(), purgeUrl.getUrl()));
                    } else {
                        resultList.add(varnishPurger.purge(varnishHost, varnishPort,
                                purgeUrl.getDomain(), purgeUrl.getUrl()));
                    }
                }
            }

        }
        return resultList;
    }
}
