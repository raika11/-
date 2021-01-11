package jmnet.moka.web.rcv.config;

import com.zaxxer.hikari.HikariDataSource;
import java.beans.PropertyDescriptor;
import java.sql.SQLException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.sql.DataSource;
import jmnet.moka.web.rcv.config.base.AbstractMybatisConfiguration;
import org.apache.ibatis.mapping.DatabaseIdProvider;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.scripting.LanguageDriver;
import org.apache.ibatis.session.ExecutorType;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.type.TypeHandler;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.mybatis.spring.boot.autoconfigure.ConfigurationCustomizer;
import org.mybatis.spring.boot.autoconfigure.MybatisAutoConfiguration;
import org.mybatis.spring.boot.autoconfigure.MybatisProperties;
import org.mybatis.spring.boot.autoconfigure.SpringBootVFS;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.ResourceLoader;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.config
 * ClassName : MokaDBAutoConfiguration
 * Created : 2020-12-11 011 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-11 011 오후 1:58
 */
@Configuration
@AutoConfigureBefore({DataSourceAutoConfiguration.class, MybatisAutoConfiguration.class})
@MapperScan(value = "jmnet.moka.web.rcv.mapper.idb", sqlSessionFactoryRef = "idbSqlSessionFactory")
public class IdbMybatisConfiguration extends AbstractMybatisConfiguration {
    @Bean
    @ConfigurationProperties(prefix = "idb.spring.datasource")
    public DataSourceProperties idbDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean("idbDataSource")
    public DataSource idbDataSource() {
        return getDataSource ( idbDataSourceProperties() );
    }

    @Bean("idbMybatisProperties")
    @ConfigurationProperties(prefix = "idb.mybatis")
    public MybatisProperties idbMybatisProperties() {
        return new MybatisProperties();
    }

    private final Interceptor[] interceptors;
    @SuppressWarnings("rawtypes")
    private final TypeHandler[] typeHandlers;
    private final LanguageDriver[] languageDrivers;
    private final ResourceLoader resourceLoader;
    private final DatabaseIdProvider databaseIdProvider;
    private final List<ConfigurationCustomizer> configurationCustomizers;

    public IdbMybatisConfiguration(ObjectProvider<Interceptor[]> interceptorsProvider,
            @SuppressWarnings("rawtypes") ObjectProvider<TypeHandler[]> typeHandlersProvider,
            ObjectProvider<LanguageDriver[]> languageDriversProvider, ResourceLoader resourceLoader,
            ObjectProvider<DatabaseIdProvider> databaseIdProvider,
            ObjectProvider<List<ConfigurationCustomizer>> configurationCustomizersProvider) {
        this.interceptors = interceptorsProvider.getIfAvailable();
        this.typeHandlers = typeHandlersProvider.getIfAvailable();
        this.languageDrivers = languageDriversProvider.getIfAvailable();
        this.resourceLoader = resourceLoader;
        this.databaseIdProvider = databaseIdProvider.getIfAvailable();
        this.configurationCustomizers = configurationCustomizersProvider.getIfAvailable();
    }

    @Bean("idbSqlSessionFactory")
    public SqlSessionFactory idbSqlSessionFactory(
            @Autowired @Qualifier("idbMybatisProperties") MybatisProperties properties)
            throws Exception {
        return getSqlSessionFactory( idbDataSource(), properties, this.resourceLoader, this.interceptors, this.databaseIdProvider,
                this.typeHandlers, this.configurationCustomizers, this.languageDrivers );
    }

    @Bean("idbSqlSessionTemplate")
    public SqlSessionTemplate idbSqlSessionTemplate(
            @Autowired @Qualifier("idbSqlSessionFactory") SqlSessionFactory sqlSessionFactory,
            @Autowired @Qualifier("idbMybatisProperties") MybatisProperties properties) {
        ExecutorType executorType = properties.getExecutorType();
        if (executorType != null) {
            return new SqlSessionTemplate(sqlSessionFactory, executorType);
        } else {
            return new SqlSessionTemplate(sqlSessionFactory);
        }
    }

    @Bean("idbMybatisTransactionManager")
    public PlatformTransactionManager idbMybatisTransactionManager() {
        return new DataSourceTransactionManager(this.idbDataSource());
    }
}
