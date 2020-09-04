package jmnet.moka.web.wms.config.security.jwt;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.util.ResponseUtil;

/**
 * 
 * <pre>
 * Jwt 토큰방식 인증을 위해 로그인 과 토큰을 header에 내려준다.
 * 2020. 7. 18. kspark 최초생성
 * </pre>
 * 
 * @since 2020. 7. 18. 오후 12:27:53
 * @author kspark
 */
public class WmsJwtAuthenticationFilter extends AbstractAuthenticationProcessingFilter {
    private static TypeReference<Map<String, String>> MAP_TYPE_REF =
            new TypeReference<Map<String, String>>() {
            };
    private static String LOGIN_URI = "/loginJwt";
    private static String LOGIN_METHOD = "POST";
    private static String LOGIN_USER_ID = "userId";
    private static String LOGIN_PASSWORD = "userPassword";

    private static ObjectMapper MAPPER = new ObjectMapper();
    static {
        MAPPER.setSerializationInclusion(Include.NON_EMPTY);
        MAPPER.setDefaultPropertyInclusion(Include.NON_NULL);
    }

    @Autowired
    private MessageByLocale messageByLocale;

    public WmsJwtAuthenticationFilter(AuthenticationManager authenticationManager) {
        super(new AntPathRequestMatcher(LOGIN_URI, LOGIN_METHOD));
        this.setAuthenticationManager(authenticationManager);
    }


    /**
     * <pre>
     * LOGIN_URL, LOGIN_METHOD 에 부합하는 url에 대해 json형식의 LOGIN_USERNAME, LOGIN_PASSWORD에 대한 인증을 처리한다.
     * 기본 : /loginJwt, POST
     * json 형식 : {"userId":"user", "userPassword":"passwd"}
     * </pre>
     * 
     * @param request http요청
     * @param response http응답
     * @return 인증 여부
     * @throws AuthenticationException 인증오류
     * @see org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter#attemptAuthentication(javax.servlet.http.HttpServletRequest,
     *      javax.servlet.http.HttpServletResponse)
     */
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request,
            HttpServletResponse response) throws AuthenticationException {

        HashMap<String, String> credentials = null;
        try {
            credentials = MAPPER.readValue(request.getInputStream(), MAP_TYPE_REF);
        } catch (IOException e) {
            e.printStackTrace();
        }

        String userId = credentials.get(LOGIN_USER_ID);
        String userPassword = credentials.get(LOGIN_PASSWORD);

        // Authenticate user
        Authentication auth = getAuthenticationManager()
                .authenticate(new WmsJwtAuthenticationToken(userId, userPassword));

        return auth;
    }

    protected void unsuccessfulAuthentication(HttpServletRequest request,
            HttpServletResponse response, AuthenticationException failed)
            throws IOException, ServletException {
        super.unsuccessfulAuthentication(request, response, failed);

        String message = "";
        if (failed instanceof BadCredentialsException) {
            message = messageByLocale.get("wms.login.error.InternalAuthenticationServiceException",
                    request);
            ResponseUtil.error(response, TpsConstants.HEADER_INVALID_DATA, message);
        } else if (failed instanceof InsufficientAuthenticationException) {
            message = messageByLocale.get("wms.login.error.InsufficientAuthenticationException",
                    request);
            ResponseUtil.error(response, TpsConstants.HEADER_UNAUTHORIZED, message);
        } else {
            message = messageByLocale.get("wms.login.error", request);
            ResponseUtil.error(response, TpsConstants.HEADER_SERVER_ERROR, message);
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request,
            HttpServletResponse response, FilterChain chain, Authentication authResult)
            throws IOException, ServletException {

        SecurityContextHolder.getContext().setAuthentication(authResult);

        // Fire event
        if (this.eventPublisher != null) {
            eventPublisher.publishEvent(new AuthenticationSuccessEvent(authResult));
        }

        HttpSession session = request.getSession(false);
        if (session == null) {
            return;
        }
        session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);

        String sessionId = request.getSession().getId();
        String token = WmsJwtHelper.create(authResult, sessionId);

        // Add token in response
        response.addHeader(WmsJwtHelper.HEADER_STRING, WmsJwtHelper.TOKEN_PREFIX + token);
    }

}
