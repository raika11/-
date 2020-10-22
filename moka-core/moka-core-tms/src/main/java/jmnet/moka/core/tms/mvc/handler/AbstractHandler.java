package jmnet.moka.core.tms.mvc.handler;

import java.lang.reflect.Method;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.springframework.web.method.HandlerMethod;

/**
 *
 */
public abstract class AbstractHandler {
    protected final static String HANDLER_METHOD_NAME = "merge";
    protected String viewName;
    protected HandlerMethod handlerMethod;

    public void setViewName(String viewName) {
        this.viewName = viewName;
    }

    protected Method findMethod(Class<?> claz) {
        Method[] methods = claz.getMethods();
        Method resultMethod = null;
        // 프로퍼테에 설정된 메소드를 찾아 HandlerMethod로 반환한다.
        for (Method method : methods) {
            if (method.getName()
                      .equals(HANDLER_METHOD_NAME)) {
                resultMethod = method;
                break;
            }
        }
        return resultMethod;
    }

    public abstract HandlerMethod resolvable(HttpServletRequest request, String requestPath, List<String> pathList, String domainId) throws Exception;
}
