package jmnet.moka.core.tms.template.loader;

import com.hazelcast.core.EntryEvent;
import com.hazelcast.core.HazelcastInstance;
import com.hazelcast.core.IMap;
import com.hazelcast.map.listener.EntryAddedListener;
import com.hazelcast.map.listener.EntryEvictedListener;
import com.hazelcast.map.listener.EntryExpiredListener;
import com.hazelcast.map.listener.EntryRemovedListener;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import jmnet.moka.common.cache.CacheManager;
import jmnet.moka.common.cache.HazelcastCache;
import jmnet.moka.common.cache.hazelcast.HazelcastMapListener;
import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.loader.TemplateLoader;
import jmnet.moka.common.template.parse.model.TemplateRoot;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tms.exception.TmsException;
import jmnet.moka.core.tms.merge.KeyResolver;
import jmnet.moka.core.tms.merge.item.AdItem;
import jmnet.moka.core.tms.merge.item.ArticlePageItem;
import jmnet.moka.core.tms.merge.item.ComponentItem;
import jmnet.moka.core.tms.merge.item.ContainerItem;
import jmnet.moka.core.tms.merge.item.MergeItem;
import jmnet.moka.core.tms.merge.item.PageItem;
import jmnet.moka.core.tms.merge.item.TemplateItem;
import jmnet.moka.core.tms.template.parse.model.AdTemplateRoot;
import jmnet.moka.core.tms.template.parse.model.ApTemplateRoot;
import jmnet.moka.core.tms.template.parse.model.CpTemplateRoot;
import jmnet.moka.core.tms.template.parse.model.CtTemplateRoot;
import jmnet.moka.core.tms.template.parse.model.MokaTemplateRoot;
import jmnet.moka.core.tms.template.parse.model.PgTemplateRoot;
import jmnet.moka.core.tms.template.parse.model.TpTemplateRoot;
import org.apache.commons.net.nntp.Article;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.support.GenericApplicationContext;

/**
 * <pre>
 * JSON형태의 템플릿 정보를 로딩하고 캐싱을 관리한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 *
 * @author kspark
 * @since 2019. 9. 4. 오후 4:16:52
 */
public abstract class AbstractTemplateLoader implements TemplateLoader<MergeItem> {
    public static final String PATH_PARAM_PREFIX = "/*";
    protected String domainId;

    protected ConcurrentMap<String, MergeItem> mergeItemMap;
    protected ConcurrentMap<String, MokaTemplateRoot> templateRootMap;
    /*  REST 방식일 경우 URI에 "/*" 를 추가한다.     */
    protected ConcurrentMap<String, String> uri2ItemMap;
    protected boolean cacheable;
    protected long itemExpireTime;

    private static final Logger logger = LoggerFactory.getLogger(AbstractTemplateLoader.class);

    public AbstractTemplateLoader(GenericApplicationContext appContext, String domainId, boolean cacheable, long itemExpireTime) {
        this.domainId = domainId;
        this.cacheable = cacheable;
        this.itemExpireTime = itemExpireTime;
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

        if (hzInstance != null && cacheable) {
            this.mergeItemMap = hzInstance.getMap(this.domainId+"_mergeItem");
            this.uri2ItemMap = hzInstance.getMap(this.domainId+"_uri2Item");
            hzCache.getHazelcastDelegator().addListener((IMap<String,String>)this.uri2ItemMap);
        } else {
            this.uri2ItemMap = new ConcurrentHashMap<>();
            this.mergeItemMap = new ConcurrentHashMap<>();
        }
        if (cacheable) {
            this.templateRootMap = new ConcurrentHashMap<String, MokaTemplateRoot>(256);
        }
    }

    public abstract void loadUri()
            throws TmsException;

    public abstract String getArticlePageId(String domainId, String articleType)
            throws DataLoadException;

    public Map<String, String> getUri2ItemMap() {
        return this.uri2ItemMap;
    }

    /**
     * <pre>
     * uri에 해당하는 아이템의 키를 반환한다. (도메인,아이템타입, 아이템아이디)
     * uri의 case-insensitive를 지원하기 위해 uri를 소문자로 변환후 비교한다.
     * </pre>
     *
     * @param uri uri
     * @return 아이템 키
     */
    public String getItemKey(String uri) {
        if (uri == null) {
            return null;
        }
        uri = uri.toLowerCase(); // 소문자로 비교한다.
        String itemKey = this.uri2ItemMap.get(uri); // uri case-insensitive
        if (itemKey != null) { // REST방식 URL이 아닌 경우
            return itemKey;
        }
        // REST 방식 중 default 파라미터를 사용하는 경우
        if ( this.uri2ItemMap.containsKey(uri+AbstractTemplateLoader.PATH_PARAM_PREFIX)) {
            return this.uri2ItemMap.get(uri+AbstractTemplateLoader.PATH_PARAM_PREFIX);
        }
        // REST 방식인 경우 마지막 경로를 제거하고 PageItem을 찾는다.
        int lastSlashIndex = uri.lastIndexOf("/");
        if (lastSlashIndex > 0) { // URL_PARAM을 사용하는  페이지의 경우
            return this.uri2ItemMap.get(uri.substring(0, lastSlashIndex) + AbstractTemplateLoader.PATH_PARAM_PREFIX);
        }
        return null;
    }

    protected String getPageUriLowerCase(String uri, String urlParam) {
        // 2020-11-26 backoffice에서 path parameter가 있을 경우 /*를 넣어주는 방식으로 변경
//        if (McpString.isNotEmpty(urlParam)) {
//            uri = uri + AbstractTemplateLoader.PATH_PARAM_PREFIX;
//        }
        return uri.toLowerCase();
    }

    /**
     * uri를 아이템 키에 매핑시킨다. case-insensitive를 지원하기 위해 uri의 소문자로 변환한다.
     *
     * @param pageItem 페이지 아이템
     */
    protected void addUri(PageItem pageItem) {
        String uri = getPageUriLowerCase(pageItem.getString(ItemConstants.PAGE_URL), pageItem.getString(ItemConstants.PAGE_URL_PARAM));
        String itemKey = KeyResolver.makeItemKey(this.domainId, pageItem.getItemType(), pageItem.getItemId());
        if (uri != null) {
            this.uri2ItemMap.put(uri, itemKey);
            logger.debug("Uri added:{} {}", this.domainId, uri);
        }
    }

    /**
     * uri를 제거시킨다. case-insensitive를 지원하기 위해 uri의 소문자로 변환한다.
     *
     * @param pageItem 페이지 아이템
     */
    public void removeUri(PageItem pageItem) {
        String uri = getPageUriLowerCase(pageItem.getString(ItemConstants.PAGE_URL), pageItem.getString(ItemConstants.PAGE_URL_PARAM));
        if (uri != null) {
            // uri case-insensitive를 위해 소문자로 변환
            this.uri2ItemMap.remove(uri);
            logger.debug("Uri removed:{} {}", this.domainId, uri);
        }
    }

    @Override
    public abstract MergeItem getItem(String itemType, String itemId)
            throws TemplateLoadException, TemplateParseException;


    public abstract MergeItem getItem(String itemType, String itemId, boolean force)
            throws TemplateLoadException, TemplateParseException;

    @Override
    public TemplateRoot setItem(String itemType, String itemId, MergeItem item)
            throws TemplateParseException {
        String itemKey = KeyResolver.makeItemKey(this.domainId, itemType, itemId);
        if (cacheable) {
            this.mergeItemMap.put(itemKey, item);
        }
        MokaTemplateRoot templateRoot = getParsedTemplate(item);
        if (cacheable) {
            this.templateRootMap.put(itemKey, templateRoot);
        }
        return templateRoot;
    }

    private MokaTemplateRoot getParsedTemplate(MergeItem item)
            throws TemplateParseException {
        MokaTemplateRoot templateRoot = null;
        if (item instanceof PageItem) {
            templateRoot = new PgTemplateRoot((PageItem) item);
        } else if (item instanceof ArticlePageItem)
            templateRoot = new ApTemplateRoot((ArticlePageItem) item);
        else if (item instanceof ComponentItem) {
            templateRoot = new CpTemplateRoot((ComponentItem) item, this);
        } else if (item instanceof ContainerItem) {
            templateRoot = new CtTemplateRoot((ContainerItem) item);
        } else if (item instanceof TemplateItem) {
            templateRoot = new TpTemplateRoot((TemplateItem) item);
        } else if (item instanceof AdItem) {
            templateRoot = new AdTemplateRoot((AdItem) item);
        }
        return templateRoot;
    }

    @Override
    public TemplateRoot getParsedTemplate(String itemType, String itemId)
            throws TemplateParseException, TemplateLoadException {
        MokaTemplateRoot templateRoot;
        MergeItem remoteItem = null;
        String itemKey = KeyResolver.makeItemKey(this.domainId, itemType, itemId);
        if (cacheable && (templateRoot = this.templateRootMap.get(itemKey)) != null) {
            MergeItem localItem = templateRoot.getItem();
            // expire time을 초과하면 item을 가져와 변경여부를 체크한다.
            if (System.currentTimeMillis() - localItem.getLastLoaded() > this.itemExpireTime) {
                remoteItem = getItem(itemType, itemId, true);
                if (localItem.equalsModified(remoteItem)) {
                    // 로드 시간을 reset 한다.
                    localItem.resetLastLoad();
                    return templateRoot;
                }
                // 변경된 아이템의  Template 파싱하는 과정은 아래에서 처리한다.
            } else {
                return templateRoot;
            }
        }
        if (remoteItem == null) {
            remoteItem = getItem(itemType, itemId);
        }
        templateRoot = getParsedTemplate(remoteItem);
        if (cacheable) {
            this.templateRootMap.put(itemKey, templateRoot);
        }
        return templateRoot;
    }

    /**
     * <pre>
     * 아이템 정보를 다시 로딩하기 위해 삭제한다.
     * </pre>
     *
     * @param itemType 아이템 타입
     * @param itemId   아이템 ID
     */
    public void purgeItem(String itemType, String itemId) {
        String itemKey = KeyResolver.makeItemKey(this.domainId, itemType, itemId);
        if (this.mergeItemMap != null) {
            if (this.mergeItemMap.containsKey(itemKey)) { // 존재하면 remove
                this.mergeItemMap.remove(itemKey);
                logger.debug("Purged: {} {} {}", this.domainId, itemType, itemId);
            } else { // 존재하지 않고, 신규 PG면 uri등록이 필요함
                if (itemType.equals(MokaConstants.ITEM_PAGE)) {
                    try {
                        MokaTemplateRoot templateRoot = (MokaTemplateRoot) this.getParsedTemplate(itemType, itemId);
                        PageItem pageItem = (PageItem) templateRoot.getItem();
                        if (pageItem
                                .getString(ItemConstants.PAGE_USE_YN)
                                .equals("Y")) {
                            this.addUri(pageItem);
                        }
                    } catch (TemplateParseException | TemplateLoadException e) {
                        logger.error("Purge Item Fail: {} {} {}", this.domainId, itemType, itemId, e);
                    }
                }
            }
        } else {
            logger.debug("Purge: Item not found : {} {} {}", this.domainId, itemType, itemId);
        }
        if (this.templateRootMap != null) {
            this.templateRootMap.remove(itemKey);
        } else {
            logger.debug("Purge: Item Root not found : {} {} {}", this.domainId, itemType, itemId);
        }
    }

    /**
     * <pre>
     * 아이템 정보에서 템플릿 본문을 반환한다.
     * </pre>
     *
     * @param item 아이템
     * @return 템플릿 텍스트
     */
    protected String getTemplateText(MergeItem item) {
        String templateText = "";
        if (item instanceof PageItem) {
            templateText = (String) item.get(ItemConstants.PAGE_BODY);
            //        } else if (type.equals(MspConstants.ITEM_SKIN)) { //TODO: 스킨처리 결정 후 재정리 필요
            //            templateText = (String) item.get(ItemConstants.PAGE_CONTENT); */
        } else if (item instanceof TemplateItem) {
            templateText = (String) item.get(ItemConstants.TEMPLATE_BODY);
        } else if (item instanceof ContainerItem) {
            templateText = (String) item.get(ItemConstants.CONTAINER_BODY);
        }
        return templateText;
    }
}
