package jmnet.moka.core.tps.mvc.articlePackage.service;

import java.util.Optional;
import javax.transaction.Transactional;
import jmnet.moka.core.tps.mvc.articlePackage.dto.ArticlePackageSearchDTO;
import jmnet.moka.core.tps.mvc.articlePackage.entity.ArticlePackage;
import jmnet.moka.core.tps.mvc.articlePackage.repository.ArticlePackageKwdRepository;
import jmnet.moka.core.tps.mvc.articlePackage.repository.ArticlePackageRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.articlePackage.service
 * ClassName : ArticlePackageSeriveImpl
 * Created : 2021-05-03 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-05-03 오후 4:13
 */
@Service
@Slf4j
public class ArticlePackageServiceImpl implements ArticlePackageService {

    private final ArticlePackageRepository articlePackageRepository;

    private final ArticlePackageKwdRepository articlePackageKwdRepository;

    public ArticlePackageServiceImpl(ArticlePackageRepository articlePackageRepository, ArticlePackageKwdRepository articlePackageKwdRepository) {
        this.articlePackageRepository = articlePackageRepository;
        this.articlePackageKwdRepository = articlePackageKwdRepository;
    }

    @Override
    public Page<ArticlePackage> findAll(ArticlePackageSearchDTO search) {
        return articlePackageRepository.findAll(search.getPageable());
    }

    @Override
    public Optional<ArticlePackage> findByPkgSeq(Long pkgSeq) {
        return articlePackageRepository.findById(pkgSeq);
    }

    @Transactional
    @Override
    public ArticlePackage insertArticlePackage(ArticlePackage articlePackage) {
        return articlePackageRepository.save(articlePackage);
    }

    @Transactional
    @Override
    public ArticlePackage updateArticlePackage(ArticlePackage articlePackage) {
        return articlePackageRepository.save(articlePackage);
    }

}
