package jmnet.moka.common.template.parse;

import static jmnet.moka.common.template.Constants.ATTR_NAME;
import static jmnet.moka.common.template.Constants.ITEM_PAGE;
import static jmnet.moka.common.template.Constants.hasTemplate;
import static jmnet.moka.common.template.Constants.nodeType;
import static org.junit.Assert.assertNotNull;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.loader.FileTemplateLoader;
import jmnet.moka.common.template.loader.TemplateLoader;
import jmnet.moka.common.template.parse.TemplateParser;
import jmnet.moka.common.template.parse.model.TemplateRoot;

public class TemplateParserTest {

	private static final Logger logger = LoggerFactory.getLogger(TemplateParser.class);
	private String templatePath;
	
	@Before
	public void setUp() throws IOException {
		
		// test/resources/samples의 경로를 찾는다.
        //		ClassLoader classLoader = TemplateMergerTest.class.getClassLoader();
//		File file = new File(classLoader.getResource("samples").getFile());
        File file = new File("src/test/resources/samples");
        //		File file = new File("C:\\GitHub\\ResearchInstitute\\MCP_prototype\\mcp-core\\mcp-core-template\\src\\test\\resources\\samples");
		
		this.templatePath = file.getAbsolutePath();
	}
	
	/**
     * 
     * <pre>
     * 파싱후 엘리먼트 정보만 표시한다.
     * </pre>
     * 
     * @throws TemplateParseException 템플릿 파싱 오류
     * @throws TemplateLoadException
     */
	@Test	
    public void parseAndResulElement() throws TemplateParseException, TemplateLoadException {
		TemplateLoader<String> templateLoader = new FileTemplateLoader(this.templatePath);
		String templateText = templateLoader.getItem(ITEM_PAGE, "0001");
		TemplateRoot templateRoot = TemplateParser.parse(ITEM_PAGE, "0001", templateText);
		StringBuilder sb = new StringBuilder(1024*10);
		templateRoot.traverse(sb, 0, true);
		logger.debug("---- Template: \r\n{}", sb.toString());
		assertNotNull(templateRoot);
	}
	
	@Test	
    public void parseAndGetItemList() throws TemplateParseException, TemplateLoadException {
		TemplateLoader<String> templateLoader = new FileTemplateLoader(this.templatePath);
		String templateText = templateLoader.getItem(ITEM_PAGE, "0001");
		TemplateRoot templateRoot = TemplateParser.parse(ITEM_PAGE, "0001", templateText);
		List<Map<String, Object>> elementInfoList = templateRoot.getElementInfoList();
		for (Map<String, Object> elementInfo: elementInfoList ) {
			if ( hasTemplate(nodeType((String)elementInfo.get(ATTR_NAME))) ) {
				logger.debug("---- Template: \r\n{}", elementInfo);				
			}
		}
		assertNotNull(templateRoot);
	}

	/**
     * 
     * <pre>
     * 파싱후 모든노드의 정보를 표시한다.
     * </pre>
     * 
     * @throws TemplateParseException 템플릿 파싱 오류
     * @throws TemplateLoadException
     */
	@Test
    public void parseAndResultAll() throws TemplateParseException, TemplateLoadException {
		TemplateLoader<String> templateLoader = new FileTemplateLoader(this.templatePath);
		String templateText = templateLoader.getItem(ITEM_PAGE, "0001");
		TemplateRoot templateRoot = TemplateParser.parse(ITEM_PAGE, "0001", templateText);
		StringBuilder sb = new StringBuilder(1024*10);
		templateRoot.traverse(sb, 0, false);
		logger.debug("---- Template: \r\n{}", sb.toString());
		assertNotNull(templateRoot);
	}

	/**
     * 
     * <pre>
     * 컴포넌트를 포함한 파싱후 모든노드의 정보를 표시한다.
     * </pre>
     * 
     * @throws TemplateParseException 템플릿 파싱 오류
     * @throws TemplateLoadException
     */
	@Test
    public void parseAndResultAllWithComponent()
            throws TemplateParseException, TemplateLoadException {
		TemplateLoader<String> templateLoader = new FileTemplateLoader(this.templatePath);
		String templateText = templateLoader.getItem(ITEM_PAGE, "0006");
		TemplateRoot templateRoot = TemplateParser.parse(ITEM_PAGE, "0006", templateText);
		StringBuilder sb = new StringBuilder(1024*10);
		templateRoot.traverse(sb, 0, false);
		logger.debug("---- Template: \r\n{}", sb.toString());
		assertNotNull(templateRoot);
	}
	
	
	
}
