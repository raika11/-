package jmnet.moka.core.dps.db.session;

import com.zaxxer.hikari.HikariDataSource;
import java.io.IOException;
import java.util.HashMap;
import javax.sql.DataSource;
import jmnet.moka.core.common.util.ResourceMapper;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourcePatternResolver;

/**
 * DataSource 설정
 */
public class XmlConfigSqlSessionFactory implements DpsSqlSessionFactory {
	private static final Logger logger = LoggerFactory.getLogger(XmlConfigSqlSessionFactory.class);
	private HashMap<String, SqlSessionFactory> sqlSessionFactoryMap;
	
    public XmlConfigSqlSessionFactory() throws IOException {
		this.sqlSessionFactoryMap = new HashMap<String, SqlSessionFactory>(16);
	}
	
    public void load(String configLocations) throws IOException {
		ResourcePatternResolver patternResolver = ResourceMapper.getResouerceResolver();
        Resource[] resources = patternResolver.getResources(configLocations);
        for ( Resource resource : resources) {
            logger.info("Resource: {}", resource.getURL());
        	String path = resource.getURL().getPath();
        	String[] splits = path.split("/");
        	String dataSourceName = "";
        	if ( splits.length > 2) {
        		dataSourceName = splits[splits.length-2];
        		SqlSessionFactory sqlSessionFactory =
        				  new SqlSessionFactoryBuilder().build(resource.getInputStream());
        		add(dataSourceName, sqlSessionFactory);
        	} 
        }
	}
	
	@Override
	public void add(String name, SqlSessionFactory sqlSessionFactory) {
		this.sqlSessionFactoryMap.put(name, sqlSessionFactory);
	}
	
	@Override
	public SqlSession getSqlSession(String dsName) {
		SqlSessionFactory sqlSessionFactory =this.sqlSessionFactoryMap.get(dsName);
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
