package jmnet.moka.core.tms.merge.content;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import jmnet.moka.common.JSONResult;
import jmnet.moka.common.proxy.http.ApiHttpProxyFactory;
import jmnet.moka.common.proxy.http.HttpProxy;
import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tms.exception.TmsException;
import jmnet.moka.core.tms.merge.MokaDomainTemplateMerger;
import jmnet.moka.core.tms.merge.item.ContentSkinItem;
import jmnet.moka.core.tms.merge.item.DomainItem;
import jmnet.moka.core.tms.mvc.domain.DomainResolver;

/**
 * <pre>
 * Content를 로딩한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * 
 * @since 2019. 9. 4. 오후 4:16:52
 * @author kspark
 */
public class ContentDelegator {

    private DomainResolver domainResolver;

    private ApiHttpProxyFactory apiHttpProxyFactory;

    private MokaDomainTemplateMerger templateMerger;


    @Autowired
    public ContentDelegator(DomainResolver domainResolver, MokaDomainTemplateMerger templateMerger,
            ApiHttpProxyFactory apiHttpProxyFactory) {
        this.domainResolver = domainResolver;
        this.templateMerger = templateMerger;
        this.apiHttpProxyFactory = apiHttpProxyFactory;
    }

    private HttpProxy getHttpProxy(String domainId) {
        DomainItem domainItem = this.domainResolver.getDomainInfoById(domainId);
        String apiHost = domainItem.getApiHost();
        String apiPath = domainItem.getApiPath();
        return apiHttpProxyFactory.getApiHttpProxy(apiHost, apiPath);
    }

    public ContentSkinItem getSkinItem(String domainId, String contentId) throws TmsException {
        try {
            HttpProxy httpProxy = getHttpProxy(domainId);
            String apiId = "";
            Map<String, Object> parameterMap = new HashMap<String, Object>();
            JSONResult result = httpProxy.getApiResult(apiId, parameterMap, true);
            Map<String, Object> dataMap = result.getDataMap();
            String skinId = dataMap.get("SKIN_ID").toString();
            ContentSkinItem skinItem =
                    (ContentSkinItem) this.templateMerger.getItem(domainId,
                            MokaConstants.ITEM_CONTENT_SKIN,
                            skinId);
            return skinItem;
        } catch (IOException | URISyntaxException | ParseException | TemplateLoadException
                | TemplateParseException | TemplateMergeException e) {
            throw new TmsException(String.format("Skin Getting Fail: %s %s", domainId, contentId),
                    e);
        }
    }

    public Content getContent(String domainId, String contentId) throws TmsException {
        try {
            HttpProxy httpProxy = getHttpProxy(domainId);
            String apiId = "";
            Map<String, Object> parameterMap = new HashMap<String, Object>();
            JSONResult result = httpProxy.getApiResult(apiId, parameterMap, true);
            Map<String, Object> dataMap = result.getDataMap();
            if (dataMap != null) {
                Content content = Content.toContent(dataMap);
                return content;
            }
            return null;
        } catch (IOException | URISyntaxException | ParseException e) {
            throw new TmsException(
                    String.format("Content Getting Fail: %s %s", domainId, contentId), e);
        }
    }
}
