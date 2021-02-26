/**
 * msp-tps QuerydslConfiguration.java 2019. 11. 29. 오후 3:10:11 ssc
 */
package jmnet.moka.core.mail.config;

import com.querydsl.jpa.impl.JPAQueryFactory;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import jmnet.moka.core.common.MokaConstants;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

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
public class MailQuerydslConfiguration {
    @PersistenceContext(unitName = MokaConstants.PERSISTANCE_UNIT_MAIL)
    private EntityManager mailEntityManager;

    @Bean
    public JPAQueryFactory mailJpaQueryFactory() {
        return new JPAQueryFactory(mailEntityManager);
    }
}
