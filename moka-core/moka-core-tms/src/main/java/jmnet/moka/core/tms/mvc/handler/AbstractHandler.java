package jmnet.moka.core.tms.mvc.handler;

import java.lang.reflect.Method;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import jmnet.moka.core.tms.merge.MokaFunctions;
import org.springframework.web.method.HandlerMethod;

/**
 *
 */
public abstract class AbstractHandler {
    protected final static String HANDLER_METHOD_NAME = "merge";
    protected final static MokaFunctions MOKA_FUNCTIONS = new MokaFunctions();
    protected String viewName;
    protected HandlerMethod handlerMethod;

    public void setViewName(String viewName) {
        this.viewName = viewName;
    }

    /**
     * Handler의 Method를 찾는다.
     * @param claz 클래스
     * @return 메소드
     */
    protected Method findMethod(Class<?> claz) {
        Method[] methods = claz.getMethods();
        Method resultMethod = null;
        // 프로퍼티에 설정된 메소드를 찾아 HandlerMethod로 반환한다.
        for (Method method : methods) {
            if (method.getName()
                      .equals(HANDLER_METHOD_NAME)) {
                resultMethod = method;
                break;
            }
        }
        return resultMethod;
    }

    /**
     * URL의 처리가 가능한지 여부를 반환한다.
     * @param request http 요청
     * @param requestPath 요청 경로
     * @param pathList 경로 목록
     * @param domainId 도메인 id
     * @return 처리 메소드
     * @throws Exception 예외
     */
    public abstract HandlerMethod resolvable(HttpServletRequest request, String requestPath, List<String> pathList, String domainId) throws Exception;
}
