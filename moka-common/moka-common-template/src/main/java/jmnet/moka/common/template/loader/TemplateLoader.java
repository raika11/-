package jmnet.moka.common.template.loader;

import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.parse.model.TemplateRoot;

public interface TemplateLoader<T> {

	
	/**
     * <pre>
     * 템플릿 내용혹은 컴포넌트정보를 가진 파일내용을 반환한다.
     * </pre>
     * 
     * @param type 템플릿 종류
     * @param id 아이디
     * @return 템플릿 내용
     * @throws TemplateLoadException 템플릿 로드 예외
     * @throws TemplateParseException 템플릿 파싱 예외
     */
    public T getItem(String type, String id) throws TemplateLoadException, TemplateParseException;
	
	
	/**
     * <pre>
     * 템플릿 정보를 추가한다.
     * </pre>
     * 
     * @param type 템플릿 종류
     * @param id 아이디
     * @param item 템플릿 정보
     * @return templateRoot
     * @throws TemplateLoadException 템플릿 로드 예외
     * @throws TemplateParseException 템플릿 파싱 예외
     */
    public TemplateRoot setItem(String type, String id, T item)
            throws TemplateLoadException, TemplateParseException;
	
	
	/**
	 * <pre>
	 * 파싱된 템플릿 정보를 반환한다.
	 * </pre>
	 * @param type 템플릿 종류
	 * @param id 아이디
	 * @return TemplateRoot
	 * @throws TemplateLoadException 템플릿 로드 예외
     * @throws TemplateParseException 템플릿 파싱 예외
	 */
    public TemplateRoot getParsedTemplate(String type, String id)
            throws TemplateLoadException, TemplateParseException;
		
}
