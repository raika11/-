package jmnet.moka.core.tps.mvc.editform.repository;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.Optional;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.editform.dto.EditFormPartSearchDTO;
import jmnet.moka.core.tps.mvc.editform.entity.EditFormPart;
import jmnet.moka.core.tps.mvc.editform.entity.QEditFormPart;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
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
        super(EditFormPart.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<EditFormPart> findAll(EditFormPartSearchDTO searchDTO) {
        QEditFormPart qPart = QEditFormPart.editFormPart;

        JPQLQuery<EditFormPart> query = from(qPart);

        if (McpString.isNotEmpty(searchDTO.getKeyword())) {

            if (TpsConstants.SEARCH_TYPE_ALL.equals(searchDTO.getSearchType())) {
                query.where(qPart.partTitle
                        .contains(searchDTO.getKeyword())
                        .or(qPart.partId
                                        .contains(searchDTO.getKeyword())
                                        .or(qPart.editForm.formId.contains(searchDTO.getKeyword()))
                                        .or(qPart.editForm.formName.contains(searchDTO.getKeyword()))
                                /*
                                .or(qPart.editForm.formSeq.like(searchDTO.getKeyword() + "%"))
                                .or(qPart.partSeq.like(searchDTO.getKeyword() + "%")
                                 )*/));

            } else {
                if (qPart.partId
                        .getMetadata()
                        .getName()
                        .equals(searchDTO.getSearchType())) {
                    query.where(qPart.partId.contains(searchDTO.getKeyword()));
                } else if (qPart.partTitle
                        .getMetadata()
                        .getName()
                        .equals(searchDTO.getSearchType())) {
                    query.where(qPart.partTitle.contains(searchDTO.getKeyword()));
                } else if (qPart.editForm.formId
                        .getMetadata()
                        .getName()
                        .equals(searchDTO.getSearchType())) {
                    query.where(qPart.editForm.formId.contains(searchDTO.getKeyword()));
                } else if (qPart.editForm.formName
                        .getMetadata()
                        .getName()
                        .equals(searchDTO.getSearchType())) {
                    query.where(qPart.editForm.formName.contains(searchDTO.getKeyword()));
                    /*
                } else if (qPart.editForm.formSeq
                        .getMetadata()
                        .getName()
                        .equals(searchDTO.getSearchType())) {
                    query.where(qPart.editForm.formSeq.like("%" + searchDTO.getKeyword() + "%"));
                } else if (qPart.partSeq
                        .getMetadata()
                        .getName()
                        .equals(searchDTO.getSearchType())) {
                    query.where(qPart.partSeq.like("%" + searchDTO.getKeyword() + "%"));
                     */
                } else {
                    // 검색조건 없음
                }
            }
        }

        if (McpString.isNotEmpty(searchDTO.getFormSeq())) {
            query.where(qPart.formSeq.eq(searchDTO.getFormSeq()));
        }

        if (McpString.isNotEmpty(searchDTO.getPartSeq())) {
            query.where(qPart.partSeq.eq(searchDTO.getPartSeq()));
        }
        
        Pageable pageable = searchDTO.getPageable();
        if (McpString.isYes(searchDTO.getUseTotal())) {
            query = getQuerydsl().applyPagination(pageable, query);
        }

        QueryResults<EditFormPart> list = query.fetchResults();

        return new PageImpl<EditFormPart>(list.getResults(), pageable, list.getTotal());
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
