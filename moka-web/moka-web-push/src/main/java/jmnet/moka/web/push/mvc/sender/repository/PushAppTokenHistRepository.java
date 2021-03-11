package jmnet.moka.web.push.mvc.sender.repository;

import jmnet.moka.web.push.mvc.sender.entity.PushAppTokenHist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PushAppTokenHistRepository extends JpaRepository<PushAppTokenHist, Long>, PushAppTokenHistRepositorySupport {

}