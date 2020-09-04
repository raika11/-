package jmnet.moka.web.wms.config.security;

import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.web.authentication.session.SessionAuthenticationException;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.util.Assert;

public class WmsSessionAuthenticationStrategy implements SessionAuthenticationStrategy {

    private final SessionRegistry sessionRegistry;
    private boolean exceptionIfMaximumExceeded = false;
    private int maximumSessions = 1;

    public WmsSessionAuthenticationStrategy(SessionRegistry sessionRegistry, int maximumSessions) {
        Assert.isTrue(maximumSessions != 0,
                "MaximumLogins must be either -1 to allow unlimited logins, or a positive integer to specify a maximum");
        this.maximumSessions = maximumSessions;
        Assert.notNull(sessionRegistry, "The sessionRegistry cannot be null");
        this.sessionRegistry = sessionRegistry;
    }

    @Override
    public void onAuthentication(Authentication authentication, HttpServletRequest request,
            HttpServletResponse response) throws SessionAuthenticationException {
        final List<SessionInformation> sessions =
                sessionRegistry.getAllSessions(authentication.getPrincipal(), false);

        int sessionCount = sessions.size();

        if (sessionCount < maximumSessions) {
            // They haven't got too many login sessions running at present
            registerNewSession(request, authentication);
            return;
        }

        if (maximumSessions == -1) {
            // We permit unlimited logins
            registerNewSession(request, authentication);
            return;
        }

        if (sessionCount == maximumSessions) {
            HttpSession session = request.getSession(false);

            if (session != null) {
                // Only permit it though if this request is associated with one of the
                // already registered sessions
                for (SessionInformation si : sessions) {
                    if (si.getSessionId().equals(session.getId())) {
                        return;
                    }
                }
            }
            // If the session is null, a new one will be created by the parent class,
            // exceeding the allowed number
        }

        // 초과된 세션 제거
        allowableSessionsExceeded(sessions, maximumSessions, sessionRegistry);

        registerNewSession(request, authentication);

    }

    protected void registerNewSession(HttpServletRequest request, Authentication authentication) {
        // 세션 레지스트리 등록
        sessionRegistry.registerNewSession(request.getSession().getId(),
                authentication.getPrincipal());
    }

    protected void allowableSessionsExceeded(List<SessionInformation> sessions,
            int maximumSessions, SessionRegistry registry) throws SessionAuthenticationException {
        if (exceptionIfMaximumExceeded || (sessions == null)) {
            //            throw new SessionAuthenticationException(messages.getMessage(
            //                    "ConcurrentSessionControlAuthenticationStrategy.exceededAllowed",
            //                    new Object[] { Integer.valueOf(allowableSessions) },
            //                    "Maximum sessions of {0} for this principal exceeded"));
            throw new SessionAuthenticationException(String.format(
                    "Maximum sessions of %d for this principal exceeded", maximumSessions));
        }

        // Determine least recently used session, and mark it for invalidation
        SessionInformation leastRecentlyUsed = null;

        for (SessionInformation session : sessions) {
            if ((leastRecentlyUsed == null)
                    || session.getLastRequest().before(leastRecentlyUsed.getLastRequest())) {
                leastRecentlyUsed = session;
            }
        }

        leastRecentlyUsed.expireNow();
        sessionRegistry.removeSessionInformation(leastRecentlyUsed.getSessionId());
    }
}
