package jmnet.moka.core.tms.mvc;

import java.lang.reflect.Method;
import javax.servlet.http.HttpServletRequest;

import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.core.common.MokaConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.support.GenericApplicationContext;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.handler.AbstractHandlerMapping;

/**
 * <pre>
 * 템플릿에 해당하는 경로의 매핑을 처리한다.
 * 2019. 9. 10. kspark 최초생성
 * </pre>
 * @since 2019. 9. 10. 오후 3:53:26
 * @author kspark
 */
public class DefaultMergeHandlerMapping extends AbstractHandlerMapping {

	@Autowired
    private DefaultPathResolver pathResolver;
	
	private HandlerMethod defaultHandlerMethod;
	private HandlerMethod articleHandlerMethod;

//    AbstractHandlerMapping handlerMapping = new DefaultMergeHandlerMapping(appContext,
//            defaultHandlerClass, defaultHandlerBeanName, defaultHandlerMethod,
//            articleHandlerClass, articleHandlerBeanName, articleHandlerMethod);

	@Autowired
    public DefaultMergeHandlerMapping(GenericApplicationContext applicationContext,
            String defaultHandlerClass, String defaultHandlerBeanName, String defaultHandlerMethodName,
              String articleHandlerClass, String articleHandlerBeanName, String articleHandlerMethodName ) throws ClassNotFoundException {
        this.defaultHandlerMethod = getHandlerMethod(applicationContext, defaultHandlerClass, defaultHandlerBeanName, defaultHandlerMethodName);
        this.articleHandlerMethod = getHandlerMethod(applicationContext, articleHandlerClass, articleHandlerBeanName, articleHandlerMethodName);
	}
	
	@Override
	protected Object getHandlerInternal(HttpServletRequest request) throws Exception {
		
        if (pathResolver.available(request)) {
            MergeContext context = (MergeContext)request.getAttribute(MokaConstants.MERGE_CONTEXT);
            if ( context.get(MokaConstants.MERGE_CONTEXT_ARTICLE_ID) == null) {
                return this.defaultHandlerMethod;
            } else {
                return this.articleHandlerMethod;
            }
        }
		return null;
	}

    /**
     * <pre>
     * 프로터티에 설정된 클래스의 메소드로 HandlerMethod를 생성하여 반환한다.
     * </pre>
     * 
     * @param applicationContext
     * @param className
     * @param beanName
     * @param methodName
     * @return
     * @throws ClassNotFoundException
     */
    private HandlerMethod getHandlerMethod(GenericApplicationContext applicationContext,
            String className, String beanName, String methodName) throws ClassNotFoundException {
        // 프로퍼티에 설정된 HandlerMethod 정보로 Bean Definition을 생성한다.
        applicationContext.registerBean(beanName, Class.forName(className), (beanDefinition) -> {
            beanDefinition.setScope(ConfigurableBeanFactory.SCOPE_SINGLETON);
        });
        Object bean = applicationContext.getBean(beanName);
        Method[] methods = bean.getClass().getMethods();
        Method beanMethod = null;
        // 프로퍼테에 설정된 메소드를 찾아 HandlerMethod로 반환한다.
        for (Method method : methods) {
            if (method.getName().equals(methodName)) {
                beanMethod = method;
                break;
            }
        }
        if (beanMethod != null) {
            return new HandlerMethod(bean, beanMethod);
        }
        return null;
    }

}
