package jmnet.moka.core.tps.mvc.quiz.repository;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.quiz.entity.QQuestionSimple;
import jmnet.moka.core.tps.mvc.quiz.entity.QQuizQuestionSimple;
import jmnet.moka.core.tps.mvc.quiz.entity.QQuizSimple;
import jmnet.moka.core.tps.mvc.quiz.entity.QuizQuestionSimple;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.EntityGraph.EntityGraphType;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.quiz.repository
 * ClassName : QuizQuestionRepositorySupportImpl
 * Created : 2021-02-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-08 17:00
 */
public class QuizQuestionRepositorySupportImpl extends TpsQueryDslRepositorySupport implements QuizQuestionRepositorySupport {
    public QuizQuestionRepositorySupportImpl() {
        super(QuizQuestionSimple.class);
    }

    @Override
    @EntityGraph(attributePaths = {"quiz", "question"}, type = EntityGraphType.LOAD)
    public Page<QuizQuestionSimple> findAllQuestion(SearchDTO search) {
        QQuizQuestionSimple quizQuestion = QQuizQuestionSimple.quizQuestionSimple;
        QQuestionSimple question = QQuestionSimple.questionSimple;
        QQuizSimple quiz = QQuizSimple.quizSimple;

        JPQLQuery<QuizQuestionSimple> query = from(quizQuestion);


        if (McpString.isNotEmpty(search.getKeyword())) {
            String keyword = search
                    .getKeyword()
                    .toUpperCase();
            if (search
                    .getSearchType()
                    .equals(TpsConstants.SEARCH_TYPE_ALL)) {
                query.where(quizQuestion.question.title
                        .toUpperCase()
                        .contains(keyword)
                        .or(quizQuestion.quiz.title
                                .toUpperCase()
                                .contains(keyword)));
            } else if (quizQuestion.quiz.title
                    .getMetadata()
                    .getName()
                    .equals(search.getSearchType())) {
                query.where(quizQuestion.quiz.title
                        .toUpperCase()
                        .contains(keyword));
            } else if ("question_title".equals(search.getSearchType())) {
                query.where(quizQuestion.question.title
                        .toUpperCase()
                        .contains(keyword));
            }
        }

        // 삭제되지 않은 퀴즈에 포함된 항목만 표시
        query.where(quizQuestion.quiz.delYn.ne(MokaConstants.YES));

        Pageable pageable = search.getPageable();
        if (McpString.isYes(search.getUseTotal())) {
            query = getQuerydsl().applyPagination(pageable, query);
        }
        QueryResults<QuizQuestionSimple> list = query
                .innerJoin(quizQuestion.question, question)
                .fetchJoin()
                .innerJoin(quizQuestion.quiz, quiz)
                .fetchJoin()
                .fetchResults();

        return new PageImpl<>(list.getResults(), pageable, list.getTotal());
    }
}
