package jmnet.moka.core.tps.mvc.editform.repository;

import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.editform.entity.EditForm;
import jmnet.moka.core.tps.mvc.editform.entity.EditFormPart;
import jmnet.moka.core.tps.mvc.editform.entity.QEditFormPart;
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
public class EditFormPartRepositorySupportImpl extends QuerydslRepositorySupport implements EditFormPartRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public EditFormPartRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(EditForm.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Optional<EditFormPart> findEditFormPart(EditFormPart editFormPart) {
        QEditFormPart qEditFormPart = QEditFormPart.editFormPart;

        JPQLQuery<EditFormPart> query = from(qEditFormPart);
        query.where(qEditFormPart.formSeq.eq(editFormPart.getFormSeq()));
        query.where(qEditFormPart.partId
                .toUpperCase()
                .contains(editFormPart
                        .getPartId()
                        .toUpperCase()));

        return Optional.ofNullable(query.fetchFirst());
    }

}
