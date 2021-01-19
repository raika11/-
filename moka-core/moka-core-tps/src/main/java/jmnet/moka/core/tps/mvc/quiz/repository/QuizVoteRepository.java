package jmnet.moka.core.tps.mvc.quiz.repository;

import jmnet.moka.core.tps.mvc.quiz.entity.QuizVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface QuizVoteRepository extends JpaRepository<QuizVote, Long>, JpaSpecificationExecutor<QuizVote> {

}
