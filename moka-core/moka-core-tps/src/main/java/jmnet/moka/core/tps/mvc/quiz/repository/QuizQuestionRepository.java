package jmnet.moka.core.tps.mvc.quiz.repository;

import jmnet.moka.core.tps.mvc.quiz.entity.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, Long>, JpaSpecificationExecutor<QuizQuestion> {

}
