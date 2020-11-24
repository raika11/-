package jmnet.moka.core.common.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Map;
import jmnet.moka.common.utils.exception.ServiceProcessException;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.common.rest
 * ClassName : RequestEntityGenerator
 * Created : 2020-11-23 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-23 17:35
 */
public class RequestEntityGenerator {

    /**
     * <pre>
     * Http Method별로 RequestEntity를 생성하여 전달
     * </pre>
     *
     * @param method  HttpMethod
     * @param url     요청 url
     * @param headers Http header
     * @param body    param body
     * @return RequestEntity
     * @throws URISyntaxException
     */
    public static <T> RequestEntity<T> rquestEntity(final HttpMethod method, final String url, final Map<String, String> headers, final Object body)
            throws URISyntaxException {
        MultiValueMap<String, String> requestHeaders = new LinkedMultiValueMap<>();
        requestHeaders.setAll(headers);

        return rquestEntity(method, url, requestHeaders, body);
    }

    /**
     * <pre>
     * Http Method별로 RequestEntity를 생성하여 전달
     * </pre>
     *
     * @param method         HttpMethod
     * @param url            요청 url
     * @param requestHeaders Http header
     * @param body           param body
     * @return RequestEntity
     * @throws URISyntaxException
     */
    public static <T> RequestEntity<T> rquestEntity(final HttpMethod method, final String url, final MultiValueMap<String, String> requestHeaders,
            final Object body) {
        try {
            URI uri = new URI(url);

            switch (method) {
                case GET:
                case DELETE:
                    return new RequestEntity<>(requestHeaders, method, uri);
                case PUT:
                case POST:
                    @SuppressWarnings("unchecked") T requestBody = (T) body;
                    return new RequestEntity<>(requestBody, requestHeaders, method, uri);
                default:
                    break;
            }
            return new RequestEntity<T>(requestHeaders, method, uri);

        } catch (URISyntaxException ex) {
            throw new ServiceProcessException(ex, HttpStatus.BAD_REQUEST);
        }

    }

    /**
     * <pre>
     * Http Method별로 RequestEntity를 생성하여 전달
     * </pre>
     *
     * @param method
     * @param url
     * @param headers
     * @return RequestEntity
     * @throws URISyntaxException
     */
    public static RequestEntity<Void> rquestEntity(HttpMethod method, final String url, final Map<String, String> headers)
            throws URISyntaxException {
        return rquestEntity(method, url, headers, null);
    }
}
