package jmnet.moka.core.tps.mvc.jpod.service;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.IOException;
import jmnet.moka.common.utils.MapBuilder;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.rest.RestTemplateHelper;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.tps.mvc.jpod.dto.PodtyEpisodeSearchDTO;
import jmnet.moka.core.tps.mvc.jpod.vo.PodtyChannelVO;
import jmnet.moka.core.tps.mvc.jpod.vo.PodtyCredentialVO;
import jmnet.moka.core.tps.mvc.jpod.vo.PodtyEpisodeVO;
import jmnet.moka.core.tps.mvc.jpod.vo.PodtyResultVO;
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
 * Package : jmnet.moka.core.tps.mvc.jpod.service
 * ClassName : BrightcoveServiceImpl
 * Created : 2020-11-24 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-24 09:10
 */
@Slf4j
@Service
public class PodtyServiceImpl implements PodtyService {
    @Autowired
    private RestTemplateHelper restTemplateHelper;

    @Value("${podty.client-id}")
    private String clientId;

    @Value("${podty.secret}")
    private String clientSecret;

    @Value("${podty.auth-token.header}")
    private String tokenHeaderKey;


    @Value("${podty.token.api}")
    private String tokenApi;

    @Value("${podty.channels.api}")
    private String channelsApi;

    @Value("${podty.episodes.api}")
    private String episodesApi;


    private String token;

    public PodtyResultVO<PodtyChannelVO> findAllChannel() {
        PodtyCredentialVO token = getClientCredentials();

        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add(MokaConstants.CONTENT_TYPE, MediaType.APPLICATION_JSON_UTF8_VALUE);
        headers.add(tokenHeaderKey, token.getResult());

        String url = channelsApi;
        try {
            url += MapBuilder
                    .getInstance()
                    .add("client_id", clientId)
                    .getQueryString(true, true);
        } catch (Exception ex) {
            log.error(ex.toString());
        }

        ResponseEntity<String> responseEntity = restTemplateHelper.post(url, null, headers);

        PodtyResultVO<PodtyChannelVO> result = new PodtyResultVO<>();
        try {
            result = ResourceMapper
                    .getDefaultObjectMapper()
                    .readValue(responseEntity.getBody(), new TypeReference<PodtyResultVO<PodtyChannelVO>>() {
                    });
        } catch (IOException ex) {
            log.error("[PODTY CHANNEL ERROR]", ex);
        }

        return result;
    }


    public PodtyResultVO<PodtyEpisodeVO> findAllEpisode(String castSrl, PodtyEpisodeSearchDTO searchDTO) {
        PodtyCredentialVO token = getClientCredentials();

        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add(MokaConstants.CONTENT_TYPE, MediaType.APPLICATION_JSON_UTF8_VALUE);
        headers.add(tokenHeaderKey, token.getResult());


        String url = episodesApi;
        try {
            url += MapBuilder
                    .getInstance()
                    .add("client_id", clientId)
                    .add("cast_srl", castSrl)
                    .add("page", String.valueOf(searchDTO.getPage() + 1))
                    .add("size", String.valueOf(searchDTO.getSize()))
                    .add("direction", searchDTO.getDirection())
                    .getQueryString(true, true);
        } catch (Exception ex) {
            log.error(ex.toString());
        }

        ResponseEntity<String> responseEntity = restTemplateHelper.post(url, null, headers);

        PodtyResultVO<PodtyEpisodeVO> result = new PodtyResultVO<>();

        try {
            result = ResourceMapper
                    .getDefaultObjectMapper()
                    .readValue(responseEntity.getBody(), new TypeReference<PodtyResultVO<PodtyEpisodeVO>>() {
                    });
        } catch (Exception ex) {
            log.error("[PODTY EPISODE ERROR]", ex);
        }

        return result;
    }

    private PodtyCredentialVO getClientCredentials() {

        PodtyCredentialVO token = new PodtyCredentialVO();

        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add(MokaConstants.CONTENT_TYPE, MediaType.APPLICATION_JSON_UTF8_VALUE);
        String tokenUri = tokenApi;
        try {
            tokenUri += MapBuilder
                    .getInstance()
                    .add("client_id", clientId)
                    .add("secret", clientSecret)
                    .getQueryString(true, true);
        } catch (Exception ex) {
            log.error(ex.toString());
        }
        synchronized (PodtyServiceImpl.class) {
            ResponseEntity<String> responseEntity = restTemplateHelper.post(tokenUri, null, headers);
            try {
                token = ResourceMapper
                        .getDefaultObjectMapper()
                        .readValue(responseEntity.getBody(), PodtyCredentialVO.class);
            } catch (Exception ex) {
                log.error(ex.toString());
            }
        }
        return token;
    }

}
