package jmnet.moka.core.tps.mvc.bright.service;

import java.util.ArrayList;
import java.util.List;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.rest.RestTemplateHelper;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.tps.mvc.bright.dto.OvpSearchDTO;
import jmnet.moka.core.tps.mvc.bright.dto.VideoDTO;
import jmnet.moka.core.tps.mvc.bright.vo.BrightcoveCredentailVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.bright.service
 * ClassName : BrightcoveServiceImpl
 * Created : 2020-11-24 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-24 09:10
 */
@Slf4j
@Service
public class BrightcoveServiceImpl implements BrightcoveService {
    @Autowired
    private RestTemplateHelper restTemplateHelper;

    @Value("${brightcove.account}")
    private String account;

    @Value("${brightcove.api-key}")
    private String apiKey;

    @Value("${brightcove.client-id}")
    private String clientId;

    @Value("${brightcove.client-secret}")
    private String clientSecret;

    @Value("${brightcove.address}")
    private String baseUrl;

    @Value("${brightcove.api.token}")
    private String tokenApi;

    @Value("${brightcove.cms.api.base-url}")
    private String cmsBaseUrl;

    @Value("${brightcove.cms.api.ingest-url}")
    private String cmsIngestUrl;

    @Value("${brightcove.api.bcovlive-url}")
    private String bcovliveUrl;

    private BrightcoveCredentailVO brightcoveCredentailVO;


    public ResponseEntity<?> findAllOvp(OvpSearchDTO searchDTO) {
        BrightcoveCredentailVO credentail = getClientCredentials();

        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add(MokaConstants.CONTENT_TYPE, MediaType.APPLICATION_JSON_UTF8_VALUE);
        headers.add(MokaConstants.AUTHORIZATION, String.format("%s %s", credentail.getTokenType(), credentail.getAccessToken()));
        //headers.add("X-API-KEY", apiKey);
        String requestUrl = cmsBaseUrl;
        if (McpString.isNotEmpty(searchDTO.getFolderId())) {
            requestUrl = String.format(requestUrl + "/folders/%s/videos", searchDTO.getFolderId());
        } else {
            requestUrl = String.format(requestUrl + "/videos", searchDTO.getFolderId());
        }
        MultiValueMap<String, Object> params = new LinkedMultiValueMap<>();
        params.add("limit", searchDTO.getSize());
        params.add("offset", searchDTO.getPage() * searchDTO.getSize());
        ResponseEntity<String> responseEntity = restTemplateHelper.get(requestUrl, params, headers);


        return responseEntity;
    }

    private boolean isCorrectCredentail() {
        if (brightcoveCredentailVO == null || McpDate
                .now()
                .after(brightcoveCredentailVO.getExpireDt())) {
            return false;
        }
        return true;
    }

    private BrightcoveCredentailVO getClientCredentials() {
        if (!isCorrectCredentail()) {
            MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
            headers.add(MokaConstants.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE);
            MultiValueMap<String, Object> params = new LinkedMultiValueMap<>();
            params.add("client_id", clientId);
            params.add("client_secret", clientSecret);
            synchronized (BrightcoveCredentailVO.class) {
                ResponseEntity<String> responseEntity = restTemplateHelper.post(baseUrl + tokenApi, params, headers);
                try {
                    BrightcoveCredentailVO newCredentialVO = ResourceMapper
                            .getDefaultObjectMapper()
                            .readValue(responseEntity.getBody(), BrightcoveCredentailVO.class);
                    brightcoveCredentailVO = newCredentialVO;
                    brightcoveCredentailVO.setExpireDt(McpDate.secondPlus(newCredentialVO.getExpiresIn()));
                } catch (Exception ex) {
                    log.error(ex.toString());
                }
            }
        }

        return brightcoveCredentailVO;
    }

    public List<VideoDTO> findAllVideos(SearchDTO search) {

        BrightcoveCredentailVO credentail = getClientCredentials();

        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add(MokaConstants.CONTENT_TYPE, MediaType.APPLICATION_JSON_UTF8_VALUE);
        headers.add(MokaConstants.AUTHORIZATION, String.format("%s %s", credentail.getTokenType(), credentail.getAccessToken()));
        //headers.add("X-API-KEY", apiKey);

        String requestUrl = String.format("%s/%s/videos", cmsBaseUrl, account);

        MultiValueMap<String, Object> params = new LinkedMultiValueMap<>();
        params.add("limit", search.getSize());
        params.add("offset", search.getPage() * search.getSize());
        ResponseEntity<String> responseEntity = restTemplateHelper.get(requestUrl, params, headers);

        List<VideoDTO> returnList = new ArrayList<>();
        // responseEntity -> VideoDTO 로 변경작업 필요
        
        return returnList;
    }
}
