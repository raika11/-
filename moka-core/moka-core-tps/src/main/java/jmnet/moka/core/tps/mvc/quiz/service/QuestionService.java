package jmnet.moka.core.tps.mvc.quiz.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.mvc.quiz.entity.Question;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.quiz
 * ClassName : QuestionService
 * Created : 2021-01-18 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-18 11:43
 */
public interface QuestionService {

    Page<Question> findAllQuestion(SearchDTO question);

    Optional<Question> findQuestionBySeq(Long questionSeq);

    Question insertQuestion(Question question);

    List<Question> insertAllQuestion(List<Question> questions);

    Question updateQuestion(Question question);

    List<Question> updateAllQuestion(List<Question> questions);

    Question deleteQuestion(Question question);



}
