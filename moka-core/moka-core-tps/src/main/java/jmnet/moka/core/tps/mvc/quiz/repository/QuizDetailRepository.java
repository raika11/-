package jmnet.moka.core.tps.mvc.quiz.repository;

import jmnet.moka.core.tps.mvc.quiz.entity.QuizDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface QuizDetailRepository extends JpaRepository<QuizDetail, Long>, JpaSpecificationExecutor<QuizDetail>, QuizRepositorySupport {

}
