package jmnet.moka.web.wms.config.security.jwt;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.List;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.util.ResponseUtil;
import jmnet.moka.core.tps.mvc.user.dto.UserDTO;
import jmnet.moka.core.tps.mvc.user.service.UserService;
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
    private UserService userService;

    @Autowired
    private SessionRegistry sessionRegistry;

    @Autowired
    private MessageByLocale messageByLocale;

    private static ObjectMapper MAPPER = ResourceMapper.getDefaultObjectMapper();

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

        // 인증된 세션이 있으면 다음 필터로 넘김, 중복 로그인 확인
        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();
        if (auth != null && auth instanceof UsernamePasswordAuthenticationToken) {
            // Authorization 헤더가 있는 경우만 expire/중복로그인 여부 체크
            if (header != null && expiredOrDuplicated(request, response, auth, request
                    .getSession(true)
                    .getId())) {
                return;
            } else {
                chain.doFilter(request, response);
                return;
            }
        }

        // If header does not contain BEARER or is null delegate to Spring impl and exit
        if (header == null || header.startsWith(WmsJwtHelper.TOKEN_PREFIX) == false) {
            // rest of the spring pipeline
            chain.doFilter(request, response);
            return;
        }

        // If header is present, try grab user principal from database and perform authorization
        Authentication jwtAuth = WmsJwtHelper.getUsernamePasswordAuthentication(request, userService);

        UserDTO details = (UserDTO) jwtAuth.getDetails();
        if (expiredOrDuplicated(request, response, jwtAuth, details.getSessionId())) {
            return;
        }

        SecurityContextHolder
                .getContext()
                .setAuthentication(jwtAuth);

        // lastAcessTime을 갱신함
        request.getSession(false);

        // Continue filter execution
        chain.doFilter(request, response);
    }

    private boolean expiredOrDuplicated(HttpServletRequest request, HttpServletResponse response, Authentication auth, String sessionId)
            throws IOException {
        List<SessionInformation> siList = this.sessionRegistry.getAllSessions(auth.getPrincipal(), false);
        if (siList == null || siList.size() == 0) {
            String message = messageByLocale.get("wms.login.error.unauthorized", request);
            ResponseUtil.error(response, TpsConstants.HEADER_UNAUTHORIZED, message);
            return true;
        }
        // 로그인 정보가 있으면 유효
        for (SessionInformation si : siList) {
            String logonSessionId = si.getSessionId();
            if (logonSessionId.equals(sessionId)) {
                return false;
            }
        }
        // 로그인 정보가 없으면 동시 사용 갯수 초과하여 제거된 것으로 판단
        String message = messageByLocale.get("wms.login.error.duplicated", request);
        ResponseUtil.error(response, TpsConstants.HEADER_UNAUTHORIZED, message);
        return true;
    }
}
