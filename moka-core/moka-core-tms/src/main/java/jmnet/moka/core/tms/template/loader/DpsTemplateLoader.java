package jmnet.moka.core.tms.template.loader;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.fasterxml.jackson.core.type.TypeReference;
import jmnet.moka.common.JSONResult;
import jmnet.moka.common.template.Constants;
import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.loader.HttpProxyDataLoader;
import jmnet.moka.common.template.loader.TemplateLoader;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MspConstants;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.tms.exception.TmsException;
import jmnet.moka.core.tms.merge.KeyResolver;
import jmnet.moka.core.tms.merge.item.ComponentAd;
import jmnet.moka.core.tms.merge.item.MergeItem;
import jmnet.moka.core.tms.merge.item.PageItem;

/**
 * <pre>
 * JSON형태의 템플릿 정보를 로딩하고 캐싱을 관리한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * 
 * @since 2019. 9. 4. 오후 4:16:52
 * @author kspark
 */
public class DpsTemplateLoader extends AbstractTemplateLoader {
    public static final String ITEM_API_DOMAIN = "domain.list";
    public static final String API_RESERVED = "reserved.list";
    public static final String ITEM_API_PAGE = "page.list";
    public static final String ITEM_API_CONTAINER = "container";
    public static final String ITEM_API_COMPONENT = "component";
    public static final String ITEM_API_TEMPLATE = "template";
    public static final String ITEM_API_DATASET = "dataset";
    public static final String ITEM_API_AD = "ad";
    public static final String ITEM_API_SKIN = "skin";
    public static final String PARAM_DOMAIN_ID = "domainId";
    public static final String PARAM_ITEM_ID = "id";
    public static final String PARAM_TBODY = "tBody";
    public static final String DATA_SELECT_COMPONENT_AD = "COMPONENT_AD";

    protected static Map<String, String> itemApiMap = new HashMap<String, String>();
    static {
        itemApiMap.put(MspConstants.ITEM_DOMAIN, ITEM_API_DOMAIN);
        itemApiMap.put(MspConstants.ITEM_PAGE, ITEM_API_PAGE);
        itemApiMap.put(MspConstants.ITEM_CONTAINER, ITEM_API_CONTAINER);
        itemApiMap.put(MspConstants.ITEM_COMPONENT, ITEM_API_COMPONENT);
        itemApiMap.put(MspConstants.ITEM_TEMPLATE, ITEM_API_TEMPLATE);
        itemApiMap.put(MspConstants.ITEM_DATASET, ITEM_API_DATASET);
        itemApiMap.put(MspConstants.ITEM_AD, ITEM_API_AD);
        itemApiMap.put(MspConstants.ITEM_CONTENT_SKIN, ITEM_API_SKIN);
    }
    protected HttpProxyDataLoader httpProxyDataLoader;
    private static final Logger logger = LoggerFactory.getLogger(DpsTemplateLoader.class);
    private static final DpsItemFactory DPS_ITEM_FACTORY = new DpsItemFactory();

    public DpsTemplateLoader(String domainId, HttpProxyDataLoader httpProxyDataLoader)
            throws TemplateParseException, TmsException {
        this(domainId, httpProxyDataLoader, false, 0L);
    }

    public DpsTemplateLoader(String domainId, HttpProxyDataLoader httpProxyDataLoader,
            boolean cacheable, long itemExpireSeconds) {
        super(domainId, cacheable, itemExpireSeconds);
        try {
            this.httpProxyDataLoader = httpProxyDataLoader;
            loadUri();
        } catch (Exception e) {
            logger.warn("TemplateLoader Creation failed: {}", e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    public void loadUri() throws TmsException {

        try {
            HashMap<String, String> newUri2PageIdMap = new HashMap<String, String>(256);

            Map<String, Object> parameterMap = new LinkedHashMap<String, Object>();
            parameterMap.put(PARAM_DOMAIN_ID, this.domainId);
            parameterMap.put(PARAM_TBODY, "N");
            JSONResult jsonResult =
                    this.httpProxyDataLoader.getJSONResult(ITEM_API_PAGE, parameterMap, true);
            Object jsonArray = (JSONArray) jsonResult.get(Constants.DEFAULT_LOOP_DATA_SELECT);
            for (JSONObject jsonObject : (List<JSONObject>) jsonArray) {
                Map<String, Object> valueMap = ResourceMapper.getDefaultObjectMapper()
                        .convertValue(jsonObject, new TypeReference<Map<String, Object>>() {});
                PageItem pageItem = DPS_ITEM_FACTORY.getPageItem(valueMap);
                // PG일 경우 URL과 매핑한다.
                String itemKey = KeyResolver.makeItemKey(this.domainId, pageItem.getItemType(),
                        pageItem.getItemId());
                newUri2PageIdMap.put(pageItem.getString(ItemConstants.PAGE_URL), itemKey);
            }
            this.uri2ItemMap = newUri2PageIdMap;

        } catch (Exception e) {
            // 로딩된 정보가 있으면 유지하고, 없으면(초기로딩) 맵을 생성한다.
            if (this.uri2ItemMap == null) {
                this.uri2ItemMap = new HashMap<String, String>(256);
            }
            throw new TmsException("Url load fail from DPS", e);
        }
    }

    @Override
    public void setAssistantTemplateLoader(TemplateLoader<MergeItem> assistantTemplateLoader) {
        this.assistantTemplateLoader = assistantTemplateLoader;
        this.hasAssistantTemplateLoader = true;
    }

    /**
     * <pre>
     * 템플릿 내용을 로딩한다.
     * </pre>
     * 
     * @param itemType 템플릿 타입
     * @param itemId 아이디
     * @return 템플릿 내용
     * @throws TemplateParseException 템플릿 파싱 오류
     * @throws TemplateLoadException
     */
    private MergeItem loadJson(String itemType, String itemId)
            throws TemplateParseException, TemplateLoadException {

        String api = itemApiMap.get(itemType);
        Map<String, Object> parameterMap = new LinkedHashMap<String, Object>();
        // 아이템 아이디가 unique하므로 domainId를 제외함
        // parameterMap.put(PARAM_DOMAIN_ID, this.domainId);
        parameterMap.put(PARAM_ITEM_ID, itemId);

        MergeItem item = null;
        try {
            JSONResult jsonResult = this.httpProxyDataLoader.getJSONResult(api, parameterMap, true);
            JSONArray jsonArray = (JSONArray) jsonResult.get(Constants.DEFAULT_LOOP_DATA_SELECT);
            JSONObject jsonObject = (JSONObject) jsonArray.get(0);
            item = DPS_ITEM_FACTORY.getItem(itemType, jsonObject);
            // ComponentItem인 경우 COMPONENT_AD를 처리한다
            if (itemType.equals(MspConstants.ITEM_COMPONENT)) {
                setComponentAd(item, jsonResult);
            }
            String itemKey = KeyResolver.makeItemKey(this.domainId, itemType, itemId);
            // PG일 경우 URL과 매핑한다.
            if (itemType.equals(MspConstants.ITEM_PAGE)) {
                this.uri2ItemMap.put(item.getString(ItemConstants.PAGE_URL), itemKey);
            }
            if (cacheable) {
                this.mergeItemMap.put(itemKey, item);
            }
            logger.debug("Item Loaded: {} {}", itemType, itemId);
        } catch (DataLoadException e) {
            throw new TemplateLoadException(String.format("TemplateItem load fail: %s %s %s",
                    this.domainId, itemType, itemId), e);
        } catch (Exception e) {
            if (this.hasAssistantTemplateLoader) {
                logger.debug("Template Loaded Fail And Will Retry : {} {} {}", itemType, itemId,
                        e.getMessage());
                item = this.assistantTemplateLoader.getItem(itemType, itemId);
            } else {
                throw new TemplateLoadException(
                        String.format("Template Loaded Fail: %s %s", itemType, itemId), e);
            }
        }
        return item;
    }

    protected void setComponentAd(MergeItem item, JSONResult jsonResult) {
        JSONResult componentAdResult = (JSONResult) jsonResult.get(DATA_SELECT_COMPONENT_AD);
        JSONArray jsonArray = (JSONArray) componentAdResult.get(Constants.DEFAULT_LOOP_DATA_SELECT);
        List<Map<String, Object>> componentAdList = ResourceMapper.getDefaultObjectMapper()
                .convertValue(jsonArray, ResourceMapper.TYPEREF_LIST_MAP);
        if (componentAdList != null && componentAdList.size() > 0) {
            List<ComponentAd> list = new ArrayList<ComponentAd>(4);
            for (Map<String, Object> map : componentAdList) {
                String adId = map.get(ItemConstants.DpsItemConstants.COMPONENTAD_AD_ID).toString();
                String adName =
                        (String) map.get(ItemConstants.DpsItemConstants.COMPONENTAD_AD_NAME);
                int listParagraph = Integer.parseInt(map
                        .get(ItemConstants.DpsItemConstants.COMPONENTAD_LIST_PARAGRAPH).toString());
                ComponentAd componentAd = new ComponentAd(adId, adName, listParagraph);
                list.add(componentAd);
            }
            item.put(ItemConstants.COMPONENTAD_LIST, list);
        }
    }

    public String getItemKey(String uri) {
        return this.uri2ItemMap.get(uri);
    }

    public MergeItem getItem(String itemType, String itemId)
            throws TemplateParseException, TemplateLoadException {
        return getItem(itemType, itemId, false);
    }

    public MergeItem getItem(String itemType, String itemId, boolean force)
            throws TemplateParseException, TemplateLoadException {
        String itemKey = KeyResolver.makeItemKey(this.domainId, itemType, itemId);
        MergeItem item = null;
        if (force || cacheable == false || this.mergeItemMap.containsKey(itemKey) == false) {
            item = this.loadJson(itemType, itemId);
        } else {
            item = this.mergeItemMap.get(itemKey);
        }

        // pageItem이고 사용여부가 Y가 아니면 uri에서 제거
        if (itemType.equals(MspConstants.ITEM_PAGE)) { // PG면 url에서 제거
            if (item.getString(ItemConstants.PAGE_USE_YN).equals("Y") == false) {
                this.uri2ItemMap.remove(item.getString(ItemConstants.PAGE_URL));
            }
        }

        if (item == null) {
            logger.error("Template Content Not Found : {} {}", itemType, itemId);
            return null;
        }

        return item;
    }

}
