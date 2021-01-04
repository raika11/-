package jmnet.moka.core.tps.mvc.comment.repository;

import jmnet.moka.core.tps.mvc.comment.entity.CommentVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CommentVoteRepository extends JpaRepository<CommentVote, Void>, JpaSpecificationExecutor<CommentVote> {

}
