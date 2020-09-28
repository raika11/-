package jmnet.moka.core.tms.template.loader;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import jmnet.moka.core.common.MokaConstants;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.JSONResult;
import jmnet.moka.common.template.Constants;
import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.loader.HttpProxyDataLoader;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.tms.exception.TmsException;
import jmnet.moka.core.tms.merge.KeyResolver;
import jmnet.moka.core.tms.merge.item.MergeItem;

/**
 * <pre>
 * JSON형태의 템플릿 정보를 로딩하고 캐싱을 관리한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * 
 * @since 2019. 9. 4. 오후 4:16:52
 * @author kspark
 */
public class DpsWorkTemplateLoader extends DpsTemplateLoader {
    public static final String ITEM_API_COMPONENT_WORK = "component.work";
    private String workerId;
    private List<String> componentIdList;
    private static final Logger logger = LoggerFactory.getLogger(DpsWorkTemplateLoader.class);
    private static final DpsItemFactory DPS_ITEM_FACTORY = new DpsItemFactory();

    public DpsWorkTemplateLoader(String domainId, HttpProxyDataLoader httpProxyDataLoader,
            String workerId, List<String> componentIdList)
            throws TemplateParseException, TmsException {
        super(domainId, httpProxyDataLoader, false, 0L);
        this.workerId = workerId;
        this.componentIdList = componentIdList;
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
        String api = DpsTemplateLoader.itemApiMap.get(itemType);
        // boolean isWorkComponent = this.workerId != null
        // && itemType.equals(MspConstants.ITEM_COMPONENT) && itemId.equals(this.componentId);
        boolean isWorkComponent = false;
        if (this.workerId != null && itemType.equals(MokaConstants.ITEM_COMPONENT)) {
            if (this.componentIdList.size() == 0 || this.componentIdList.contains(itemId)) {
                isWorkComponent = true;
            }
        }
        if (isWorkComponent) {
            api = ITEM_API_COMPONENT_WORK;
        }
        Map<String, Object> parameterMap = new LinkedHashMap<String, Object>();
        parameterMap.put(PARAM_DOMAIN_ID, this.domainId);
        parameterMap.put(PARAM_ITEM_ID, itemId);
        if (isWorkComponent) {
            parameterMap.put(MokaConstants.PARAM_WORKER_ID, this.workerId);
        }

        MergeItem item = null;
        try {
            JSONResult jsonResult = this.httpProxyDataLoader.getJSONResult(api, parameterMap, true);
            JSONArray jsonArray = (JSONArray) jsonResult.get(Constants.DEFAULT_LOOP_DATA_SELECT);
            JSONObject jsonObject = (JSONObject) jsonArray.get(0);
            item = DPS_ITEM_FACTORY.getItem(itemType, jsonObject);
            // ComponentItem인 경우 COMPONENT_AD를 처리한다
            if (itemType.equals(MokaConstants.ITEM_COMPONENT)) {
                setComponentAd(item, jsonResult);
            }
            String itemKey = KeyResolver.makeItemKey(this.domainId, itemType, itemId);
            // PG일 경우 URL과 매핑한다.
            if (itemType.equals(MokaConstants.ITEM_PAGE)) {
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


    public String getItemKey(String uri) {
        return this.uri2ItemMap.get(uri);
    }

    public MergeItem getItem(String itemType, String itemId)
            throws TemplateParseException, TemplateLoadException {
        return getItem(itemType, itemId, true);
    }

    public MergeItem getItem(String itemType, String itemId, boolean force)
            throws TemplateParseException, TemplateLoadException {

        MergeItem item = this.loadJson(itemType, itemId);
        if (item == null) {
            logger.error("Template Content Not Found : {} {}", itemType, itemId);
            return null;
        }
        return item;
    }

}
