package jmnet.moka.core.mail.config;


import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import jmnet.moka.core.common.MokaConstants;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.stereotype.Repository;

@Repository
public class MailQueryDslRepositorySupport extends QuerydslRepositorySupport {

    public MailQueryDslRepositorySupport(Class<?> domainClass) {
        super(domainClass);
    }

    @PersistenceContext(unitName = MokaConstants.PERSISTANCE_UNIT_MAIL)
    public void setEntityManager(@Qualifier("mailEntityManager") EntityManager mailEntityManager) {
        super.setEntityManager(mailEntityManager);
    }

}
