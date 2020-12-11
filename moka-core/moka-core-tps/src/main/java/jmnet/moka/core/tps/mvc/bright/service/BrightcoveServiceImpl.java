package jmnet.moka.core.tps.mvc.bright.service;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.rest.RestTemplateHelper;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.tps.mvc.bright.dto.OvpSearchDTO;
import jmnet.moka.core.tps.mvc.bright.vo.BrightcoveCredentailVO;
import jmnet.moka.core.tps.mvc.bright.vo.OvpVO;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.util.UriComponentsBuilder;

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

    @Value("${brightcove.job-id.channel1}")
    private String channel1JobId;

    @Value("${brightcove.job-id.channel2}")
    private String channel2JobId;


    @Autowired
    private ModelMapper modelMapper;

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
        return false;
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

    // https://apis.support.brightcove.com/cms/references/reference.html#operation/GetVideos
    public List<OvpVO> findAllVideo(OvpSearchDTO search)
            throws IOException, ParseException {

        BrightcoveCredentailVO credentail = getClientCredentials();

        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add(MokaConstants.CONTENT_TYPE, MediaType.APPLICATION_JSON_UTF8_VALUE);
        headers.add(MokaConstants.AUTHORIZATION, String.format("%s %s", credentail.getTokenType(), credentail.getAccessToken()));
        //headers.add("X-API-KEY", apiKey);

        UriComponentsBuilder builder = UriComponentsBuilder.newInstance();
        builder.path(cmsBaseUrl + "/videos");
        builder.queryParam("limit", search.getSize());
        builder.queryParam("offset", search.getPage() * search.getSize());
        if (McpString.isNotEmpty(search.getKeyword())) {
            builder.queryParam("q", search.getSearchType() + ":" + search.getKeyword());
        }
        String requestUrl = builder
                .build()
                .encode()
                .toString();

        ResponseEntity<String> responseEntity = restTemplateHelper.get(requestUrl, null, headers);

        String response = responseEntity.getBody();
        List<Map<String, Object>> map = ResourceMapper
                .getDefaultObjectMapper()
                .readValue(response, new TypeReference<List<Map<String, Object>>>() {
                });

        List<OvpVO> returnList = new ArrayList<>();
        for (Map<String, Object> item : map) {
            String src = null;
            if (item.containsKey("images")) {
                Map<String, Object> images = (Map<String, Object>) item.get("images");
                if (images.containsKey("thumbnail")) {
                    Map<String, Object> thumbnail = (Map<String, Object>) images.get("thumbnail");
                    if (thumbnail.containsKey("src")) {
                        src = thumbnail
                                .get("src")
                                .toString();
                    }
                }
            }

            Date created_at = null;
            if (item.containsKey("created_at")) {
                created_at = McpDate.date("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", item
                        .get("created_at")
                        .toString());    // 2019-04-30T23:27:22.507Z
            }

            OvpVO ovp = OvpVO
                    .builder()
                    .id(item.containsKey("id") ? item
                            .get("id")
                            .toString() : null)
                    .thumbFileName(src)
                    .name(item.containsKey("name") ? item
                            .get("name")
                            .toString() : null)
                    .state(item.containsKey("state") ? item
                            .get("state")
                            .toString() : "ACTIVE")
                    .regDt(created_at)
                    .build();
            returnList.add(ovp);
        }
        return returnList;
    }

    @Override
    public List<OvpVO> findAllLive()
            throws IOException, ParseException {

        List<OvpVO> returnList = new ArrayList<>();
        OvpVO ovp1 = this.findLiveByChannel(1);
        if (ovp1 != null) {
            returnList.add(ovp1);
        }
        OvpVO ovp2 = this.findLiveByChannel(2);
        if (ovp2 != null) {
            returnList.add(ovp2);
        }

        return returnList;
    }

    // https://live.support.brightcove.com/live-api/references/reference.html#operation/GetLiveJobDetails
    private OvpVO findLiveByChannel(int channel)
            throws IOException {
        BrightcoveCredentailVO credentail = getClientCredentials();

        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add(MokaConstants.CONTENT_TYPE, MediaType.APPLICATION_JSON_UTF8_VALUE);
        headers.add(MokaConstants.AUTHORIZATION, String.format("%s %s", credentail.getTokenType(), credentail.getAccessToken()));
        headers.add("X-API-KEY", apiKey);

        String jobId = (channel == 1) ? channel1JobId : channel2JobId;

        UriComponentsBuilder builder = UriComponentsBuilder.newInstance();
        builder.path(bcovliveUrl + "/jobs/" + jobId);
        String requestUrl = builder
                .build()
                .encode()
                .toString();

        ResponseEntity<String> responseEntity = restTemplateHelper.get(requestUrl, null, headers);

        String response = responseEntity.getBody();
        Map<String, Object> map = ResourceMapper
                .getDefaultObjectMapper()
                .readValue(response, new TypeReference<Map<String, Object>>() {
                });

        if (!map.isEmpty()) {
            if (map.containsKey("job")) {
                Map<String, Object> job = (Map<String, Object>) map.get("job");
                OvpVO ovp = OvpVO
                        .builder()
                        .id(job.containsKey("job_videocloud_asset_id") ? job
                                .get("job_videocloud_asset_id")
                                .toString() : null)
                        .state(job.containsKey("state") ? job
                                .get("state")
                                .toString() : "processing")
                        .build();
                return ovp;
            }
        }
        return null;
    }
}
