package jmnet.moka.common.template.parse.model;

import static jmnet.moka.common.template.Constants.ATTR_ID;
import static jmnet.moka.common.template.Constants.ITEM_AD;
import static jmnet.moka.common.template.Constants.ITEM_COMPONENT;
import static jmnet.moka.common.template.Constants.ITEM_CONTAINER;
import static jmnet.moka.common.template.Constants.ITEM_TEMPLATE;
import static jmnet.moka.common.template.Constants.NODE_ROOT;
import static jmnet.moka.common.template.Constants.TYPE_AD;
import static jmnet.moka.common.template.Constants.TYPE_CP;
import static jmnet.moka.common.template.Constants.TYPE_CT;
import static jmnet.moka.common.template.Constants.TYPE_TP;
import static jmnet.moka.common.template.Constants.hasTemplate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;
import jmnet.moka.common.template.merge.TreeNode;

/**
 * 
 * <pre>
 * 파싱된 템플릿 정보의 최상위 노드, DOM의 Root와 동일 개념
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * @since 2019. 9. 4. 오후 6:20:25
 * @author kspark
 */
public class TemplateRoot extends TemplateElement {
	private static final Logger logger = LoggerFactory.getLogger(TemplateRoot.class);
	
	private String itemType;
	private String id;
    private int templateSize;
		
    public TemplateRoot(String itemType, String id) {
		// templateRoot는 templateRoot가 null이며, lineNumber도 0이다.
		super(null, NODE_ROOT, null, 0);
        this.itemType = itemType;
		this.id = id;
	}
	
    public void setTemplateSize(int templateSize) {
        this.templateSize = templateSize;
    }

    public int getTemplateSize() {
        return this.templateSize;
    }

	public String getItemType() {
		return this.itemType;
	}
	
	public String getId() {
		return this.id;
	}

	@Override
	public void addChild(TemplateNode node) {
		if ( node == null ) return;
		this.children.add(node);
	}

	@Override
    public void merge(TemplateMerger<?> merger, MergeContext context, StringBuilder sb) {
		if ( hasChild()) {
			for( TemplateNode node : this.childNodes()) {
				try {
					node.merge(merger, context, sb);
				} catch (TemplateMergeException e) {
					// 오류 나는 부분은 머지결과에서 제외되고 계속 머지를 수행한다.
					logger.error("Template Merge Error :" + e.getLocalizedMessage(),e);
				}
			}
		}
	}
		
	/**
     * 
     * <pre>
     * 템플릿 관계에 대한 tree를 조사한다.
     * </pre>
     * 
     * @param merger 머저
     * @param parentTreeNode 상위 TreeNode
     * @throws TemplateParseException 템플릿 파싱 예외
     * @throws TemplateLoadException 템플릿 로딩 예외
     */
    public void templateTree(TemplateMerger<?> merger, TreeNode parentTreeNode)
            throws TemplateParseException, TemplateLoadException {
				
		for ( TemplateNode templateNode : this.childNodes()) {
			if ( hasTemplate(templateNode.getNodeType()) ) {
				TemplateElement templateElement = (TemplateElement)templateNode;
				checkCyclicReference(parentTreeNode, templateElement);
                TreeNode treeNode = new TreeNode(parentTreeNode, templateElement);
                parentTreeNode.addChild(treeNode);
                TemplateRoot templateRoot = null;
                if (templateElement.getNodeType() == TYPE_TP) {
                    templateRoot = merger.getParsedTemplate(ITEM_TEMPLATE,
                            ((TemplateElement) templateNode).getAttribute(ATTR_ID));
                } else if (templateElement.getNodeType() == TYPE_CP) {
                    templateRoot = merger.getParsedTemplate(ITEM_COMPONENT,
                            ((TemplateElement) templateNode).getAttribute(ATTR_ID));
                } else if (templateElement.getNodeType() == TYPE_CT) {
                    templateRoot = merger.getParsedTemplate(ITEM_CONTAINER,
                            ((TemplateElement) templateNode).getAttribute(ATTR_ID));
                } else if (templateElement.getNodeType() == TYPE_AD) {
                    templateRoot = merger.getParsedTemplate(ITEM_AD,
                            ((TemplateElement) templateNode).getAttribute(ATTR_ID));
                }
                templateRoot.templateTree(merger, treeNode);
            }
        }
	}
	
	/**
	 * <pre>
	 * 템플릿의 순환참조가 있는지 확인한다.
	 * </pre>
	 * @param parentTreeNode 상위 노드
	 * @param templateElement 엘리먼트
	 * @throws TemplateParseException 파싱오류
	 */
	private void checkCyclicReference(TreeNode parentTreeNode, TemplateElement templateElement) throws TemplateParseException {
		if ( parentTreeNode.hasParent()) {
			TreeNode parent = parentTreeNode;
			while ( parent.hasParent() ) {
				TemplateElement parentTemplateElement = parent.getTemplateElement();
				List<String> parentTemplateIdList = getTemplateIdList(parentTemplateElement);
				List<String> templateIdList = getTemplateIdList(templateElement);
				for ( String parentTemplateId : parentTemplateIdList) {
					for ( String templateId : templateIdList) {
						if ( parentTemplateId.equals(templateId)) {
							throw new TemplateParseException(
                                    TemplateParseException.CYCLE_TEMPLATE,
							        "Cyclic Template : name="+ templateElement.getNodeName()
							+",id= "+templateElement.getAttribute(ATTR_ID)
							+" ,duplicateTemplateId= " + templateId
							, templateElement.getLineNumber());
						}
					}
				}
//				if ( parentTemplateElement.getName().equals(templateElement.getName()) && 
//						parentTemplateElement.getAttribute("id").equals(templateElement.getAttribute("id"))) {
//					throw new TemplateParseException("Cyclic Template : name="+ templateElement.getName()
//					+",id= "+templateElement.getAttribute("id"), templateElement.getLineNumber());
//				}					
				parent = parent.getParent();
			}
		}
	}
	
	/**
	 * <pre>
	 * TemplateElement에 포함되어 있는 템플릿 id를 추출한다.
	 * </pre>
	 * @param templateElement 템플릿 엘리먼트
	 * @return 템플릿 id 목록
	 */
    private List<String> getTemplateIdList(TemplateElement templateElement) {
        List<String> templateIdList = new ArrayList<String>(8);
        switch (templateElement.getNodeType()) {
            case TYPE_TP:
            case TYPE_CP:
                templateIdList.add(templateElement.getAttribute(ATTR_ID));
                break;
            case TYPE_AD:
            case TYPE_CT:
                templateIdList.add("NOT IMPLEMENTED");
        }
        return templateIdList;
    }
	
	public List<Map<String, Object>> getElementInfoList() {
		List<Map<String, Object>> elementInfoList = new ArrayList<Map<String, Object>>(16);
		
		if ( hasChild()) {
			for( TemplateNode node : this.childNodes()) {
				node.getElementInfoList(elementInfoList, 1);
			}
		}
		return elementInfoList;
	}
}
