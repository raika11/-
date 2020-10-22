package jmnet.moka.core.tms.mvc;

import org.springframework.context.support.GenericApplicationContext;

public class HandlerAndView {
    private static String HANDLER_PREFIX = "tms.merge.handler.";
    private static String VIEW_PREFIX = "tms.merge.view.";
    private static String CLASS_SUFFIX = ".class";
    private static String BEAN_NAME_SUFFIX = ".beanName";
    private static String NAME_SUFFIX = ".name";
    private String handlerClass;
    private String handlerBeanName;
    private String viewClass;
    private String viewName;

    public HandlerAndView(GenericApplicationContext appContext, String handlerName) {
        this.handlerClass = getValue(appContext, HANDLER_PREFIX, handlerName, CLASS_SUFFIX);
        this.handlerBeanName = getValue(appContext, HANDLER_PREFIX, handlerName, BEAN_NAME_SUFFIX);
        this.viewClass = getValue(appContext, VIEW_PREFIX, handlerName, CLASS_SUFFIX);
        this.viewName = getValue(appContext, VIEW_PREFIX, handlerName, NAME_SUFFIX);
    }

    private String getValue(GenericApplicationContext appContext, String prefix, String name, String suffix) {
        String propertyKey = String.join("", "${", prefix, name, suffix, "}");
        return appContext.getBeanFactory()
                         .resolveEmbeddedValue(propertyKey);
    }

    public String getHandlerClass() {
        return handlerClass;
    }

    public String getHandlerBeanName() {
        return handlerBeanName;
    }

    public String getViewClass() {
        return viewClass;
    }

    public String getViewName() {
        return viewName;
    }
}
