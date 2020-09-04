package jmnet.moka.core.tms.merge;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.support.GenericApplicationContext;
import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.loader.DataLoader;
import jmnet.moka.common.template.loader.HttpProxyDataLoader;
import jmnet.moka.common.template.loader.TemplateLoader;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.tms.exception.TmsException;
import jmnet.moka.core.tms.merge.item.MergeItem;
import jmnet.moka.core.tms.mvc.domain.DomainResolver;
import jmnet.moka.core.tms.template.loader.AbstractTemplateLoader;

/**
 * <pre>
 * 도메인 단위의 템플릿을 머징한다.
 * 2019. 9. 11. kspark 최초생성
 * </pre>
 * 
 * @since 2019. 9. 11. 오후 5:10:49
 * @author kspark
 */
public class MspDomainTemplateMerger implements DomainTemplateMerger {

    private static final Logger logger = LoggerFactory.getLogger(MspDomainTemplateMerger.class);
    private String defaultTemplateDomain = "0000";
    private HashMap<String, MspTemplateMerger> templateMergerMap;
    private TemplateLoader<MergeItem> assistantTemplateLoader;
    private DataLoader dataLoader;
    private HashMap<String, DataLoader> dataLoaderMap;
    private GenericApplicationContext appContext;


    /**
     * DPS기반의 DomainTemplateMerger를 생성한다.
     * 
     * @param appContext
     * @param defaultTemplateDomain
     * @throws TemplateParseException
     */
    public MspDomainTemplateMerger(GenericApplicationContext appContext,
            String defaultTemplateDomain)
            throws TemplateParseException {
        this.appContext = appContext;
        this.templateMergerMap = new HashMap<String, MspTemplateMerger>(16);
        if (defaultTemplateDomain != null) {
            this.defaultTemplateDomain = defaultTemplateDomain;
        }
        //공통 도메인 템플릿 로더는 DPS기반
        //등록된 빈 정의를 통해 생성
        this.assistantTemplateLoader =
                this.appContext.getBean(AbstractTemplateLoader.class, this.defaultTemplateDomain);
        loadDataLoaderMap();
    }

    /**
     * <pre>
     * DataLoader정보 맵을 설정한다.
     * </pre>
     * 
     */
    private void loadDataLoaderMap() {
        HashMap<String, DataLoader> domainDataLoaderMap = new HashMap<String, DataLoader>(8);
        HashMap<String, DataLoader> targetDataLoaderMap = new HashMap<String, DataLoader>(8);

        DomainResolver domainResolver = appContext.getBean(DomainResolver.class);

        for (MergeItem domainItem : domainResolver.getDomainInfoList()) {
            String domainId = domainItem.getString(ItemConstants.DOMAIN_ID);
            String domainUrl = domainItem.getString(ItemConstants.DOMAIN_URL);
            String apiHost = domainItem.getString(ItemConstants.DOMAIN_API_HOST);
            String apiPath = domainItem.getString(ItemConstants.DOMAIN_API_PATH);

            String dataLoaderKey = apiHost + "_" + apiPath;
            if (targetDataLoaderMap.containsKey(dataLoaderKey)) {
                // targetPrefix가 같을 경우 존재하는 loader 사용
                domainDataLoaderMap.put(domainId, targetDataLoaderMap.get(dataLoaderKey));
                logger.debug("HttpProxyDataLoader Assigned already Created: {} {} {} {}", domainUrl,
                        domainId, apiHost, apiPath);
            } else {
                // HttpProxyDataLoader로 직접 bean이 생성되지 않고, apiHost와 apiPath 파라미터로 HttpProxy prototype bean이
                // 생성된 후 httpProxyDataLoader bean이 생성됨
                HttpProxyDataLoader httpProxyDataLoader =
                        appContext.getBean(HttpProxyDataLoader.class, apiHost, apiPath);
                domainDataLoaderMap.put(domainId, httpProxyDataLoader);
                targetDataLoaderMap.put(dataLoaderKey, httpProxyDataLoader);
                logger.debug("HttpProxyDataLoader Created: {} {} {} {}", domainUrl, domainId,
                        apiHost, apiPath);
            }
        }
        if (domainDataLoaderMap.size() > 0) {
            this.dataLoaderMap = domainDataLoaderMap;
        }
        //        else  다시 로딩을 시도할 수 있도록 null 상태로 유지한다.
    }

    @Override
    public void loadUri(String domainId)
            throws TemplateMergeException, TemplateParseException, TmsException {
        MspTemplateMerger ftm = getTemplateMerger(domainId);
        ftm.loadUri();
    }

    @Override
    public Map<String, String> getUri2ItemMap(String domainId)
            throws TemplateMergeException, TemplateParseException, TmsException {
        MspTemplateMerger ftm = getTemplateMerger(domainId);
        return ftm.getUri2ItemMap();
    }

    @Override
    public StringBuilder merge(String domainId, String itemType, String itemId,
            MergeContext context) throws TemplateMergeException, TemplateParseException {
        MspTemplateMerger ftm = getTemplateMerger(domainId);
        return ftm.merge(itemType, itemId, context);
    }


    public String getItemKey(String domainId, String path)
            throws TemplateMergeException, TemplateParseException {
        MspTemplateMerger ftm = getTemplateMerger(domainId);
        return ftm.getItemKey(path);
    }

    @Override
    public MergeItem getItem(String domainId, String itemType, String itemId)
            throws TemplateParseException, TemplateMergeException, TemplateLoadException {
        MspTemplateMerger ftm = getTemplateMerger(domainId);
        return ftm.getItem(itemType, itemId);
    }

    @Override
    public void purgeItem(String domainId, String itemType, String itemId)
            throws TemplateMergeException, TemplateParseException {
        MspTemplateMerger templateMerger = getTemplateMerger(domainId);
        templateMerger.purgeItem(itemType, itemId);
    }


    /**
     * <pre>
     * 도메인별 TemplateMerger를 반환한다.
     * </pre>
     * 
     * @param domainId
     * @return
     * @throws TemplateMergeException
     * @throws TemplateParseException
     */
    private MspTemplateMerger getTemplateMerger(String domainId)
            throws TemplateMergeException, TemplateParseException {
        // 도메인 정보 로드 실패시 로더맵이 생성되지 않아 다시 생성해야 한다. 
        if (this.dataLoaderMap == null) {
            this.loadDataLoaderMap();
        }
        MspTemplateMerger tm = this.templateMergerMap.get(domainId);
        if (tm == null) {
            try {
                DataLoader domainDataLoader = this.dataLoader;
                if (domainDataLoader == null) {
                    domainDataLoader = this.dataLoaderMap.get(domainId);
                }
                if (domainDataLoader != null) {
                    AbstractTemplateLoader templateLoader =
                            this.appContext.getBean(AbstractTemplateLoader.class, domainId);
                    tm = new MspTemplateMerger(this.appContext, domainId, templateLoader,
                            domainDataLoader, this.assistantTemplateLoader);
                    this.templateMergerMap.put(domainId, tm);
                    logger.debug("Domain Template Merger Created : {}", domainId);
                } else {
                    throw new IOException("Domain DataLoader Not Found:" + domainId);
                }
            } catch (IOException e) {
                throw new TemplateMergeException("Domain Template Merger Creation Fail", e);
            }
        }
        return tm;
    }


}
