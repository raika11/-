package jmnet.moka.core.tms.merge;

import java.util.StringJoiner;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tms.mvc.HttpParamMap;

/**
 * <pre>
 * 머지에서 사용되는 Key의 생성과 키 구성에 사용되는 factor를 추출하는 방법을 구현한다.
 * key =  factor1 + separator + factor2 + ... 으로 구성된다. 
 * 2020. 2. 26. kspark 최초생성
 * </pre>
 * 
 * @since 2020. 2. 26. 오후 5:41:05
 * @author kspark
 */
public class KeyResolver {
    /** itemKey 관련 **/
    public static final int ITEM_DOMAIN_ID = 0;
    public static final int ITEM_TYPE = 1;
    public static final int ITEM_ID = 2;
    public static final String DEFAULT_SEPARATOR = "_";
    public static final String ANY = "*";
    public static final HttpParamMap EMPTY_MAP = new HttpParamMap();

    /** cache 관련 */
    public static final String CACHE_MERGE_POSTFIX = ".merge";
    public static final String CACHE_PG_MERGE = "pg" + CACHE_MERGE_POSTFIX;
    public static final String CACHE_CP_MERGE = "cp" + CACHE_MERGE_POSTFIX;
    public static final String CACHE_CT_MERGE = "ct" + CACHE_MERGE_POSTFIX;
    public static final String CACHE_TP_MERGE = "tp" + CACHE_MERGE_POSTFIX;
    public static final String CACHE_AD_MERGE = "ad" + CACHE_MERGE_POSTFIX;

    public static String getCacheType(String itemType) {
        return itemType.toLowerCase()+CACHE_MERGE_POSTFIX;
    }

    public static String[] getFactors(String key, String separator) {
        if (key == null || key.length() == 0)
            return null;
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
        for (String value: extra) {
            if ( value == null || value.equals("")) {
                joiner.add(ANY);
            } else {
                joiner.add(value);
            }
        }
        return joiner.toString();
    }

    public static String makeDefaultCacheKey(String domainId, String itemType, String itemId,
            String... extra) {
        if (extra == null || extra.length == 0) {
            return String.join(DEFAULT_SEPARATOR, makeItemKey(domainId, itemType, itemId));
        } else {
            return String.join(DEFAULT_SEPARATOR, makeItemKey(domainId, itemType, itemId),
                    makeExtraKey(extra));
        }
    }

    public static String makePgItemCacheKey(String domainId, String itemId,
            HttpParamMap httpParamMap) {
        return makeDefaultCacheKey(domainId, MokaConstants.ITEM_PAGE, itemId,
                makeParamKey(httpParamMap));
    }

    public static String makeApItemCacheKey(String domainId, String itemId, String cid,
            HttpParamMap httpParamMap) {
        return makeDefaultCacheKey(domainId, MokaConstants.ITEM_ARTICLE_PAGE, itemId, cid,
                makeParamKey(httpParamMap));
    }

    public static String makeCtItemCacheKey(String domainId, String itemId,
            String pageId, String cid, HttpParamMap httpParamMap, String... extra) {
        return makeDefaultCacheKey(domainId, MokaConstants.ITEM_CONTAINER, itemId, pageId, cid,
                makeParamKey(httpParamMap));
    }

    public static String makeCpItemCacheKey(String domainId, String itemId,
            String pageId, String cid, HttpParamMap httpParamMap, String... extra) {
        return makeDefaultCacheKey(domainId, MokaConstants.ITEM_COMPONENT, itemId, pageId, cid,
                makeParamKey(httpParamMap));
    }

    public static String makeTpItemCacheKey(String domainId, String itemId, String pageId,
            String cid, String relCp, HttpParamMap httpParamMap, String... extra) {
        return makeDefaultCacheKey(domainId, MokaConstants.ITEM_TEMPLATE, itemId, pageId, cid, relCp,
                makeParamKey(httpParamMap));
    }

    public static String makeAdItemCacheKey(String domainId, String itemId) {
        return makeDefaultCacheKey(domainId, MokaConstants.ITEM_AD, itemId);
    }

    public static String makeDataId(String itemType, String itemId) {
        return itemType + itemId;
    }

    private static String makeParamKey(HttpParamMap httpParamMap) {
        if (httpParamMap == null) {
            return ANY + DEFAULT_SEPARATOR + ANY;
        }
        String page =
                httpParamMap.containsKey(MokaConstants.PARAM_PAGE)
                        ? httpParamMap.get(MokaConstants.PARAM_PAGE).toString() : ANY;
        String count =
                httpParamMap.containsKey(MokaConstants.PARAM_COUNT)
                        ? httpParamMap.get(MokaConstants.PARAM_COUNT).toString() : ANY;
        if (httpParamMap.get(MokaConstants.PARAM_SORT) == null) {
            return String.join(DEFAULT_SEPARATOR, page, count);
        } else {
            return String.join(DEFAULT_SEPARATOR, page, count,
                    httpParamMap.get(MokaConstants.PARAM_SORT));
        }
    }

}
