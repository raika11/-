/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package jmnet.moka.core.tps.helper;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.rest.RestTemplateHelper;
import jmnet.moka.core.common.util.ResourceMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

/**
 * Description: 설명
 *
 * @author ohtah
 * @since 2020. 12. 23.
 */
public class KeywordHelper {
    @Value("${article.keyword.url}")
    private String keywordUrl;

    @Autowired
    private RestTemplateHelper restTemplateHelper;

    public List<String> getKeywords(String title, String subTitle, String content)
            throws IOException {

        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add(MokaConstants.CONTENT_TYPE, MediaType.APPLICATION_JSON_UTF8_VALUE);
        String requestUrl = keywordUrl;
        MultiValueMap<String, Object> params = new LinkedMultiValueMap<>();
        params.add("title", title);
        params.add("subTitle", subTitle);
        params.add("content", content);
        params.add("term", MokaConstants.YES);
        ResponseEntity<String> responseEntity = restTemplateHelper.post(requestUrl, params, headers);

        String response = responseEntity.getBody();
        List<Map<String, Object>> map = ResourceMapper
                .getDefaultObjectMapper()
                .readValue(response, new TypeReference<List<Map<String, Object>>>() {
                });

        List<String> returnList = new ArrayList<>();
        for (Map<String, Object> item : map) {

        }
        return returnList;
    }
}
