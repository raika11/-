package jmnet.moka.core.tps.config;

import java.io.IOException;
import java.util.List;
import jmnet.moka.common.TimeHumanizer;
import jmnet.moka.common.proxy.autoConfig.HttpProxyConfiguration;
import jmnet.moka.common.proxy.http.HttpProxy;
import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.loader.DataLoader;
import jmnet.moka.common.template.loader.HttpProxyDataLoader;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.tms.exception.TmsException;
import jmnet.moka.core.tms.merge.MokaPreviewTemplateMerger;
import jmnet.moka.core.tms.merge.item.DomainItem;
import jmnet.moka.core.tms.mvc.domain.DomainResolver;
import jmnet.moka.core.tms.mvc.domain.DpsDomainResolver;
import jmnet.moka.core.tms.template.loader.AbstractTemplateLoader;
import jmnet.moka.core.tms.template.loader.DpsTemplateLoader;
import jmnet.moka.core.tms.template.loader.DpsWorkTemplateLoader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import org.springframework.context.support.GenericApplicationContext;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;

@Order(Ordered.HIGHEST_PRECEDENCE)
@Configuration
public class PreviewConfiguration {

    public static final String PREVIEW_WORK_TEMPLATE_MERGER = "previewWorkTemplateMerger";
    public static final String PREVIEW_TEMPLATE_MERGER = "previewTemplateMerger";
    public static final String TEMPLATE_LOADER = "templateLoader";
    public static final String WORK_TEMPLATE_LOADER = "workTemplateLoader";
    public final transient Logger logger = LoggerFactory.getLogger(getClass());
    @Value("${tms.item.api.host}")
    private String itemApiHost;
    @Value("${tms.item.api.path}")
    private String itemApiPath;
    @Value("${tms.default.api.host}")
    private String defaultApiHost;
    @Value("${tms.default.api.path}")
    private String defaultApiPath;
    @Value("${tms.default.api.hostPath.use}")
    private boolean defaultApiHostUse;
    @Value("${tms.template.loader.cache}")
    private boolean templateLoaderCache;
    @Autowired
    private GenericApplicationContext appContext;
    private DataLoader defaultDataLoader;

    @Bean
    @Scope("prototype")
    @ConditionalOnMissingBean
    public HttpProxyDataLoader domainDataLoader(String apiHost, String apiPath) {
        HttpProxy httpProxy = (HttpProxy) appContext.getBean(HttpProxyConfiguration.API_HTTP_PROXY, apiHost, apiPath);
        return new HttpProxyDataLoader(httpProxy);
    }

    @Bean
    @Scope("singleton")
    public HttpProxyDataLoader itemDataLoader() {
        HttpProxy httpProxy = (HttpProxy) appContext.getBean(HttpProxyConfiguration.API_HTTP_PROXY, this.itemApiHost, this.itemApiPath);
        return new HttpProxyDataLoader(httpProxy);
    }

    @Bean
    @Scope("singleton")
    public HttpProxyDataLoader defaultDataLoader() {
        HttpProxy httpProxy = (HttpProxy) appContext.getBean(HttpProxyConfiguration.API_HTTP_PROXY, this.defaultApiHost, this.defaultApiPath);
        return new HttpProxyDataLoader(httpProxy);
    }

    @Bean
    @Scope("prototype")
    public DomainResolver domainResolver()
            throws TmsException {
        DomainResolver domainResolver = null;
        long reservedExpireTime = TimeHumanizer.parseLong("0", 0L);
        HttpProxyDataLoader httpProxyDataLoader = itemDataLoader();
        domainResolver = new DpsDomainResolver(httpProxyDataLoader, reservedExpireTime);
        return domainResolver;
    }

    @Bean(name = TEMPLATE_LOADER)
    @Scope("prototype")
    public AbstractTemplateLoader templateLoader(String domainId)
            throws TemplateParseException, TmsException, DataLoadException {
        long expire = 10000L;
        try {
            String expireSeconds = appContext
                    .getBeanFactory()
                    .resolveEmbeddedValue("${tms.item.preview.expire.seconds}");
            if (McpString.isNotEmpty(expireSeconds)) {
                expire = Long.parseLong(expireSeconds);
            }
        } catch (Exception e) {
            logger.info("property {} not set, item will not cache", "tms.item.preview.expire.seconds");
        }
        return new DpsTemplateLoader(appContext, domainId, itemDataLoader(), null, templateLoaderCache, true, expire);
    }

    @Bean(name = WORK_TEMPLATE_LOADER)
    @Scope("prototype")
    public AbstractTemplateLoader workTemplateLoader(String domainId, String workerId, List<String> workComponentIdList)
            throws TemplateParseException, TmsException, DataLoadException {
        return new DpsWorkTemplateLoader(appContext, domainId, itemDataLoader(), workerId, workComponentIdList);
    }

    @Bean(name = PREVIEW_TEMPLATE_MERGER)
    @Scope("prototype")
    public MokaPreviewTemplateMerger previewTemplateMerger(DomainItem domainItem)
            throws IOException {
        String domainId = domainItem.getString(ItemConstants.DOMAIN_ID);
        String apiHost = domainItem.getString(ItemConstants.DOMAIN_API_HOST);
        String apiPath = domainItem.getString(ItemConstants.DOMAIN_API_PATH);
        //        HttpProxyDataLoader domainDataLoader = appContext.getBean(HttpProxyDataLoader.class, apiHost, apiPath);
        HttpProxyDataLoader domainDataLoader = domainDataLoader(apiHost, apiPath);
        AbstractTemplateLoader templateLoader = (AbstractTemplateLoader) this.appContext.getBean(TEMPLATE_LOADER, domainId);
        DomainResolver domainResolver = this.appContext.getBean(DomainResolver.class);
        MokaPreviewTemplateMerger ptm =
                new MokaPreviewTemplateMerger(this.appContext, domainItem, domainResolver, templateLoader, domainDataLoader, defaultDataLoader(),
                        this.defaultApiHostUse);
        return ptm;
    }

    @Bean(name = PREVIEW_WORK_TEMPLATE_MERGER)
    @Scope("prototype")
    public MokaPreviewTemplateMerger previewWorkTemplateMerger(DomainItem domainItem, String regId, List<String> workComponentIdList)
            throws IOException {

        String domainId = domainItem.getString(ItemConstants.DOMAIN_ID);
        String apiHost = domainItem.getString(ItemConstants.DOMAIN_API_HOST);
        String apiPath = domainItem.getString(ItemConstants.DOMAIN_API_PATH);
        //        HttpProxyDataLoader httpProxyDataLoader = appContext.getBean(HttpProxyDataLoader.class, apiHost, apiPath);
        HttpProxyDataLoader domainDataLoader = domainDataLoader(apiHost, apiPath);
        AbstractTemplateLoader templateLoader =
                (AbstractTemplateLoader) this.appContext.getBean(WORK_TEMPLATE_LOADER, domainId, regId, workComponentIdList);
        DomainResolver domainResolver = this.appContext.getBean(DomainResolver.class);
        MokaPreviewTemplateMerger ptm =
                new MokaPreviewTemplateMerger(this.appContext, domainItem, domainResolver, templateLoader, domainDataLoader, defaultDataLoader(),
                        this.defaultApiHostUse, regId);
        return ptm;
    }

}
