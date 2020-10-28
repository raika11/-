package jmnet.moka.core.tms.mvc;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;
import jmnet.moka.core.tms.mvc.domain.DomainResolver;
import jmnet.moka.core.tms.mvc.handler.AbstractHandler;
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
 *
 * @author kspark
 * @since 2019. 9. 10. 오후 3:53:26
 */
public class DefaultMergeHandlerMapping extends AbstractHandlerMapping {

    private final GenericApplicationContext appContext;

    private final DomainResolver domainResolver;

    private final List<AbstractHandler> handlerList;

    @Autowired
    public DefaultMergeHandlerMapping(@Autowired GenericApplicationContext appContext, @Autowired DomainResolver domainResolver,
            @Autowired List<HandlerAndView> handlerAndViewList) throws ClassNotFoundException {
        this.appContext = appContext;
        this.domainResolver = domainResolver;
        this.handlerList = new ArrayList<>(8);
        this.registerHandlerMethod(handlerAndViewList);
    }

    @Override
    protected Object getHandlerInternal(HttpServletRequest request) throws Exception {

        String domainId = domainResolver.getDomainId(request);

        String paramDomain = request.getParameter("testDomain");
        if (paramDomain != null) {
            domainId = paramDomain;
        }

        // 서비스 도메인이 아닐 경우 다음 handlerMapping으로 넘긴다.
        if (domainId == null) {
            return null;
        }

        String requestPath = resolvePath(request);
        List<String> pathList =  this.getPathList(requestPath);
        for (AbstractHandler handler : this.handlerList) {
            HandlerMethod handlerMethod = handler.resolvable(request, requestPath, pathList, domainId);
            if (handlerMethod != null) {
                return handlerMethod;
            }
        }
        return null;
    }

    /**
     * <pre>
     * 실제 템플릿 아이템 경로를 URL로 부터 추출한다.
     * 예를 들면, page 파라미터 url마지막에 추가하는 경우 등
     * </pre>
     *
     * @param request http요청
     * @return 템플릿 경로
     */
    private String resolvePath(HttpServletRequest request) {
        // TODO : REST URI일 경우 템플릿 경로와 파라메터 영역 분리 로직 필요
        return request.getRequestURI();
    }

    private List<String> getPathList(String path) {
        return Arrays.stream(path.split("/"))
                     .filter(splitted -> splitted != null && splitted.length() > 0)
                     .collect(Collectors.toList());
    }

    private void registerHandlerMethod(List<HandlerAndView> handlerAndViewList) throws ClassNotFoundException {
        for (HandlerAndView handlerAndView : handlerAndViewList) {
            // 프로퍼티에 설정된 HandlerMethod 정보로 Bean Definition을 생성한다.
            appContext.registerBean(handlerAndView.getHandlerBeanName(), Class.forName(handlerAndView.getHandlerClass()),
                                    (beanDefinition) -> beanDefinition.setScope(ConfigurableBeanFactory.SCOPE_SINGLETON));
            AbstractHandler handler = (AbstractHandler) appContext.getBean(handlerAndView.getHandlerBeanName());
            handler.setViewName(handlerAndView.getViewName());
            this.handlerList.add(handler);
        }
    }
}
