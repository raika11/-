package jmnet.moka.core.tps.mvc.newsletter.repository;

import jmnet.moka.core.tps.mvc.newsletter.dto.NewsletterSearchDTO;
import jmnet.moka.core.tps.mvc.newsletter.entity.NewsletterSend;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.newsletter.repository
 * ClassName : NewsletterSendRepositorySupport
 * Created : 2021-04-20 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-04-20 오후 3:12
 */
public interface NewsletterSendRepositorySupport {
    /**
     * 뉴스레터 발송 조회
     *
     * @param search 조회조건
     * @return
     */
    Page<NewsletterSend> findAllNewsletterSend(NewsletterSearchDTO search);
}