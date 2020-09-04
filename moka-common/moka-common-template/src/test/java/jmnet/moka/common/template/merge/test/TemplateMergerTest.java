package jmnet.moka.common.template.merge.test;


import static jmnet.moka.common.template.Constants.ITEM_PAGE;
import static jmnet.moka.common.template.Constants.ITEM_TEMPLATE;
import static org.junit.Assert.assertNotNull;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ch.qos.logback.classic.Level;
import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.merge.DefaultTemplateMerger;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;

public class TemplateMergerTest {
	private static final Logger logger = LoggerFactory.getLogger(TemplateMergerTest.class);
	
	private TemplateMerger<String> merger;
	private MergeContext defaultContext;
	private boolean enableDebugLog = true;
	
	@Before
	public void setUp() throws IOException {
		if ( enableDebugLog == false ) {
			ch.qos.logback.classic.Logger rootLogger = (ch.qos.logback.classic.Logger)LoggerFactory.getLogger(ch.qos.logback.classic.Logger.ROOT_LOGGER_NAME);
			rootLogger.setLevel(Level.toLevel("info"));
		}
		
		// test/resources/samples의 경로를 찾는다.
//		ClassLoader classLoader = TemplateMergerTest.class.getClassLoader();
//		File file = new File(classLoader.getResource("samples").getFile());
		File file = new File("C:\\GitHub\\ResearchInstitute\\MCP_prototype\\mcp-core\\mcp-core-template\\src\\test\\resources\\samples");
		String templatePath = file.getAbsolutePath();
		
		this.merger = new DefaultTemplateMerger(templatePath,"http://tms.ssc.com:8080","ssc_test");
		// 머지 옵션설정
		this.defaultContext = new MergeContext();
		this.defaultContext.getMergeOptions().setDebug(true);

		// 변수 설정
		this.defaultContext.set("name", "<서울&시스템>");
		this.defaultContext.set("site", "http://www.ssc.co.kr");
		this.defaultContext.set("meta", "Y");
		HashMap<String,String> codeMap = new HashMap<String,String>();
		codeMap.put("R_URL", "//r.ssc.co.kr");
		this.defaultContext.set("code", codeMap);

	}
	
	/**
	 * 
	 * <pre>
	 * 페이지에 내포된 템플릿을 머지한다.
	 * </pre>
	 * @throws IOException
	 * @throws TemplateMergeException
	 */
	@Test
	public void pageMergeTest() throws IOException, TemplateMergeException  {
		StringBuilder result =  merger.merge(ITEM_PAGE, "0001", this.defaultContext);
		logger.info("--- merge text ---\r\n{}\r\n", result.toString());
		assertNotNull(result);
	}
	
	/**
     * 
     * <pre>
     * 템플릿의 포함관계를 표시한다.
     * </pre>
     * 
     * @throws TemplateParseException
     * @throws TemplateLoadException
     */
	@Test
    public void templateTreeTest() throws TemplateParseException, TemplateLoadException {
		String result = merger.templateTree(ITEM_PAGE, "0001");
		logger.info("--- template tree ---\r\n{}\r\n", result);
		assertNotNull(result);
	}

	/**
     * 
     * <pre>
     * 템플릿의 포함관계를 표시한다.
     * </pre>
     * 
     * @throws TemplateParseException
     * @throws TemplateLoadException
     */
	@Test
    public void templateTreeCyclicReferenceTest()
            throws TemplateParseException, TemplateLoadException {
		try {
			String result = merger.templateTree(ITEM_PAGE, "0003");
			logger.info("--- template tree ---\r\n{}\r\n", result);
		} catch (TemplateParseException e) {
			assertNotNull(e);			
			logger.error(e.toString());
		}
	}
	
	/**
	 * 
	 * <pre>
	 * 템플릿에 내포된 템플릿을 머지한다.
	 * </pre>
	 * @throws TemplateMergeException
	 */
	@Test
	public void templateMergeTest() throws TemplateMergeException  {
		StringBuilder result =  merger.merge(ITEM_TEMPLATE, "0002", this.defaultContext);
		logger.info("--- merge text ---\r\n{}\r\n", result.toString());
		assertNotNull(result);
	}
	
	/**
	 * 
	 * <pre>
	 * 다중 loop에 대한 머지를 테스트 한다.
	 * </pre>
	 * @throws TemplateMergeException
	 */
	@Test
	public void innerLoopTest() throws TemplateMergeException  {
		MergeContext context = new MergeContext();
		context.getMergeOptions().setDebug(true);
		
		StringBuilder result = merger.merge(ITEM_PAGE, "0002", context);
		logger.info("--- inner loop test ---\r\n{}\r\n", result.toString());
		assertNotNull(result);
	}
	
	@Test
	public void dataMerge() throws TemplateMergeException {
		for ( int i=0; i < 10; i++) {
			long start = System.currentTimeMillis();
			StringBuilder result = merger.merge(ITEM_PAGE, "0004", defaultContext);
			if ( i == 0 ) {
				logger.info("--- inner loop test ---\r\n{}\r\n", result.toString());
			}
			logger.info("time = {} ms", System.currentTimeMillis() - start);
			assertNotNull(result);
		}
	}
	
	@Test
	public void scriptTest() throws TemplateMergeException {
		StringBuilder result =  merger.merge(ITEM_PAGE, "0005", this.defaultContext);
		logger.info("--- merge text ---\r\n{}\r\n", result.toString());
		assertNotNull(result);
	}
	
	@Test
	public void componentTest() throws TemplateMergeException {
		StringBuilder result =  merger.merge(ITEM_PAGE, "0006", this.defaultContext);
		logger.info("--- merge text ---\r\n{}\r\n", result.toString());
		assertNotNull(result);
	}
	
	@Test
	public void containerTest() throws TemplateMergeException {
		StringBuilder result =  merger.merge(ITEM_PAGE, "0007", this.defaultContext);
		logger.info("--- merge text ---\r\n{}\r\n", result.toString());
		assertNotNull(result);
	}

    @Test
    public void splitTest() throws TemplateMergeException {
        StringBuilder result = merger.merge(ITEM_TEMPLATE, "6001", this.defaultContext);
        logger.info("--- merge text ---\r\n{}\r\n", result.toString());
        assertNotNull(result);
    }
	
}
