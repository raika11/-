package jmnet.moka.core.dps.db.session;

import java.io.IOException;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

public interface DpsSqlSessionFactory {

    void load(String configLocations) throws IOException;

	void add(String name, SqlSessionFactory sqlSessionFactory);
	
	SqlSession getSqlSession(String dsName) ;
	
	void destory();
}
