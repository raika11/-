package jmnet.moka.core.dps.autoConfig;

import jmnet.moka.core.dps.db.session.DpsSqlSessionFactory;
import jmnet.moka.core.dps.db.session.JavaConfigSqlSessionFactory;
import jmnet.moka.core.dps.db.session.XmlConfigSqlSessionFactory;
import org.jasypt.encryption.StringEncryptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import java.io.IOException;

@Configuration
@PropertySource("classpath:dps-auto.properties")
public class DpsSqlSessionAutoConfiguration {

	private static final Logger logger = LoggerFactory.getLogger(DpsSqlSessionAutoConfiguration.class);

	@Value("${dps.config.base}")
	private String configBasePath;

    @Value("${dps.config.sys.base}")
    private String configSysBasePath;

	@Value("${dps.config.dataSource.xml}")
	private String dataSourcesXmlFileName;
	
	@Value("${dps.config.dataSource.properties}")
	private String dataSourcesPropertiesFileName;
	
	@Value("${dps.config.dataSource.xml.enable}")
	private boolean dataSourcesXmlEnable;
	
    @Value("${dps.config.mybatis.callSettersOnNulls}")
    private boolean callSettersOnNulls;

    private final StringEncryptor mokaEncryptor;

    @Autowired
    public DpsSqlSessionAutoConfiguration(StringEncryptor mokaEncryptor){
        this.mokaEncryptor = mokaEncryptor;
    }
	
	@Bean(destroyMethod="destory")
	public DpsSqlSessionFactory dpsSqlSessionFactory() throws IOException  {
		DpsSqlSessionFactory dpsSqlSessionFactory;
        if (this.dataSourcesXmlEnable) {
            logger.debug("SqlSesessionFactory created by XML Configuration");
            dpsSqlSessionFactory = new XmlConfigSqlSessionFactory();
            if (configSysBasePath != null && configSysBasePath.trim().length() > 0) {
                // 시스템 api를 위한 dataSource
                dpsSqlSessionFactory.load(configSysBasePath + "/**/" + dataSourcesXmlFileName);
            }
            // dps별 api를 위한 dataSource
            dpsSqlSessionFactory.load(configBasePath + "/**/" + dataSourcesXmlFileName);
        } else {
            dpsSqlSessionFactory = new JavaConfigSqlSessionFactory(this.callSettersOnNulls, mokaEncryptor);
            logger.debug("SqlSesessionFactory created by Java Configuration");
            if (configSysBasePath != null && configSysBasePath.trim().length() > 0) {
                // 시스템 api를 위한 dataSource
                dpsSqlSessionFactory
                        .load(configSysBasePath + "/**/" + dataSourcesPropertiesFileName);
            }
            // dps별 api를 위한 dataSource
            dpsSqlSessionFactory.load(configBasePath + "/**/" + dataSourcesPropertiesFileName);
        }
        return dpsSqlSessionFactory;
	}
}
