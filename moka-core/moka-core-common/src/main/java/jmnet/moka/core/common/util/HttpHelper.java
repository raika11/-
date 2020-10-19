package jmnet.moka.core.common.util;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import jmnet.moka.core.common.MokaConstants;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

public class HttpHelper {

    /**
     * getRemoteAddr에서 사용할 헤더 목록
     */
    public static final String[] REMOTE_IP_HEADER =
            {"X-Forwarded-For", "Proxy-Client-IP", "WL-Proxy-Client-IP", "HTTP_CLIENT_IP", "HTTP_X_FORWARDED_FOR"};

    /**
     * 요청한 Client IP를 가져온다.
     *
     * @param request HttpServletRequest
     * @return IP
     */
    public static String getRemoteAddr(HttpServletRequest request) {
        String ip = null;
        for (String h : REMOTE_IP_HEADER) {
            ip = request.getHeader(h);
            if (ip != null) {
                return ip;
            }
        }
        return request.getRemoteAddr();
    }

    /**
     * <pre>
     * http 파라미터 맵을 반환한다. 파라미터 중복시 overwrite된다.
     * </pre>
     *
     * @param request HttpServletRequest
     * @return 파라미터 맵
     */
    public static Map<String, String> getParamMap(HttpServletRequest request) {
        Map<String, String> parameterMap = new HashMap<String, String>(8);
        Enumeration<String> paramNameEnumeration = request.getParameterNames();
        while (paramNameEnumeration.hasMoreElements()) {
            String paramName = paramNameEnumeration.nextElement();
            String value = request.getParameter(paramName);
            if (value != null) {
                parameterMap.put(paramName, value);
            }
        }
        return parameterMap;
    }

    /**
     * <pre>
     * http 파라미터를 문자열로 반환한다.
     * </pre>
     *
     * @param request HttpServletRequest
     * @return 파라미터 맵
     */
    public static String getParamString(HttpServletRequest request) {
        String param = "";
        Enumeration<String> params = request.getParameterNames();
        int idx = 0;
        while (params.hasMoreElements()) {
            String name = (String) params.nextElement();
            if (idx++ > 0) {
                param += ",";
            }
            param += (name + "=" + request.getParameter(name));
        }
        return param;
    }

    /**
     * http header 정보를 Map으로 반환한다.
     *
     * @param request http요청
     * @return http header 맵
     */
    public static Map<String, String> getHeaderMap(HttpServletRequest request) {
        Map<String, String> headerMap = new HashMap<String, String>(8);
        for (Enumeration<String> e = request.getHeaderNames(); e.hasMoreElements(); ) {
            String headerName = e.nextElement();
            headerMap.put(headerName, request.getHeader(headerName));
        }
        return headerMap;
    }

    /**
     * http cookie를 Map으로 반환한다.
     *
     * @param request http요청
     * @return http cookie 맵
     */
    public static Map<String, String> getCookieMap(HttpServletRequest request) {
        Map<String, String> cookieMap = new HashMap<String, String>();
        for (Cookie cookie : request.getCookies()) {
            cookieMap.put(cookie.getName(), cookie.getValue());
        }
        return cookieMap;
    }

    /**
     * HttpServletRequest 없이 client ip 얻기
     *
     * @return client ip
     */
    public static String getRemoteAddr() {
        HttpServletRequest req = RequestContextHolder.getRequestAttributes() != null
                ? ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest()
                : null;
        return req != null ? getRemoteAddr(req) : MokaConstants.IP_UNKNOWN;
    }
}
