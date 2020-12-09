package jmnet.moka.core.tps.mvc.sns.service;

import com.fasterxml.jackson.core.type.TypeReference;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import jmnet.moka.common.utils.MapBuilder;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.rest.RestTemplateHelper;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.tps.mvc.codemgt.service.CodeMgtService;
import jmnet.moka.core.tps.mvc.sns.dto.SnsDeleteDTO;
import jmnet.moka.core.tps.mvc.sns.dto.SnsPublishDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.Base64Utils;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.sns.service
 * ClassName : SnsApiServiceImpl
 * Created : 2020-12-08 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-08 12:01
 */
@Slf4j
@Service("twitterApiService")
public class TwitterApiServiceImpl implements SnsApiService {

    @Value("${sns.share.article-url}")
    private String articleUrl;

    @Value("${sns.twitter.update-api-url}")
    private String twitterUpdateApiUrl;

    @Value("${sns.twitter.delete-api-url}")
    private String twitterDeleteApiUrl;

    @Value("${sns.twitter.consumer-key}")
    private String twitterConsumerKey;

    @Value("${sns.twitter.consumer-key-secret}")
    private String twitterConsumerKeySecret;

    @Value("${sns.twitter.access-token}")
    private String twitterAccessToken;

    @Value("${sns.twitter.access-token-secret}")
    private String twitterAccessTokenSecret;

    private final RestTemplateHelper restTemplateHelper;

    private final CodeMgtService codeMgtService;

    public TwitterApiServiceImpl(RestTemplateHelper restTemplateHelper, CodeMgtService codeMgtService) {
        this.restTemplateHelper = restTemplateHelper;
        this.codeMgtService = codeMgtService;
    }



    @Override
    public Map<String, Object> publish(SnsPublishDTO snsPublish)
            throws Exception {
        String articleServiceUrl = twitterUpdateApiUrl;

        String message = snsPublish.getMessage();
        if (McpString.isNotEmpty(message)) {
            message = message
                    .replaceAll("'", "＇")
                    .replaceAll("\\(", "\\（")
                    .replaceAll("\\)", "\\）")
                    .replaceAll("\\*", "\\＊")
                    .replaceAll("!", "！");

            message += articleUrl + snsPublish.getTotalId();
        }
        MultiValueMap<String, Object> params = MapBuilder
                .getInstance()
                .add("status", snsPublish.getMessage())
                .add("trim_user", "1")
                .getMultiValueMap();
        ResponseEntity<String> content = restTemplateHelper.post(articleServiceUrl, params, makeOauthHeaderMap(articleServiceUrl, params));

        String response = content.getBody();
        Map<String, Object> map = ResourceMapper
                .getDefaultObjectMapper()
                .readValue(response, new TypeReference<Map<String, Object>>() {
                });

        return map;

    }

    @Override
    public Map<String, Object> delete(SnsDeleteDTO snsDelete)
            throws Exception {
        String articleServiceUrl = String.format(twitterDeleteApiUrl, snsDelete.getSnsId());

        String url = new StringBuilder(articleServiceUrl)
                .append("/")
                .append(snsDelete.getSnsId())
                .toString();
        ResponseEntity<String> responseEntity = restTemplateHelper.delete(url);


        String response = responseEntity.getBody();
        Map<String, Object> map = ResourceMapper
                .getDefaultObjectMapper()
                .readValue(response, new TypeReference<Map<String, Object>>() {
                });

        return map;
    }

    private MultiValueMap<String, String> makeOauthHeaderMap(String url, MultiValueMap<String, Object> params)
            throws Exception {
        Map<String, String> twitterOauthMap = new HashMap<>();

        twitterOauthMap.put("oauth_consumer_key", twitterConsumerKey);
        twitterOauthMap.put("oauth_signature_method", "HMAC-SHA1");
        twitterOauthMap.put("oauth_timestamp", String.valueOf(McpDate
                .now()
                .getTime() / 1000));
        twitterOauthMap.put("oauth_nonce", "a"); // Required, but Twitter doesn't appear to use it, so "a" will do.
        twitterOauthMap.put("oauth_token", twitterAccessToken);
        twitterOauthMap.put("oauth_version", "1.0");

        String result = twitterOauthMap
                .entrySet()
                .stream()
                .map(entry -> urlEncoding(entry.getKey()) + "=" + urlEncoding(entry.getValue()))
                .collect(Collectors.joining("&"));

        String paramStr = params
                .entrySet()
                .stream()
                .map(entry -> urlEncoding(entry.getKey()) + "=" + urlEncoding(String.valueOf(entry
                        .getValue()
                        .get(0))))
                .collect(Collectors.joining("&"));
        if (McpString.isNotEmpty(paramStr)) {
            result += "&" + paramStr;
        }

        String encodeSignatureBase = "POST&" + URLEncoder.encode(url, "UTF-8") + "&" + URLEncoder.encode(result, "UTF-8");
        twitterOauthMap.put("oauth_signature", generateSignature(encodeSignatureBase));

        result = twitterOauthMap
                .entrySet()
                .stream()
                .map(entry -> urlEncoding(entry.getKey()) + "=\"" + urlEncoding(entry.getValue()) + "\"")
                .collect(Collectors.joining(", "));

        MultiValueMap<String, String> header = new LinkedMultiValueMap<>();
        header.add("Authorization", "OAuth " + result);

        return header;
    }

    private String generateSignature(String signatueBaseStr) {
        byte[] byteHMAC = null;
        try {
            Mac mac = Mac.getInstance("HmacSHA1");
            SecretKeySpec spec;
            if (null == twitterAccessTokenSecret) {
                String signingKey = encode(twitterConsumerKeySecret) + '&';
                spec = new SecretKeySpec(signingKey.getBytes(), "HmacSHA1");
            } else {
                String signingKey = encode(twitterConsumerKeySecret) + '&' + encode(twitterAccessTokenSecret);
                spec = new SecretKeySpec(signingKey.getBytes(), "HmacSHA1");
            }
            mac.init(spec);
            byteHMAC = mac.doFinal(signatueBaseStr.getBytes());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return Base64Utils.encodeToString(byteHMAC);
    }

    private String urlEncoding(String value) {
        try {
            return URLEncoder.encode(value, "UTF-8");
        } catch (Exception ex) {
            return value;
        }
    }

    private String encode(String value) {
        String encoded = "";
        try {
            encoded = URLEncoder.encode(value, "UTF-8");
        } catch (Exception e) {
            e.printStackTrace();
        }
        String sb = "";
        char focus;
        for (int i = 0; i < encoded.length(); i++) {
            focus = encoded.charAt(i);
            if (focus == '*') {
                sb += "%2A";
            } else if (focus == '+') {
                sb += "%20";
            } else if (focus == '%' && i + 1 < encoded.length() && encoded.charAt(i + 1) == '7' && encoded.charAt(i + 2) == 'E') {
                sb += '~';
                i += 2;
            } else {
                sb += focus;
            }
        }
        return sb.toString();
    }
}
