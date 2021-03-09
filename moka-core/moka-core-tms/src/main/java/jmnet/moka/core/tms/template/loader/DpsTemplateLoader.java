package jmnet.moka.core.tms.template.loader;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.common.JSONResult;
import jmnet.moka.common.cache.CacheManager;
import jmnet.moka.common.template.Constants;
import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.loader.HttpProxyDataLoader;
import jmnet.moka.core.common.DpsApiConstants;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.tms.exception.TmsException;
import jmnet.moka.core.tms.merge.KeyResolver;
import jmnet.moka.core.tms.merge.item.MergeItem;
import jmnet.moka.core.tms.merge.item.PageItem;
import jmnet.moka.core.tms.mvc.HttpParamFactory;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
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
public class DpsTemplateLoader extends AbstractTemplateLoader {
    //    public static final String ITEM_API_DOMAIN = "domain.list";
    //    public static final String API_RESERVED = "reserved.list";
    //    public static final String ITEM_API_PAGE = "page.list";
    //    public static final String ITEM_API_CONTAINER = "container";
    //    public static final String ITEM_API_COMPONENT = "component";
    //    public static final String ITEM_API_TEMPLATE = "template";
    //    public static final String ITEM_API_DATASET = "dataset";
    //    public static final String ITEM_API_AD = "ad";
    //    public static final String ITEM_API_ARTICLE_PAGE = "articlePage";
    //    public static final String ITEM_API_ARTICLE_PAGE_ID = "articlePageId";
    public static final String PARAM_DOMAIN_ID = "domainId";
    public static final String PARAM_ITEM_ID = "id";
    public static final String PARAM_TBODY = "tBody";
    public static final String PARAM_ARTICLE_TYPE = "artType";
    public static final String VALUE_ARTICLE_PAGE_SEQ = "ART_PAGE_SEQ";
    private static final String DEFAULT_ARTICLE_TYPE = "B";
    private static final Logger logger = LoggerFactory.getLogger(DpsTemplateLoader.class);
    private static final DpsItemFactory DPS_ITEM_FACTORY = new DpsItemFactory();
    protected static Map<String, String> itemApiMap = new HashMap<String, String>();

    static {
        itemApiMap.put(MokaConstants.ITEM_DOMAIN, DpsApiConstants.ITEM_DOMAIN);
        itemApiMap.put(MokaConstants.ITEM_PAGE, DpsApiConstants.ITEM_PAGE);
        itemApiMap.put(MokaConstants.ITEM_CONTAINER, DpsApiConstants.ITEM_CONTAINER);
        itemApiMap.put(MokaConstants.ITEM_COMPONENT, DpsApiConstants.ITEM_COMPONENT);
        itemApiMap.put(MokaConstants.ITEM_TEMPLATE, DpsApiConstants.ITEM_TEMPLATE);
        itemApiMap.put(MokaConstants.ITEM_DATASET, DpsApiConstants.ITEM_DATASET);
        itemApiMap.put(MokaConstants.ITEM_AD, DpsApiConstants.ITEM_AD);
        itemApiMap.put(MokaConstants.ITEM_ARTICLE_PAGE, DpsApiConstants.ITEM_ARTICLE_PAGE);
    }

    protected HttpProxyDataLoader httpProxyDataLoader;
    // @Value anotation으로 로딩되지 않아 생성자에서 처리
    private String savePagePath;
    // 미리보기용 여부
    private boolean preview;
    private CacheManager cacheManager;
    private HttpParamFactory httpParamFactory;
    private Map<String, String> artTypeToArticlePageIdMap = new HashMap<>();
    private GenericApplicationContext appContext;

    /**
     * DPS로 부터 아이템 정보를 가져와 처리한다.
     *
     * @param appContext          context
     * @param domainId            도메인 Id
     * @param httpProxyDataLoader 로더
     * @param cacheManager        캐시매니저
     * @param cacheable           캐시여부
     * @param preview             미리보기 여부
     * @param itemExpireSeconds   아이템 만료 시간(초)
     */
    public DpsTemplateLoader(GenericApplicationContext appContext, String domainId, HttpProxyDataLoader httpProxyDataLoader,
            CacheManager cacheManager, boolean cacheable, boolean preview, long itemExpireSeconds)
            throws DataLoadException, TmsException {
        super(appContext, domainId, cacheable, itemExpireSeconds);
        try {
            this.httpProxyDataLoader = httpProxyDataLoader;
            this.cacheManager = cacheManager;
            this.preview = preview;
            if (!preview) {
                this.httpParamFactory = (HttpParamFactory) appContext.getBean("httpParamFactory");
                this.savePagePath = appContext
                        .getBeanFactory()
                        .resolveEmbeddedValue("${tms.merge.save.page.path}");
                loadUri();
                // 기본 article 페이지를 로딩한다.
                getArticlePageId(this.domainId, DEFAULT_ARTICLE_TYPE);
            }
        } catch (Exception e) {
            logger.error("TemplateLoader Creation failed: {}", e.getMessage());
            throw e;
        }
    }

    @SuppressWarnings("unchecked")
    @Override
    public void loadUri()
            throws TmsException {

        try {
            HashMap<String, String> newUri2ItemMap = new HashMap<String, String>(256);

            Map<String, Object> parameterMap = new LinkedHashMap<String, Object>();
            parameterMap.put(PARAM_DOMAIN_ID, this.domainId);
            parameterMap.put(PARAM_TBODY, "N");
            JSONResult jsonResult = this.httpProxyDataLoader.getJSONResult(DpsApiConstants.ITEM_PAGE, parameterMap, true);
            Object jsonArray = jsonResult.getDataList();
            for (JSONObject jsonObject : (List<JSONObject>) jsonArray) {
                Map<String, Object> valueMap = ResourceMapper
                        .getDefaultObjectMapper()
                        .convertValue(jsonObject, new TypeReference<Map<String, Object>>() {
                        });
                PageItem pageItem = DPS_ITEM_FACTORY.getPageItem(valueMap);
                // PG일 경우 URL과 매핑한다.
                if (pageItem.getBoolYN(ItemConstants.PAGE_USE_YN)) { // 사용일 경우만 등록한다.
                    // case-insensitive를 지원하기 위해 소문자로 변환
                    String itemKey = KeyResolver.makeItemKey(this.domainId, pageItem.getItemType(), pageItem.getItemId());
                    String uri = getPageUriLowerCase(pageItem.getString(ItemConstants.PAGE_URL), pageItem.getString(ItemConstants.PAGE_URL_PARAM));
                    logger.debug("load uri: {} {}", this.domainId, uri);
                    newUri2ItemMap.put(uri, itemKey);
                    // FILE_YN = Y 일경우 머징된 파일을 로딩한다.
                    if (pageItem.getBoolYN(ItemConstants.PAGE_FILE_YN)) {
                        String mergedPagePath = String.join("/", this.savePagePath, this.domainId, pageItem.getItemId());
                        File mergedPageFile = new File(mergedPagePath);
                        try {
                            String mergedPage = "";
                            if (mergedPageFile.exists()) {
                                mergedPage = new String(Files.readAllBytes(mergedPageFile.toPath()), "UTF-8");
                                this.cacheManager.set(KeyResolver.getCacheType(MokaConstants.ITEM_PAGE),
                                        KeyResolver.makePgItemCacheKey(this.domainId, pageItem.getItemId(), this.httpParamFactory.createDefault()),
                                        mergedPage, 24 * 60 * 60 * 1000L);
                                logger.debug("Merged Page Loaded:{}", uri);
                            }
                        } catch (IOException e) {
                            logger.warn("Page Not Loaded: {} {}", this.domainId, pageItem.getItemId());
                        }
                    }
                }
            }
            //            this.uri2ItemMap = newUri2ItemMap;
            for (String oldKey : this.uri2ItemMap.keySet()) {
                if (!newUri2ItemMap.containsKey(oldKey)) {
                    this.uri2ItemMap.remove(oldKey);
                }
            }
            this.uri2ItemMap.putAll(newUri2ItemMap);
        } catch (Exception e) {
            throw new TmsException("Url load fail from DPS", e);
        }
    }

    @Override
    public String getArticlePageId(String domainId, String articleType)
            throws DataLoadException {
        // 이미 존재하는 경우
        if (this.artTypeToArticlePageIdMap.containsKey(articleType)) {
            return this.artTypeToArticlePageIdMap.get(articleType);
        }
        // 없는 경우 DPS에서 가져온다.
        Map<String, Object> parameterMap = new LinkedHashMap<String, Object>();
        parameterMap.put(PARAM_DOMAIN_ID, this.domainId);
        parameterMap.put(PARAM_ARTICLE_TYPE, articleType);
        JSONResult jsonResult = this.httpProxyDataLoader.getJSONResult(DpsApiConstants.ITEM_ARTICLE_PAGE_ID, parameterMap, true);
        Object jsonArray = jsonResult.getDataList();
        if (jsonArray instanceof List) {
            List list = (List) jsonArray;
            if (list.size() >= 1) {
                Map map = (Map) (list.get(0));
                String articlePageId = map
                        .get(VALUE_ARTICLE_PAGE_SEQ)
                        .toString();
                this.artTypeToArticlePageIdMap.put(articleType, articlePageId);
                return articlePageId;
            }
        }
        return this.artTypeToArticlePageIdMap.get(DEFAULT_ARTICLE_TYPE);
    }

    /**
     * <pre>
     * 템플릿 내용을 로딩한다.
     * </pre>
     *
     * @param itemType 템플릿 타입
     * @param itemId   아이디
     * @return 템플릿 내용
     * @throws TemplateParseException 템플릿 파싱 예외
     * @throws TemplateLoadException  템플릿 로드 예외
     */
    private MergeItem loadJson(String itemType, String itemId)
            throws TemplateParseException, TemplateLoadException {

        String api = itemApiMap.get(itemType);
        Map<String, Object> parameterMap = new LinkedHashMap<String, Object>();
        // 아이템 아이디가 unique하므로 domainId를 제외함
        // parameterMap.put(PARAM_DOMAIN_ID, this.domainId);
        parameterMap.put(PARAM_ITEM_ID, itemId);

        MergeItem item;
        try {
            JSONResult jsonResult = this.httpProxyDataLoader.getJSONResult(api, parameterMap, true);
            JSONArray jsonArray = (JSONArray) jsonResult.get(Constants.DEFAULT_LOOP_DATA_SELECT);
            JSONObject jsonObject = (JSONObject) jsonArray.get(0);
            item = DPS_ITEM_FACTORY.getItem(itemType, jsonObject);
            String itemKey = KeyResolver.makeItemKey(this.domainId, itemType, itemId);
            // PG일 경우 URL과 매핑한다.
            if (itemType.equals(MokaConstants.ITEM_PAGE)) {
                if (item.getBoolYN(ItemConstants.PAGE_USE_YN)) {
                    this.addUri((PageItem) item);
                } else {
                    // 사용안함일 경우 제거한다.
                    this.removeUri((PageItem) item);
                }
            }
            if (cacheable) {
                this.mergeItemMap.put(itemKey, item);
            }
            logger.debug("Item Loaded: {} {}", itemType, itemId);
        } catch (DataLoadException e) {
            throw new TemplateLoadException(String.format("TemplateItem load fail: %s %s %s", this.domainId, itemType, itemId), e);
        } catch (Exception e) {
            throw new TemplateLoadException(String.format("Template Loaded Fail: %s %s", itemType, itemId), e);
        }
        return item;
    }

    public MergeItem getItem(String itemType, String itemId)
            throws TemplateParseException, TemplateLoadException {
        return getItem(itemType, itemId, false);
    }

    public MergeItem getItem(String itemType, String itemId, boolean force)
            throws TemplateParseException, TemplateLoadException {
        String itemKey = KeyResolver.makeItemKey(this.domainId, itemType, itemId);
        MergeItem item;
        if (force || !cacheable || !this.mergeItemMap.containsKey(itemKey)) {
            item = this.loadJson(itemType, itemId);
        } else {
            item = this.mergeItemMap.get(itemKey);
        }

        if (item == null) {
            logger.error("Template Content Not Found : {} {}", itemType, itemId);
            return null;
        }

        return item;
    }

}
