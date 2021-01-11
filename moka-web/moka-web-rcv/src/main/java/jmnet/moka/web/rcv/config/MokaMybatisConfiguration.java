package jmnet.moka.web.rcv.config;

import java.util.List;
import javax.sql.DataSource;
import jmnet.moka.web.rcv.config.base.AbstractMybatisConfiguration;
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
import org.springframework.boot.autoconfigure.AutoConfigureAfter;
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
@AutoConfigureAfter(IdbMybatisConfiguration.class)
@MapperScan(basePackages = "jmnet.moka.web.rcv.mapper.moka")
public class MokaMybatisConfiguration extends AbstractMybatisConfiguration {
    @Primary
    @Bean
    @ConfigurationProperties(prefix = "moka.spring.datasource")
    public DataSourceProperties mokaDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Primary
    @Bean("mokaDataSource")
    public DataSource mokaDataSource() {
        return getDataSource ( mokaDataSourceProperties() );
    }

    @Primary
    @Bean("mokaMybatisProperties")
    @ConfigurationProperties(prefix = "moka.mybatis")
    public MybatisProperties mokaMybatisProperties() {
        return new MybatisProperties();
    }

    private final Interceptor[] interceptors;
    @SuppressWarnings("rawtypes")
    private final TypeHandler[] typeHandlers;
    private final LanguageDriver[] languageDrivers;
    private final ResourceLoader resourceLoader;
    private final DatabaseIdProvider databaseIdProvider;
    private final List<ConfigurationCustomizer> configurationCustomizers;

    public MokaMybatisConfiguration(ObjectProvider<Interceptor[]> interceptorsProvider,
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

    @Primary
    @Bean("mokaSqlSessionFactory")
    public SqlSessionFactory mokaSqlSessionFactory(
            @Autowired @Qualifier("mokaMybatisProperties") MybatisProperties properties)
            throws Exception {
        return getSqlSessionFactory( mokaDataSource(), properties, this.resourceLoader, this.interceptors, this.databaseIdProvider,
                this.typeHandlers, this.configurationCustomizers, this.languageDrivers );
    }

    @Primary
    @Bean("mokaSqlSessionTemplate")
    public SqlSessionTemplate mokaSqlSessionTemplate(
            @Autowired @Qualifier("mokaSqlSessionFactory") SqlSessionFactory sqlSessionFactory,
            @Autowired @Qualifier("mokaMybatisProperties") MybatisProperties properties) {
        ExecutorType executorType = properties.getExecutorType();
        if (executorType != null) {
            return new SqlSessionTemplate(sqlSessionFactory, executorType);
        } else {
            return new SqlSessionTemplate(sqlSessionFactory);
        }
    }

    @Primary
    @Bean("mokaMybatisTransactionManager")
    public PlatformTransactionManager mokaMybatisTransactionManager() {
        return new DataSourceTransactionManager(this.mokaDataSource());
    }
}
