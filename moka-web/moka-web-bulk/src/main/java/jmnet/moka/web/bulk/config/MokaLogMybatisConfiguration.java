package jmnet.moka.web.bulk.config;

import java.util.List;
import javax.sql.DataSource;
import jmnet.moka.web.bulk.config.base.AbstractMybatisConfiguration;
import org.apache.ibatis.mapping.DatabaseIdProvider;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.scripting.LanguageDriver;
import org.apache.ibatis.session.ExecutorType;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.type.TypeHandler;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.mybatis.spring.boot.autoconfigure.ConfigurationCustomizer;
import org.mybatis.spring.boot.autoconfigure.MybatisAutoConfiguration;
import org.mybatis.spring.boot.autoconfigure.MybatisProperties;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ResourceLoader;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.config
 * ClassName : MokaDBAutoConfiguration
 * Created : 2020-12-11 011 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-11 011 오후 1:58
 */
@Configuration
@AutoConfigureBefore({DataSourceAutoConfiguration.class, MybatisAutoConfiguration.class})
@MapperScan(value = "jmnet.moka.web.bulk.mapper.mokalog", sqlSessionFactoryRef = "mokalogSqlSessionFactory")
public class MokaLogMybatisConfiguration extends AbstractMybatisConfiguration {
    @Bean
    @ConfigurationProperties(prefix = "mokalog.spring.datasource")
    public DataSourceProperties mokalogDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean("mokalogDataSource")
    public DataSource mokalogDataSource() {
        return getDataSource ( mokalogDataSourceProperties() );
    }

    @Bean("mokalogMybatisProperties")
    @ConfigurationProperties(prefix = "mokalog.mybatis")
    public MybatisProperties mokalogMybatisProperties() {
        return new MybatisProperties();
    }

    private final Interceptor[] interceptors;
    @SuppressWarnings("rawtypes")
    private final TypeHandler[] typeHandlers;
    private final LanguageDriver[] languageDrivers;
    private final ResourceLoader resourceLoader;
    private final DatabaseIdProvider databaseIdProvider;
    private final List<ConfigurationCustomizer> configurationCustomizers;

    public MokaLogMybatisConfiguration(ObjectProvider<Interceptor[]> interceptorsProvider,
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

    @Bean("mokalogSqlSessionFactory")
    public SqlSessionFactory mokalogSqlSessionFactory(
            @Autowired @Qualifier("mokalogMybatisProperties") MybatisProperties properties)
            throws Exception {
        return getSqlSessionFactory( mokalogDataSource(), properties, this.resourceLoader, this.interceptors, this.databaseIdProvider,
                this.typeHandlers, this.configurationCustomizers, this.languageDrivers );
    }

    @Bean("mokalogSqlSessionTemplate")
    public SqlSessionTemplate mokalogSqlSessionTemplate(
            @Autowired @Qualifier("mokalogSqlSessionFactory") SqlSessionFactory sqlSessionFactory,
            @Autowired @Qualifier("mokalogMybatisProperties") MybatisProperties properties) {
        ExecutorType executorType = properties.getExecutorType();
        if (executorType != null) {
            return new SqlSessionTemplate(sqlSessionFactory, executorType);
        } else {
            return new SqlSessionTemplate(sqlSessionFactory);
        }
    }

    @Bean("mokalogMybatisTransactionManager")
    public PlatformTransactionManager mokalogMybatisTransactionManager() {
        return new DataSourceTransactionManager(this.mokalogDataSource());
    }
}
