package jmnet.moka.core.tms.mvc;

import java.util.Locale;
import org.springframework.beans.BeansException;
import org.springframework.core.Ordered;
import org.springframework.lang.Nullable;
import org.springframework.web.context.support.WebApplicationObjectSupport;
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.ViewResolver;

public class DefaultMergeViewResolver extends WebApplicationObjectSupport implements ViewResolver, Ordered {
	
	private int order = Ordered.LOWEST_PRECEDENCE;  // default: same as non-Ordered
	private String viewName;
    private View view;
	
    public DefaultMergeViewResolver(View view, int order) {
        this.view = view;
        this.order = order;
	}

	@Override
	public int getOrder() {
		return this.order;
	}

	@Override
	@Nullable
	public View resolveViewName(String viewName, Locale locale) throws BeansException {
//		if (!context.isTypeMatch(viewName, View.class)) {
//			if (logger.isDebugEnabled()) {
//				logger.debug("Found bean named '" + viewName + "' but it does not implement View");
//			}
//			// Since we're looking into the general ApplicationContext here,
//			// let's accept this as a non-match and allow for chaining as well...
//			return null;
//		}
		if ( viewName.equals(this.viewName)) {
            return this.view;
		}
		return null;
	}

}
