package jmnet.moka.core.tps.mvc.newsletter.repository;

import jmnet.moka.core.tps.mvc.newsletter.entity.NewsletterInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.newsletter.repository
 * ClassName : NewsletterInfoRepository
 * Created : 2021-04-16 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-04-16 오후 4:11
 */
public interface NewsletterInfoRepository
        extends JpaRepository<NewsletterInfo, Long>, JpaSpecificationExecutor<NewsletterInfo>, NewsletterInfoRepositorySupport {
}