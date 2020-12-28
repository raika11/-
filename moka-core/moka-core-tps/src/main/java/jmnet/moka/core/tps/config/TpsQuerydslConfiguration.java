/**
 * msp-tps QuerydslConfiguration.java 2019. 11. 29. 오후 3:10:11 ssc
 */
package jmnet.moka.core.tps.config;

import com.querydsl.jpa.impl.JPAQueryFactory;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import jmnet.moka.core.common.MokaConstants;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

/**
 * <pre>
 *
 * 2019. 11. 29. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2019. 11. 29. 오후 3:10:11
 */
@Configuration
public class TpsQuerydslConfiguration {

    @PersistenceContext(unitName = MokaConstants.PERSISTANCE_UNIT_TPS)
    private EntityManager tpsEntityManager;

    @Primary
    @Bean
    public JPAQueryFactory tpsJpaQueryFactory() {
        return new JPAQueryFactory(tpsEntityManager);
    }
}
