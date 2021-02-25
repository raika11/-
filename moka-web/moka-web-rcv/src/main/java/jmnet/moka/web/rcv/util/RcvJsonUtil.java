package jmnet.moka.web.rcv.util;

import org.springframework.boot.configurationprocessor.json.JSONArray;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.rcv.util
 * ClassName : RcvJsonUtil
 * Created : 2021-02-17 017 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-17 017 오후 5:00
 */
public class RcvJsonUtil {
    public static String getJsonString( JSONObject jsonObject, String key )
            throws JSONException {
        if( !jsonObject.has(key) )
            return "";
        return jsonObject.getString(key);
    }

    public static JSONObject getJsonObject( JSONObject jsonObject, String key )
            throws JSONException {
        if( !jsonObject.has(key) )
            return null;
        return jsonObject.getJSONObject(key);
    }

    public static JSONArray getJsonArray(JSONObject jsonObject, String key)
            throws JSONException {
        if (!jsonObject.has(key)) {
            return null;
        }
        return jsonObject.getJSONArray(key);
    }
}
