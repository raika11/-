package jmnet.moka.web.wms.config.security;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.util.ResponseUtil;
import jmnet.moka.core.tps.mvc.auth.dto.UserDTO;
import jmnet.moka.core.tps.mvc.auth.service.AuthService;
import jmnet.moka.web.wms.config.security.jwt.WmsJwtHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

/**
 * <pre>
 * 로그아웃 이벤트 처리
 * 2017. 4. 21. ince 최초생성
 * </pre>
 *
 * @author ince
 * @since 2017. 4. 21. 오후 3:21:38
 */
public class WmsLogoutHandler implements LogoutSuccessHandler, LogoutHandler {

    private static final Logger logger = LoggerFactory.getLogger(WmsLogoutHandler.class);

    @Autowired
    private MessageByLocale messageByLocale;

    @Autowired
    private SessionRegistry sessionRegistry;

    @Autowired
    private AuthService authService;

    /**
     * <pre>
     * 로그 아웃 후속처리 처리 (for LogoutSuccessHandler)
     * </pre>
     *
     * @param request        요청
     * @param response       응답
     * @param authentication 인증
     * @throws IOException      IO 예외
     * @throws ServletException 서블릿 예외
     * @see org.springframework.security.web.authentication.logout.LogoutSuccessHandler#onLogoutSuccess(javax.servlet.http.HttpServletRequest,
     * javax.servlet.http.HttpServletResponse, org.springframework.security.core.Authentication)
     */
    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException {

        String message = messageByLocale.get("wms.logout.ok", request);
        ResponseUtil.ok(response, message, null);

    }

    protected void clearAuthenticationAttributes(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            return;
        }
        session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
    }

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {

        try {
            removeSessionInformation(request, authentication);
        } catch (Exception e) {
            logger.error("removeSessionInformation fail:", e);
        }

        request
                .getSession()
                .invalidate();

        SecurityContextHolder
                .getContext()
                .setAuthentication(null);
        SecurityContextHolder.clearContext();


        String message = messageByLocale.get("wms.logout.ok", request);
        try {
            ResponseUtil.ok(response, message, null);
        } catch (IOException e) {
            logger.error("logout process Error:", e);
        }

    }

    private void removeSessionInformation(HttpServletRequest request, Authentication authentication)
            throws JsonParseException, JsonMappingException, IOException {
        String logonSessionId = request
                .getSession()
                .getId();
        Authentication auth = authentication;
        if (authentication == null) {
            // session을 사용할 수 없을 경우 Authorization Header값을 사용한다.
            auth = WmsJwtHelper.getUsernamePasswordAuthentication(request, authService);
            logonSessionId = ((UserDTO) auth.getDetails()).getSessionId();
        }
        if (auth == null) {
            return;
        }
        SessionInformation si = sessionRegistry.getSessionInformation(logonSessionId);
        if (si != null) {
            this.sessionRegistry.removeSessionInformation(logonSessionId);
        }
    }

}
