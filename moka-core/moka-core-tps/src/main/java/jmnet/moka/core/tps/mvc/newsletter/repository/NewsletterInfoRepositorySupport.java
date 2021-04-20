package jmnet.moka.core.tps.mvc.newsletter.repository;

import jmnet.moka.core.tps.mvc.newsletter.dto.NewsletterSearchDTO;
import jmnet.moka.core.tps.mvc.newsletter.entity.NewsletterInfo;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.newsletter.repository
 * ClassName : NewsletterInfoRepositorySupport
 * Created : 2021-04-16 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-04-16 오후 4:11
 */
public interface NewsletterInfoRepositorySupport {
    /**
     * 조회
     *
     * @param search
     * @return
     */
    Page<NewsletterInfo> findAllNewsletterInfo(NewsletterSearchDTO search);
}