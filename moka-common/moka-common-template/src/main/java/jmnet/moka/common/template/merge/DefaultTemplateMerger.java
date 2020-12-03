package jmnet.moka.common.template.merge;

import static jmnet.moka.common.template.Constants.ATTR_ID;
import static jmnet.moka.common.template.Constants.ATTR_NAME;
import static jmnet.moka.common.template.Constants.ELEMENT_MERGER_PACKAGE;
import static jmnet.moka.common.template.Constants.ELEMENT_MERGER_POSTFIX;
import static jmnet.moka.common.template.Constants.PREFIX;
import static jmnet.moka.common.template.Constants.TRAVERSE_INDENT;
import java.io.IOException;
import java.io.StringWriter;
import java.lang.reflect.Constructor;
import java.util.HashMap;
import org.apache.commons.jexl3.JexlBuilder;
import org.apache.commons.jexl3.JxltEngine.Template;
import org.apache.commons.jexl3.MapContext;
import org.apache.commons.jexl3.internal.Engine;
import org.apache.commons.jexl3.internal.TemplateEngine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.template.Constants;
import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.loader.DataLoader;
import jmnet.moka.common.template.loader.SimpleDataLoader;
import jmnet.moka.common.template.loader.FileTemplateLoader;
import jmnet.moka.common.template.merge.element.ElementMerger;
import jmnet.moka.common.template.parse.model.TemplateElement;
import jmnet.moka.common.template.parse.model.TemplateRoot;

/**
 * <pre>
 * 파일시스템에서 템플릿 정보를 조회하여 머지하는 기본 템플릿 머저
 * 템플릿을 포함할 경우 포함된 템플릿을 파싱하여 머지한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * @since 2019. 9. 4. 오후 5:59:52
 * @author kspark
 */
public class DefaultTemplateMerger implements TemplateMerger<String> {
	
	private TemplateEngine templateEngine = new TemplateEngine(new Engine(new JexlBuilder()),false,0,'$','#');
	private HashMap<String, ElementMerger> elementMergerMap;
	private FileTemplateLoader templateLoader;
	private Evaluator evaluator;
	private DataLoader dataLoader;
	private DataLoader defaultDataLoader;
	private Template wrapItemStart;
	private Template wrapItemEnd;
	
	private static final Logger logger = LoggerFactory.getLogger(DefaultTemplateMerger.class);
    
	public DefaultTemplateMerger(String basePath, String apiHost, String apiPath) throws IOException {
		this(basePath, new SimpleDataLoader(apiHost, apiPath), null);
	}

	public DefaultTemplateMerger(String basePath, DataLoader dataLoader, DataLoader defaultDataLoader)  {
		this.templateLoader = new FileTemplateLoader(basePath);
		this.elementMergerMap = new HashMap<String, ElementMerger>(16);
		this.evaluator = new Evaluator();
		this.dataLoader = dataLoader;
		this.defaultDataLoader = defaultDataLoader;
		this.wrapItemStart = templateEngine.createTemplate(Constants.WRAP_ITEM_START);
		this.wrapItemEnd = templateEngine.createTemplate(Constants.WRAP_ITEM_END);
	}

    public TemplateRoot setItem(String type, String id, String templateText)
            throws TemplateLoadException, TemplateParseException {
		return this.templateLoader.setItem(type, id, templateText);
	}
	
    public TemplateRoot getParsedTemplate(String type, String id)
            throws TemplateParseException, TemplateLoadException {
		return this.templateLoader.getParsedTemplate(type, id);

	}
	
    public String getItem(String type, String id) throws TemplateParseException {
        throw new TemplateParseException(TemplateParseException.UNEXPECTED,
                "Only Template Text. Not Implemented", 0);
	}
	
	public String getWrapItemStart(String itemType, String itemId) {
		StringWriter writer = new StringWriter();
		MapContext context = new MapContext();
		context.set(Constants.WRAP_ITEM_TYPE, itemType);
		context.set(Constants.WRAP_ITEM_ID, itemId);
		wrapItemStart.evaluate(context, writer);
		return writer.toString();
	}
	
	public String getWrapItemEnd(String itemType, String itemId) {
		StringWriter writer = new StringWriter();
		MapContext context = new MapContext();
		context.set(Constants.WRAP_ITEM_TYPE, itemType);
		context.set(Constants.WRAP_ITEM_ID, itemId);
		wrapItemEnd.evaluate(context, writer);
		return writer.toString();
	}

	@Override
	public String preprocessToken(String token, MergeContext context) {
		return token;
	}

	protected String makeClassName(String nodeName) {
		String lower = nodeName.split(":")[1].toLowerCase();
		String camelPresentation = lower.substring(0, 1).toUpperCase() + lower.substring(1);
		return ELEMENT_MERGER_PACKAGE + "." + camelPresentation + ELEMENT_MERGER_POSTFIX;
	}
	
	public ElementMerger getElementMerger(String nodeName) {
		ElementMerger elementMerger = this.elementMergerMap.get(nodeName);
		if ( elementMerger == null && nodeName.startsWith(PREFIX) ) {
			String className = makeClassName(nodeName);
			synchronized (this.elementMergerMap) {
				if ( this.elementMergerMap.get(nodeName) == null) { // 선행 thread가 생성한 경우 skip한다.
					try {
						Class<?> claz = Class.forName(className);
						Constructor<?> constructor = claz.getConstructor(TemplateMerger.class);
						elementMerger = (ElementMerger)constructor.newInstance(this);
						this.elementMergerMap.put(nodeName, elementMerger);
					} catch (Exception e) {
						elementMerger = null;
						logger.error("ElementMerger Not Found:{} {}", className, e);
					}
				} else {
					elementMerger =this.elementMergerMap.get(nodeName);
				}
			}
		}
		return elementMerger;
	}
	
	public Evaluator getEvaluator() {
		return this.evaluator;
	}
	
	public DataLoader getDataLoader() {
		return this.dataLoader;
	}

	public DataLoader getDefaultDataLoader() { return this.defaultDataLoader; }

	public StringBuilder merge(String type, String id, MergeContext context) throws TemplateMergeException {
		StringBuilder sb = new StringBuilder(1024);
		try {
			TemplateRoot templateRoot =  getParsedTemplate(type, id);
			templateRoot.merge(this, context, sb);
		} catch ( Exception e) {
			throw new TemplateMergeException("Template Merge Fail : "+ type+", " + id, e);
		}
		return sb;
	}
	
    public boolean exists(String type, String id) throws TemplateMergeException {
        try {
            TemplateRoot templateRoot = getParsedTemplate(type, id);
            if (templateRoot != null) {
                return true;
            }
        } catch (Exception e) {
            throw new TemplateMergeException("Template load Fail : " + type + ", " + id, e);
        }
        return false;
    }

    public TreeNode templateTreeNode(String type, String id)
            throws TemplateParseException, TemplateLoadException {
		TemplateRoot templateRoot = this.templateLoader.getParsedTemplate(type, id);
		TreeNode rootTreeNode = new TreeNode(null);
		templateRoot.templateTree(this, rootTreeNode);
		return rootTreeNode;
	}


    public String templateTree(String type, String id)
            throws TemplateParseException, TemplateLoadException {
		TreeNode rootTreeNode = templateTreeNode(type, id);
		StringBuilder sb = new StringBuilder(1024);
		childTemplateTree(rootTreeNode, sb, 1);
		return sb.toString();
	}
	
	private void childTemplateTree(TreeNode parentNode, StringBuilder sb, int depth ) {
		for ( TreeNode treeNode : parentNode.getChildren()) {
			for (int i=0; i < depth; i++) sb.append(TRAVERSE_INDENT);
			TemplateElement templateElement = treeNode.getTemplateElement();
			sb.append(
					String.format("%s %s %s", templateElement.getNodeName(), templateElement.getAttribute(ATTR_ID), templateElement.getAttribute(ATTR_NAME) )
			).append(System.lineSeparator());
			if (treeNode.hasChild()) {
				childTemplateTree(treeNode, sb, depth+1);
			}
		}
	}

}
