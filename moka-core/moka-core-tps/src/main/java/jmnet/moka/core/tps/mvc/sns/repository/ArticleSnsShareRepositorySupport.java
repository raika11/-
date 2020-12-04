package jmnet.moka.core.tps.mvc.sns.repository;

import jmnet.moka.core.tps.mvc.sns.dto.ArticleSnsShareSearchDTO;
import jmnet.moka.core.tps.mvc.sns.entity.ArticleSnsShare;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.sns.repository
 * ClassName : ArticleSnsShareRepositorySupport
 * Created : 2020-12-04 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-04 14:19
 */
public interface ArticleSnsShareRepositorySupport {

    Page<ArticleSnsShare> findAllArticleSnsShare(ArticleSnsShareSearchDTO searchDTO);
}
