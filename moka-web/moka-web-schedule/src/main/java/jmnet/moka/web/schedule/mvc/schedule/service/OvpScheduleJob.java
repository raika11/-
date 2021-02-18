package jmnet.moka.web.schedule.mvc.schedule.service;

import jmnet.moka.common.utils.McpDate;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.brightcove.BrightcoveCredentailVO;
import jmnet.moka.core.common.brightcove.BrightcoveProperties;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.web.schedule.support.schedule.AbstractScheduleJob;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

/**
 * <pre>
 * 브라이트 코드에서 OVP 목록을 조회하여 rss 파일을 FTP 서버로 전송한다.
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.schedule.service
 * ClassName : OvpScheduleJob
 * Created : 2021-02-17 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-17 11:54
 */
@Slf4j
public class OvpScheduleJob extends AbstractScheduleJob {

    @Autowired
    private BrightcoveProperties brightcoveProperties;

    @Override
    public void invoke() {

    }

    private BrightcoveCredentailVO getClientCredentials() {
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

    public ResponseEntity<?> findAllOvp() {
        BrightcoveCredentailVO credentail = getClientCredentials();

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


        return responseEntity;
    }
}
