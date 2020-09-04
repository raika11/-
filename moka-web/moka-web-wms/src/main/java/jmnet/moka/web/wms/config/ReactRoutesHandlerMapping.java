package jmnet.moka.web.wms.config;

import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.handler.AbstractHandlerMapping;

/**
 * <pre>
 * React Routes 해당하는 경로의 패핑을 처리한다.
 * 2019. 9. 10. kspark 최초생성
 * </pre>
 * @since 2019. 9. 10. 오후 3:53:26
 * @author kspark
 */
public class ReactRoutesHandlerMapping extends AbstractHandlerMapping {

	
    private List<String> reactRoutesList;
    private HandlerMethod reactRoutesHandlerMethod;
	
	
    public ReactRoutesHandlerMapping(String routesPath)
            throws NoSuchMethodException, SecurityException {
        String[] splitted = routesPath.split(",");
        this.reactRoutesList = new ArrayList<String>(16);
        for (String path : splitted) {
            this.reactRoutesList.add(path.trim());
        }
        this.reactRoutesHandlerMethod =
                new HandlerMethod(this, this.getClass().getMethod("gotoMain"));
	}
	
	@Override
	protected Object getHandlerInternal(HttpServletRequest request) throws Exception {
        String uri = request.getRequestURI();
        for (String routePath : this.reactRoutesList) {
            if (uri.startsWith(routePath)) {
                return this.reactRoutesHandlerMethod;
            }
        }
        return null;
    }

    public String gotoMain() {
        return "forward:/index.html";
	}

}
