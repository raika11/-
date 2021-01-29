package jmnet.moka.core.tps.mvc.quiz.repository;

import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.mvc.quiz.entity.Question;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.quiz.repository
 * ClassName : QuestionRepositorySupport
 * Created : 2021-01-29 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-29 17:07
 */
public interface QuestionRepositorySupport {

    /**
     * 질문 목록 조회
     *
     * @param search 검색 조건
     * @return 검색 결과
     */
    Page<Question> findAllQuestion(SearchDTO search);
}
