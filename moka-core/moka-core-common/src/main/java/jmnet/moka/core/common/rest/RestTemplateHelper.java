package jmnet.moka.core.common.rest;

import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.common.rest
 * ClassName : RestTemplateHelper
 * Created : 2020-11-23 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-23 17:31
 */
@Slf4j
public class RestTemplateHelper {

    private final RestTemplate restTemplate;

    public RestTemplateHelper(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * <pre>
     * RestTemplate을 이용하여 외부 서버와 데이터를 주고 받는다.
     * </pre>
     *
     * @param url url
     * @return ResponseEntity
     */
    public ResponseEntity<String> get(String url) {

        return request(url, HttpMethod.GET, null, null);
    }

    /**
     * <pre>
     * RestTemplate을 이용하여 외부 서버와 데이터를 주고 받는다.
     * MultiValueMap에 파라미터를 담아 전달
     * </pre>
     *
     * @param url    url
     * @param params 파라미터
     * @return ResponseEntity
     */
    public ResponseEntity<String> get(String url, MultiValueMap<String, Object> params) {

        return request(url, HttpMethod.GET, params, null);
    }



    /**
     * <pre>
     * RestTemplate을 이용하여 외부 서버와 데이터를 주고 받는다.
     * 문자열 또는 객체로 파라미터 전달
     * MultiValueMap에 헤더 정보를 담아 전달
     * </pre>
     *
     * @param url     요청 url
     * @param body    요청 파라미터
     * @param headers HttpHeader
     * @return ResponseEntity
     */
    public ResponseEntity<String> get(String url, Object body, MultiValueMap<String, String> headers) {

        return request(url, HttpMethod.GET, body, headers);
    }

    /**
     * <pre>
     * RestTemplate을 이용하여 외부 서버와 데이터를 주고 받는다.
     * MultiValueMap에 파라미터를 담아 전달
     * MultiValueMap에 헤더 정보를 담아 전달
     * </pre>
     *
     * @param url     요청 url
     * @param params  param map
     * @param headers HttpHeader
     * @return ResponseEntity
     */
    public ResponseEntity<String> get(String url, MultiValueMap<String, Object> params, MultiValueMap<String, String> headers) {

        return request(url, HttpMethod.GET, params, headers);
    }

    /**
     * <pre>
     * RestTemplate을 이용하여 외부 서버와 데이터를 주고 받는다.
     * MultiValueMap에 파라미터를 담아 전달
     * </pre>
     *
     * @param url    url
     * @param params 파라미터
     * @return ResponseEntity
     */
    public ResponseEntity<String> post(String url, MultiValueMap<String, Object> params) {

        return request(url, HttpMethod.POST, params, null);
    }



    /**
     * <pre>
     * RestTemplate을 이용하여 외부 서버와 데이터를 주고 받는다.
     * 문자열 또는 객체로 파라미터 전달
     * MultiValueMap에 헤더 정보를 담아 전달
     * </pre>
     *
     * @param url     요청 url
     * @param body    요청 파라미터
     * @param headers HttpHeader
     * @return ResponseEntity
     */
    public ResponseEntity<String> post(String url, Object body, MultiValueMap<String, String> headers) {

        return request(url, HttpMethod.POST, body, headers);
    }

    /**
     * <pre>
     * RestTemplate을 이용하여 외부 서버와 데이터를 주고 받는다.
     * MultiValueMap에 파라미터를 담아 전달
     * MultiValueMap에 헤더 정보를 담아 전달
     * </pre>
     *
     * @param url     요청 url
     * @param params  param map
     * @param headers HttpHeader
     * @return ResponseEntity
     */
    public ResponseEntity<String> post(String url, MultiValueMap<String, Object> params, MultiValueMap<String, String> headers) {

        return request(url, HttpMethod.POST, params, headers);
    }

    /**
     * <pre>
     * RestTemplate을 이용하여 외부 서버와 데이터를 주고 받는다.
     * MultiValueMap에 파라미터를 담아 전달
     * MultiValueMap에 헤더 정보를 담아 전달
     * </pre>
     *
     * @param url 요청 url
     * @return ResponseEntity
     */
    public ResponseEntity<String> delete(String url) {

        return request(url, HttpMethod.DELETE, null, null);
    }


    /**
     * <pre>
     * RestTemplate을 이용하여 외부 서버와 데이터를 주고 받는다.
     * MultiValueMap에 파라미터를 담아 전달
     * MultiValueMap에 헤더 정보를 담아 전달
     * </pre>
     *
     * @param url    요청 url
     * @param params param map
     * @return ResponseEntity
     */
    public ResponseEntity<String> delete(String url, MultiValueMap<String, Object> params) {

        return request(url, HttpMethod.DELETE, params, null);
    }



    /**
     * <pre>
     * RestTemplate을 이용하여 외부 서버와 데이터를 주고 받는다.
     * MultiValueMap에 파라미터를 담아 전달
     * MultiValueMap에 헤더 정보를 담아 전달
     * </pre>
     *
     * @param url     요청 url
     * @param params  params map
     * @param headers HttpHeader
     * @return ResponseEntity
     */
    private ResponseEntity<String> request(String url, HttpMethod method, MultiValueMap<String, Object> params,
            MultiValueMap<String, String> headers) {

        RequestEntity<?> requestEntity = RequestEntityGenerator.rquestEntity(method, url, headers, params);
        String uuid = UUID
                .randomUUID()
                .toString();
        log.info("External System Request Start : txid : {}, url : {}, params : {}", uuid, url, params);
        ResponseEntity<String> responseBody = restTemplate.exchange(requestEntity, String.class);
        log.info("External System Request end : txid : {}", uuid);
        return responseBody;
    }

    /**
     * <pre>
     * RestTemplate을 이용하여 외부 서버와 데이터를 주고 받는다.
     * MultiValueMap에 파라미터를 담아 전달
     * MultiValueMap에 헤더 정보를 담아 전달
     * </pre>
     *
     * @param url     요청 url
     * @param body    request body
     * @param headers HttpHeader
     * @return ResponseEntity
     */
    private ResponseEntity<String> request(String url, HttpMethod method, Object body, MultiValueMap<String, String> headers) {

        RequestEntity<?> requestEntity = RequestEntityGenerator.rquestEntity(method, url, headers, body);
        String uuid = UUID
                .randomUUID()
                .toString();
        log.info("External System Request Start : txid : {}, url : {}, params : {}", uuid, url, body);
        ResponseEntity<String> responseBody = restTemplate.exchange(requestEntity, String.class);
        log.info("External System Request end : txid : {}", uuid);
        return responseBody;
    }



}
