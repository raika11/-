package jmnet.moka.core.comment.mvc.comment.repository;

import jmnet.moka.core.comment.mvc.comment.entity.CommentBanned;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CommentBannedRepository extends JpaRepository<CommentBanned, Integer>, JpaSpecificationExecutor<CommentBanned> {

}
