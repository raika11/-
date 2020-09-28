package jmnet.moka.core.tms.merge;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StringWriter;
import java.lang.reflect.Constructor;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import jmnet.moka.core.common.MokaConstants;
import org.apache.commons.jexl3.JexlBuilder;
import org.apache.commons.jexl3.JxltEngine.Template;
import org.apache.commons.jexl3.MapContext;
import org.apache.commons.jexl3.internal.Engine;
import org.apache.commons.jexl3.internal.TemplateEngine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.context.support.GenericApplicationContext;
import org.springframework.core.io.Resource;
import jmnet.moka.common.JSONResult;
import jmnet.moka.common.cache.CacheManager;
import jmnet.moka.common.template.Constants;
import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.loader.DataLoader;
import jmnet.moka.common.template.loader.TemplateLoader;
import jmnet.moka.common.template.merge.Evaluator;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.MergeOptions;
import jmnet.moka.common.template.merge.TemplateMerger;
import jmnet.moka.common.template.merge.TreeNode;
import jmnet.moka.common.template.merge.element.ElementMerger;
import jmnet.moka.common.template.parse.model.TemplateElement;
import jmnet.moka.common.template.parse.model.TemplateRoot;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.tms.exception.TmsException;
import jmnet.moka.core.tms.merge.element.MspAbstractElementMerger;
import jmnet.moka.core.tms.merge.item.MergeItem;
import jmnet.moka.core.tms.template.loader.AbstractTemplateLoader;

/**
 * <pre>
 * 아이템 정보를 조회하여 머지하는 기본 템플릿 머저
 * 템플릿을 포함할 경우 포함된 템플릿을 파싱하여 머지한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * 
 * @since 2019. 9. 4. 오후 5:59:52
 * @author kspark
 */
public class MspTemplateMerger implements TemplateMerger<MergeItem> {

    protected static final String CUSTOM_ELEMENT_MERGER_PACKAGE =
            "jmnet.moka.core.tms.merge.element";
    protected static String[] TAGS =
            {Constants.EL_TP, Constants.EL_CP, Constants.EL_CT, Constants.EL_AD, Constants.EL_LOOP,
                    Constants.EL_DATA, Constants.EL_PAGING, MokaConstants.EL_JSON};
    protected static List<String> CUSTOM_ELEMENT_MERGER_TAG = Arrays.asList(TAGS);
    private TemplateEngine templateEngine =
            new TemplateEngine(new Engine(new JexlBuilder()), false, 0, '$', '#');
    protected HashMap<String, ElementMerger> elementMergerMap;
    protected AbstractTemplateLoader templateLoader;
    protected Evaluator evaluator;
    protected DataLoader dataLoader;
    protected CacheManager cacheManager;
    protected Template wrapItemStart;
    protected Template wrapItemEnd;
    protected Template htmlWrap;
    private GenericApplicationContext appContext;
    protected String domainId;
    protected Template highlightTemplate;
    protected String highlightJsPath;
    protected String highlightCssPath;
    protected boolean onlyHighlight;
    protected boolean esiEnabled;

    private static final Logger logger = LoggerFactory.getLogger(MspTemplateMerger.class);

    public MspTemplateMerger(GenericApplicationContext appContext, String domainId,
            AbstractTemplateLoader templateLoader, DataLoader dataLoader,
            TemplateLoader<MergeItem> assistantTemplateLoader) {
        this.appContext = appContext;
        try {
            this.cacheManager = this.appContext.getBean(CacheManager.class);
        } catch (BeansException e) {
            logger.warn("CacheManager load fail or not set");
        }
        this.domainId = domainId;
        this.templateLoader = templateLoader;
        this.elementMergerMap = new HashMap<String, ElementMerger>(16);
        this.evaluator = new Evaluator();
        this.dataLoader = dataLoader;
        if (assistantTemplateLoader != null) {
            this.templateLoader.setAssistantTemplateLoader(assistantTemplateLoader);
        }

        this.esiEnabled = Boolean
                .valueOf(appContext.getBeanFactory().resolveEmbeddedValue("${tms.esi.enable}"));

        loadTemplateForPreview();
    }

    private void loadTemplateForPreview() {
        this.wrapItemStart = templateEngine.createTemplate(MokaConstants.WRAP_ITEM_START);
        this.wrapItemEnd = templateEngine.createTemplate(MokaConstants.WRAP_ITEM_END);

        this.highlightJsPath =
                appContext.getBeanFactory().resolveEmbeddedValue("${tms.merge.highlight.js.path}");
        this.highlightCssPath =
                appContext.getBeanFactory().resolveEmbeddedValue("${tms.merge.highlight.css.path}");
        this.onlyHighlight = Boolean.valueOf(
                appContext.getBeanFactory().resolveEmbeddedValue("${tms.merge.highlight.only}"));
        String highlightTemplatePath =
                appContext.getBeanFactory().resolveEmbeddedValue("${tms.merge.highlight.template}");
        String htmlWrapTemplatePath =
                appContext.getBeanFactory().resolveEmbeddedValue("${tms.merge.htmlWrap.template}");


        // highlight template 로딩
        try {
            String templateContent = "";
            if (highlightTemplatePath.startsWith("class")) {
                Resource resource = ResourceMapper.getResource(highlightTemplatePath);
                if (resource.exists()) {
                    templateContent = new BufferedReader(new InputStreamReader(
                            resource.getInputStream(), StandardCharsets.UTF_8)).lines()
                                    .collect(Collectors.joining(System.lineSeparator()));
                }
            } else {
                templateContent = new String(
                        Files.readAllBytes(ResourceMapper.getPath(highlightTemplatePath)), "UTF-8");
            }
            this.highlightTemplate = templateEngine.createTemplate(templateContent);
        } catch (IOException e) {
            logger.error("highlight Template Load Fail: {}", highlightTemplatePath, e);
        }

        // html wrap template 로딩
        try {
            String templateContent = "";
            if (htmlWrapTemplatePath.startsWith("class")) {
                Resource resource = ResourceMapper.getResource(htmlWrapTemplatePath);
                if (resource.exists()) {
                    templateContent = new BufferedReader(new InputStreamReader(
                            resource.getInputStream(), StandardCharsets.UTF_8)).lines()
                                    .collect(Collectors.joining(System.lineSeparator()));
                }
            } else {
                templateContent = new String(
                        Files.readAllBytes(ResourceMapper.getPath(htmlWrapTemplatePath)), "UTF-8");
            }
            this.htmlWrap = templateEngine.createTemplate(templateContent);
        } catch (IOException e) {
            logger.error("html wrap Template Load Fail: {}", htmlWrapTemplatePath, e);
        }
    }

    public void loadUri() throws TmsException {
        this.templateLoader.loadUri();
    }

    public Map<String, String> getUri2ItemMap() {
        return this.templateLoader.getUri2ItemMap();
    }

    @Override
    public TemplateRoot setItem(String itemType, String itemId, MergeItem item)
            throws TemplateParseException {
        return this.templateLoader.setItem(itemType, itemId, item);
    }

    @Override
    public TemplateRoot getParsedTemplate(String itemType, String itemId)
            throws TemplateParseException, TemplateLoadException {
        return this.templateLoader.getParsedTemplate(itemType, itemId);
    }

    @Override
    public MergeItem getItem(String itemType, String itemId)
            throws TemplateLoadException, TemplateParseException {
        return this.templateLoader.getItem(itemType, itemId);
    }

    /**
     * <pre>
     * 아이템 정보를 다시 로딩할 수 있도록 삭제한다.
     * </pre>
     * 
     * @param itemType
     * @param itemId
     */
    public void purgeItem(String itemType, String itemId) {
        this.templateLoader.purgeItem(itemType, itemId);
    }

    /**
     * <pre>
     * uri를 머징하기 위한 아이템의 key를 반환한다.
     * </pre>
     * 
     * @param uri uri
     * @return itemKey
     */
    public String getItemKey(String uri) {
        return this.templateLoader.getItemKey(uri);
    }

    public String getDomainId() {
        return this.domainId;
    }

    protected String makeClassName(String nodeName) {
        String lower = nodeName.split(":")[1].toLowerCase();
        String pascalPresentation = lower.substring(0, 1).toUpperCase() + lower.substring(1);
        if (CUSTOM_ELEMENT_MERGER_TAG.contains(nodeName)) {
            return CUSTOM_ELEMENT_MERGER_PACKAGE + "." + pascalPresentation
                    + Constants.ELEMENT_MERGER_POSTFIX;
        } else {
            return Constants.ELEMENT_MERGER_PACKAGE + "." + pascalPresentation
                    + Constants.ELEMENT_MERGER_POSTFIX;
        }
    }

    @Override
    public ElementMerger getElementMerger(String nodeName) {
        ElementMerger elementMerger = this.elementMergerMap.get(nodeName);
        if (elementMerger == null && nodeName.startsWith(Constants.PREFIX)) {
            String className = makeClassName(nodeName);
            synchronized (this.elementMergerMap) {
                if (this.elementMergerMap.get(nodeName) == null) { // 선행 thread가 생성한 경우 skip한다.
                    try {
                        Class<?> claz = Class.forName(className);
                        Constructor<?> constructor = claz.getConstructor(TemplateMerger.class);
                        elementMerger = (ElementMerger) constructor.newInstance(this);
                        // MspAbstractElementMerger를 상속받은 경우만 appContext와 cacheManager를 설정한다.
                        if (elementMerger instanceof MspAbstractElementMerger) {
                            MspAbstractElementMerger mspElementMerger =
                                    (MspAbstractElementMerger) elementMerger;
                            mspElementMerger.setApplicationContext(appContext);
                            mspElementMerger.setCacheManager(cacheManager);
                        }
                        this.elementMergerMap.put(nodeName, elementMerger);
                    } catch (Exception e) {
                        elementMerger = null;
                        logger.error("ElementMerger Not Found:{} {}", className, e);
                    }
                } else {
                    elementMerger = this.elementMergerMap.get(nodeName);
                }
            }
        }
        return elementMerger;
    }

    @Override
    public Evaluator getEvaluator() {
        return this.evaluator;
    }

    @Override
    public DataLoader getDataLoader() {
        return this.dataLoader;
    }

    public CacheManager getCacheManager() {
        return this.cacheManager;
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


    /**
     * <pre>
     * ShowItem의 스타일을 추가한다. onlyHightlight가 없으면 시스템기본으로 처리한다.
     * </pre>
     * 
     * @param sb
     * @param context
     * @param onlyHighlight 하이라이트할 아이템만 처리할지 여부
     */
    public void addShowItemStyle(StringBuilder sb, MergeContext context, boolean... onlyHighlight) {
        MergeOptions options = context.getMergeOptions();
        sb.append(System.lineSeparator());
        if (onlyHighlight == null || onlyHighlight.length == 0) {
            sb.append(getHighlightScript(options.getShowItem(), options.getShowItemId(),
                    this.onlyHighlight));
        } else {
            sb.append(getHighlightScript(options.getShowItem(), options.getShowItemId(),
                    onlyHighlight[0]));
        }
    }

    private String getHighlightScript(String itemType, String itemId, boolean onlyHighlight) {
        MapContext context = new MapContext();
        context.set(MokaConstants.HIGHLIGHT_JS_PATH, this.highlightJsPath);
        context.set(MokaConstants.HIGHLIGHT_CSS_PATH, this.highlightCssPath);
        context.set(MokaConstants.SHOW_ITEM_TYPE, itemType);
        context.set(MokaConstants.SHOW_ITEM_ID, itemId);
        context.set(MokaConstants.ONLY_HIGHLIGHT, onlyHighlight);
        StringWriter writer = new StringWriter();
        this.highlightTemplate.evaluate(context, writer);
        return writer.toString();
    }

    @Override
    public StringBuilder merge(String itemType, String itemId, MergeContext context)
            throws TemplateMergeException {
        StringBuilder sb = new StringBuilder(1024);
        try {
            TemplateRoot templateRoot = getParsedTemplate(itemType, itemId);
            templateRoot.merge(this, context, sb);
            if (context.getMergeOptions().getShowItem() != null) {
                addShowItemStyle(sb, context);
            }
        } catch (Exception e) {
            throw new TemplateMergeException("Template Merge Fail : " + itemType + ", " + itemId,
                    e);
        }
        return sb;
    }

    @Override
    public boolean exists(String itemType, String itemId) throws TemplateMergeException {
        try {
            TemplateRoot templateRoot = getParsedTemplate(itemType, itemId);
            if (templateRoot != null) {
                return true;
            }
        } catch (Exception e) {
            throw new TemplateMergeException("Template load Fail : " + itemType + ", " + itemId, e);
        }
        return false;
    }

    @Override
    public TreeNode templateTreeNode(String itemType, String itemId)
            throws TemplateParseException, TemplateLoadException {
        TemplateRoot templateRoot = this.templateLoader.getParsedTemplate(itemType, itemId);
        TreeNode rootTreeNode = new TreeNode(null);
        templateRoot.templateTree(this, rootTreeNode);
        return rootTreeNode;
    }

    @Override
    public String templateTree(String itemType, String itemId)
            throws TemplateParseException, TemplateLoadException {
        TreeNode rootTreeNode = templateTreeNode(itemType, itemId);
        StringBuilder sb = new StringBuilder(1024);
        childTemplateTree(rootTreeNode, sb, 1);
        return sb.toString();
    }

    private void childTemplateTree(TreeNode parentNode, StringBuilder sb, int depth) {
        for (TreeNode treeNode : parentNode.getChildren()) {
            for (int i = 0; i < depth; i++)
                sb.append(Constants.TRAVERSE_INDENT);
            TemplateElement templateElement = treeNode.getTemplateElement();
            sb.append(String.format("%s %s %s", templateElement.getNodeName(),
                    templateElement.getAttribute(Constants.ATTR_ID),
                    templateElement.getAttribute(Constants.ATTR_NAME)))
                    .append(System.lineSeparator());
            if (treeNode.hasChild()) {
                childTemplateTree(treeNode, sb, depth + 1);
            }
        }
    }

    @SuppressWarnings("unchecked")
    public void setData(MergeContext context, String dataId, JSONResult result) {
        Map<String, JSONResult> dataMap = null;
        if (context.has(MokaConstants.MERGE_DATA_MAP) == false) {
            dataMap = new HashMap<String, JSONResult>(16);
            context.set(MokaConstants.MERGE_DATA_MAP, dataMap);
        } else {
            dataMap = (Map<String, JSONResult>) context.get(MokaConstants.MERGE_DATA_MAP);
        }
        dataMap.put(dataId, result);
        logger.debug("Loaded Data put : {}", dataId);
    }

    public JSONResult getData(MergeContext context, String dataId) {
        if (context.has(MokaConstants.MERGE_DATA_MAP) == false) {
            return null;
        } else {
            @SuppressWarnings("unchecked")
            Map<String, JSONResult> dataMap =
                    (Map<String, JSONResult>) context.get(MokaConstants.MERGE_DATA_MAP);
            return dataMap.get(dataId);
        }
    }

    public boolean isEsiEnabled() {
        return this.esiEnabled;
    }
}
