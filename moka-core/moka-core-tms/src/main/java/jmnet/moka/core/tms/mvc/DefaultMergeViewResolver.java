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
	private String defaultViewName;
    private View defaultView;
	private String articleViewName;
	private View articleView;
	
    public DefaultMergeViewResolver(String defaultViewName, View defaultView, int order) {
    	this.defaultViewName = defaultViewName;
        this.defaultView = defaultView;
        this.order = order;
	}

	public void setArticleView(String articleViewName, View articleView) {
    	this.articleViewName = articleViewName;
		this.articleView = articleView;
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
		if ( viewName.equals(this.defaultViewName)) {
            return this.defaultView;
		} else if ( viewName.equals(this.articleViewName)) {
			return this.articleView;
		}
		return null;
	}

}
