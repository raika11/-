package jmnet.moka.core.dps.db.session;

import java.io.IOException;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

public interface DpsSqlSessionFactory {

    public void load(String configLocations) throws IOException;

	public void add(String name, SqlSessionFactory sqlSessionFactory);
	
	public SqlSession getSqlSession(String dsName) ;
	
	public void destory();
}
