package jmnet.moka.common.proxy.autoConfig;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import jmnet.moka.common.proxy.file.FileProxy;

@Configuration
@Import(ProxyCommonConfiguration.class)
@PropertySource("classpath:file-proxy-auto.properties")
public class FileProxyConfiguration {
	
	@Value("#{timeHumanizer.parse('${fileProxy.cacheTime}', 60*1000)}")  
	private int fileCacheTime;
	
	@Value("#{timeHumanizer.parse('${fileProxy.GCTime}', 10*60*1000)}")
	private int fileGCTime;
			
	@Bean
	public FileProxy fileProxy()  {
		return new FileProxy(fileCacheTime, fileGCTime);
	}
}
