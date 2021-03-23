package jmnet.moka.core.common.push.service;

import jmnet.moka.common.utils.BeanConverter;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.core.common.push.dto.PushSendDTO;
import jmnet.moka.core.common.rest.RestTemplateHelper;
import jmnet.moka.core.common.util.ResourceMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.common.push.service
 * ClassName : PushServiceImpl
 * Created : 2021-03-23 ince
 * </pre>
 *
 * @author ince
 * @since 2021-03-23 07:05
 */
public class PushSendServiceImpl implements PushSendService {

    @Autowired
    private RestTemplateHelper restTemplateHelper;

    @Value("${push.api.url:http://localhost:8180/api/push}")
    private String pushApiUrl;

    @Override
    public ResultDTO<?> send(PushSendDTO sendDTO)
            throws Exception {
        MultiValueMap<String, Object> paramMap = new LinkedMultiValueMap<>();
        paramMap.setAll(BeanConverter.toMap(sendDTO));
        /**
         * 목록을 Map으로 만들때 예상치 자료 구조로 변환되어 개별로 추가되도록 설정
         */
        paramMap.remove("appSeq");
        paramMap.addAll("appSeq", sendDTO.getAppSeq());
        ResponseEntity<String> responseEntity = restTemplateHelper.post(pushApiUrl, paramMap);
        ResultDTO<?> resultDto = ResourceMapper
                .getDefaultObjectMapper()
                .readValue(responseEntity.getBody(), ResultDTO.class);

        return resultDto;
    }
}
