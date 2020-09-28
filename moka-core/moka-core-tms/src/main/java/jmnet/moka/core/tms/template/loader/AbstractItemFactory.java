package jmnet.moka.core.tms.template.loader;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import jmnet.moka.core.common.MokaConstants;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.tms.exception.TmsException;
import jmnet.moka.core.tms.merge.item.AdItem;
import jmnet.moka.core.tms.merge.item.ComponentItem;
import jmnet.moka.core.tms.merge.item.ContainerItem;
import jmnet.moka.core.tms.merge.item.ContentSkinItem;
import jmnet.moka.core.tms.merge.item.DatasetItem;
import jmnet.moka.core.tms.merge.item.DomainItem;
import jmnet.moka.core.tms.merge.item.MergeItem;
import jmnet.moka.core.tms.merge.item.PageItem;
import jmnet.moka.core.tms.merge.item.TemplateItem;

/**
 * 
 * <pre>
 * 아이템 정보를 생성한다.
 * jmnet.moka.core.common.ItemConstants.*ItemConstants의 설정된 
 * 속성명을 jmnet.moka.core.common.ItemConstants 기준으로 변경한다. 
 * 2020. 3. 20. kspark 최초생성
 * </pre>
 * 
 * @since 2020. 3. 20. 오후 5:01:59
 * @author kspark
 */
public abstract class AbstractItemFactory {
    public final static Logger logger = LoggerFactory.getLogger(AbstractItemFactory.class);

    protected static final List<String> DOMAIN_LIST = makeConstantArray("DOMAIN_");
    protected static final List<String> PAGE_LIST = makeConstantArray("PAGE_");
    protected static final List<String> CONTAINER_LIST = makeConstantArray("CONTAINER_");
    protected static final List<String> COMPONENT_LIST = makeConstantArray("COMPONENT_");
    protected static final List<String> TEMPLATE_LIST = makeConstantArray("TEMPLATE_");
    protected static final List<String> DATASET_LIST = makeConstantArray("DATASET_");
    protected static final List<String> AD_LIST = makeConstantArray("AD_");
    protected static final List<String> SKIN_LIST = makeConstantArray("SKIN_");
    //    protected static TypeReference<Map<String, Object>> ITEM_TYPE_REFERENCE =
    //            new TypeReference<Map<String, Object>>() {
    //            };

    private static List<String> makeConstantArray(String prefix) {
        Field[] fields = ItemConstants.class.getFields();
        List<String> list = new ArrayList<String>(16);
        String fieldName;
        for (Field field : fields) {
            fieldName = field.getName();
            if (fieldName.startsWith(prefix)) {
                list.add(fieldName);
            }
        }
        return list;
    }

    @SuppressWarnings("unchecked")
    public List<DomainItem> getDomainItemList(String json, long lastLoaded)
            throws TemplateLoadException {
        try {
            JSONParser jsonParser = new JSONParser();
            JSONArray jsonArray = (JSONArray) jsonParser.parse(json);
            List<DomainItem> itemList = new ArrayList<DomainItem>(16);
            for (JSONObject jsonObject : (List<JSONObject>) jsonArray) {
                DomainItem domainItem = new DomainItem();
                Map<String, Object> valueMap = ResourceMapper.getDefaultObjectMapper()
                        .convertValue(jsonObject, ResourceMapper.TYPEREF_MAP_OBJECT);
                setEntry(domainItem, valueMap, DOMAIN_LIST);
                itemList.add(domainItem);
            }
            return itemList;
        } catch (Exception e) {
            throw new TemplateLoadException("DomainItem list load failed", e);
        }
    }

    @SuppressWarnings("unchecked")
    public List<DomainItem> getDomainItemList(JSONArray jsonArray, long lastLoaded)
            throws TemplateLoadException {
        try {
            List<DomainItem> domainItemList = new ArrayList<DomainItem>(16);
            for (JSONObject jsonObject : (List<JSONObject>) jsonArray) {
                DomainItem domainItem = new DomainItem();
                Map<String, Object> valueMap = ResourceMapper.getDefaultObjectMapper()
                        .convertValue(jsonObject, ResourceMapper.TYPEREF_MAP_OBJECT);
                setEntry(domainItem, valueMap, DOMAIN_LIST);
                domainItemList.add(domainItem);
            }
            return domainItemList;
        } catch (Exception e) {
            throw new TemplateLoadException("DomainItem list load failed", e);
        }
    }


    public MergeItem getItem(String itemType, String json) throws TmsException {
        try {
            JSONParser jsonParser = new JSONParser();
            JSONObject jsonObject = (JSONObject) jsonParser.parse(json);
            Map<String, Object> valueMap = ResourceMapper.getDefaultObjectMapper()
                    .convertValue(jsonObject, ResourceMapper.TYPEREF_MAP_OBJECT);
            if (itemType.equals(MokaConstants.ITEM_PAGE)) {
                return getPageItem(valueMap);
            } else if (itemType.equals(MokaConstants.ITEM_CONTENT_SKIN)) {
                return getContentSkinItem(valueMap);
            } else if (itemType.equals(MokaConstants.ITEM_CONTAINER)) {
                return getContainerItem(valueMap);
            } else if (itemType.equals(MokaConstants.ITEM_COMPONENT)) {
                return getComponentItem(valueMap);
            } else if (itemType.equals(MokaConstants.ITEM_TEMPLATE)) {
                return getTemplateItem(valueMap);
            } else if (itemType.equals(MokaConstants.ITEM_DATASET)) {
                return getDatasetItem(valueMap);
            } else if (itemType.equals(MokaConstants.ITEM_AD)) {
                return getAdItem(valueMap);
            }
            return null;
        } catch (Exception e) {
            throw new TmsException("Item load failed", e);
        }
    }

    public MergeItem getItem(String itemType, JSONObject jsonObject)
            throws IllegalArgumentException, ParseException, TmsException {
        try {
            Map<String, Object> valueMap = ResourceMapper.getDefaultObjectMapper()
                    .convertValue(jsonObject, ResourceMapper.TYPEREF_MAP_OBJECT);
            if (itemType.equals(MokaConstants.ITEM_PAGE)) {
                return getPageItem(valueMap);
            } else if (itemType.equals(MokaConstants.ITEM_CONTENT_SKIN)) {
                return getContentSkinItem(valueMap);
            } else if (itemType.equals(MokaConstants.ITEM_CONTAINER)) {
                return getContainerItem(valueMap);
            } else if (itemType.equals(MokaConstants.ITEM_COMPONENT)) {
                return getComponentItem(valueMap);
            } else if (itemType.equals(MokaConstants.ITEM_TEMPLATE)) {
                return getTemplateItem(valueMap);
            } else if (itemType.equals(MokaConstants.ITEM_DATASET)) {
                return getDatasetItem(valueMap);
            } else if (itemType.equals(MokaConstants.ITEM_AD)) {
                return getAdItem(valueMap);
            }
            return null;
        } catch (Exception e) {
            throw new TmsException("Item load failed", e);
        }
    }

    public PageItem getPageItem(Map<String, Object> valueMap)
            throws IllegalArgumentException, ParseException {
        PageItem pageItem = new PageItem();
        setEntry(pageItem, valueMap, PAGE_LIST);
        return pageItem;
    }

    public ContentSkinItem getContentSkinItem(Map<String, Object> valueMap)
            throws IllegalArgumentException, ParseException {
        ContentSkinItem skinItem = new ContentSkinItem();
        setEntry(skinItem, valueMap, SKIN_LIST);
        return skinItem;
    }

    public ContainerItem getContainerItem(Map<String, Object> valueMap)
            throws IllegalArgumentException, ParseException {
        ContainerItem containerItem = new ContainerItem();
        setEntry(containerItem, valueMap, CONTAINER_LIST);
        return containerItem;
    }

    public ComponentItem getComponentItem(Map<String, Object> valueMap)
            throws IllegalArgumentException, ParseException {
        ComponentItem componentItem = new ComponentItem();
        setEntry(componentItem, valueMap, COMPONENT_LIST);
        return componentItem;
    }

    public TemplateItem getTemplateItem(Map<String, Object> valueMap)
            throws IllegalArgumentException, ParseException {
        TemplateItem templateItem = new TemplateItem();
        setEntry(templateItem, valueMap, TEMPLATE_LIST);
        return templateItem;
    }

    public DatasetItem getDatasetItem(Map<String, Object> valueMap)
            throws IllegalArgumentException, ParseException {
        DatasetItem datesetItem = new DatasetItem();
        setEntry(datesetItem, valueMap, DATASET_LIST);
        return datesetItem;
    }

    public AdItem getAdItem(Map<String, Object> valueMap)
            throws IllegalArgumentException, ParseException {
        AdItem adItem = new AdItem();
        setEntry(adItem, valueMap, AD_LIST);
        return adItem;
    }


    public abstract void setEntry(MergeItem item, Map<String, Object> map,
            List<String> constantNameList);
}
