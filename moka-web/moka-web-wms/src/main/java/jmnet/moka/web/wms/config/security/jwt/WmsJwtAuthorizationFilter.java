package jmnet.moka.web.wms.config.security.jwt;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.List;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.util.ResponseUtil;
import jmnet.moka.core.tps.mvc.auth.dto.UserDTO;
import jmnet.moka.core.tps.mvc.auth.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

public class WmsJwtAuthorizationFilter extends BasicAuthenticationFilter {
    private static final Logger logger = LoggerFactory.getLogger(WmsJwtAuthorizationFilter.class);

    @Autowired
    private AuthService authService;

    @Autowired
    private SessionRegistry sessionRegistry;

    @Autowired
    private MessageByLocale messageByLocale;

    private static final ObjectMapper MAPPER = ResourceMapper.getDefaultObjectMapper();

    static {
        MAPPER.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    public WmsJwtAuthorizationFilter(AuthenticationManager authenticationManager) {
        super(authenticationManager);
        logger.debug("WmsJwtAuthorizationFilter created");
    }


    // endpoint every request hit with authorization
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        // Read the Authorization header, where the JWT Token should be
        String header = request.getHeader(WmsJwtHelper.HEADER_STRING);

        // ?????? ID
        String menuId = request.getHeader(MokaConstants.HEADER_MENU_ID);

        // ????????? ????????? ????????? ?????? ????????? ??????, ?????? ????????? ??????
        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();
        if (auth instanceof UsernamePasswordAuthenticationToken) {
            // Authorization ????????? ?????? ????????? expire/??????????????? ?????? ??????
            if (header != null && expiredOrDuplicated(request, response, auth, request
                    .getSession(true)
                    .getId())) {
                return;
            } else {
                if (menuAuthCheck(request, response, auth, menuId)) {
                    chain.doFilter(request, response);
                }
                return;
            }
        }

        // If header does not contain BEARER or is null delegate to Spring impl and exit
        if (header == null || !header.startsWith(WmsJwtHelper.TOKEN_PREFIX)) {
            // rest of the spring pipeline
            chain.doFilter(request, response);
            return;
        }

        // If header is present, try grab user principal from database and perform authorization
        Authentication jwtAuth = WmsJwtHelper.getUsernamePasswordAuthentication(request, authService);

        assert jwtAuth != null;
        UserDTO details = (UserDTO) jwtAuth.getDetails();
        if (expiredOrDuplicated(request, response, jwtAuth, details.getSessionId())) {
            return;
        }


        SecurityContextHolder
                .getContext()
                .setAuthentication(jwtAuth);

        // lastAcessTime??? ?????????
        request.getSession(false);

        // Continue filter execution
        chain.doFilter(request, response);
    }

    /**
     * ?????? ?????? ??????
     *
     * @param request  HttpServletRequest
     * @param response HttpServletResponse
     * @param auth     Authentication
     * @param menuId   ?????? ID
     * @return ?????? ?????? ??????
     * @throws IOException ?????? ??????
     */
    private boolean menuAuthCheck(HttpServletRequest request, HttpServletResponse response, Authentication auth, String menuId)
            throws IOException {
        if (McpString.isNotEmpty(menuId) && !"null".equals(menuId)) {
            if (!authService.hasMenuAuth(auth.getName(), menuId)) {
                String message = messageByLocale.get("wms.member.error.forbidden", request);
                ResponseUtil.error(response, TpsConstants.HEADER_FORBIDDEN, message);
                return false;
            }
        }
        return true;
    }

    private boolean expiredOrDuplicated(HttpServletRequest request, HttpServletResponse response, Authentication auth, String sessionId)
            throws IOException {
        List<SessionInformation> siList = this.sessionRegistry.getAllSessions(auth.getPrincipal(), false);
        if (siList == null || siList.size() == 0) {
            String message = messageByLocale.get("wms.login.error.unauthorized", request);
            ResponseUtil.error(response, TpsConstants.HEADER_UNAUTHORIZED, message);
            return true;
        }
        // ????????? ????????? ????????? ??????
        for (SessionInformation si : siList) {
            String logonSessionId = si.getSessionId();
            if (logonSessionId.equals(sessionId)) {
                return false;
            }
        }
        // ????????? ????????? ????????? ?????? ?????? ?????? ???????????? ????????? ????????? ??????
        String message = messageByLocale.get("wms.login.error.duplicated", request);
        ResponseUtil.error(response, TpsConstants.HEADER_UNAUTHORIZED, message);
        return true;
    }
}
