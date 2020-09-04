package jmnet.moka.common.template.parse.model;

import static jmnet.moka.common.template.Constants.INFO_LEVEL;
import static jmnet.moka.common.template.Constants.TRAVERSE_INDENT;
import static jmnet.moka.common.template.Constants.TYPE_TOKEN;
import static jmnet.moka.common.template.Constants.hasTemplate;
import static jmnet.moka.common.template.Constants.nodeType;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;

/**
 * 
 * <pre>
 * 파싱된 템플릿 정보를 구성하는 Node를 표현한다. 
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * @since 2019. 9. 4. 오후 6:15:22
 * @author kspark
 */
public abstract class TemplateNode implements Cloneable{
	protected TemplateRoot templateRoot;
	/** 노드 타입 */
	protected short nodeType;
	/** 노드 이름 */
	protected String nodeName;
	/** 이전 노드 */
	protected TemplateNode previous;
	/** 하위 노드 목록 */
	protected List<TemplateNode> children;
	/** line number */
	protected int lineNumber;
	
	public TemplateNode(TemplateRoot templateRoot, String nodeName, TemplateNode previous, int lineNumber) {
		this.templateRoot = templateRoot;
		this.nodeType = nodeType(nodeName);
		this.nodeName = nodeName;
		this.previous = previous;
		this.lineNumber = lineNumber;
	}
	
	public TemplateRoot getTemplateRoot() {
		return this.templateRoot;
	}
	
	public short getNodeType() {
		return this.nodeType;
	}
	
	public TemplateNode getPrevious() {
		return this.previous;
	}
	
	public int getLineNumber() {
		return this.lineNumber;
	}
	
	public boolean previousIsToken() {
		if ( this.previous != null && this.previous.nodeType == TYPE_TOKEN) 
			return true;
		return false;
	}
	
	public TemplateNode getFirst() {
		if (this.children != null && this.children.size() > 1) {
			return children.get(0);
		}
		return null;
	}
	
	public TemplateNode getLast() {
		if (this.children != null && this.children.size() > 0) {
			return children.get(this.children.size()-1);
		}
		return null;
	}
	
	public String getNodeName() {
		return this.nodeName;
	}
	
	public void addChild(TemplateNode node) {
		if ( this.children != null) {
			this.children.add(node);
		}
	}

	public void addChildren(List<TemplateNode> nodes) {
		if ( this.children != null) {
			this.children.addAll(nodes);
		}
	}

	public boolean hasChild() {
        if (this.children == null || this.children.size() == 0)
            return false;
		return true;
	}
	
	public List<TemplateNode> childNodes() {
		return this.children;
	}
	
	/** 
	 * 
	 * <pre>
	 * 노드의 정보를 Map으로 반환한다.
	 * </pre>
	 * @return 노드 정보
	 */
	public abstract Map<String, Object> infoMap();
	
	/**
	 * 
	 * <pre>
	 * 노드를 머지한다.
	 * </pre>
	 * @param merger 머저
	 * @param context 컨텍스트
	 * @param sb 스트링빌더
	 * @throws TemplateMergeException 템플릿 머지 예외
	 */
	public abstract void merge(TemplateMerger<?> merger, MergeContext context, StringBuilder sb) throws TemplateMergeException;
	
	/**
	 * 
	 * <pre>
	 * 마지막 라인의 공백을 반환한다.
	 * </pre>
	 * @return 마지막 라인의 공백
	 */
	public String getTailSpace() {
		return "";
	}
	
	/**
	 * 
	 * <pre>
	 * 템플릿 노드를 순회하여 정보를 반환한다.
	 * </pre>
	 * @param sb 스트링 빌더
	 * @param level 현재 레벨
	 * @param onlyTemplate 템플릿만 처리 여부
	 * @throws TemplateParseException 템플릿 파싱 예외
	 */
	public void traverse(StringBuilder sb, int level, boolean onlyTemplate) throws TemplateParseException {
		
		if ( onlyTemplate == false || ( onlyTemplate && hasTemplate(nodeType) ) ) { 
			for (int i=0; i < level; i++) sb.append(TRAVERSE_INDENT);
			sb.append("L"+level+" ");
			sb.append(infoMap().toString()).append(System.lineSeparator());
		}
	
		if ( hasChild()) {
			for( TemplateNode node : this.childNodes()) {
				node.traverse(sb, level+1, onlyTemplate);
			}
		}
	}
	
	public void getElementInfoList(List<Map<String, Object>> elementInfoList, int level) {
		Map<String, Object> cloneMap = new HashMap<String, Object>(16);
		cloneMap.putAll(this.infoMap());
		cloneMap.put(INFO_LEVEL, level);
		elementInfoList.add(cloneMap);
	
		if ( hasChild()) {
			for( TemplateNode node : this.childNodes()) {
				node.getElementInfoList(elementInfoList, level+1);
			}
		}
	}
	
	
	public String toString() {
		return infoMap().toString();
	}
}
