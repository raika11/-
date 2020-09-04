/**
* nst
* HttpSessionEventPublisher.java
* 2017. 8. 30. 오전 10:06:05
* kspark
*/
package jmnet.moka.web.wms.config.security;

import javax.servlet.http.HttpSessionEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.session.SessionRegistry;

/**
 * <pre>
 * 세션 생성과 종료후 처리를 수행한다.
 * 2017. 8. 30. kspark 최초생성
 * </pre>
 * @since 2017. 8. 30. 오전 10:06:05
 * @author kspark
 */
public class HttpSessionEventPublisher extends org.springframework.security.web.session.HttpSessionEventPublisher {
    public static final Logger logger = LoggerFactory.getLogger(HttpSessionEventPublisher.class);
    private SessionRegistry sessionRegistry;

    public HttpSessionEventPublisher(SessionRegistry sessionRegistry) {
        this.sessionRegistry = sessionRegistry;
    }

	/**
	 * <pre>
	 * 세션 생성시 처리를 한다.
	 * </pre>
	 * @param event httpSession 이벤트
	 * @see org.springframework.security.web.session.HttpSessionEventPublisher#sessionCreated(javax.servlet.http.HttpSessionEvent)
	 */
	public void sessionCreated(HttpSessionEvent event) {
		super.sessionCreated(event);
        logger.debug("Http Session is created : {}  {}s", event.getSession().getId(),
                event.getSession().getMaxInactiveInterval());
	}

	/**
	 * <pre>
	 * 세션 종료시 처리를 한다.
	 * </pre>
	 * @param event httpSession 이벤트
	 * @see org.springframework.security.web.session.HttpSessionEventPublisher#sessionDestroyed(javax.servlet.http.HttpSessionEvent)
	 */
	public void sessionDestroyed(HttpSessionEvent event) {
		super.sessionDestroyed(event);
        String sessionId = event.getSession().getId();
        logger.debug("Http Session is destroyed : {}  {}s", sessionId,
                event.getSession().getMaxInactiveInterval());
        // 다른 서버에서 expire 됐을 경우에 남아 있을 수 있는 가능성 때문에 
        if (this.sessionRegistry.getSessionInformation(sessionId) != null) {
            this.sessionRegistry.removeSessionInformation(sessionId);
        }
	}
	
}
