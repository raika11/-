package jmnet.moka.core.tms.merge;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.loader.DataLoader;
import jmnet.moka.common.template.loader.HttpProxyDataLoader;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.tms.exception.TmsException;
import jmnet.moka.core.tms.merge.item.MergeItem;
import jmnet.moka.core.tms.mvc.domain.DomainResolver;
import jmnet.moka.core.tms.template.loader.AbstractTemplateLoader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.support.GenericApplicationContext;

/**
 * <pre>
 * 도메인 단위의 템플릿을 머징한다.
 * 2019. 9. 11. kspark 최초생성
 * </pre>
 * 
 * @since 2019. 9. 11. 오후 5:10:49
 * @author kspark
 */
public class MokaDomainTemplateMerger implements DomainTemplateMerger {

    private static final Logger logger = LoggerFactory.getLogger(MokaDomainTemplateMerger.class);
    private HashMap<String, MokaTemplateMerger> templateMergerMap;
    private HashMap<String, DataLoader> dataLoaderMap;
    private DataLoader defaultDataLoader;
    private GenericApplicationContext appContext;
    private boolean defaultApiHostPathUse;


    /**
     * DPS기반의 DomainTemplateMerger를 생성한다.
     * 
     * @param appContext 컨텍스트
     * @param defaultApiHost api호스트
     * @param defaultApiPath api경로
     */
    public MokaDomainTemplateMerger(GenericApplicationContext appContext,
                                    String defaultApiHost, String defaultApiPath, boolean defaultApiHostPathUse)
            throws TemplateMergeException, TemplateParseException {
        this.appContext = appContext;
        this.templateMergerMap = new HashMap<String, MokaTemplateMerger>(16);
        this.defaultDataLoader =
                appContext.getBean(HttpProxyDataLoader.class, defaultApiHost, defaultApiPath);
        this.defaultApiHostPathUse = defaultApiHostPathUse;
        loadDataLoaderMap();
        String defaultDataLoaderKey = defaultApiHost + "_" + defaultApiPath;
        if ( this.dataLoaderMap.containsKey(defaultDataLoaderKey)) {
            this.defaultDataLoader = this.dataLoaderMap.get(defaultDataLoaderKey);
        } else {
            this.defaultDataLoader =
                    appContext.getBean(HttpProxyDataLoader.class, defaultApiHost, defaultApiPath);
            this.dataLoaderMap.put(defaultDataLoaderKey,this.defaultDataLoader);
        }
        logger.debug("Default HttpProxyDataLoader Created: {} {}", defaultApiHost, defaultApiPath);
        this.defaultApiHostPathUse = defaultApiHostPathUse;

        // domain별 TemplateLoader를 미리 생성한다.
        DomainResolver domainResolver = appContext.getBean(DomainResolver.class);
        for (MergeItem domainItem : domainResolver.getDomainInfoList()) {
            String domainId = domainItem.getString(ItemConstants.DOMAIN_ID);
            this.getTemplateMerger(domainId);
        }
    }

    /**
     * <pre>
     * DataLoader정보 맵을 설정한다.
     * </pre>
     *
     */
    private void loadDataLoaderMap()
            throws TemplateMergeException, TemplateParseException {
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
        MokaTemplateMerger ftm = getTemplateMerger(domainId);
        ftm.loadUri();
    }

    @Override
    public Map<String, String> getUri2ItemMap(String domainId)
            throws TemplateMergeException, TemplateParseException, TmsException {
        MokaTemplateMerger ftm = getTemplateMerger(domainId);
        return ftm.getUri2ItemMap();
    }

    @Override
    public StringBuilder merge(String domainId, String itemType, String itemId,
            MergeContext context) throws TemplateMergeException, TemplateParseException {
        MokaTemplateMerger ftm = getTemplateMerger(domainId);
        return ftm.merge(itemType, itemId, context);
    }


    public String getItemKey(String domainId, String path)
            throws TemplateMergeException, TemplateParseException {
        MokaTemplateMerger ftm = getTemplateMerger(domainId);
        return ftm.getItemKey(path);
    }

    @Override
    public MergeItem getItem(String domainId, String itemType, String itemId)
            throws TemplateParseException, TemplateMergeException, TemplateLoadException {
        MokaTemplateMerger ftm = getTemplateMerger(domainId);
        return ftm.getItem(itemType, itemId);
    }

    @Override
    public void purgeItem(String domainId, String itemType, String itemId)
            throws TemplateMergeException, TemplateParseException {
        MokaTemplateMerger templateMerger = getTemplateMerger(domainId);
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
    public MokaTemplateMerger getTemplateMerger(String domainId)
            throws TemplateMergeException, TemplateParseException {
        // 도메인 정보 로드 실패시 로더맵이 생성되지 않아 다시 생성해야 한다.
        if (this.dataLoaderMap == null) {
            this.loadDataLoaderMap();
        }
        MokaTemplateMerger tm = this.templateMergerMap.get(domainId);
        if (tm == null) {
            synchronized (this) {
                tm = this.templateMergerMap.get(domainId);
                if ( tm == null) {
                    try {
                        DataLoader domainDataLoader = this.dataLoaderMap.get(domainId);
                        if (domainDataLoader != null) {
                            AbstractTemplateLoader templateLoader = this.appContext.getBean(AbstractTemplateLoader.class, domainId);
                            tm = new MokaTemplateMerger(this.appContext, domainId, templateLoader, domainDataLoader, this.defaultDataLoader,
                                    defaultApiHostPathUse);
                            this.templateMergerMap.put(domainId, tm);
                            logger.debug("Domain Template Merger Created : {}", domainId);
                        } else {
                            throw new IOException("Domain DataLoader Not Found:" + domainId);
                        }
                    } catch (IOException e) {
                        throw new TemplateMergeException("Domain Template Merger Creation Fail", e);
                    }
                }
            }
        }
        return tm;
    }


}
