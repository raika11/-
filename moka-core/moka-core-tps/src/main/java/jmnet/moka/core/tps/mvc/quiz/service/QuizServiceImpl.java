package jmnet.moka.core.tps.mvc.quiz.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import javax.annotation.Nullable;
import javax.validation.constraints.NotEmpty;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.mvc.quiz.dto.QuizSearchDTO;
import jmnet.moka.core.tps.mvc.quiz.entity.Question;
import jmnet.moka.core.tps.mvc.quiz.entity.Quiz;
import jmnet.moka.core.tps.mvc.quiz.entity.QuizDetail;
import jmnet.moka.core.tps.mvc.quiz.entity.QuizQuestion;
import jmnet.moka.core.tps.mvc.quiz.entity.QuizRel;
import jmnet.moka.core.tps.mvc.quiz.repository.QuizDetailRepository;
import jmnet.moka.core.tps.mvc.quiz.repository.QuizQuestionRepository;
import jmnet.moka.core.tps.mvc.quiz.repository.QuizRelRepository;
import jmnet.moka.core.tps.mvc.quiz.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.quiz.service
 * ClassName : QuizServiceImpl
 * Created : 2021-01-18 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-18 16:30
 */
@Service
public class QuizServiceImpl implements QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuizDetailRepository quizDetailRepository;

    @Autowired
    private QuizQuestionRepository quizQuestionRepository;

    @Autowired
    private QuizRelRepository quizRelRepository;



    @Override
    public Page<Quiz> findAllQuiz(QuizSearchDTO quiz) {
        return quizRepository.findAllQuiz(quiz);
    }

    @Override
    public Optional<Quiz> findQuizBySeq(Long quizSeq) {
        return quizRepository.findById(quizSeq);
    }

    @Override
    public Optional<QuizDetail> findQuizDetailBySeq(Long quizSeq) {
        return quizDetailRepository.findById(quizSeq);
    }

    @Override
    public Quiz insertQuiz(Quiz quiz) {
        return quizRepository.save(quiz);
    }

    @Override
    @Transactional
    public Quiz insertQuiz(Quiz quiz, @NotEmpty List<Question> questions) {
        Quiz newQuiz = insertQuiz(quiz);
        AtomicInteger order = new AtomicInteger(0);
        List<QuizQuestion> quizQuestions = new ArrayList<>();
        questions.forEach(question -> quizQuestions.add(QuizQuestion
                .builder()
                .ordNo(order.addAndGet(1))
                .questionSeq(question.getQuestionSeq())
                .quizSeq(newQuiz.getQuizSeq())
                .build()));

        quizQuestionRepository.saveAll(quizQuestions);

        return newQuiz;
    }

    @Override
    @Transactional
    public Quiz insertQuiz(Quiz quiz, @NotEmpty List<Question> questions, @Nullable List<QuizRel> quizRels) {
        Quiz newQuiz = insertQuiz(quiz, questions);

        if (quizRels != null && quizRels.size() > 0) {
            AtomicInteger order = new AtomicInteger(0);
            quizRels.forEach(quizRel -> {
                quizRel.setOrdNo(order.addAndGet(1));
                quizRel.setQuizSeq(newQuiz.getQuizSeq());
            });
            quizRelRepository.saveAll(quizRels);
        }

        return newQuiz;
    }

    @Override
    public QuizDetail insertQuizDetail(QuizDetail quiz, List<Question> questions) {

        QuizDetail newQuiz = quizDetailRepository.save(quiz);
        newQuiz.setQuizQuestions(saveAllQuizQuestion(questions, newQuiz.getQuizSeq()));
        newQuiz.setQuizRels(saveAllQuizRel(quiz.getQuizRels(), newQuiz.getQuizSeq()));

        return newQuiz;
    }

    @Override
    public List<QuizRel> insertQuizRels(Long quizSeq, List<QuizRel> quizRels) {
        AtomicInteger order = new AtomicInteger(0);
        quizRels.forEach(quizRel -> {
            quizRel.setQuizSeq(quizSeq);
            quizRel.setOrdNo(order.addAndGet(1));
        });
        return quizRelRepository.saveAll(quizRels);
    }

    private List<QuizQuestion> saveAllQuizQuestion(List<Question> questions, Long quizSeq) {
        List<QuizQuestion> quizQuestions = new ArrayList<>();
        AtomicInteger order = new AtomicInteger(0);
        if (questions != null && questions.size() > 0) {
            questions.forEach(question -> quizQuestions.add(QuizQuestion
                    .builder()
                    .ordNo(order.addAndGet(1))
                    .questionSeq(question.getQuestionSeq())
                    .quizSeq(quizSeq)
                    .build()));
            return quizQuestionRepository.saveAll(quizQuestions);
        }
        return null;
    }

    private List<QuizRel> saveAllQuizRel(List<QuizRel> quizRels, Long quizSeq) {

        AtomicInteger order = new AtomicInteger(0);
        if (quizRels != null && quizRels.size() > 0) {
            quizRels.forEach(rel -> {
                rel.setQuizSeq(quizSeq);
                rel.setOrdNo(order.addAndGet(1));
            });
            return quizRelRepository.saveAll(quizRels);
        }
        return null;
    }

    @Override
    public Quiz updateQuiz(Quiz quiz) {
        return null;
    }

    @Override
    public QuizDetail updateQuizDetail(QuizDetail quiz, List<Question> questions) {

        quizRepository.deleteQuizQuestionByQuizSeq(quiz.getQuizSeq());
        quizRepository.deleteQuizRelByQuizSeq(quiz.getQuizSeq());

        QuizDetail newQuiz = quizDetailRepository.save(quiz);
        newQuiz.setQuizQuestions(saveAllQuizQuestion(questions, newQuiz.getQuizSeq()));
        newQuiz.setQuizRels(saveAllQuizRel(quiz.getQuizRels(), newQuiz.getQuizSeq()));

        return newQuiz;
    }

    @Override
    public List<QuizRel> updateQuizRels(Long quizSeq, List<QuizRel> quizRels) {
        quizRepository.deleteQuizRelByQuizSeq(quizSeq);
        AtomicInteger order = new AtomicInteger(0);
        quizRels.forEach(quizRel -> {
            quizRel.setQuizSeq(quizSeq);
            quizRel.setOrdNo(order.addAndGet(1));
        });
        return quizRelRepository.saveAll(quizRels);
    }

    @Override
    public long deleteQuiz(Quiz quiz) {
        return quizRepository.updateQuizDelYn(quiz.getQuizSeq(), MokaConstants.YES);
    }


}
