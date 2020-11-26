package jmnet.moka.common.utils;

import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.apache.commons.lang.ArrayUtils;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;

/**
 * <pre>
 * Map 생성 클래스
 * 2017. 4. 21. ince 최초생성
 * </pre>
 *
 * @author ince
 * @since 2017. 4. 21. 오후 3:12:56
 */
public class MapBuilder {

    private final Map<String, Object> map;

    /**
     * <pre>
     * MapBuilder 인스턴스 생성
     * </pre>
     *
     * @return MapBuilder
     */
    public static MapBuilder getInstance() {
        return new MapBuilder();
    }

    /**
     * 생성자
     */
    private MapBuilder() {
        super();
        map = new HashMap<String, Object>();
    }

    /**
     * 생성자
     *
     * @maps map
     */
    private MapBuilder(final Map<String, Object> params) {
        super();
        map = new HashMap<String, Object>();
        if (params != null) {
            map.putAll(params);
        }
    }

    /**
     * <pre>
     * map에 추가
     * </pre>
     *
     * @param key
     * @param value
     * @return MapBuilder
     */
    public MapBuilder add(String key, Object value) {
        map.put(key, value);
        return this;
    }

    /**
     * <pre>
     * map에 추가
     * </pre>
     *
     * @param value
     * @return MapBuilder
     */
    public MapBuilder add(Map<String, Object> value) {
        if (value != null) {
            map.putAll(value);
        }
        return this;
    }

    /**
     * <pre>
     * map 리턴
     * </pre>
     *
     * @return Map<String, Object>
     */
    public Map<String, Object> getMap() {
        return map;
    }

    /**
     * <pre>
     * 갖고 있는 Map 정보를 MultiValueMap로 변경한다.
     * 외부 서버 api를 호출할때 파라미터를 전달하기 위한 map을 구성한다.
     * 기본 데이터형(int, double, float, char)들도 문자열로 처리한다.
     * </pre>
     *
     * @return MultiValueMap<String, Object>
     * @throws Exception
     */

    public MultiValueMap<String, Object> getMultiValueMap()
            throws Exception {


        return getMultiValueMap(false, null);
    }
    

    public MultiValueMap<String, Object> getMultiValueMap(boolean isUnderScore, String[] ignoreUnderScore)
            throws Exception {
        MultiValueMap<String, Object> multiValueMap = new LinkedMultiValueMap<String, Object>();
        Set<String> sets = map.keySet();
        Iterator<String> keys = sets.iterator();
        while (keys.hasNext()) {
            String key = keys.next();
            if (map.get(key) instanceof List<?>) {
                List<?> list = (List<?>) map.get(key);
                for (Object obj : list) {
                    if (obj instanceof String) {
                        if (isUnderScore && ArrayUtils.indexOf(ignoreUnderScore, key) == -1) {
                            key = McpString.convertCamelToSnake(key);
                        }
                        multiValueMap.add(key, obj);
                    } else {
                        Map<String, Object> subMap = BeanConverter.toMap(obj, isUnderScore, ignoreUnderScore);
                        Set<String> keySet = subMap.keySet();
                        keySet.forEach((skey) -> multiValueMap.add(skey, McpString.nvl(subMap.get(skey), "")));
                    }
                }
            } else if (map.get(key) instanceof String[]) {
                String[] list = (String[]) map.get(key);
                if (isUnderScore && ArrayUtils.indexOf(ignoreUnderScore, key) == -1) {
                    key = McpString.convertCamelToSnake(key);
                }
                for (String obj : list) {
                    multiValueMap.add(key, obj);
                }
            } else if (map.get(key) instanceof Object[]) {
                Object[] objList = (Object[]) map.get(key);
                for (Object obj : objList) {
                    Map<String, Object> subMap = BeanConverter.toMap(obj, isUnderScore, ignoreUnderScore);
                    Set<String> keySet = subMap.keySet();
                    keySet.forEach((skey) -> multiValueMap.add(skey, McpString.nvl(subMap.get(skey), "")));
                }
            } else {
                Object value = map.get(key);
                if (value != null) {
                    if (isUnderScore && ArrayUtils.indexOf(ignoreUnderScore, key) == -1) {
                        key = McpString.convertCamelToSnake(key);
                    }
                    multiValueMap.add(key, String.valueOf(value));
                }
            }
        }

        return multiValueMap;
    }

    /**
     * <pre>
     * Map 정보를 Http Get 방식의 QueryString 문자열로 변환한다.
     * </pre>
     *
     * @return QueryString 문자열
     */
    public String getQueryString()
            throws Exception {

        return getQueryString(true, true);
    }

    /**
     * Map 정보를 Http Get 방식의 QueryString 문자열로 변환한다.
     *
     * @param firstCheck 첫 파라미터 앞에 '?' 붙일지 여부
     * @param encode     파라미터값을 URL Encoding 할지 여부
     * @return queryString
     * @throws Exception 예외처리
     */
    public String getQueryString(boolean firstCheck, boolean encode)
            throws Exception {
        String queryString = "";

        Set<String> sets = map.keySet();
        Iterator<String> keys = sets.iterator();
        while (keys.hasNext()) {
            String key = keys.next();
            if (map.get(key) != null) {
                if (firstCheck) {
                    if (StringUtils.isEmpty(queryString)) {
                        queryString += "?";
                    } else {
                        queryString += "&";
                    }
                } else {
                    queryString += "&";
                }
                String value = encode ? URLEncoder.encode((String) map.get(key), "UTF-8") : (String) map.get(key);
                queryString += key + "=" + value;
            }
        }
        return queryString;
    }

    /**
     * <pre>
     * MultiValueMap 정보를 Http Get 방식의 QueryString 문자열로 변환한다.
     * </pre>
     *
     * @param params MultiValueMap
     * @return QueryString 문자열
     */
    public String getQueryString(MultiValueMap<String, Object> params) {
        String queryString = "";

        Set<String> sets = params.keySet();
        Iterator<String> keys = sets.iterator();
        while (keys.hasNext()) {
            String key = keys.next();
            List<Object> list = params.get(key);
            for (Object obj : list) {
                if (StringUtils.isEmpty(queryString)) {
                    queryString += "?";
                } else {
                    queryString += "&";
                }

                queryString += key + "=" + obj;
            }

        }
        return queryString;
    }
}
