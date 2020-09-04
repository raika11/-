package jmnet.moka.common.cache.autoConfig;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.xml.sax.SAXException;
import jmnet.moka.common.cache.CacheManager;

@Configuration
@PropertySource("classpath:cache-auto.properties")

public class CacheAutoConfiguration {
	@Value("${mcp.ext.cache.xml}")
	private String cacheXml;
	
	@Bean(destroyMethod="shutdown")
	@ConditionalOnProperty(name ="mcp.ext.cache.enable", havingValue="true")
	public CacheManager cacheManager() throws IOException, XPathExpressionException, ClassNotFoundException, NoSuchMethodException, SecurityException, InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, ParserConfigurationException, SAXException {
		ResourcePatternResolver resourcePatternResolver = new PathMatchingResourcePatternResolver();
		Resource xmlFileResource = resourcePatternResolver.getResource(cacheXml);
        CacheManager cacheManager = new CacheManager(xmlFileResource.getInputStream());
        return cacheManager;
	}
	
}
