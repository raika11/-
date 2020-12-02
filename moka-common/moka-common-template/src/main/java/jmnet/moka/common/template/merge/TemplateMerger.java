package jmnet.moka.common.template.merge;

import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.loader.DataLoader;
import jmnet.moka.common.template.merge.element.ElementMerger;
import jmnet.moka.common.template.parse.model.TemplateRoot;

public interface TemplateMerger<T> {
	
	/**
     * <pre>
     * 파싱된 템플릿 정보를 가져온다.
     * </pre>
     * 
     * @param type 템플릿 타입
     * @param id 아이디
     * @return TemplateRoot 템플릿루트
     * @throws TemplateParseException 템플릿 파싱 예외
     * @throws TemplateLoadException 템플릿 로드 예외
     */
    public TemplateRoot getParsedTemplate(String type, String id)
            throws TemplateParseException, TemplateLoadException;
	
    public TemplateRoot setItem(String type, String id, T item)
            throws TemplateParseException, TemplateLoadException;
	
    public T getItem(String type, String id)
            throws TemplateParseException, TemplateLoadException;
	
	public ElementMerger getElementMerger(String name);
	
	public Evaluator getEvaluator();
	
	public DataLoader getDataLoader();
	
	public DataLoader getDefaultDataLoader();
	
	public String getWrapItemStart(String itemType, String itemId);
	
	public String getWrapItemEnd(String itemType, String itemId);
	
	public String preprocessToken(String token, MergeContext context);

	/**
	 * 
	 * <pre>
	 * 머지를 수행한다.
	 * </pre>
	 * @param type 템플릿 타입
	 * @param id 아이디
	 * @param context 컨텍스트
	 * @return 머지결과를 담은 스트링빌더
	 * @throws TemplateMergeException 템플릿 머징 예외
	 */
	public StringBuilder merge(String type, String id, MergeContext context) throws TemplateMergeException;
	
	
	/**
     * <pre>
     * 머지를 수행할 Item 존재 여부를 반환한다, 로딩 되기 전이면 로딩 후에 true를 반환한다.
     * </pre>
     * 
     * @param type 템플릿 타입
     * @param id 아이디
     * @return 아이템 존재 여부
     * @throws TemplateMergeException 템플릿 머징 예외
     */
    public boolean exists(String type, String id) throws TemplateMergeException;

    /**
     * <pre>
     * 템플릿 관계에 대한 tree를 반환한다.
     * </pre>
     * 
     * @param type 템플릿 타입
     * @param id 아이디
     * @return 템플릿 관계 트리
     * @throws TemplateLoadException 템플릿 로드 예외
     * @throws TemplateParseException 템플릿 파싱 예외
     */
    public TreeNode templateTreeNode(String type, String id)
            throws TemplateLoadException, TemplateParseException;
	
	/**
     * 
     * <pre>
     * 템플릿 관계를 스트링으로 반환한다.
     * </pre>
     * 
     * @param type 템플릿 타입
     * @param id 템플릿 아이디
     * @return 템플릿 관계
     * @throws TemplateLoadException 템플릿 로드 예외
     * @throws TemplateParseException 템플릿 파싱 예외
     */
    public String templateTree(String type, String id)
            throws TemplateLoadException, TemplateParseException;
	
}
