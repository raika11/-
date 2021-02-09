package jmnet.moka.core.tps.mvc.quiz.repository;

import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.mvc.quiz.entity.QuizQuestionSimple;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.quiz.repository
 * ClassName : QuizQuestionRepositorySupport
 * Created : 2021-02-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-08 16:59
 */
public interface QuizQuestionRepositorySupport {

    /**
     * 질문 목록 조회
     *
     * @param search 검색 조건
     * @return 검색 결과
     */
    Page<QuizQuestionSimple> findAllQuestion(SearchDTO search);
}
