package jmnet.moka.common;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
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


}
