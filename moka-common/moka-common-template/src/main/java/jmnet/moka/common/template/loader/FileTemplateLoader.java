package jmnet.moka.common.template.loader;

import static jmnet.moka.common.template.Constants.COMPONENT_TEMPLATE_ID;
import static jmnet.moka.common.template.Constants.ITEM_COMPONENT;
import static jmnet.moka.common.template.Constants.ITEM_TEMPLATE;
import java.io.File;
import java.nio.file.Files;
import java.util.HashMap;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.parse.TemplateParser;
import jmnet.moka.common.template.parse.model.CpTemplateRoot;
import jmnet.moka.common.template.parse.model.TemplateRoot;

/**
 * <pre>
 * 파일시스템의 템플릿 정보를 로딩하고 캐싱을 관리한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * @since 2019. 9. 4. 오후 4:16:52
 * @author kspark
 */
public class FileTemplateLoader implements TemplateLoader<String> {
	protected String basePath;
	protected HashMap<String, String> templateMap;
	protected HashMap<String, TemplateRoot> templateRootMap;
	protected boolean cacheable;
	private static final Logger logger = LoggerFactory.getLogger(FileTemplateLoader.class);
	private TemplateLoader<String> assistantTemplateLoader;
	
	public FileTemplateLoader(String basePath) {
		this(basePath, false);
	}
	
	public FileTemplateLoader(String basePath, boolean cacheable) {
		this.basePath = basePath;
		this.cacheable = cacheable;
		if ( cacheable ) {
			this.templateMap = new HashMap<String, String>(256);
			this.templateRootMap = new HashMap<String, TemplateRoot>(256);
		}
	}
	
	public void setAssistantTemplateLoader(TemplateLoader<String> assistantTemplateLoader) {
		this.assistantTemplateLoader = assistantTemplateLoader;
	}
	
	/**
	 * <pre>
	 * 캐시키를 생성한다.
	 * </pre>
	 * @param type 템플릿 타입
	 * @param id 아이디
	 * @return 
	 */
	private String makeKey(String type, String id) {
		return type+"_"+id;
	}
	
	/**
	 * <pre>
	 * 템플릿 경로를 반환한다.
	 * </pre>
	 * @param type 템플릿 타입
	 * @param id 아이디
	 * @return 템플릿 경로
	 */
	protected String makePath(String type, String id) {
		return this.basePath+"/"+ type+"/"+id;
	}
	
	/**
     * <pre>
     * 템플릿 내용을 로딩한다.
     * </pre>
     * 
     * @param type 템플릿 타입
     * @param id 아이디
     * @return 템플릿 내용
     * @throws TemplateParseException
     * @throws TemplateLoadException
     */
    private String loadTemplate(String type, String id)
            throws TemplateParseException, TemplateLoadException {
		File templateFile = new File(makePath(type,id));
		String template = "";
		try {
			template = new String(Files.readAllBytes(templateFile.toPath()),"UTF-8");
			logger.debug("Template Loaded: {} {} {}", type, id, makePath(type, id));
		} catch ( Exception e) {
			logger.debug("Template Loaded Fail And Will Retry : {} {} {}", type, id, makePath(type, id));
			// assistanceTemplateLoader로 다시 조회한다.
			try {
				template = this.assistantTemplateLoader.getItem(type, id);
			} catch ( Exception e1) {
				throw e1;
			}
		}
		
		if ( cacheable ) this.templateMap.put(makeKey(type,id), template);
		return template;
	}

    public String getItem(String type, String id)
            throws TemplateParseException, TemplateLoadException {
		String key = makeKey(type, id) ;
		if ( cacheable == false ||  this.templateMap.containsKey(key) ) {
            try {
                return this.loadTemplate(type, id);
            } catch (Exception e) {
                throw new TemplateLoadException(
                        String.format("Could not load type=%s, id=%s", type, id), e);
            }
		}
		return this.templateMap.get(key);
	}
	
    public TemplateRoot setItem(String type, String id, String templateText)
            throws TemplateParseException, TemplateParseException {
		String key = makeKey(type, id) ;
		if ( cacheable ) this.templateMap.put(key, templateText);
		TemplateRoot templateRoot = TemplateParser.parse(type, id, templateText);
		
		if ( cacheable ) this.templateRootMap.put(makeKey(type,id), templateRoot);
		
		return templateRoot;
	}
	
	
    private CpTemplateRoot getTemplateComponent(String type, String id, String json)
            throws TemplateParseException, TemplateLoadException {
		try {
			JSONParser jsonParser = new JSONParser();
			JSONObject componentJson = (JSONObject)jsonParser.parse(json);
			String templateId = (String)componentJson.get(COMPONENT_TEMPLATE_ID);
			if ( this.cacheable) { //캐시되는 경우만 템플릿을 미리 파싱한다.
				getParsedTemplate(ITEM_TEMPLATE, templateId);
			}
            CpTemplateRoot cpTemplateRoot = new CpTemplateRoot(id, componentJson);
            return cpTemplateRoot;
		} catch (ParseException e) {
            throw new TemplateLoadException(
                    String.format("Component JSON Parse Error: %s %s", type, id), e);
		}
	}

    public TemplateRoot getParsedTemplate(String type, String id) throws TemplateParseException,
            TemplateLoadException {
		TemplateRoot templateRoot;
		if ( cacheable ) {
			if ( (templateRoot = this.templateRootMap.get(makeKey(type, id))) != null) {
				return templateRoot;
			}
		}

		if (type.equals(ITEM_COMPONENT)) {
			templateRoot = getTemplateComponent(type, id, getItem(type, id));
		} else  {
			templateRoot = TemplateParser.parse(type, id, getItem(type, id));
		}
		
		if ( cacheable ) {
			this.templateRootMap.put(makeKey(type,id), templateRoot);
		}
		return templateRoot;
	}
	
//	public TemplateRoot setParsedTemplate(String type, String id, String templateText, TemplateLoader<String> assistanceTemplateLoader) throws UnsupportedEncodingException, IOException, TemplateParseException  {
//		TemplateRoot templateRoot = null;
//		if (type.equals(ITEM_COMPONENT)) {
//			templateRoot = getTemplateComponent(type, id, templateText, assistanceTemplateLoader);
//		} else  {
//			templateRoot = TemplateParser.parse(type, id, templateText);
//		}
//		if ( cacheable ) {
//			this.templateRootMap.put(makeKey(type,id), templateRoot);
//		}
//		return templateRoot;
//	}
	
}
