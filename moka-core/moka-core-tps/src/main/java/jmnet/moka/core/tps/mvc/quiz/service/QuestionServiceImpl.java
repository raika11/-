package jmnet.moka.core.tps.mvc.quiz.service;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.mvc.quiz.entity.Question;
import jmnet.moka.core.tps.mvc.quiz.entity.QuizChoice;
import jmnet.moka.core.tps.mvc.quiz.entity.QuizChoicePK;
import jmnet.moka.core.tps.mvc.quiz.repository.QuestionRepository;
import jmnet.moka.core.tps.mvc.quiz.repository.QuizChoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.quiz.service
 * ClassName : QuestionServiceImpl
 * Created : 2021-01-18 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-18 17:30
 */
@Service
public class QuestionServiceImpl implements QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuizChoiceRepository quizChoiceRepository;

    @Override
    public Page<Question> findAllQuestion(SearchDTO question) {
        return questionRepository.findAll(question.getPageable());
    }

    @Override
    public Optional<Question> findQuestionBySeq(Long questionSeq) {
        return questionRepository.findById(questionSeq);
    }

    @Override
    public Question insertQuestion(Question question) {
        Question newQuestion = questionRepository.save(question);
        if (question.getChoices() != null && question
                .getChoices()
                .size() > 0) {
            AtomicInteger order = new AtomicInteger(0);
            for (QuizChoice quizChoice : question.getChoices()) {
                quizChoice.setId(QuizChoicePK
                        .builder()
                        .ordNo(order.addAndGet(1))
                        .questionSeq(question.getQuestionSeq())
                        .build());
            }
            quizChoiceRepository.saveAll(question.getChoices());
        }

        return newQuestion;
    }

    @Override
    public List<Question> insertAllQuestion(List<Question> questions) {
        // 신규 등록 이므로 pk값 초기화 처리
        questions.forEach(question -> {
            question.setQuestionSeq(null);
        });
        List<Question> newQuestions = questionRepository.saveAll(questions);

        if (newQuestions.size() > 0) {
            newQuestions.forEach(question -> {
                if (question.getChoices() != null && question
                        .getChoices()
                        .size() > 0) {
                    AtomicInteger order = new AtomicInteger(0);
                    question
                            .getChoices()
                            .forEach(quizChoice -> quizChoice.setId(QuizChoicePK
                                    .builder()
                                    .ordNo(order.addAndGet(1))
                                    .questionSeq(question.getQuestionSeq())
                                    .build()));
                    quizChoiceRepository.saveAll(question.getChoices());
                }
            });
        }

        return newQuestions;
    }

    @Override
    public Question updateQuestion(Question question) {
        return questionRepository.save(question);
    }

    @Override
    public List<Question> updateAllQuestion(List<Question> questions) {
        questions = questionRepository.saveAll(questions);

        if (questions != null && questions.size() > 0) {
            questions.forEach(question -> {
                if (question.getChoices() != null && question
                        .getChoices()
                        .size() > 0) {
                    AtomicInteger order = new AtomicInteger(0);
                    question
                            .getChoices()
                            .forEach(quizChoice -> quizChoice.setId(QuizChoicePK
                                    .builder()
                                    .ordNo(order.addAndGet(1))
                                    .questionSeq(question.getQuestionSeq())
                                    .build()));
                }
                quizChoiceRepository.saveAll(question.getChoices());
            });
        }

        return questions;
    }

    @Override
    public Question deleteQuestion(Question question) {
        return questionRepository.save(question);
    }
}
