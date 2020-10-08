package jmnet.moka.core.tms.merge.element;

import java.io.IOException;

import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tms.merge.MokaTemplateMerger;
import org.springframework.context.support.GenericApplicationContext;
import jmnet.moka.common.cache.CacheManager;
import jmnet.moka.common.template.Constants;
import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;
import jmnet.moka.common.template.merge.element.AbstractElementMerger;
import jmnet.moka.common.template.parse.model.TemplateElement;
import jmnet.moka.common.template.parse.model.TemplateRoot;
import jmnet.moka.core.tms.merge.item.MergeItem;
import jmnet.moka.core.tms.mvc.HttpParamMap;
import jmnet.moka.core.tms.template.parse.model.MokaTemplateRoot;

/**
 * <pre>
 * Element(커스텀 태그)를 머지한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * @since 2019. 9. 4. 오후 4:17:48
 * @author kspark
 */
public abstract class MokaAbstractElementMerger extends AbstractElementMerger {

    //	private static final Logger logger = LoggerFactory.getLogger(MspAbstractElementMerger.class);
    protected CacheManager cacheManager;
    protected boolean cacheable = false;
    protected GenericApplicationContext appContext;

	public MokaAbstractElementMerger(TemplateMerger<MergeItem> templateMerger) throws IOException {
		super(templateMerger);
	}
	
    public void setApplicationContext(GenericApplicationContext appContext) {
        this.appContext = appContext;
    }

    public void setCacheManager(CacheManager cacheManager) {
        this.cacheManager = cacheManager;
        if (cacheManager == null) {
            this.cacheable = false;
        } else {
            this.cacheable = true;
        }
    }

    public abstract String makeCacheKey(TemplateElement element, MokaTemplateRoot templateRoot,
            MergeContext context);

    public boolean appendCached(String cacheType, String cacheKey, StringBuilder sb) {
        if (this.cacheable) {
            String cached = this.cacheManager.get(cacheType, cacheKey);
            if (cached != null) {
                sb.append(cached);
                return true;
            }
        }
        return false;
    }

    public void setCache(String cacheType, String cacheKey, StringBuilder sb) {
        if (this.cacheable) {
            this.cacheManager.set(cacheType, cacheKey, sb.toString());
        }
    }

	public void startWrapItem(TemplateElement element, String indent, StringBuilder sb) {
		sb.append(indent)
                .append(this.templateMerger.getWrapItemStart(
                        Constants.name2ItemMap.get(element.getNodeName()),
                        element.getAttribute(Constants.ATTR_ID)))
		.append(System.lineSeparator());
	}
	
	public void endWrapItem(TemplateElement element, String indent, StringBuilder sb) {
		sb.append(indent)
                .append(this.templateMerger.getWrapItemEnd(
                        Constants.name2ItemMap.get(element.getNodeName()),
                        element.getAttribute(Constants.ATTR_ID)))
		.append(System.lineSeparator());
	}
	
    public MergeItem getItem(TemplateElement element)
            throws TemplateParseException, TemplateLoadException {
        String itemType = Constants.name2ItemMap.get(element.getNodeName());
        String itemId = element.getAttribute(Constants.ATTR_ID);
        return (MergeItem) this.templateMerger.getItem(itemType, itemId);
	}


    public boolean addEsi(TemplateMerger<?> merger, TemplateRoot templateRoot,
            TemplateElement element, MergeContext context,
            StringBuilder sb) {
        boolean isEsiEnabled = ((MokaTemplateMerger) merger).isEsiEnabled();
        String mergePath = (String) context.get(MokaConstants.MERGE_PATH);
        if (mergePath.startsWith("/_")) {
            return false;
        } else {
            if (isEsiEnabled) {
                HttpParamMap paramMap =
                        (HttpParamMap) context.get(MokaConstants.MERGE_CONTEXT_PARAM);
                sb.append("<esi:include src=\"/")
                        .append(paramMap.getMergeUrl(templateRoot, element, context))
                        .append("\"/>");
            }
            return isEsiEnabled;
        }

    }
}
