/**
 * msp-tps WebMvcConfiguration.java 2019. 11. 29. 오후 2:05:07 ssc
 */
package jmnet.moka.core.tps.config;

import java.util.Map;
import javax.sql.DataSource;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.boot.autoconfigure.orm.jpa.EntityManagerFactoryBuilderCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
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
import jmnet.moka.core.common.MspConstants;

/**
 * <pre>
 * 
 * 2019. 11. 29. ssc 최초생성
 * </pre>
 * 
 * @since 2019. 11. 29. 오후 2:05:07
 * @author ssc
 */
@Configuration
@AutoConfigureBefore(HibernateJpaAutoConfiguration.class)
@EnableJpaRepositories(basePackages = "jmnet.moka.core.tps.mvc.**.repository",
        entityManagerFactoryRef = "tpsEntityManagerFactory",
        transactionManagerRef = "tpsJpaTransactionManager")
@PropertySource("classpath:tps-auto.properties")
public class TpsJpaConfiguration {

    @Autowired
    @Qualifier("tpsDataSource")
    private DataSource dataSource;

    @Primary
    @Bean
    @ConfigurationProperties(prefix = "tps.spring.jpa")
    public JpaProperties tpsJpaProperties() {
        return new JpaProperties();
    }

    @Primary
    @Bean
    @ConfigurationProperties(prefix = "tps.spring.jpa.hibernate")
    public HibernateProperties tpsHibernateProperties() {
        return new HibernateProperties();
    }

    @Primary
    @Bean
    public EntityManagerFactoryBuilder entityManagerFactoryBuilder(
            ObjectProvider<PersistenceUnitManager> persistenceUnitManager,
            ObjectProvider<EntityManagerFactoryBuilderCustomizer> customizers,
            @Autowired @Qualifier("tpsJpaProperties") JpaProperties jpaProperties) {
        AbstractJpaVendorAdapter jpaVendorAdapter = new HibernateJpaVendorAdapter();
        jpaVendorAdapter.setShowSql(jpaProperties.isShowSql());
        jpaVendorAdapter.setDatabase(jpaProperties.determineDatabase(this.dataSource));
        jpaVendorAdapter.setDatabasePlatform(jpaProperties.getDatabasePlatform());
        jpaVendorAdapter.setGenerateDdl(jpaProperties.isGenerateDdl());
        EntityManagerFactoryBuilder builder = new EntityManagerFactoryBuilder(jpaVendorAdapter,
                jpaProperties.getProperties(), persistenceUnitManager.getIfAvailable());
        customizers.orderedStream().forEach((customizer) -> customizer.customize(builder));
        return builder;
    }

    @Primary
    @Bean
    public LocalContainerEntityManagerFactoryBean tpsEntityManagerFactory(
            @Autowired @Qualifier("entityManagerFactoryBuilder") EntityManagerFactoryBuilder builder,
            @Autowired @Qualifier("tpsJpaProperties") JpaProperties jpaProperties,
            @Autowired @Qualifier("tpsHibernateProperties") HibernateProperties hibernateProperties) {
        Map<String, Object> properties = hibernateProperties.determineHibernateProperties(
                jpaProperties.getProperties(), new HibernateSettings());
        return builder.dataSource(this.dataSource).properties(properties)
                .packages("jmnet.moka.core.tps.mvc.**.entity")
                .persistenceUnit(MspConstants.PERSISTANCE_UNIT_TPS).build();
    }


    @Primary
    @Bean
    public PlatformTransactionManager tpsJpaTransactionManager(
            @Autowired @Qualifier("tpsEntityManagerFactory") LocalContainerEntityManagerFactoryBean entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory.getObject());
    }

}
