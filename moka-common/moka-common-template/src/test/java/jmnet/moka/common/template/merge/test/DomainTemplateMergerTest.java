package jmnet.moka.common.template.merge.test;

import static jmnet.moka.common.template.Constants.ITEM_PAGE;
import static org.junit.Assert.assertNotNull;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;

import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ch.qos.logback.classic.Level;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.merge.DefaultDomainTemplateMerger;
import jmnet.moka.common.template.merge.MergeContext;

public class DomainTemplateMergerTest {
	private static final Logger logger = LoggerFactory.getLogger(DomainTemplateMergerTest.class);
	
	private DefaultDomainTemplateMerger merger;
	private MergeContext defaultContext;
	private boolean enableDebugLog = true;
	private static String WWW = "www.ssc.co.kr";
	private static String CMS = "cms.ssc.co.kr";
	private static String DEFAULT = "_default";
	
	@Before
	public void setUp() throws IOException {
		if ( enableDebugLog == false ) {
			ch.qos.logback.classic.Logger rootLogger = (ch.qos.logback.classic.Logger)LoggerFactory.getLogger(ch.qos.logback.classic.Logger.ROOT_LOGGER_NAME);
			rootLogger.setLevel(Level.toLevel("info"));
		}
		
		// test/resources/samples의 경로를 찾는다.
//		ClassLoader classLoader = TemplateMergerTest.class.getClassLoader();
//		File file = new File(classLoader.getResource("samples-domain").getFile());
		File file = new File("C:\\GitHub\\ResearchInstitute\\MCP_prototype\\mcp-core\\mcp-core-template\\src\\test\\resources\\samples-domain");
		String templatePath = file.getAbsolutePath();
		
		this.merger = new DefaultDomainTemplateMerger(templatePath,"http://localhost:8080","ssc_cms");
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

	@Test
	public void defaultDoaminMergeTest() throws IOException, TemplateMergeException  {
		StringBuilder result =  merger.merge(DEFAULT, ITEM_PAGE, "0001", this.defaultContext);
		logger.info("--- merge text ---\r\n{}\r\n", result.toString());
		assertNotNull(result);
	}
	
	@Test
	public void wwwDoaminMergeTest() throws IOException, TemplateMergeException  {
		StringBuilder result =  merger.merge(WWW, ITEM_PAGE, "index", this.defaultContext);
		logger.info("--- merge text ---\r\n{}\r\n", result.toString());
		assertNotNull(result);
	}
	
	@Test
	public void cmsDoaminMergeTest() throws IOException, TemplateMergeException  {
		StringBuilder result =  merger.merge(CMS, ITEM_PAGE, "index", this.defaultContext);
		logger.info("--- merge text ---\r\n{}\r\n", result.toString());
		assertNotNull(result);
	}
	
}
