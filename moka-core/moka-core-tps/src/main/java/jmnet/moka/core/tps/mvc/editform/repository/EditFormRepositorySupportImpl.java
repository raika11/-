package jmnet.moka.core.tps.mvc.editform.repository;

import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.editform.entity.EditForm;
import jmnet.moka.core.tps.mvc.editform.entity.QEditForm;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.editform.repository
 * ClassName : EditFormRepositorySupportImpl
 * Created : 2020-10-23 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-23 09:38
 */
public class EditFormRepositorySupportImpl extends QuerydslRepositorySupport implements EditFormRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public EditFormRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(EditForm.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Optional<EditForm> findEditForm(EditForm editForm) {
        QEditForm qEditForm = QEditForm.editForm;

        JPQLQuery<EditForm> query = from(qEditForm);
        query.where(qEditForm.channelId
                .toUpperCase()
                .contains(editForm
                        .getChannelId()
                        .toUpperCase()));
        query.where(qEditForm.partId
                .toUpperCase()
                .contains(editForm
                        .getPartId()
                        .toUpperCase()));

        return Optional.of(query.fetchOne());
    }

}
