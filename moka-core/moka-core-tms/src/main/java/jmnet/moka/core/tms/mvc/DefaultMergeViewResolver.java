package jmnet.moka.core.tms.mvc;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import org.springframework.beans.BeansException;
import org.springframework.core.Ordered;
import org.springframework.web.context.support.WebApplicationObjectSupport;
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.ViewResolver;

public class DefaultMergeViewResolver extends WebApplicationObjectSupport implements ViewResolver, Ordered {

    private int order;// = Ordered.LOWEST_PRECEDENCE; default: same as non-Ordered
    private Map<String, View> viewMap;

    public DefaultMergeViewResolver(int order) {
        this.order = order;
        this.viewMap = new HashMap<>(8);
    }

    public void addView(String viewName, View view) {
        this.viewMap.put(viewName, view);
    }

    @Override
    public int getOrder() {
        return this.order;
    }

    @Override
    public View resolveViewName(String viewName, Locale locale)
            throws BeansException {
        //		if (!context.isTypeMatch(viewName, View.class)) {
        //			if (logger.isDebugEnabled()) {
        //				logger.debug("Found bean named '" + viewName + "' but it does not implement View");
        //			}
        //			// Since we're looking into the general ApplicationContext here,
        //			// let's accept this as a non-match and allow for chaining as well...
        //			return null;
        //		}
        return this.viewMap.get(viewName);
    }

}
