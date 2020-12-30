package jmnet.moka.core.tps.mvc.article.service;

import com.fasterxml.jackson.core.type.TypeReference;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.mvc.article.dto.ArticleBasicDTO;
import jmnet.moka.core.tps.mvc.article.dto.ArticleSearchDTO;
import jmnet.moka.core.tps.mvc.article.dto.ArticleTitleDTO;
import jmnet.moka.core.tps.mvc.article.entity.ArticleBasic;
import jmnet.moka.core.tps.mvc.article.entity.ArticleTitle;
import jmnet.moka.core.tps.mvc.article.mapper.ArticleMapper;
import jmnet.moka.core.tps.mvc.article.repository.ArticleBasicRepository;
import jmnet.moka.core.tps.mvc.article.repository.ArticleTitleRepository;
import jmnet.moka.core.tps.mvc.article.vo.ArticleBasicVO;
import jmnet.moka.core.tps.mvc.article.vo.ArticleCodeVO;
import jmnet.moka.core.tps.mvc.article.vo.ArticleComponentRelVO;
import jmnet.moka.core.tps.mvc.article.vo.ArticleComponentVO;
import jmnet.moka.core.tps.mvc.article.vo.ArticleDetailVO;
import jmnet.moka.core.tps.mvc.article.vo.ArticleReporterVO;
import jmnet.moka.core.tps.mvc.reporter.vo.ReporterVO;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

/**
 * Article 서비스 구현체
 *
 * @author jeon0525
 */
@Service
@Slf4j
public class ArticleServiceImpl implements ArticleService {

    private final ArticleBasicRepository articleBasicRepository;

    private final ArticleTitleRepository articleTitleRepository;

    private final ArticleMapper articleMapper;

    private final ModelMapper modelMapper;

    public ArticleServiceImpl(ArticleBasicRepository articleBasicRepository, ArticleTitleRepository articleTitleRepository,
            ArticleMapper articleMapper, ModelMapper modelMapper) {
        this.articleBasicRepository = articleBasicRepository;
        this.articleTitleRepository = articleTitleRepository;
        this.articleMapper = articleMapper;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<ArticleBasicVO> findAllArticleBasicByService(ArticleSearchDTO search) {
        return articleMapper.findAllByService(search);
    }

    @Override
    public Optional<ArticleBasic> findArticleBasicById(Long totalId) {
        return articleBasicRepository.findById(totalId);
    }

    @Override
    public Long findLastestArticleBasicByArtType(String artType) {
        return articleBasicRepository.findLastestByTotalIdByArtType(artType);
    }

    @Override
    public void saveArticleTitle(ArticleBasic articleBasic, ArticleTitleDTO articleTitleDTO) {
        // 웹제목
        if (McpString.isNotEmpty(articleTitleDTO.getArtEditTitle())) {
            Optional<ArticleTitle> articleTitle = articleTitleRepository.findByTotalIdAndTitleDiv(articleBasic.getTotalId(), "DP");
            if (articleTitle.isPresent()) {
                // 수정
                articleTitle
                        .get()
                        .setTitle(articleTitleDTO.getArtEditTitle());
                articleTitleRepository.save(articleTitle.get());
            } else {
                // 등록
                ArticleTitle newTitle = ArticleTitle
                        .builder()
                        .totalId(articleBasic.getTotalId())
                        .titleDiv("DP")
                        .title(articleTitleDTO.getArtEditTitle())
                        .build();
                articleTitleRepository.save(newTitle);
            }
        }

        // 모바일제목
        if (McpString.isNotEmpty(articleTitleDTO.getArtEditMobTitle())) {
            Optional<ArticleTitle> articleTitle = articleTitleRepository.findByTotalIdAndTitleDiv(articleBasic.getTotalId(), "DM");
            if (articleTitle.isPresent()) {
                // 수정
                articleTitle
                        .get()
                        .setTitle(articleTitleDTO.getArtEditMobTitle());
                articleTitleRepository.save(articleTitle.get());
            } else {
                // 등록
                ArticleTitle newTitle = ArticleTitle
                        .builder()
                        .totalId(articleBasic.getTotalId())
                        .titleDiv("DM")
                        .title(articleTitleDTO.getArtEditMobTitle())
                        .build();
                articleTitleRepository.save(newTitle);
            }
        }
    }

    @Override
    public Optional<ArticleDetailVO> findArticleDetailById(Long totalId) {
        List<List<Object>> articleInfoList = articleMapper.findByIdForMapList(totalId);
        ArticleDetailVO articleDetailVO = null;
        if (articleInfoList != null && articleInfoList.size() > 0) {
            if (articleInfoList.get(0) != null && articleInfoList
                    .get(0)
                    .size() > 0) {
                articleDetailVO = (ArticleDetailVO) articleInfoList
                        .get(0)
                        .get(0);
            }
            if (articleInfoList.size() > 1) {
                for (Object obj : articleInfoList.get(1)) {
                    assert articleDetailVO != null;
                    articleDetailVO.addCode((ArticleCodeVO) obj);
                }
            }
            if (articleInfoList.size() > 2) {
                for (Object obj : articleInfoList.get(2)) {
                    assert articleDetailVO != null;
                    articleDetailVO.addReporter((ReporterVO) obj);
                }
            }
            if (articleInfoList.size() > 3) {
                for (Object obj : articleInfoList.get(3)) {
                    assert articleDetailVO != null;
                    articleDetailVO.addComponentRel((ArticleComponentRelVO) obj);
                }
            }
        }

        return Optional.ofNullable(articleDetailVO);
    }

    @Override
    public List<ArticleBasicVO> findAllArticleBasicByBulkY(ArticleSearchDTO search) {
        return articleMapper.findAllByBulkY(search);
    }

    @Override
    public List<ArticleComponentVO> findAllImageComponent(Long totalId) {
        return articleMapper.findAllImageComponent(totalId);
    }

    @Override
    public List<ArticleBasicVO> findAllArticleBasic(ArticleSearchDTO search) {
        return articleMapper.findAll(search);
    }

    @Override
    public void findArticleInfo(ArticleBasicDTO articleDto) {
        Map paramMap = new HashMap();
        paramMap.put("totalId", articleDto.getTotalId());
        List<List<Object>> listMap = articleMapper.findInfo(paramMap);
        if (listMap.size() == 3) {

        }
        if (listMap.get(0) != null && listMap
                .get(0)
                .size() > 0) {
            List<String> categoryList = modelMapper.map(listMap.get(0), new TypeReference<List<String>>() {
            }.getType());
            articleDto.setCategoryList(categoryList);
        }

        if (listMap.get(1) != null && listMap
                .get(1)
                .size() > 0) {
            List<ArticleReporterVO> reporterList = modelMapper.map(listMap.get(1), ArticleReporterVO.TYPE);
            articleDto.setReporterList(reporterList);
        }

        if (listMap.get(2) != null && listMap
                .get(2)
                .size() > 0) {
            List<String> tagList = modelMapper.map(listMap.get(2), new TypeReference<List<String>>() {
            }.getType());
            articleDto.setTagList(tagList);
        }

    }
}
