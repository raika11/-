package jmnet.moka.core.dps.api;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.support.GenericApplicationContext;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.handler.AbstractHandlerMapping;

/**
 * <pre>
 * 템플릿에 해당하는 경로의 패핑을 처리한다.
 * 2019. 9. 10. kspark 최초생성
 * </pre>
 * @since 2019. 9. 10. 오후 3:53:26
 * @author kspark
 */
public class ApiRequestHandlerMapping extends AbstractHandlerMapping {

    @Value("${dps.apiRequest.handler.class}")
    private String apiRequestHandlerClass;
    @Value("${dps.apiRequest.handler.beanName}")
    private String apiRequestHandlerBeanName;
    @Value("${dps.apiRequest.handler.method}")
    private String apiRequestHandlerMethod;

	@Autowired
	private ApiRequestHelper apiRequestHelper;
	
    private static final Logger logger = LoggerFactory.getLogger(ApiRequestHandlerMapping.class);

	private HandlerMethod handlerMethod; 

	@Autowired
    public ApiRequestHandlerMapping(GenericApplicationContext appContext,
            String apiRequestHandlerClass, String apiRequestHandlerBeanName,
            String apiRequestHandlerMethod) throws ClassNotFoundException {

        appContext.registerBean(apiRequestHandlerBeanName, Class.forName(apiRequestHandlerClass),
                (beanDefinition) -> {
                    beanDefinition.setScope(ConfigurableBeanFactory.SCOPE_SINGLETON);
                });
        Object bean = appContext.getBean(apiRequestHandlerBeanName);
        // request를 처리할 HandlerMethod를 찾는다.
        Method[] methods = bean.getClass().getMethods();
        Method beanMethod = null;
        for (Method method : methods) {
            if (method.getName().equals(apiRequestHandlerMethod)) {
                List<Class<?>> parameterList = Arrays.asList(method.getParameterTypes());
                if (parameterList.contains(HttpServletRequest.class)
                        && parameterList.contains(HttpServletRequest.class)
                        && parameterList.size() == 2) {
                    beanMethod = method;
                    break;
                }
            }
        }
        // handlerMapping을 등록한다.
        if (beanMethod != null) {
            this.handlerMethod = new HandlerMethod(bean, beanMethod);
        } else {
            logger.error("Api Request Handler Not Found: {}",
                    apiRequestHandlerClass + "." + apiRequestHandlerMethod);
        }
    }
	
	@Override
	protected Object getHandlerInternal(HttpServletRequest request) throws Exception {
        String apiPath = ApiResolver.getPath(request);
        if (apiPath != null && apiRequestHelper.apiPathExists(apiPath)) {
            return this.handlerMethod;
        }
		return null;
	}

}
