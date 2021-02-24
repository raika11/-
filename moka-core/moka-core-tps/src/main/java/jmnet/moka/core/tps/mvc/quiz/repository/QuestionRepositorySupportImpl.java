package jmnet.moka.core.tps.mvc.quiz.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.JPQLQuery;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.quiz.entity.QQuestion;
import jmnet.moka.core.tps.mvc.quiz.entity.QQuizChoice;
import jmnet.moka.core.tps.mvc.quiz.entity.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.quiz.repository
 * ClassName : QuestionRepositorySupportImpl
 * Created : 2021-01-29 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-29 17:07
 */
public class QuestionRepositorySupportImpl extends TpsQueryDslRepositorySupport implements QuestionRepositorySupport {

    public QuestionRepositorySupportImpl() {
        super(Question.class);
    }


    @Override
    public Page<Question> findAllQuestion(SearchDTO search) {
        QQuestion qQuestion = QQuestion.question;
        QQuizChoice qQuizChoice = QQuizChoice.quizChoice;
        JPQLQuery<Question> query = from(qQuestion);


        if (McpString.isNotEmpty(search.getKeyword())) {
            String keyword = search
                    .getKeyword()
                    .toUpperCase();
            if (search
                    .getSearchType()
                    .equals(TpsConstants.SEARCH_TYPE_ALL)) {
                query.where(qQuestion.title
                        .toUpperCase()
                        .contains(keyword)
                        .or(qQuestion.questionSeq.in(JPAExpressions
                                .selectFrom(qQuizChoice)
                                .select(qQuizChoice.id.questionSeq)
                                .where(qQuizChoice.title
                                        .toUpperCase()
                                        .contains(search.getKeyword())))));
            } else if (qQuestion.title
                    .getMetadata()
                    .getName()
                    .equals(search.getSearchType())) {
                query.where(qQuestion.title
                        .toUpperCase()
                        .contains(keyword));
            } else if ("choiceTitle".equals(search.getSearchType())) {
                query.where(qQuestion.questionSeq.in(JPAExpressions
                        .selectFrom(qQuizChoice)
                        .select(qQuizChoice.id.questionSeq)
                        .where(qQuizChoice.title
                                .toUpperCase()
                                .contains(search.getKeyword()))));
            }
        }

        Pageable pageable = search.getPageable();
        if (McpString.isYes(search.getUseTotal())) {
            query = getQuerydsl().applyPagination(pageable, query);
        }
        QueryResults<Question> list = query.fetchResults();

        return new PageImpl<Question>(list.getResults(), pageable, list.getTotal());
    }

    @Override
    @Transactional
    public long deleteQuestionBySeq(Long questionSeq) {
        QQuizChoice qQuizChoice = QQuizChoice.quizChoice;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qQuizChoice.id.questionSeq.eq(questionSeq));
        return delete(qQuizChoice)
                .where(builder)
                .execute();
    }
}
