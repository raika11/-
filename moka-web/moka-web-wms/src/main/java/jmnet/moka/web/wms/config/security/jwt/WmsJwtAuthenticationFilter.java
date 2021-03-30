package jmnet.moka.web.wms.config.security.jwt;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.util.ResponseUtil;
import jmnet.moka.core.tps.mvc.auth.dto.UserDTO;
import jmnet.moka.web.wms.config.security.exception.AbstractAuthenticationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

/**
 * <pre>
 * Jwt 토큰방식 인증을 위해 로그인 과 토큰을 header에 내려준다.
 * 2020. 7. 18. kspark 최초생성
 * </pre>
 *
 * @author kspark
 * @since 2020. 7. 18. 오후 12:27:53
 */
public class WmsJwtAuthenticationFilter extends AbstractAuthenticationProcessingFilter {
    private static TypeReference<Map<String, String>> MAP_TYPE_REF = new TypeReference<Map<String, String>>() {
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


    @Value("${login.password.changed-days-noti-limit:30}")
    private int passwordChangeNotiDays;

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
     * @param request  http요청
     * @param response http응답
     * @return 인증 여부
     * @throws AuthenticationException 인증오류
     * @see org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter#attemptAuthentication(javax.servlet.http.HttpServletRequest,
     * javax.servlet.http.HttpServletResponse)
     */
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {

        HashMap<String, String> credentials = null;
        try {
            credentials = MAPPER.readValue(request.getInputStream(), MAP_TYPE_REF);
        } catch (IOException e) {
            e.printStackTrace();
        }

        String userId = credentials.get(LOGIN_USER_ID);
        String userPassword = credentials.get(LOGIN_PASSWORD);

        // Authenticate user
        Authentication auth = getAuthenticationManager().authenticate(new WmsJwtAuthenticationToken(userId, userPassword));

        return auth;
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed)
            throws IOException, ServletException {
        //super.unsuccessfulAuthentication(request, response, failed);
        if (failed instanceof AbstractAuthenticationException) {
            AbstractAuthenticationException wmsAuthenticationFailed = (AbstractAuthenticationException) failed;
            Map<String, Object> body = wmsAuthenticationFailed
                    .getErrorCode()
                    .toMap();
            if (wmsAuthenticationFailed.getExtra() != null) {
                body.put("extra", wmsAuthenticationFailed.getExtra());
            }
            ResponseUtil.error(response, TpsConstants.HEADER_UNAUTHORIZED, wmsAuthenticationFailed.getMessage(), body, wmsAuthenticationFailed
                    .getErrorCode()
                    .getCode());

        } else {
            ResponseUtil.error(response, TpsConstants.HEADER_UNAUTHORIZED, failed.getMessage(), null);
        }

        /*
        String message = "";
        if (failed instanceof UsernameNotFoundException) {
            ResponseUtil.error(response, TpsConstants.HEADER_UNAUTHORIZED, failed.getMessage(), null);
        } else if (failed instanceof BadCredentialsException) { // 비밀번호 오류
            message = messageByLocale.get("wms.login.error.BadCredentials", request);
            ResponseUtil.error(response, TpsConstants.HEADER_INVALID_DATA, message, null);
        } else if (failed instanceof InsufficientAuthenticationException) { // status 가 'N'인 경우
            message = messageByLocale.get("wms.login.error.InsufficientAuthenticationException", request);
            ResponseUtil.error(response, TpsConstants.HEADER_FORBIDDEN, message, null);
        } else {
            message = messageByLocale.get("wms.login.error", request);
            ResponseUtil.error(response, TpsConstants.HEADER_SERVER_ERROR, message);
        }
        */
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult)
            throws IOException, ServletException {

        SecurityContextHolder
                .getContext()
                .setAuthentication(authResult);

        // Fire event
        if (this.eventPublisher != null) {
            eventPublisher.publishEvent(new AuthenticationSuccessEvent(authResult));
        }

        HttpSession session = request.getSession(false);
        if (session == null) {
            return;
        }
        session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);

        String sessionId = request
                .getSession()
                .getId();
        String token = WmsJwtHelper.create(authResult, sessionId);

        // Add token in response
        response.addHeader(WmsJwtHelper.HEADER_STRING, WmsJwtHelper.TOKEN_PREFIX + token);

        UserDTO userDetails = (UserDTO) authResult.getDetails();
        /* 비밀번호 변경 만료일 알림
        if (userDetails.getPasswordModDt() != null && McpDate.dayTerm(userDetails.getPasswordModDt()) < -(passwordChangeNotiDays)) {
            String message = messageByLocale.get("wms.login.change-password.noti");

            ResponseUtil.ok(response, TpsConstants.HEADER_SUCCESS, message, UnauthrizedErrorCode.PASSWORD_NOTI.toMap(),
                    UnauthrizedErrorCode.PASSWORD_NOTI.getCode());

        } else {
            String message = messageByLocale.get("wms.login.success", userDetails.getUserName());
            ResponseUtil.ok(response, message, null);
        }
        */

        String message = messageByLocale.get("wms.login.success", userDetails.getUserName());
        ResponseUtil.ok(response, message, null);
    }

}
