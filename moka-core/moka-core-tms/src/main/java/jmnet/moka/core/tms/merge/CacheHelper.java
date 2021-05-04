package jmnet.moka.core.tms.merge;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.StringJoiner;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tms.mvc.HttpParamMap;

/**
 * <pre>
 * 머지에서 사용되는 Key의 생성과 키 구성에 사용되는 factor를 추출하는 방법을 구현한다.
 * key =  factor1 + separator + factor2 + ... 으로 구성된다.
 * 2020. 2. 26. kspark 최초생성
 * </pre>
 *
 * @author kspark
 * @since 2020. 2. 26. 오후 5:41:05
 */
public class CacheHelper {
    /**
     * itemKey 관련
     **/
    public static final int ITEM_DOMAIN_ID = 0;
    public static final int ITEM_TYPE = 1;
    public static final int ITEM_ID = 2;
    public static final String DEFAULT_SEPARATOR = "_";
    public static final String ANY = "*";
    public static final HttpParamMap EMPTY_MAP = new HttpParamMap();

    /**
     * cache 관련
     */
    public static final String CACHE_MERGE_POSTFIX = ".merge";
    public static final String CACHE_PG_MERGE = "pg" + CACHE_MERGE_POSTFIX;
    public static final String CACHE_ARTICLE_MERGE = "article" + CACHE_MERGE_POSTFIX;
    public static final String CACHE_AMP_ARTICLE_MERGE = "ampArticle" + CACHE_MERGE_POSTFIX;
    public static final String CACHE_CP_MERGE = "cp" + CACHE_MERGE_POSTFIX;
    public static final String CACHE_CT_MERGE = "ct" + CACHE_MERGE_POSTFIX;
    public static final String CACHE_TP_MERGE = "tp" + CACHE_MERGE_POSTFIX;
    public static final String CACHE_AD_MERGE = "ad" + CACHE_MERGE_POSTFIX;
    public static final String CACHE_ARTICLE_FLAG = "article.flag";
    private static String[] DEFAULT_CACHE_PARAM_ARRAY = {MokaConstants.PARAM_PAGE, MokaConstants.PARAM_COUNT};
    private static final List<String> DEFAULT_CACHE_PARAM_LIST = Arrays.asList(DEFAULT_CACHE_PARAM_ARRAY);

    public static String getCacheType(String itemType) {
        // 기사페이지(AP)는 article.merge와 ampArticle.merge에 별도로 처리됨
        return itemType.toLowerCase() + CACHE_MERGE_POSTFIX;
    }

    public static String[] getFactors(String key, String separator) {
        if (key == null || key.length() == 0) {
            return null;
        }
        String[] splitted = key.split(separator);
        return splitted;
    }

    public static String getFactor(String[] factors, int index) {
        return factors[index];
    }

    public static String makeItemKey(String domainId, String itemType, String itemId) {
        return String.join(DEFAULT_SEPARATOR, domainId, itemType, itemId);
    }

    public static String[] getItemKeyFactors(String key) {
        return getFactors(key, DEFAULT_SEPARATOR);
    }

    public static String getItemKeyFactor(String key, int index) {
        return getFactors(key, DEFAULT_SEPARATOR)[index];
    }

    private static String makeExtraKey(String... extra) {
        StringJoiner joiner = new StringJoiner(DEFAULT_SEPARATOR);
        for (String value : extra) {
            if (value == null || value.equals("")) {
                joiner.add(ANY);
            } else {
                joiner.add(value);
            }
        }
        return joiner.toString();
    }

    public static String makeCacheKey(String domainId, String itemType, String itemId, String... extra) {
        if (extra == null) {
            return String.join(DEFAULT_SEPARATOR, makeItemKey(domainId, itemType, itemId));
        } else {
            return String.join(DEFAULT_SEPARATOR, makeItemKey(domainId, itemType, itemId), makeExtraKey(extra));
        }
    }

    public static String makePgItemCacheKey(String domainId, String itemId, MergeContext mergeContext) {
        return makeCacheKey(domainId, MokaConstants.ITEM_PAGE, itemId, makeParamKey(mergeContext));
    }

//    public static String makeApItemCacheKey(String domainId, String itemId, String totalId, HttpParamMap httpParamMap) {
//        return makeCacheKey(domainId, MokaConstants.ITEM_ARTICLE_PAGE, itemId, totalId, makeParamKey(httpParamMap));
//    }

    public static String makeCtItemCacheKey(String domainId, String itemId, String pageId, String totalId, HttpParamMap httpParamMap,
            MergeContext mergeContext) {
        List<String> cacheParamList = (List) mergeContext.get(MokaConstants.MERGE_CONTEXT_CACHE_PARAM_LIST);
        return makeCacheKey(domainId, MokaConstants.ITEM_CONTAINER, itemId, pageId, totalId,  makeParamKey(cacheParamList, httpParamMap));
    }

    public static String makeCpItemCacheKey(String domainId, String itemId, String pageId, String totalId, HttpParamMap httpParamMap,
            MergeContext mergeContext) {
        List<String> cacheParamList = (List) mergeContext.get(MokaConstants.MERGE_CONTEXT_CACHE_PARAM_LIST);
        return makeCacheKey(domainId, MokaConstants.ITEM_COMPONENT, itemId, pageId, totalId, makeParamKey(cacheParamList, httpParamMap));
    }

    public static String makeTpItemCacheKey(String domainId, String itemId, String pageId, String totalId, String relCp, HttpParamMap httpParamMap,
            MergeContext mergeContext) {
        List<String> cacheParamList = (List) mergeContext.get(MokaConstants.MERGE_CONTEXT_CACHE_PARAM_LIST);
        return makeCacheKey(domainId, MokaConstants.ITEM_TEMPLATE, itemId, pageId, totalId, relCp, makeParamKey(cacheParamList, httpParamMap));
    }

    public static String makeAdItemCacheKey(String domainId, String itemId) {
        return makeCacheKey(domainId, MokaConstants.ITEM_AD, itemId);
    }

    public static String makeArticleCacheKey(String domainId, String articleId) {
        return String.join(DEFAULT_SEPARATOR, domainId, articleId);
    }

    public static String makeAmpArticleCacheKey(String domainId, String articleId) {
        return String.join(DEFAULT_SEPARATOR, domainId, articleId);
    }

    public static String makeDataId(String itemType, String itemId) {
        return itemType + itemId;
    }

    public static String makeParamKey(MergeContext mergeContext) {
        List<String> cacheParamList = (List) mergeContext.get(MokaConstants.MERGE_CONTEXT_CACHE_PARAM_LIST);
        HttpParamMap httpParamMap = (HttpParamMap) mergeContext.get(MokaConstants.MERGE_CONTEXT_PARAM);
        return makeParamKey(cacheParamList, httpParamMap);
    }

    public static String makeParamKey(List<String> cacheParamList, HttpParamMap httpParamMap) {
        if (cacheParamList == null) {
            return null;
        }
        if ( httpParamMap == null) { // 파라미터가 없어도 키를 생성해야 함
            httpParamMap = EMPTY_MAP;
        }
        StringJoiner joiner = new StringJoiner(DEFAULT_SEPARATOR);
        for (String paramName : cacheParamList) {
            if (httpParamMap.containsKey(paramName)) {
                String value = httpParamMap.get(paramName);
                joiner.add(McpString.isEmpty(value) ? ANY : value);
            } else {
                joiner.add(ANY);
            }
        }
        return joiner.toString();
    }

//    private static String makeParamKey(HttpParamMap httpParamMap) {
//        if (httpParamMap == null) {
//            return ANY + DEFAULT_SEPARATOR + ANY;
//        }
//        String page = httpParamMap.containsKey(MokaConstants.PARAM_PAGE) ? httpParamMap
//                .get(MokaConstants.PARAM_PAGE)
//                .toString() : ANY;
//        String count = httpParamMap.containsKey(MokaConstants.PARAM_COUNT) ? httpParamMap
//                .get(MokaConstants.PARAM_COUNT)
//                .toString() : ANY;
//        String filter = httpParamMap.containsKey(MokaConstants.PARAM_FILTER) ? httpParamMap
//                .get(MokaConstants.PARAM_FILTER)
//                .toString() : ANY;
//        String category = httpParamMap.get(MokaConstants.PARAM_CATEGORY);
//        category = McpString.isNotEmpty(category) ? category : ANY;
//        if (httpParamMap.get(MokaConstants.PARAM_SORT) == null) {
//            return String.join(DEFAULT_SEPARATOR, page, count, filter, category);
//        } else {
//            return String.join(DEFAULT_SEPARATOR, page, count, filter, category, httpParamMap.get(MokaConstants.PARAM_SORT));
//        }
//    }

    /**
     * 캐시키에 추가되어야 할 파라메터를 등록한다.
     *
     * @param mergeContext 컨텍스트
     * @param paramName    파라미터명
     */
    public static void addExtraCacheParam(MergeContext mergeContext, String paramName) {
        List<String> cacheParamList = (List) mergeContext.get(MokaConstants.MERGE_CONTEXT_CACHE_PARAM_LIST);
        if (cacheParamList == null) {
            cacheParamList = new ArrayList<>();
            cacheParamList.addAll(DEFAULT_CACHE_PARAM_LIST);
            mergeContext.set(MokaConstants.MERGE_CONTEXT_CACHE_PARAM_LIST, cacheParamList);
        }
        cacheParamList.add(paramName);
    }

}
