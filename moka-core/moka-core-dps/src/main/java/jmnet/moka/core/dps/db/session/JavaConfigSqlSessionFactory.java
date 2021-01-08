package jmnet.moka.core.dps.db.session;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import javax.sql.DataSource;
import jmnet.moka.core.common.util.ResourceMapper;
import org.apache.ibatis.builder.xml.XMLMapperBuilder;
import org.apache.ibatis.executor.ErrorContext;
import org.apache.ibatis.mapping.Environment;
import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.apache.ibatis.transaction.TransactionFactory;
import org.apache.ibatis.transaction.jdbc.JdbcTransactionFactory;
import org.jasypt.encryption.StringEncryptor;
import org.jasypt.properties.EncryptableProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourcePatternResolver;

/**
 * DataSource 설정
 */
public class JavaConfigSqlSessionFactory implements DpsSqlSessionFactory {
	private static final Logger logger = LoggerFactory.getLogger(JavaConfigSqlSessionFactory.class);
	private final HashMap<String, SqlSessionFactory> sqlSessionFactoryMap;
	private ResourcePatternResolver patternResolver = ResourceMapper.getResouerceResolver();
    private boolean callSettersOnNulls;
	private StringEncryptor mokaEncryptor;
	
    public JavaConfigSqlSessionFactory(boolean callSettersOnNulls, StringEncryptor mokaEncryptor) throws IOException {
        this.callSettersOnNulls = callSettersOnNulls;
        this.mokaEncryptor = mokaEncryptor;
		org.apache.ibatis.logging.LogFactory.useSlf4jLogging();
		this.sqlSessionFactoryMap = new HashMap<String, SqlSessionFactory>(16);
	}
	
    public void load(String configLocations) throws IOException {
        Resource[] resources = patternResolver.getResources(configLocations);
        for ( Resource resource : resources) {
            logger.info("Resource: {}", resource.getURL());
        	String path = resource.getURL().toString();
        	String[] splits = path.split("/");
        	String dataSourceName = "";
        	if ( splits.length > 2) {
        		dataSourceName = splits[splits.length-2];
				EncryptableProperties encryptProperties = new EncryptableProperties(this.mokaEncryptor);
				encryptProperties.load(resource.getInputStream());

				// get() 시점에 복호화되므로 복호화된 값을 넣는다.
				for ( Map.Entry<Object,Object> entry: encryptProperties.entrySet()) {
					encryptProperties.put(entry.getKey(), encryptProperties.getProperty((String)entry.getKey()));
				}
//        		HikariConfig config = new HikariConfig(resource.getFile().getCanonicalPath());
        		HikariConfig config = new HikariConfig(encryptProperties);
        		config.setPoolName(dataSourceName);
        		HikariDataSource dataSource = new HikariDataSource(config);
            	TransactionFactory transactionFactory = new JdbcTransactionFactory();
            	Environment environment = new Environment("development", transactionFactory, dataSource);
            	Configuration configuration = new Configuration(environment);
                configuration.setCallSettersOnNulls(this.callSettersOnNulls);
            	setMappers(configuration, path);
            	ErrorContext.instance().reset();
            	SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(configuration);
        		add(dataSourceName, sqlSessionFactory);
        	} 
        	
        }
	}
	
	private void setMappers(Configuration configuration, String dataResourcePath) throws IOException {
		String mapperLocations = 
				dataResourcePath.substring(0,
						dataResourcePath.lastIndexOf('/'))+"/sqlMapper*.xml";
    	Resource[] mapperResources = patternResolver.getResources(mapperLocations);
    	for ( Resource mapperResource : mapperResources) {
    		XMLMapperBuilder xmlMapperBuilder = new XMLMapperBuilder(mapperResource.getInputStream(),
    				configuration, mapperResource.getURL().getPath(), configuration.getSqlFragments());
    		xmlMapperBuilder.parse();
    	}
	}
	
	@Override
	public void add(String name, SqlSessionFactory sqlSessionFactory) {
		this.sqlSessionFactoryMap.put(name, sqlSessionFactory);
	}
	
	@Override
	public SqlSession getSqlSession(String dsName) {
		SqlSessionFactory sqlSessionFactory = this.sqlSessionFactoryMap.get(dsName);
		return sqlSessionFactory.openSession();
	}

	@Override
	public void destory() {
		for ( SqlSessionFactory factory : sqlSessionFactoryMap.values() ) {
			
			DataSource ds = factory.getConfiguration().getEnvironment().getDataSource();
			HikariDataSource hikariDs = ((HikariDataSource)ds);
			hikariDs.close();
			logger.debug("SqlSessionFactory's DataSource is closed: {}",hikariDs.getPoolName());
			
		}
	}
}
