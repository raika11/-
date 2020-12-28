/**
 * msp-tps WebMvcConfiguration.java 2019. 11. 29. 오후 2:05:07 ssc
 */
package jmnet.moka.core.comment.config;

import java.util.Map;
import javax.sql.DataSource;
import jmnet.moka.core.common.MokaConstants;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.orm.jpa.EntityManagerFactoryBuilderCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateProperties;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateSettings;
import org.springframework.boot.autoconfigure.orm.jpa.JpaProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.persistenceunit.PersistenceUnitManager;
import org.springframework.orm.jpa.vendor.AbstractJpaVendorAdapter;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;

/**
 * <pre>
 *
 * 2019. 11. 29. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2019. 11. 29. 오후 2:05:07
 */
@Configuration
@EnableJpaRepositories(basePackages = "jmnet.moka.core.comment.mvc.**.repository", entityManagerFactoryRef = "commentEntityManagerFactory", transactionManagerRef = "commentJpaTransactionManager")
@PropertySource("classpath:comment.properties")
public class CommentJpaConfiguration {

    @Autowired
    @Qualifier("commentDataSource")
    private DataSource dataSource;

    @Bean
    @ConfigurationProperties(prefix = "comment.spring.jpa")
    public JpaProperties commentJpaProperties() {
        return new JpaProperties();
    }

    @Bean
    @ConfigurationProperties(prefix = "comment.spring.jpa.hibernate")
    public HibernateProperties commentHibernateProperties() {
        return new HibernateProperties();
    }

    @Primary
    @Bean
    public EntityManagerFactoryBuilder commentEntityManagerFactoryBuilder(ObjectProvider<PersistenceUnitManager> persistenceUnitManager,
            ObjectProvider<EntityManagerFactoryBuilderCustomizer> customizers,
            @Autowired @Qualifier("commentJpaProperties") JpaProperties jpaProperties) {
        AbstractJpaVendorAdapter jpaVendorAdapter = new HibernateJpaVendorAdapter();
        jpaVendorAdapter.setShowSql(jpaProperties.isShowSql());
        jpaVendorAdapter.setDatabase(jpaProperties.determineDatabase(this.dataSource));
        jpaVendorAdapter.setDatabasePlatform(jpaProperties.getDatabasePlatform());
        jpaVendorAdapter.setGenerateDdl(jpaProperties.isGenerateDdl());
        EntityManagerFactoryBuilder builder =
                new EntityManagerFactoryBuilder(jpaVendorAdapter, jpaProperties.getProperties(), persistenceUnitManager.getIfAvailable());
        customizers
                .orderedStream()
                .forEach((customizer) -> customizer.customize(builder));
        return builder;
    }

    @Qualifier
    @Bean(name = "commentEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean commentEntityManagerFactory(
            @Autowired @Qualifier("commentEntityManagerFactoryBuilder") EntityManagerFactoryBuilder builder,
            @Autowired @Qualifier("commentJpaProperties") JpaProperties jpaProperties,
            @Autowired @Qualifier("commentHibernateProperties") HibernateProperties hibernateProperties) {
        Map<String, Object> properties = hibernateProperties.determineHibernateProperties(jpaProperties.getProperties(), new HibernateSettings());
        return builder
                .dataSource(this.dataSource)
                .properties(properties)
                .packages("jmnet.moka.core.comment.mvc.**.entity")
                .persistenceUnit(MokaConstants.PERSISTANCE_UNIT_COMMENT)
                .build();
    }


    @Qualifier
    @Bean
    public PlatformTransactionManager commentJpaTransactionManager(
            @Autowired @Qualifier("commentEntityManagerFactory") LocalContainerEntityManagerFactoryBean entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory.getObject());
    }

}
