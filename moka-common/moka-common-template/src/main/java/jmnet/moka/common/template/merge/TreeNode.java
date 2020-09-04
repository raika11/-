package jmnet.moka.common.template.merge;

import java.util.ArrayList;
import java.util.List;
import jmnet.moka.common.template.parse.model.TemplateElement;

/**
 * 
 * <pre>
 * 템플릿 관계 tree를 생성하기 위한 Tree Node 표현
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * @since 2019. 9. 4. 오후 6:04:45
 * @author kspark
 */
public class TreeNode {
	private TemplateElement templateElement;
	private TreeNode parentNode;
	private List<TreeNode> children;
	
	public TreeNode(TemplateElement templateElement) {
		this.templateElement = templateElement;
	}
	
	public TreeNode(TreeNode parentNode, TemplateElement templateElement) {
		this.parentNode = parentNode;
		this.templateElement = templateElement;
	}
	
	public void addChild(TreeNode childNode) {
		if ( children == null) {
			children = new ArrayList<TreeNode>();
		}
		children.add(childNode);
	}

	public TemplateElement getTemplateElement() {
		return templateElement;
	}

	public boolean hasParent() {
		return parentNode != null;
	}
	
	public TreeNode getParent() {
		return parentNode;
	}

	public List<TreeNode> getChildren() {
		return children;
	}

	public boolean hasChild() {
		return this.children != null;
	}
	
}
