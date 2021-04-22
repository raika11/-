package jmnet.moka.core.tps.mvc.newsletter.repository;

import jmnet.moka.core.tps.mvc.newsletter.entity.NewsletterExcel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.newsletter.repository
 * ClassName : NewsletterExcelRepository
 * Created : 2021-04-22 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-04-22 오후 4:53
 */
public interface NewsletterExcelRepository extends JpaRepository<NewsletterExcel, Long>, JpaSpecificationExecutor<NewsletterExcel> {
}
