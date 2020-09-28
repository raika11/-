/**
* msp-tps
* QuerydslConfiguration.java
* 2019. 11. 29. 오후 3:10:11
* ssc
*/
package jmnet.moka.core.tps.config;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.core.common.MokaConstants;

/**<pre>
 * 
 * 2019. 11. 29. ssc 최초생성
 * </pre>
 * @since 2019. 11. 29. 오후 3:10:11
 * @author ssc
 */
@Configuration
public class TpsQuerydslConfiguration {
    @PersistenceContext(unitName = MokaConstants.PERSISTANCE_UNIT_TPS)
    private EntityManager entityManager;
	
    @Bean
    public JPAQueryFactory tpsJpaQueryFactory() {
        return new JPAQueryFactory(entityManager);
    }
}
