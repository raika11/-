package jmnet.moka.core.tms.mvc;

import com.hazelcast.core.HazelcastInstance;
import com.hazelcast.core.IMap;
import java.io.Serializable;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import jmnet.moka.common.JSONResult;
import jmnet.moka.common.cache.CacheManager;
import jmnet.moka.common.cache.HazelcastCache;
import jmnet.moka.common.template.Constants;
import jmnet.moka.common.template.loader.HttpProxyDataLoader;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.tms.exception.TmsException;
import jmnet.moka.core.tms.merge.item.DomainItem;
import jmnet.moka.core.tms.merge.item.MergeItem;
import jmnet.moka.core.tms.mvc.domain.AbstractDomainResolver;
import jmnet.moka.core.tms.mvc.domain.ReservedMap;
import jmnet.moka.core.tms.template.loader.DpsItemFactory;
import jmnet.moka.core.tms.template.loader.DpsTemplateLoader;
import jmnet.moka.core.tms.template.parse.model.MokaTemplateRoot;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.support.GenericApplicationContext;

/**
 * <pre>
 * CDN으로 트래픽분산된 기사를 redirect한다.
 * 2021. 1. 20. kspark 최초생성
 * </pre>
 * 
 * @since 2021. 2. 19. 오전 8:40:06
 * @author kspark
 */
public class CdnRedirector {
    public static final Logger logger = LoggerFactory.getLogger(CdnRedirector.class);
    private HttpProxyDataLoader httpProxyDataLoader;
    private ConcurrentMap<String, CdnRedirect> cdnRedirectMap;
    private static String PC_TYPE = "P";
    private static String MOBILE_TYPE = "M";

    public static class CdnRedirect implements Serializable {
        private static final long serialVersionUID = 5896744588627624432L;
        private String pcCdnUrl;
        private String mobileCdnUrl;
        public CdnRedirect(String pcCdnUrl, String mobileCdnUrl) {
            this.pcCdnUrl = pcCdnUrl;
            this.mobileCdnUrl = mobileCdnUrl;
        }
        public String getPcCdnUrl() {
            return this.pcCdnUrl;
        }
        public String getMobileCdnUrl() {
            return this.mobileCdnUrl;
        }
    }

    public CdnRedirector(GenericApplicationContext appContext, HttpProxyDataLoader httpProxyDataLoader) {
        try {
            this.httpProxyDataLoader = httpProxyDataLoader;
            HazelcastInstance hzInstance = null;
            HazelcastCache hzCache = null;
            try {
                CacheManager cacheManager = appContext.getBean(CacheManager.class);
                if (cacheManager != null) {
                    hzCache = (HazelcastCache) cacheManager.getCache(HazelcastCache.class);
                    hzInstance = hzCache
                            .getHazelcastDelegator()
                            .getHazelcastInstance();
                }
            } catch (Exception e) {
                logger.warn("Load hazelcast Instance fail :{}", e.getMessage());
            }

            if (hzInstance != null ) {
                this.cdnRedirectMap = hzInstance.getMap("cdnRedirectMap");
            } else {
                this.cdnRedirectMap = new ConcurrentHashMap<String, CdnRedirect>();
            }
            this.loadCdnArticle();
        } catch (Exception e) {
            logger.warn("CdnRedirector Creation failed: {}", e.getMessage());
        }
    }

    public void loadCdnArticle() throws TmsException {
        try {
            Map<String, Object> parameterMap = new HashMap<String, Object>();
            JSONResult jsonResult = this.httpProxyDataLoader
                    .getJSONResult("cdnArticle.list", parameterMap, true);
            List<Map<String,Object>> cdnArticleList = jsonResult.getDataList();
            for ( Map<String,Object> cdnArticle : cdnArticleList) {
                CdnRedirect cdnRedirect = new CdnRedirect(cdnArticle.get("CDN_URL_NEWS").toString(),
                        cdnArticle.get("CDN_URL_MNEWS").toString()) ;
                this.cdnRedirectMap.put(cdnArticle.get("TOTAL_ID").toString(),cdnRedirect);
            }
        } catch (Exception e) {
            logger.error("CdnRedirect Loading Fail: {}",e);
            throw new TmsException("CdnRedirect Loading Fail", e);
        }
    }

    public String getCdnUrl(String type, String articleId) {
        if ( this.cdnRedirectMap.containsKey(articleId)) {
            CdnRedirect cdnRedirect = this.cdnRedirectMap.get(articleId);
            if ( type.equals(PC_TYPE)) {
                return cdnRedirect.getPcCdnUrl();
            } else if ( type.equals(MOBILE_TYPE)) {
                return cdnRedirect.getMobileCdnUrl();
            }
        }
        return null;
    }

    public void updateCdnRedirect(List<Map<String,Object>> cdnRedirectList) {
        if ( cdnRedirectList != null) {
            Map<String,CdnRedirect> newRedirectMap = new HashMap<>();
            for ( Map<String,Object> map : cdnRedirectList) {
                String articleId = map.get("totalId").toString();
                String pcCdnUrl = map.get("cdnUrlNews").toString();
                String mobileCdnUrl = map.get("cdnUrlMnews").toString();
                newRedirectMap.put(articleId,new CdnRedirect(pcCdnUrl,mobileCdnUrl));
            }
            // 제거 대상 처리
            for ( String articleId : this.cdnRedirectMap.keySet()) {
                if ( !newRedirectMap.containsKey(articleId)) {
                    this.cdnRedirectMap.remove(articleId);
                }
            }
            this.cdnRedirectMap.putAll(newRedirectMap);
        }
    }
}
