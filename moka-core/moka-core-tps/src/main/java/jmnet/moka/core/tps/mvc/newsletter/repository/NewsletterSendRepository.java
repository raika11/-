package jmnet.moka.core.tps.mvc.newsletter.repository;

import jmnet.moka.core.tps.mvc.newsletter.entity.NewsletterSend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.newsletter.repository
 * ClassName : NewsletterSendRepository
 * Created : 2021-04-20 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-04-20 오전 11:10
 */
public interface NewsletterSendRepository
        extends JpaRepository<NewsletterSend, Long>, JpaSpecificationExecutor<NewsletterSend>/* , NewsletterInfoRepositorySupport */ {
}
