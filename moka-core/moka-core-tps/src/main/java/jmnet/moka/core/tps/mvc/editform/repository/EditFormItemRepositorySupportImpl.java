package jmnet.moka.core.tps.mvc.editform.repository;

import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.editform.entity.EditForm;
import jmnet.moka.core.tps.mvc.editform.entity.EditFormItem;
import jmnet.moka.core.tps.mvc.editform.entity.QEditFormItem;
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
public class EditFormItemRepositorySupportImpl extends QuerydslRepositorySupport implements EditFormItemRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public EditFormItemRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(EditForm.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Optional<EditFormItem> findEditFormItem(EditFormItem editFormItem) {
        QEditFormItem qEditFormItem = QEditFormItem.editFormItem;

        JPQLQuery<EditFormItem> query = from(qEditFormItem);
        query.where(qEditFormItem.formSeq.eq(editFormItem.getFormSeq()));
        query.where(qEditFormItem.itemId
                .toUpperCase()
                .contains(editFormItem
                        .getItemId()
                        .toUpperCase()));

        return Optional.ofNullable(query.fetchFirst());
    }

}
