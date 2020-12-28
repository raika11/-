package jmnet.moka.core.comment.config;


import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import jmnet.moka.core.common.MokaConstants;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.stereotype.Repository;

@Repository
public class CommentQueryDslRepositorySupport extends QuerydslRepositorySupport {

    public CommentQueryDslRepositorySupport(Class<?> domainClass) {
        super(domainClass);
    }

    @PersistenceContext(unitName = MokaConstants.PERSISTANCE_UNIT_COMMENT)
    public void setEntityManager(@Qualifier("commentEntityManager") EntityManager commentEntityManager) {
        super.setEntityManager(commentEntityManager);
    }

}
