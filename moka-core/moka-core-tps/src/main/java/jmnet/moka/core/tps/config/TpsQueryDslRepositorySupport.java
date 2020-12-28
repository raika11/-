package jmnet.moka.core.tps.config;


import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import jmnet.moka.core.common.MokaConstants;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.stereotype.Repository;

@Repository
public class TpsQueryDslRepositorySupport extends QuerydslRepositorySupport {

    public TpsQueryDslRepositorySupport(Class<?> domainClass) {
        super(domainClass);
    }

    @PersistenceContext(unitName = MokaConstants.PERSISTANCE_UNIT_TPS)
    public void setEntityManager(EntityManager entityManager) {
        super.setEntityManager(entityManager);
    }

}
