package jmnet.moka.core.tps.mvc.quiz.repository;

import jmnet.moka.core.tps.mvc.quiz.entity.QuizRel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface QuizRelRepository extends JpaRepository<QuizRel, Long>, JpaSpecificationExecutor<QuizRel> {

}
