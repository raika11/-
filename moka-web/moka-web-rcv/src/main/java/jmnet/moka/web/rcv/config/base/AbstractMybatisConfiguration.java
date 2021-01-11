package jmnet.moka.web.rcv.config.base;

import com.zaxxer.hikari.HikariDataSource;
import java.beans.PropertyDescriptor;
import java.sql.SQLException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.sql.DataSource;
import org.apache.ibatis.mapping.DatabaseIdProvider;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.scripting.LanguageDriver;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.type.TypeHandler;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.boot.autoconfigure.ConfigurationCustomizer;
import org.mybatis.spring.boot.autoconfigure.MybatisProperties;
import org.mybatis.spring.boot.autoconfigure.SpringBootVFS;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.core.io.ResourceLoader;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.config.base
 * ClassName : AbstractMybatisConfiguration
 * Created : 2020-12-11 011 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-11 011 오후 5:39
 */
public abstract class AbstractMybatisConfiguration {
    protected DataSource getDataSource( DataSourceProperties dataSourceProperties ) {
        HikariDataSource dataSource = dataSourceProperties.initializeDataSourceBuilder().type(HikariDataSource.class).build();
        if (StringUtils.hasText(dataSourceProperties.getName())) {
            dataSource.setPoolName(dataSourceProperties.getName());
        }
        try {
            dataSource.getConnection().close();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        return dataSource;
    }

    @SuppressWarnings("rawtypes")
    protected SqlSessionFactory getSqlSessionFactory( DataSource dataSource, MybatisProperties properties,
            ResourceLoader resourceLoader, Interceptor[] interceptors, DatabaseIdProvider databaseIdProvider,
            TypeHandler[] typeHandlers, List<ConfigurationCustomizer> configurationCustomizers, @SuppressWarnings("unused") LanguageDriver[] languageDrivers )
            throws Exception{
        SqlSessionFactoryBean factory = new SqlSessionFactoryBean();
        factory.setDataSource(dataSource);
        factory.setVfs(SpringBootVFS.class);
        if (StringUtils.hasText(properties.getConfigLocation())) {
            factory.setConfigLocation(
                    resourceLoader.getResource(properties.getConfigLocation()));
        }
        applyConfiguration(factory, properties, configurationCustomizers);
        if (properties.getConfigurationProperties() != null) {
            factory.setConfigurationProperties(properties.getConfigurationProperties());
        }
        if (!ObjectUtils.isEmpty(interceptors)) {
            factory.setPlugins(interceptors);
        }
        if (databaseIdProvider != null) {
            factory.setDatabaseIdProvider(databaseIdProvider);
        }
        if (StringUtils.hasLength(properties.getTypeAliasesPackage())) {
            factory.setTypeAliasesPackage(properties.getTypeAliasesPackage());
        }
        if (properties.getTypeAliasesSuperType() != null) {
            factory.setTypeAliasesSuperType(properties.getTypeAliasesSuperType());
        }
        if (StringUtils.hasLength(properties.getTypeHandlersPackage())) {
            factory.setTypeHandlersPackage(properties.getTypeHandlersPackage());
        }
        if (!ObjectUtils.isEmpty(typeHandlers)) {
            factory.setTypeHandlers(typeHandlers);
        }
        if (!ObjectUtils.isEmpty(properties.resolveMapperLocations())) {
            factory.setMapperLocations(properties.resolveMapperLocations());
        }

        /*
        Set<String> factoryPropertyNames =
                Stream
                        .of(new BeanWrapperImpl(SqlSessionFactoryBean.class).getPropertyDescriptors())
                        .map(PropertyDescriptor::getName).collect(Collectors.toSet());
        // Class<? extends LanguageDriver> defaultLanguageDriver =
        // properties.getDefaultScriptingLanguageDriver();
        if (factoryPropertyNames.contains("scriptingLanguageDrivers")
                && !ObjectUtils.isEmpty(this.languageDrivers)) {
            // Need to mybatis-spring 2.0.2+
            // factory.setScriptingLanguageDrivers(this.languageDrivers);
            // if (defaultLanguageDriver == null && this.languageDrivers.length == 1) {
            // defaultLanguageDriver = this.languageDrivers[0].getClass();
            // }
        }
        if (factoryPropertyNames.contains("defaultScriptingLanguageDriver")) {
            // Need to mybatis-spring 2.0.2+
            // factory.setDefaultScriptingLanguageDriver(defaultLanguageDriver);
        }
        */
        return factory.getObject();
    }

    private void applyConfiguration(SqlSessionFactoryBean factory, MybatisProperties properties, List<ConfigurationCustomizer> configurationCustomizers) {
        org.apache.ibatis.session.Configuration configuration = properties.getConfiguration();
        if (configuration == null && !StringUtils.hasText(properties.getConfigLocation())) {
            configuration = new org.apache.ibatis.session.Configuration();
        }
        if (configuration != null && !CollectionUtils.isEmpty(configurationCustomizers)) {
            for (ConfigurationCustomizer customizer : configurationCustomizers) {
                customizer.customize(configuration);
            }
        }
        factory.setConfiguration(configuration);
    }
}
