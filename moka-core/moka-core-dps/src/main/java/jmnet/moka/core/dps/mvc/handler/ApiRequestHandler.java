package jmnet.moka.core.dps.mvc.handler;

import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jmnet.moka.common.ApiResult;
import jmnet.moka.common.cache.exception.CacheException;
import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.handler.RequestHandler;
import jmnet.moka.core.dps.excepton.ParameterException;
import org.springframework.http.ResponseEntity;

/**
 * <pre>
 * Api 요청을 처리할 Handler에 대한 Interface 
 * 2020. 1. 6. kspark 최초생성
 * </pre>
 * @since 2020. 1. 6. 오후 3:06:11
 * @author kspark
 */
public interface ApiRequestHandler {
	
	/**
	 * <pre>
	 * Request type을 처리할 requestHanlder를 반환한다.
	 * </pre>
	 * @param requestHandlerBeanType bean type
	 * @return requestHandler
	 * @throws ClassNotFoundException 클래스 예외
	 */
	RequestHandler getRequestHandler(Class<?> requestHandlerBeanType) throws ClassNotFoundException;
	
	/**
	 * <pre>
	 * Api를 처리하는 메소드
	 * </pre>
	 * @param apiContext apiContext
	 * @return api 결과
	 * @throws ParameterException 파라미터 예외
	 * @throws ClassNotFoundException 클래스 예외
	 */
	ApiResult processApi(ApiContext apiContext) throws ParameterException, ClassNotFoundException;
	
	/**
	 * <pre>
	 * Api를 처리하는 메소드
	 * </pre>
	 * @param apiContext apiContext
	 * @param asyncOnly async만 처리할 지 여부
	 * @return api 결과
	 * @throws ParameterException 파라미터 예외
	 * @throws ClassNotFoundException 클래스 예외
	 */
	ApiResult processApi(ApiContext apiContext, boolean asyncOnly) throws ParameterException, ClassNotFoundException;
	
	/**
	 * <pre>
	 * Api 요청을 받아 처리하는 메소드
	 * </pre>
	 * @param path api경로
	 * @param id api id
	 * @param parameterMap 파라미터 맵
	 * @return api 결과
	 */
    ApiResult apiRequest(String path, String id, Map<String, String> parameterMap);
	
	/**
	 * <pre>
	 * Http Api 요청을 받아 처리하는 메소드
	 * </pre>
	 * @param request http 요청
	 * @param response http 응답
	 * @return api 결과
	 */
	ResponseEntity<?> apiRequest(HttpServletRequest request, HttpServletResponse response);
	
	/**
	 * <pre>
	 * 주기적인 api 요청을 처리하는 메소드
	 * </pre>
	 * @param path api경로
	 * @param id api id
	 */
	void apiPeriodicRequest(String path, String id);
	
	/**
     * <pre>
     * 캐시된 api 결과를 purge를 처리한다(All or One).
     * </pre>
     * 
     * @param request http 요청
     * @param response http 응답
     */
    List<Map<String, Object>> purge(HttpServletRequest request,
            HttpServletResponse response) throws CacheException;
	
    /**
     * <pre>
     * 캐시된 api 결과를 특정 문자열로 시작하는 key에 대한 purge를 처리한다.
     * </pre>
     * 
     * @param request http 요청
     * @param response http 응답
     */
    List<Map<String, Object>> purgeStartsWith(HttpServletRequest request,
            HttpServletResponse response) throws CacheException;

}
