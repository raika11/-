package jmnet.moka.core.tps.mvc.quiz.repository;

import jmnet.moka.core.tps.mvc.quiz.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface QuizRepository extends JpaRepository<Quiz, Long>, JpaSpecificationExecutor<Quiz>, QuizRepositorySupport {

}
