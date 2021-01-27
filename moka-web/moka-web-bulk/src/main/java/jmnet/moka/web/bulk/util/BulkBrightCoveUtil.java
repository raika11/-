package jmnet.moka.web.bulk.util;

import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.bulk.config.BrightCoveConfig;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.Charsets;
import org.springframework.boot.configurationprocessor.json.JSONArray;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.util
 * ClassName : BulkOoyalaUtil
 * Created : 2021-01-07 007 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-01-07 007 오후 5:48
 */
@Slf4j
public class BulkBrightCoveUtil {
    public static String getAccessToken(BrightCoveConfig brightCoveConfig) {
        int retry = 3;
        do {
            try {
                RestTemplate rt = new RestTemplate();
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
                headers.add("Authorization", "Basic " + new String(Base64.encodeBase64(String
                        .format("%s:%s", brightCoveConfig.getClientId(), brightCoveConfig.getClientSecret())
                        .getBytes(Charsets.UTF_8))));
                HttpEntity<String> request = new HttpEntity<>("", headers);
                ResponseEntity<String> response = rt.exchange(brightCoveConfig.getAccessTokenUrl(), HttpMethod.POST, request, String.class);
                if (response.getStatusCode() == HttpStatus.OK) {
                    final String accessToken = (new JSONObject(response.getBody())).getString("access_token");
                    if (!McpString.isNullOrEmpty(accessToken)) {
                        log.debug(" BrightCove Access Token {} SUCCESS !!", accessToken);
                        return accessToken;
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
                log.trace(" BrightCove Access Exception {}", e.getMessage());
            }

            log.debug(" BrightCove Access Token FAILED !! remain count {}", retry);
        }while( --retry > 0 );

        return "";
    }

    private static String getJsonString( JSONObject jsonObject, String key )
            throws JSONException {
        if( !jsonObject.has(key) )
            return "";
        return jsonObject.getString(key);
    }

    @SuppressWarnings("SameParameterValue")
    private static int getJsonInt( JSONObject jsonObject, String key )
            throws JSONException {
        if( !jsonObject.has(key) )
            return 0;
        return jsonObject.getInt(key);
    }

    public static String getVideoUrl(BrightCoveConfig brightCoveConfig, String accessToken, String assetId) {
        final String sourceUrl = brightCoveConfig.getVideoSourceUrl()
                                                 .replace("{account}", brightCoveConfig.getAccount())
                                                 .replace("{assetId}", assetId);
        int retry = 3;
        do {
            try {
                RestTemplate rt = new RestTemplate();
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
                headers.add("Authorization", "Bearer " + accessToken );
                HttpEntity<String> request = new HttpEntity<>("", headers);
                ResponseEntity<String> response = rt.exchange(sourceUrl, HttpMethod.GET, request, String.class);

                int highRateVideoSize = 0;
                String highRateVideoUrl = "";
                String lowRateVideoUrl = "";
                if (response.getStatusCode() == HttpStatus.OK) {
                    JSONArray jsonArray = new JSONArray(response.getBody());
                    for (int i = 0; i < jsonArray.length(); i++) {
                        JSONObject jsonObject = jsonArray.getJSONObject(i);
                        if( !getJsonString(jsonObject,"container").equalsIgnoreCase("mp4"))
                            continue;

                        final String src = getJsonString(jsonObject,"src");
                        if( !src.contains("https") )
                            continue;

                        int size = getJsonInt(jsonObject,"size");
                        if( size == 0 )
                            continue;

                        if (highRateVideoSize == 0) {
                            highRateVideoSize = size;
                            highRateVideoUrl = src;
                            lowRateVideoUrl = src;
                        } else {
                            if (highRateVideoSize < size) {
                                lowRateVideoUrl = highRateVideoUrl;
                                highRateVideoSize = size;
                                highRateVideoUrl = src;
                            } else {
                                lowRateVideoUrl = src;
                            }
                        }
                    }
                    //고화질 영상이 대략 200mb 이하라면 고화질 전송
                    if (highRateVideoSize < brightCoveConfig.getVideoLimitSize() )
                        return highRateVideoUrl;
                    return lowRateVideoUrl;
                }
            } catch (Exception e) {
                e.printStackTrace();
                log.trace(" BrightCove getVideoUrl Exception {}", e.getMessage());
            }

            log.debug(" BrightCove getVideoUrl FAILED !! remain count {}", retry);
        }while( --retry > 0 );

        return "";
    }
}
