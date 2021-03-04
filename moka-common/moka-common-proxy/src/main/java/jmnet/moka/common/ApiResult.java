package jmnet.moka.common;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

public class ApiResult extends LinkedHashMap<String, Object> {
    private static final long serialVersionUID = 1099440427596856215L;
    public static final DateTimeFormatter df = DateTimeFormatter.ofPattern("yyyyMMdd HH:mm:ss.SSS");
    public static final String MAIN_DATA = "_DATA";
    public static final String MAIN_TOTAL = "_TOTAL";

    public void addApiResult(String dataName, ApiResult apiResult) {
        this.put(dataName, apiResult);
    }

    @SuppressWarnings("unchecked")
    public static ApiResult createApiResult(long startTime, long endTime, Object data,
            boolean bypass, String mainData) {
        ApiResult apiResult = new ApiResult();
        if (bypass == false && data instanceof Map) {
            for (Entry<Object, Object> entry : ((Map<Object, Object>) data).entrySet()) {
                String key = entry.getKey().toString();
                if (key.equals(mainData)) {
                    key = ApiResult.MAIN_DATA;
                }
                apiResult.put(entry.getKey().toString(), entry.getValue());
            }
        } else {
            apiResult.put(ApiResult.MAIN_DATA, data);
        }
        apiResult.put("_CREATE_TIME", LocalDateTime.now().format(df));
        apiResult.put("_WORK_TIME", endTime - startTime);
        return apiResult;
    }

    public static ApiResult createApiResult(Object data) {
        ApiResult apiResult = new ApiResult();
        apiResult.put(ApiResult.MAIN_DATA, data);
        apiResult.put("_CREATE_TIME", LocalDateTime.now().format(df));
        apiResult.put("_WORK_TIME", 0);
        return apiResult;
    }

    public static ApiResult createApiErrorResult(Exception e) {
        ApiResult apiResult = new ApiResult();
        apiResult.put("ERROR", String.format("%s: %s", e.getClass().getName(), e.getMessage()));
        apiResult.put("_CREATE_TIME", LocalDateTime.now().format(df));
        return apiResult;
    }

    public static ApiResult createApiErrorResult(String message, Exception e) {
        ApiResult apiResult = new ApiResult();
        apiResult.put("ERROR",
                String.format("%s%n%s:%s", message, e.getClass().getName(), e.getMessage()));
        apiResult.put("_CREATE_TIME", LocalDateTime.now().format(df));
        return apiResult;
    }



    /**
     * key에 해당하는 List를 반환한다. List가 아닐 경우 null을 반환한다.
     * @param dataKey 키
     * @return key에 해당하는 List
     */
    public List<Map<String, Object>> getDataList(String dataKey) {
        Object dataObject = unwrap(dataKey);
        if ( dataObject instanceof List) {
            return (List<Map<String, Object>>)dataObject;
        }
        return null;
    }

    /**
     * key에 해당하는 List의 첫번째 Object를 반환한다. List가 아닌 경우 null을 반환한다.
     * @param dataKey 키
     * @return key에 해당하는 List 의 첫번째 Object
     */
    public Map<String, Object> getDataListFirst(String dataKey) {
        List<Map<String, Object>> dataList = getDataList(dataKey);
        if ( dataList != null && dataList.size()>0) {
            return dataList.get(0);
        }
        return null;
    }

    /**
     * key에 해당하는 Object를 반환한다. List이던 Map이던 상관하지 않는다.
     * @return key에 해당하는 Object
     */
    public Map<String,Object> getData(String dataKey) {
        Object dataObject = unwrap(dataKey);
        if ( dataObject instanceof Map) {
            return (Map<String,Object>)dataObject;
        }
        return null;
    }

    public Object unwrap(String dataKey) {
        if ( this.containsKey(dataKey)) {
            if ( dataKey.equals(ApiResult.MAIN_DATA)) {
                return this.get(ApiResult.MAIN_DATA);
            } else {
                Object dataObject =  this.get(dataKey);
                if ( dataObject instanceof Map) {
                    return ((Map)dataObject).get(ApiResult.MAIN_DATA);
                }
            }
        }
        return null;
    }

}
