package jmnet.moka.core.tps.mvc.editform.repository;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import java.util.Objects;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.editform.entity.EditForm;
import jmnet.moka.core.tps.mvc.editform.entity.QEditForm;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.jpa.repository.EntityGraph;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.editform.repository
 * ClassName : EditFormRepositorySupportImpl
 * Created : 2021-01-19 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-19 14:12
 */
public class EditFormRepositorySupportImpl extends TpsQueryDslRepositorySupport implements EditFormRepositorySupport {

    public EditFormRepositorySupportImpl() {
        super(EditForm.class);
    }

    @Override
    @EntityGraph(attributePaths = {"editFormParts"}, type = EntityGraph.EntityGraphType.LOAD)
    public Page<EditForm> findAllEditForm(SearchDTO searchDTO) {
        QEditForm qEditForm = QEditForm.editForm;
        JPQLQuery<EditForm> query = from(qEditForm).distinct();

        // 검색어
        if (McpString.isNotEmpty(searchDTO.getKeyword())) {
            query.where(qEditForm.formName.contains(searchDTO.getKeyword()));
        }

        if (McpString.isYes(searchDTO.getUseTotal())) {
            query = Objects
                    .requireNonNull(getQuerydsl())
                    .applyPagination(searchDTO.getPageable(), query);
        }

        QueryResults<EditForm> list = query
                .leftJoin(qEditForm.editFormParts)
                .fetchJoin()
                .fetchResults();

        return new PageImpl<>(list.getResults(), searchDTO.getPageable(), list.getTotal());
    }
}
