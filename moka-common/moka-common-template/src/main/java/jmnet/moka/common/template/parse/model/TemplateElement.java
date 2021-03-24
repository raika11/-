package jmnet.moka.common.template.parse.model;

import static jmnet.moka.common.template.Constants.ATTR_API;
import static jmnet.moka.common.template.Constants.ATTR_COUNT;
import static jmnet.moka.common.template.Constants.ATTR_DATA;
import static jmnet.moka.common.template.Constants.ATTR_ID;
import static jmnet.moka.common.template.Constants.ATTR_IF;
import static jmnet.moka.common.template.Constants.ATTR_NAME;
import static jmnet.moka.common.template.Constants.ATTR_SELECT;
import static jmnet.moka.common.template.Constants.ATTR_START;
import static jmnet.moka.common.template.Constants.ATTR_URL;
import static jmnet.moka.common.template.Constants.ATTR_VALUE;
import static jmnet.moka.common.template.Constants.ATTR_VAR;
import static jmnet.moka.common.template.Constants.EL_CASE;
import static jmnet.moka.common.template.Constants.EL_CURRENT_PAGE;
import static jmnet.moka.common.template.Constants.EL_DATA;
import static jmnet.moka.common.template.Constants.EL_LOOP;
import static jmnet.moka.common.template.Constants.EL_NEXT_PAGE;
import static jmnet.moka.common.template.Constants.EL_OTHER_PAGE;
import static jmnet.moka.common.template.Constants.EL_PREV_PAGE;
import static jmnet.moka.common.template.Constants.EL_SET;
import static jmnet.moka.common.template.Constants.INFO_ATTR_MAP;
import static jmnet.moka.common.template.Constants.INFO_CONTENT;
import static jmnet.moka.common.template.Constants.INFO_LINE;
import static jmnet.moka.common.template.Constants.INFO_NODE_NAME;
import static jmnet.moka.common.template.Constants.hasTemplate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Map.Entry;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;

/**
 * 
 * <pre>
 * 템플릿의 엘리먼트(Custom Tag)를 표현한다
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * @since 2019. 9. 4. 오후 6:14:39
 * @author kspark
 */
public class TemplateElement extends TemplateNode {
    private Map<String, String> attributeMap;
	
	public TemplateElement(TemplateRoot templateRoot, String nodeName, TemplateNode previous, int lineNumber){
		super(templateRoot, nodeName, previous, lineNumber);
		this.nodeName = nodeName;
		this.children = new ArrayList<TemplateNode>(64);
        this.attributeMap = new LinkedHashMap<String, String>();
	}
		
	public void addAttribute(String name, String value) {
		this.attributeMap.put(name, value);
	}
	
	public String getNodeName() {
		return this.nodeName;
	}

    public Map<String, String> getAttributeMap() {
        return this.attributeMap;
    }

	public String getAttribute(String name) {
		return this.attributeMap.get(name);
	}
	
	public boolean isPair(TemplateElement element) {
		return this.nodeName.equals(element.getNodeName());
	}
		
	public Map<String, Object> infoMap() {
        Map<String, Object> map = new LinkedHashMap<String, Object>(4);
		map.put(INFO_NODE_NAME, this.nodeName);
		map.put(INFO_LINE, this.lineNumber);
		if ( hasTemplate(this.nodeType)) {
			map.put(ATTR_ID, this.getAttribute(ATTR_ID));
			map.put(ATTR_NAME, this.getAttribute(ATTR_NAME));
		} else if ( EL_CASE.equals(this.nodeName)) {
			map.put(ATTR_IF, this.getAttribute(ATTR_IF));
		} else if ( EL_LOOP.equals(this.nodeName)) {
			map.put(ATTR_DATA, this.getAttribute(ATTR_DATA));
			map.put(ATTR_START, this.getAttribute(ATTR_START));
			map.put(ATTR_COUNT, this.getAttribute(ATTR_COUNT));
			map.put(ATTR_SELECT, this.getAttribute(ATTR_SELECT));
		} else if ( EL_SET.equals(this.nodeName)) {
			map.put(ATTR_DATA, this.getAttribute(ATTR_VAR));
			map.put(ATTR_START, this.getAttribute(ATTR_VALUE));
		} else if ( EL_DATA.equals(this.nodeName)) {
			map.put(ATTR_API, this.getAttribute(ATTR_API));
			map.put(ATTR_URL, this.getAttribute(ATTR_URL));
			map.put(ATTR_SELECT, this.getAttribute(ATTR_SELECT));
		} else if ( EL_PREV_PAGE.equals(this.nodeName) 
				|| EL_OTHER_PAGE.equals(this.nodeName) 
				|| EL_CURRENT_PAGE.equals(this.nodeName) 
				|| EL_NEXT_PAGE.equals(this.nodeName)  ) {
			map.put(INFO_CONTENT, this.children.toString());
		}
		map.put(INFO_ATTR_MAP, this.attributeMap);
		return map;
	}

	@Override
	public void merge(TemplateMerger<?> merger, MergeContext context, StringBuilder sb) throws TemplateMergeException  {
		try {
			merger.getElementMerger(this.nodeName).merge(this, context, sb);
		} catch (Exception e) {
			throw new TemplateMergeException("Element Merge Error", this, e);
		}
	}

}
