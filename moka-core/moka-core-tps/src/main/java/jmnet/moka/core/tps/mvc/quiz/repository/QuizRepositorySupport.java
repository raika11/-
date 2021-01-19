package jmnet.moka.core.tps.mvc.quiz.repository;

import jmnet.moka.core.tps.mvc.quiz.dto.QuizSearchDTO;
import jmnet.moka.core.tps.mvc.quiz.entity.Quiz;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.quiz.repository
 * ClassName : QuizRepositorySupport
 * Created : 2021-01-18 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-18 16:32
 */
public interface QuizRepositorySupport {

    /**
     * 퀴즈 목록 조회
     *
     * @param search 검색 조건
     * @return 검색 결과
     */
    Page<Quiz> findAllQuiz(QuizSearchDTO search);

    /**
     * 퀴즈 삭제 여부 변경
     *
     * @param quizSeq 퀴즈 일련번호
     * @return 수정 결과
     */
    long updateQuizDelYn(Long quizSeq, String delYn);

    /**
     * 퀴즈 일련번호로 퀴즈 문항 삭제
     *
     * @param quizSeq 퀴즈 일련번호
     * @return 삭제 결과
     */
    long deleteQuizQuestionByQuizSeq(Long quizSeq);

    /**
     * 퀴즈 일련번호로 퀴즈 관련 자료 삭제
     *
     * @param quizSeq 퀴즈 일련번호
     * @return 삭제 결과
     */
    long deleteQuizRelByQuizSeq(Long quizSeq);

}
