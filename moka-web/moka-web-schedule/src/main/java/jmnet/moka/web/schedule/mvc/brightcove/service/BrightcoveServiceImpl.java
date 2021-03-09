package jmnet.moka.web.schedule.mvc.brightcove.service;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.IOException;
import java.io.StringReader;
import java.util.List;
import java.util.Map;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.brightcove.BrightcoveCredentailVO;
import jmnet.moka.core.common.brightcove.BrightcoveProperties;
import jmnet.moka.core.common.rest.RestTemplateHelper;
import jmnet.moka.core.common.util.ResourceMapper;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.schedule.service
 * ClassName : BrightcoveServiceImpl
 * Created : 2021-02-19 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-19 08:37
 */
@Slf4j
@Service
public class BrightcoveServiceImpl implements BrightcoveService {

    @Autowired
    private BrightcoveProperties brightcoveProperties;

    /**
     * 외부 API URL 호출용
     */
    @Autowired
    protected RestTemplateHelper restTemplateHelper;

    /**
     * brightcove ovp 목록 조회
     *
     * @return
     */
    @Override
    public List<Map<String, Object>> findAllOvpSource(BrightcoveCredentailVO credentail, String id, String size)
            throws IOException {

        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add(MokaConstants.CONTENT_TYPE, MediaType.APPLICATION_JSON_UTF8_VALUE);
        headers.add(MokaConstants.AUTHORIZATION, String.format("%s %s", credentail.getTokenType(), credentail.getAccessToken()));
        String requestUrl = brightcoveProperties.getCmsBaseUrl();
        requestUrl = String.format(requestUrl + "/videos/%s/sources", id);
        MultiValueMap<String, Object> params = new LinkedMultiValueMap<>();
        params.add("limit", brightcoveProperties.getOvpDefaultLimit());
        params.add("sort", brightcoveProperties.getOvpDefaultSort());
        ResponseEntity<String> responseEntity = restTemplateHelper.get(requestUrl, params, headers);

        List<Map<String, Object>> list = ResourceMapper
                .getDefaultObjectMapper()
                .readValue(responseEntity.getBody(), new TypeReference<List<Map<String, Object>>>() {
                });
        return list;
    }



    /**
     * brightcove ovp 목록 조회
     *
     * @return
     */
    @Override
    public List<Map<String, Object>> findAllOvp(BrightcoveCredentailVO credentail)
            throws IOException {
        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add(MokaConstants.CONTENT_TYPE, MediaType.APPLICATION_JSON_UTF8_VALUE);
        headers.add(MokaConstants.AUTHORIZATION, String.format("%s %s", credentail.getTokenType(), credentail.getAccessToken()));
        //headers.add("X-API-KEY", brightcoveProperties.getApiKey());
        String requestUrl = brightcoveProperties.getCmsBaseUrl();
        requestUrl = String.format(requestUrl + "/folders/%s/videos", brightcoveProperties.getOvpFolderId());
        MultiValueMap<String, Object> params = new LinkedMultiValueMap<>();
        params.add("limit", brightcoveProperties.getOvpDefaultLimit());
        params.add("sort", brightcoveProperties.getOvpDefaultSort());
        ResponseEntity<String> responseEntity = restTemplateHelper.get(requestUrl, params, headers);

        List<Map<String, Object>> list = ResourceMapper
                .getDefaultObjectMapper()
                .readValue(responseEntity.getBody(), new TypeReference<List<Map<String, Object>>>() {
                });


        return list;
    }


    /**
     * brightcove 통계데이터 조회
     *
     * @return
     */
    @Override
    public List<Map<String, Object>> findAnalytics(BrightcoveCredentailVO credentail, String url)
            throws IOException {
        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add(MokaConstants.CONTENT_TYPE, "application/json");
        headers.add(MokaConstants.AUTHORIZATION, String.format("%s %s", credentail.getTokenType(), credentail.getAccessToken()));
        log.debug("header {} : {}", MokaConstants.AUTHORIZATION, headers.get(MokaConstants.AUTHORIZATION));

        String requestUrl = url;
        MultiValueMap<String, Object> params = new LinkedMultiValueMap<>();
        ResponseEntity<JSONArray> responseEntity = restTemplateHelper.getJson(requestUrl, params, headers);

        List<Map<String, Object>> list = ResourceMapper
                .getDefaultObjectMapper()
                .readValue(String.valueOf(responseEntity.getBody()), new TypeReference<List<Map<String, Object>>>() {
                });

        return list;
    }



    /**
     * brightcove 인증 처리
     *
     * @return
     */
    @Override
    public BrightcoveCredentailVO getClientCredentials() {
        BrightcoveCredentailVO brightcoveCredentailVO = null;
        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add(MokaConstants.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE);
        MultiValueMap<String, Object> params = new LinkedMultiValueMap<>();
        params.add("client_id", brightcoveProperties.getClientId());
        params.add("client_secret", brightcoveProperties.getClientSecret());
        ResponseEntity<String> responseEntity =
                restTemplateHelper.post(brightcoveProperties.getBaseUrl() + brightcoveProperties.getTokenApi(), params, headers);
        try {
            BrightcoveCredentailVO newCredentialVO = ResourceMapper
                    .getDefaultObjectMapper()
                    .readValue(responseEntity.getBody(), BrightcoveCredentailVO.class);
            brightcoveCredentailVO = newCredentialVO;
            brightcoveCredentailVO.setExpireDt(McpDate.secondPlus(newCredentialVO.getExpiresIn()));
        } catch (Exception ex) {
            log.error(ex.toString());
        }

        return brightcoveCredentailVO;
    }
}
