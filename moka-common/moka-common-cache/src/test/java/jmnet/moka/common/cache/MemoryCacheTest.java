package jmnet.moka.common.cache;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;

import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.xml.sax.SAXException;
import jmnet.moka.common.cache.CacheManager;

public class MemoryCacheTest {
	private static final Logger logger = LoggerFactory.getLogger(MemoryCacheTest.class);
	private File xmlFile;
	private CacheManager cacheManager;

	@Before
	public void setUp() throws IOException, ParserConfigurationException, SAXException, XPathExpressionException, ClassNotFoundException, NoSuchMethodException, SecurityException, InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException {
		ResourcePatternResolver resourcePatternResolver = new PathMatchingResourcePatternResolver();
		Resource xmlFileResource = resourcePatternResolver.getResource("classpath:cache.xml");
		this.xmlFile = xmlFileResource.getFile();
		this.cacheManager = new CacheManager(this.xmlFile);
	}
	
	@Test
	public void expireTest() throws ParserConfigurationException, SAXException, IOException, XPathExpressionException, InterruptedException {
		long start = System.currentTimeMillis();
		this.cacheManager.set( "test", "test_1", "init");
		while(true) {
			String cached = this.cacheManager.get("test", "test_1");
			if ( cached == null) {
				logger.debug("expired : {} {}",System.currentTimeMillis()-start, cached);
				break;
			}
			logger.debug("cached : {} {}",System.currentTimeMillis()-start, cached);
			Thread.sleep(500);
		}
	}
	
	@Test
	public void multiThreadTest() throws ParserConfigurationException, SAXException, IOException, XPathExpressionException, InterruptedException {
		long start = System.currentTimeMillis();
		this.cacheManager.set( "test", "test_1", "init");
		CacheManager cm = this.cacheManager;
		for ( int i=0; i < 5; i++) {
			final int sleepTime = i*1000;
			final int index = i;
			(new Thread(new Runnable(){
				   public void run(){
				       try {
						Thread.sleep(sleepTime);
						cm.set("test", "test_1", ""+(index+1));
						} catch (InterruptedException e) {
							e.printStackTrace();
						}
				   }
				})).start();
		}
		while(true) {
			String cached = this.cacheManager.get("test", "test_1");
			if ( cached == null) {
				logger.debug("expired : {} {}",System.currentTimeMillis()-start, cached);
				break;
			}
			logger.debug("cached : {} {}",System.currentTimeMillis()-start, cached);
			Thread.sleep(500);
		}
	}
	
}
