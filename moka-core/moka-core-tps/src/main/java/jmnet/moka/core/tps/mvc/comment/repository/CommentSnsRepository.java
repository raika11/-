package jmnet.moka.core.tps.mvc.comment.repository;

import jmnet.moka.core.tps.mvc.comment.entity.CommentSns;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CommentSnsRepository extends JpaRepository<CommentSns, Void>, JpaSpecificationExecutor<CommentSns> {

}
