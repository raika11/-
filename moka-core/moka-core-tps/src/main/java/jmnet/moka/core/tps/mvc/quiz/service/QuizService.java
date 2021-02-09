package jmnet.moka.core.tps.mvc.quiz.service;

import java.util.List;
import java.util.Optional;
import javax.annotation.Nullable;
import javax.validation.constraints.NotEmpty;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.mvc.quiz.dto.QuizSearchDTO;
import jmnet.moka.core.tps.mvc.quiz.entity.Question;
import jmnet.moka.core.tps.mvc.quiz.entity.Quiz;
import jmnet.moka.core.tps.mvc.quiz.entity.QuizDetail;
import jmnet.moka.core.tps.mvc.quiz.entity.QuizQuestionSimple;
import jmnet.moka.core.tps.mvc.quiz.entity.QuizRel;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.quiz
 * ClassName : QuizService
 * Created : 2021-01-18 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-18 11:43
 */
public interface QuizService {

    Page<Quiz> findAllQuiz(QuizSearchDTO quiz);

    Page<QuizQuestionSimple> findAllQuizQuestion(SearchDTO searchDTO);

    Optional<Quiz> findQuizBySeq(Long quizSeq);

    Optional<QuizDetail> findQuizDetailBySeq(Long quizSeq);

    Quiz insertQuiz(Quiz quiz);

    Quiz insertQuiz(Quiz quiz, List<Question> questions);

    Quiz insertQuiz(Quiz quiz, @NotEmpty List<Question> questions, @Nullable List<QuizRel> quizRels);

    QuizDetail insertQuizDetail(QuizDetail quiz, List<Question> questions);

    List<QuizRel> insertQuizRels(Long quizSeq, List<QuizRel> quizRels);

    Quiz updateQuiz(Quiz quiz);

    QuizDetail updateQuizDetail(QuizDetail quiz, List<Question> questions);

    List<QuizRel> updateQuizRels(Long quizSeq, List<QuizRel> quizRels);

    long deleteQuiz(Quiz quiz);

}
