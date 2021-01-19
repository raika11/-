package jmnet.moka.core.tps.mvc.quiz.repository;

import jmnet.moka.core.tps.mvc.quiz.entity.QuizChoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface QuizChoiceRepository extends JpaRepository<QuizChoice, Long>, JpaSpecificationExecutor<QuizChoice> {

}
