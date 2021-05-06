package jmnet.moka.core.tps.mvc.articlePackage.service;

import java.util.Arrays;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.mvc.articlePackage.dto.ArticlePackageSearchDTO;
import jmnet.moka.core.tps.mvc.articlePackage.entity.ArticlePackage;
import jmnet.moka.core.tps.mvc.articlePackage.entity.ArticlePackageKwd;
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
        return articlePackageRepository.findAllArticlePackage(search);
    }

    @Override
    public Optional<ArticlePackage> findByPkgSeq(Long pkgSeq) {
        return articlePackageRepository.findById(pkgSeq);
    }

    @Transactional
    @Override
    public ArticlePackage insertArticlePackage(ArticlePackage articlePackage) {
        ArticlePackage result = articlePackageRepository.save(articlePackage);
        if (McpString.isNotEmpty(articlePackage.getCatList())) {
            // 색션
            Arrays
                    .stream(articlePackage
                            .getCatList()
                            .split(","))
                    .forEach(section -> articlePackageKwdRepository.save(ArticlePackageKwd
                            .builder()
                            .pkgSeq(result.getPkgSeq())
                            .catDiv("S")
                            .exceptYn("N")
                            .masterCode(section)
                            .build()));
        }
        if (McpString.isNotEmpty(articlePackage.getExceptCatList())) {
            // 제외 섹션
            Arrays
                    .stream(articlePackage
                            .getExceptCatList()
                            .split(","))
                    .forEach(exceptSection -> articlePackageKwdRepository.save(ArticlePackageKwd
                            .builder()
                            .pkgSeq(result.getPkgSeq())
                            .catDiv("S")
                            .exceptYn("Y")
                            .masterCode(exceptSection)
                            .build()));
        }
        if (McpString.isNotEmpty(articlePackage.getExceptTagList())) {
            // 제외 태그
            Arrays
                    .stream(articlePackage
                            .getExceptTagList()
                            .split(","))
                    .forEach(exceptTag -> articlePackageKwdRepository.save(ArticlePackageKwd
                            .builder()
                            .pkgSeq(result.getPkgSeq())
                            .catDiv("K")
                            .exceptYn("Y")
                            .keyword(exceptTag)
                            .build()));
        }
        return result;
    }

    @Transactional
    @Override
    public ArticlePackage updateArticlePackage(ArticlePackage articlePackage) {
        ArticlePackage result = articlePackageRepository.save(articlePackage);
        articlePackageKwdRepository
                .findByPkgSeq(result.getPkgSeq())
                .stream()
                .forEach(articlePackageKwdRepository::delete);
        if (McpString.isNotEmpty(articlePackage.getCatList())) {
            // 색션
            Arrays
                    .stream(articlePackage
                            .getCatList()
                            .split(","))
                    .forEach(section -> articlePackageKwdRepository.save(ArticlePackageKwd
                            .builder()
                            .pkgSeq(result.getPkgSeq())
                            .catDiv("S")
                            .exceptYn("N")
                            .masterCode(section)
                            .build()));
        }
        if (McpString.isNotEmpty(articlePackage.getExceptCatList())) {
            // 제외 섹션
            Arrays
                    .stream(articlePackage
                            .getExceptCatList()
                            .split(","))
                    .forEach(exceptSection -> articlePackageKwdRepository.save(ArticlePackageKwd
                            .builder()
                            .pkgSeq(result.getPkgSeq())
                            .catDiv("S")
                            .exceptYn("Y")
                            .masterCode(exceptSection)
                            .build()));
        }
        if (McpString.isNotEmpty(articlePackage.getExceptTagList())) {
            // 제외 태그
            Arrays
                    .stream(articlePackage
                            .getExceptTagList()
                            .split(","))
                    .forEach(exceptTag -> articlePackageKwdRepository.save(ArticlePackageKwd
                            .builder()
                            .pkgSeq(result.getPkgSeq())
                            .catDiv("K")
                            .exceptYn("Y")
                            .keyword(exceptTag)
                            .build()));
        }
        return result;
    }

    @Override
    public Optional<ArticlePackage> findByPkgTitle(String pkgTitle) {
        return articlePackageRepository.findByPkgTitle(pkgTitle);
    }

    @Override
    public Set<String> findAllPkgTitle() {
        return articlePackageRepository
                .findAll()
                .stream()
                .map(ArticlePackage::getPkgTitle)
                .collect(Collectors.toSet());
    }

}
