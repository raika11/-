package jmnet.moka.core.tps.mvc.quiz.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.member.entity.QMemberInfo;
import jmnet.moka.core.tps.mvc.quiz.dto.QuizSearchDTO;
import jmnet.moka.core.tps.mvc.quiz.entity.QQuiz;
import jmnet.moka.core.tps.mvc.quiz.entity.QQuizQuestion;
import jmnet.moka.core.tps.mvc.quiz.entity.QQuizRel;
import jmnet.moka.core.tps.mvc.quiz.entity.Quiz;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.quiz.repository
 * ClassName : QuizRepositorySupportImpl
 * Created : 2021-01-18 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-18 16:32
 */
public class QuizRepositorySupportImpl extends TpsQueryDslRepositorySupport implements QuizRepositorySupport {



    public QuizRepositorySupportImpl() {
        super(Quiz.class);
    }

    @Override
    public Page<Quiz> findAllQuiz(QuizSearchDTO search) {
        QQuiz qQuiz = QQuiz.quiz;
        QMemberInfo qRegMember = new QMemberInfo("regMember");
        JPQLQuery<Quiz> query = from(qQuiz);


        query.where(qQuiz.delYn.eq(MokaConstants.NO));


        if (McpString.isNotEmpty(search.getKeyword())) {
            String keyword = search
                    .getKeyword()
                    .toUpperCase();
            if (qQuiz.title
                    .getMetadata()
                    .getName()
                    .equals(search.getSearchType())) {
                query.where(qQuiz.title
                        .toUpperCase()
                        .contains(keyword));
            } else if (qQuiz.quizSeq
                    .getMetadata()
                    .getName()
                    .equals(search.getSearchType())) {
                query.where(qQuiz.quizSeq.eq(Long.parseLong(keyword)));
            }

        }

        Pageable pageable = search.getPageable();
        if (McpString.isYes(search.getUseTotal())) {
            query = getQuerydsl().applyPagination(pageable, query);
        }

        query.orderBy(qQuiz.quizSeq.desc());

        QueryResults<Quiz> list = query
                .leftJoin(qQuiz.regMember, qRegMember)
                .fetchResults();

        return new PageImpl<Quiz>(list.getResults(), pageable, list.getTotal());
    }

    @Override
    @Transactional
    public long updateQuizDelYn(Long quizSeq, String delYn) {
        QQuiz quiz = QQuiz.quiz;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(quiz.quizSeq.eq(quizSeq));
        return update(quiz)
                .set(quiz.delYn, delYn)
                .where(builder)
                .execute();
    }

    @Override
    @Transactional
    public long deleteQuizQuestionByQuizSeq(Long quizSeq) {
        QQuizQuestion quizQuestion = QQuizQuestion.quizQuestion;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(quizQuestion.quizSeq.eq(quizSeq));
        return delete(quizQuestion)
                .where(builder)
                .execute();
    }

    @Override
    @Transactional
    public long deleteQuizRelByQuizSeq(Long quizSeq) {
        QQuizRel quizRel = QQuizRel.quizRel;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(quizRel.quizSeq.eq(quizSeq));
        return delete(quizRel)
                .where(builder)
                .execute();
    }
}
