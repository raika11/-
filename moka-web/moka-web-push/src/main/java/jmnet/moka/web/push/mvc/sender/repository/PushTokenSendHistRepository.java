package jmnet.moka.web.push.mvc.sender.repository;

import jmnet.moka.web.push.mvc.sender.entity.PushTokenSendHist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PushTokenSendHistRepository extends JpaRepository<PushTokenSendHist, Long>, PushTokenSendHistRepositorySupport {

}