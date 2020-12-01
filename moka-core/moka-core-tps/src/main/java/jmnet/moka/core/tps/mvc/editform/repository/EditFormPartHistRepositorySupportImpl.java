package jmnet.moka.core.tps.mvc.editform.repository;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.mvc.editform.dto.EditFormPartHistSearchDTO;
import jmnet.moka.core.tps.mvc.editform.entity.EditFormPartHist;
import jmnet.moka.core.tps.mvc.editform.entity.QEditFormPartHist;
import jmnet.moka.core.tps.mvc.member.entity.QMemberInfo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.editform.repository
 * ClassName : EditFormPartHistRepositorySupportImpl
 * Created : 2020-11-23 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-23 13:28
 */
public class EditFormPartHistRepositorySupportImpl extends QuerydslRepositorySupport implements EditFormPartHistRepositorySupport {

    public EditFormPartHistRepositorySupportImpl() {
        super(EditFormPartHist.class);
    }

    @Override
    public Page<EditFormPartHist> findAll(EditFormPartHistSearchDTO searchDTO) {
        QEditFormPartHist qPartHist = QEditFormPartHist.editFormPartHist;
        QMemberInfo qMember = QMemberInfo.memberInfo;

        JPQLQuery<EditFormPartHist> query = from(qPartHist);
        if (McpString.isNotEmpty(searchDTO.getPartSeq())) {
            query.where(qPartHist.partSeq.eq(searchDTO.getPartSeq()));
        }
        if (McpString.isNotEmpty(searchDTO.getRegDt())) {
            query.where(qPartHist.regDt.between(searchDTO.getRegDt(), McpDate.datePlus(searchDTO.getRegDt(), 1)));
        }
        Pageable pageable = searchDTO.getPageable();
        if (McpString.isYes(searchDTO.getUseTotal())) {
            query = getQuerydsl().applyPagination(pageable, query);
        }

        QueryResults<EditFormPartHist> list = query
                .leftJoin(qPartHist.regMember, qMember)
                .fetchJoin()
                .fetchResults();

        return new PageImpl<EditFormPartHist>(list.getResults(), pageable, list.getTotal());
    }
}
