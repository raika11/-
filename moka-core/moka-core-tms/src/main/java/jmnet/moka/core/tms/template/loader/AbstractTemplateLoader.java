package jmnet.moka.core.tms.template.loader;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.loader.TemplateLoader;
import jmnet.moka.common.template.parse.model.TemplateRoot;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.tms.exception.TmsException;
import jmnet.moka.core.tms.merge.KeyResolver;
import jmnet.moka.core.tms.merge.item.AdItem;
import jmnet.moka.core.tms.merge.item.ComponentItem;
import jmnet.moka.core.tms.merge.item.ContainerItem;
import jmnet.moka.core.tms.merge.item.MergeItem;
import jmnet.moka.core.tms.merge.item.PageItem;
import jmnet.moka.core.tms.merge.item.TemplateItem;
import jmnet.moka.core.tms.template.parse.model.AdTemplateRoot;
import jmnet.moka.core.tms.template.parse.model.CpTemplateRoot;
import jmnet.moka.core.tms.template.parse.model.CtTemplateRoot;
import jmnet.moka.core.tms.template.parse.model.MspTemplateRoot;
import jmnet.moka.core.tms.template.parse.model.PgTemplateRoot;
import jmnet.moka.core.tms.template.parse.model.TpTemplateRoot;

/**
 * <pre>
 * JSON형태의 템플릿 정보를 로딩하고 캐싱을 관리한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * 
 * @since 2019. 9. 4. 오후 4:16:52
 * @author kspark
 */
public abstract class AbstractTemplateLoader implements TemplateLoader<MergeItem> {
    public static final String URI_REST_PREFIX = "/*";
    protected String domainId;
    protected Map<String, MergeItem> mergeItemMap;
    protected Map<String, MspTemplateRoot> templateRootMap;
    /*  REST 방식일 경우 URI에 "/*" 를 추가한다.     */
    protected Map<String, String> uri2ItemMap;
    protected TemplateLoader<MergeItem> assistantTemplateLoader;
    protected boolean cacheable;
    protected long itemExpireTime;
    protected boolean hasAssistantTemplateLoader = false;

    private static final Logger logger = LoggerFactory.getLogger(AbstractTemplateLoader.class);

    public AbstractTemplateLoader(String domainId) {
        this(domainId, false, 0);
    }

    public AbstractTemplateLoader(String domainId, boolean cacheable, long itemExpireTime) {
        this.domainId = domainId;
        this.cacheable = cacheable;
        this.itemExpireTime = itemExpireTime;
        if (cacheable) {
            this.mergeItemMap = new ConcurrentHashMap<String, MergeItem>(256);
            this.templateRootMap = new ConcurrentHashMap<String, MspTemplateRoot>(256);
        }
        this.uri2ItemMap = new HashMap<String, String>(256);
    }

    public void setAssistantTemplateLoader(
            TemplateLoader<MergeItem> assistantTemplateLoader) {
        this.assistantTemplateLoader = assistantTemplateLoader;
        this.hasAssistantTemplateLoader = true;
    }

    public abstract void loadUri() throws TmsException;

    public String createUri2ItemMapKey(MergeItem item) {
        if (item.getItemType().equals(MokaConstants.ITEM_PAGE)) {
            // REST 방식의 page에 대한 처리
            String urlParam = item.getString(ItemConstants.PAGE_URL_PARAM);
            if ( McpString.isEmpty(urlParam)) {
                return item.getString(ItemConstants.PAGE_URL);
            } else {
                return item.getString(ItemConstants.PAGE_URL)
                        + AbstractTemplateLoader.URI_REST_PREFIX;
            }
        }
        return null;
    }

    public Map<String, String> getUri2ItemMap() {
        return this.uri2ItemMap;
    }

    /**
     * <pre>
     * 아이템의 키를 생성한다. (도메인,아이템타입, 아이템아이디)
     * </pre>
     * 
     * @param uri
     * @return
     */
    public String getItemKey(String uri) {
        return this.uri2ItemMap.get(uri);
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
        MspTemplateRoot templateRoot = getParsedTemplate(item);
        if (cacheable) {
            this.templateRootMap.put(itemKey, templateRoot);
        }
        return templateRoot;
    }

    private MspTemplateRoot getParsedTemplate(MergeItem item)
            throws TemplateParseException {
        MspTemplateRoot templateRoot = null;
        if (item instanceof PageItem) {
            templateRoot = new PgTemplateRoot((PageItem) item);
        } else if (item instanceof ComponentItem) {
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
        MspTemplateRoot templateRoot = null;
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
     * 
     * <pre>
     * 아이템 정보를 다시 로딩하기 위해 삭제한다.
     * </pre>
     * 
     * @param itemType
     * @param itemId
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
                        MspTemplateRoot templateRoot =
                                (MspTemplateRoot) this.getParsedTemplate(itemType, itemId);
                        PageItem pageItem = (PageItem) templateRoot.getItem();
                        if (pageItem.getString(ItemConstants.PAGE_USE_YN).equals("Y")) {
                            this.uri2ItemMap.put(pageItem.getString(ItemConstants.PAGE_URL),
                                    itemKey);
                        }
                    } catch (TemplateParseException | TemplateLoadException e) {
                        logger.error("Purge Item Fail: {} {} {}", this.domainId, itemType, itemId,
                                e);
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
     * @param item
     * @return
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
