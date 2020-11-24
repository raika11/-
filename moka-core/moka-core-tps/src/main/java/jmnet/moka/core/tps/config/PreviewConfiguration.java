package jmnet.moka.core.tps.config;

import java.io.IOException;
import java.util.List;
import jmnet.moka.common.TimeHumanizer;
import jmnet.moka.common.proxy.autoConfig.HttpProxyConfiguration;
import jmnet.moka.common.proxy.http.HttpProxy;
import jmnet.moka.common.template.exception.TemplateParseException;
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

    public final transient Logger logger = LoggerFactory.getLogger(getClass());

    @Value("${tms.item.api.host}")
    private String itemApiHost;

    @Value("${tms.item.api.path}")
    private String itemApiPath;

    @Value("${tms.template.loader.cache}")
    private boolean templateLoaderCache;

    @Autowired
    private GenericApplicationContext appContext;

    @Bean
    @Scope("prototype")
    @ConditionalOnMissingBean
    public HttpProxyDataLoader httpProxyDataLoader(String apiHost, String apiPath) {
        HttpProxy httpProxy = (HttpProxy) appContext.getBean(HttpProxyConfiguration.API_HTTP_PROXY, apiHost, apiPath);
        return new HttpProxyDataLoader(httpProxy);
    }

    @Bean
    @Scope("prototype")
    public DomainResolver domainResolver()
            throws TmsException {
        DomainResolver domainResolver = null;
        long reservedExpireTime = TimeHumanizer.parseLong("0", 0L);
        HttpProxyDataLoader httpProxyDataLoader = appContext.getBean(HttpProxyDataLoader.class, itemApiHost, itemApiPath);
        domainResolver = new DpsDomainResolver(httpProxyDataLoader, reservedExpireTime);
        return domainResolver;
    }

    @Bean
    @Scope("prototype")
    public AbstractTemplateLoader templateLoader(String domainId)
            throws TemplateParseException, TmsException {
        HttpProxyDataLoader httpProxyDataLoader = appContext.getBean(HttpProxyDataLoader.class, itemApiHost, itemApiPath);

        long expire = 10000L;
        try {
            String expireSeconds = appContext.getBeanFactory()
                                             .resolveEmbeddedValue("${tms.item.preview.expire.seconds}");
            if (McpString.isNotEmpty(expireSeconds)) {
                expire = Long.parseLong(expireSeconds);
            }
        } catch (Exception e) {
            logger.info("property {} not set, item will not cache", "tms.item.preview.expire.seconds");
        }
        return new DpsTemplateLoader(appContext, domainId, httpProxyDataLoader, templateLoaderCache, expire);
    }

    @Bean
    @Scope("prototype")
    public AbstractTemplateLoader workTemplateLoader(String domainId, String workerId, List<String> componentIdList)
            throws TemplateParseException, TmsException {
        HttpProxyDataLoader httpProxyDataLoader = appContext.getBean(HttpProxyDataLoader.class, itemApiHost, itemApiPath);
        return new DpsWorkTemplateLoader(appContext, domainId, httpProxyDataLoader, workerId, componentIdList);
    }

    @Bean
    @Scope("prototype")
    public MokaPreviewTemplateMerger previewTemplateMerger(DomainItem domainItem)
            throws IOException {
        // AbstractTemplateLoader assistantTemplateLoader =
        // this.appContext.getBean(AbstractTemplateLoader.class, defaultTemplateDomain);
        String domainId = domainItem.getString(ItemConstants.DOMAIN_ID);
        // String domainUrl = domainItem.getString(ItemConstants.DOMAIN_URL);
        String apiHost = domainItem.getString(ItemConstants.DOMAIN_API_HOST);
        String apiPath = domainItem.getString(ItemConstants.DOMAIN_API_PATH);
        HttpProxyDataLoader httpProxyDataLoader = appContext.getBean(HttpProxyDataLoader.class, apiHost, apiPath);
        // AbstractTemplateLoader templateLoader =
        // this.appContext.getBean(AbstractTemplateLoader.class, domainId);
        AbstractTemplateLoader templateLoader = (AbstractTemplateLoader) this.appContext.getBean("templateLoader", domainId);
        DomainResolver domainResolver = this.appContext.getBean(DomainResolver.class);
        MokaPreviewTemplateMerger ptm =
                new MokaPreviewTemplateMerger(this.appContext, domainItem, domainResolver, templateLoader, httpProxyDataLoader);
        return ptm;
    }

    @Bean
    @Scope("prototype")
    public MokaPreviewTemplateMerger previewWorkTemplateMerger(DomainItem domainItem, String workerId, List<String> componentIdList)
            throws IOException {
        // AbstractTemplateLoader assistantTemplateLoader =
        // this.appContext.getBean(AbstractTemplateLoader.class, defaultTemplateDomain);
        String domainId = domainItem.getString(ItemConstants.DOMAIN_ID);
        String apiHost = domainItem.getString(ItemConstants.DOMAIN_API_HOST);
        String apiPath = domainItem.getString(ItemConstants.DOMAIN_API_PATH);
        HttpProxyDataLoader httpProxyDataLoader = appContext.getBean(HttpProxyDataLoader.class, apiHost, apiPath);
        // AbstractTemplateLoader templateLoader = this.appContext
        // .getBean(AbstractTemplateLoader.class, domainId, workerId, componentId);
        AbstractTemplateLoader templateLoader =
                (AbstractTemplateLoader) this.appContext.getBean("workTemplateLoader", domainId, workerId, componentIdList);
        DomainResolver domainResolver = this.appContext.getBean(DomainResolver.class);
        MokaPreviewTemplateMerger ptm =
                new MokaPreviewTemplateMerger(this.appContext, domainItem, domainResolver, templateLoader, httpProxyDataLoader, workerId);
        return ptm;
    }

}
