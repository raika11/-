package jmnet.moka.web.rcv.util;

import java.nio.charset.StandardCharsets;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.rcv.config.BrightCoveConfig;
import jmnet.moka.web.rcv.task.jamxml.vo.sub.ItemMultiOvpVo;
import jmnet.moka.web.rcv.task.jamxml.vo.sub.ItemVo;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
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
 * Package : jmnet.moka.web.rcv.util
 * ClassName : RcvBrightCoveUtil
 * Created : 2021-01-07 007 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-01-07 007 오후 5:48
 */
@Slf4j
public class RcvBrightCoveUtil {
    public static String getAccessToken(BrightCoveConfig brightCoveConfig) {
        int retry = 3;
        do {
            try {
                RestTemplate rt = new RestTemplate();
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
                headers.add("Authorization", "Basic " +
                        new String(
                                Base64.encodeBase64(
                                        String.format("%s:%s", brightCoveConfig.getClientId(), brightCoveConfig.getClientSecret())
                                              .getBytes(StandardCharsets.UTF_8))
                                , StandardCharsets.UTF_8));
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

    private static String callBrightCoveApiUrl(BrightCoveConfig brightCoveConfig, String accessToken, String assetId) {
        final String sourceUrl = brightCoveConfig.getApiUrl()
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

                if (response.getStatusCode() == HttpStatus.OK) {
                    return response.getBody();
                }
            } catch (Exception e) {
                e.printStackTrace();
                log.trace(" BrightCove callBrightCoveApiUrl Exception {}", e.getMessage());
            }

            log.debug(" BrightCove callBrightCoveApiUrl FAILED !! remain count {}", retry);
        }while( --retry > 0 );

        return "";
    }

    public static ItemMultiOvpVo getArticleMultiOvpInfo(BrightCoveConfig brightCoveConfig, String assetId, ItemVo item) {
        final String accessToken = getAccessToken(brightCoveConfig);
        try {
            //noinspection ConstantConditions,LoopStatementThatDoesntLoop
            do {
                if (McpString.isNullOrEmpty(accessToken)) {
                    break;
                }

                final int index = assetId.indexOf("?");
                if(index > 0) {
                    assetId = assetId.substring(0, index);
                }

                final long ovpId = RcvUtil.parseLong(assetId);
                if( ovpId == 0 )
                    break;

                final String s = callBrightCoveApiUrl(brightCoveConfig, accessToken, assetId);
                if (McpString.isNullOrEmpty(s)) {
                    break;
                }
                return new ItemMultiOvpVo(new JSONObject(s), ovpId, item);
            } while (false);
        } catch (Exception e) {
            e.printStackTrace();
            log.trace(" BrightCove getArticleMultiOvpInfo Exception {}", e.getMessage());
        }

        log.debug(" BrightCove getArticleMultiOvpInfo Failed");

        return null;
    }
}
