package jmnet.moka.core.common.mvc.interceptor;

import java.util.Arrays;
import java.util.List;
import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jmnet.moka.core.common.MokaConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.GenericApplicationContext;
import org.springframework.core.NestedExceptionUtils;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.util.HttpHelper;

/**
 * 
 * <pre>
 * 전역 Interceptor
 * 2019. 10. 14. krapsk 최초생성
 * </pre>
 * @since 2019. 6. 17. 오후 3:18:05
 * @author ince
 */
public class MokaCommonHandlerInterceptor extends HandlerInterceptorAdapter {
    public final static Logger logger = LoggerFactory.getLogger(MokaCommonHandlerInterceptor.class);

    @Autowired
    private GenericApplicationContext appContext;

    private boolean debug = true;
	
	private String systemName;

    private List<String> ignoreList;

	public MokaCommonHandlerInterceptor(String systemName) {
		this.systemName = systemName;
	}

    @PostConstruct
    public void setDebugAndIgnore() {
        try {
            String debugValue =
                    appContext.getBeanFactory().resolveEmbeddedValue(
                            String.format("${%s}", MokaConstants.INTERCEPTOR_DEBUG));
            if (McpString.isNotEmpty(debugValue) && debugValue.equalsIgnoreCase("false")) {
                this.debug = false;
            }
        } catch (IllegalArgumentException e) {
            // property가 설정되지 않아 무시함
            logger.info("property {} not set, defalut is true", MokaConstants.INTERCEPTOR_DEBUG);
        }
        try {
            String ignoreList = appContext.getBeanFactory()
                    .resolveEmbeddedValue(String.format("${%s}", MokaConstants.INTERCEPTOR_IGNORE));
            if (McpString.isNotEmpty(ignoreList)) {
                this.ignoreList = Arrays.asList(ignoreList.split(","));
            }
        } catch (IllegalArgumentException e) {
            // property가 설정되지 않아 무시함
            logger.info("property {} not set, all uri has intercepted",
                    MokaConstants.INTERCEPTOR_IGNORE);
        }
    }

    private boolean isIgnore(String uri) {
        if (this.ignoreList != null) {
            return this.ignoreList.contains(uri);
        }
        return false;
    }

	/**
     * 
     * <pre>
     * Controller 진입 전 처리
     * </pre>
     * 
     * @param request http 요청
     * @param response http 응답
     * @param handler 처리기
     * @return boolean 계속 처리 여부
     * @throws Exception 예외
     * @see org.springframework.web.servlet.handler.HandlerInterceptorAdapter#preHandle(javax.servlet.http.HttpServletRequest,
     *      javax.servlet.http.HttpServletResponse, java.lang.Object)
     */
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
			Object handler) throws Exception {

        String uri = request.getMethod() + " " + request.getHeader("Host") + " "
                + request.getRequestURI();
        if (request.getAttribute(MokaConstants.INTERCEPTOR_REFUSED) != null) {
            logger.debug("[{}:preHandle] refused {}", systemName, uri);
            return false;
        }
		long processStartTime = System.currentTimeMillis();
		request.setAttribute("processStartTime", processStartTime);
        if (debug && this.isIgnore(request.getRequestURI()) == false) {
            logger.debug("[{}:preHandle] {}", systemName, uri);
        }
		return true;
	}

	/**
     * 
     * <pre>
     * Controller 진입 후 처리
     * </pre>
     * 
     * @param request http 요청
     * @param response http 응답
     * @param handler 처리기
     * @param mav 모델앤뷰
     * @throws Exception 예외
     * @see org.springframework.web.servlet.handler.HandlerInterceptorAdapter#postHandle(javax.servlet.http.HttpServletRequest,
     *      javax.servlet.http.HttpServletResponse, java.lang.Object,
     *      org.springframework.web.servlet.ModelAndView)
     */
	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			ModelAndView mav) throws Exception {
		
		String uri = request.getMethod() + " " + request.getHeader("Host") + " " + request.getRequestURI();
		request.setAttribute("requestSuccess", "true");

		// 에러페이지를 제외하고 수행시간을 표시한다. 5초이상 넘으면 QueryString까지 보여준다.
		long processTime = -1;
		
		Object processStartTimeObject = request.getAttribute("processStartTime");
		if ( processStartTimeObject != null) {
			processTime = System.currentTimeMillis() - (Long) processStartTimeObject;
		}
		
		// 응답시간이 5초 이상이면 QueryString까지 표시한다.
        if (debug && this.isIgnore(request.getRequestURI()) == false) {
            if (processTime >= 5000) {
                uri += (request.getQueryString() != null ? "?" + request.getQueryString() : "");
                logger.debug("[{}:Success-Long] {}, {}ms, {}", systemName,
                        HttpHelper.getRemoteAddr(request),
                        processTime, uri);
            } else {
                logger.debug("[{}:Success] {}, {}ms, {}", systemName,
                        HttpHelper.getRemoteAddr(request),
                        processTime, uri);
            }
		}
		
	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler,
			Exception ex) throws Exception {
		String uri = request.getMethod() + " " + request.getHeader("Host") + " " + request.getRequestURI();
		// 에러페이지를 제외한다
		Throwable rootCause = null;
		if ( ex != null) {
			rootCause = NestedExceptionUtils.getRootCause(ex);
		}
		if ( rootCause != null ) {
			logger.error("[{}:afterCompletion] {} {}", systemName, uri, rootCause.getMessage());
		} else if ( ex != null ) {
			logger.error("[{}:afterCompletion] {} {}", systemName, uri, ex.getMessage());
		} else{
            if (debug && this.isIgnore(request.getRequestURI()) == false) {
                logger.debug("[{}:afterCompletion] {}", systemName, uri);
            }
		}

	}
}
