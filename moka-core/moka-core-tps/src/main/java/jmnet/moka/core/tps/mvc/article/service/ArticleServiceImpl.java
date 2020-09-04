package jmnet.moka.core.tps.mvc.article.service;

import static jmnet.moka.common.data.mybatis.support.McpMybatis.getRowBounds;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jmnet.moka.core.tps.mvc.article.dto.ArticleSearchDTO;
import jmnet.moka.core.tps.mvc.article.entity.Article;
import jmnet.moka.core.tps.mvc.article.mapper.ArticleMapper;
import jmnet.moka.core.tps.mvc.article.repository.ArticleRepository;
import jmnet.moka.core.tps.mvc.article.vo.ArticleVO;

/**
 * Article 서비스 구현체
 * 
 * @author jeon0525
 *
 */
@Service
public class ArticleServiceImpl implements ArticleService {
    //    private static final Logger logger = LoggerFactory.getLogger(ArticleServiceImpl.class);

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private ArticleMapper articleMapper;

    @Override
    public List<ArticleVO> findList(ArticleSearchDTO search) {
        return articleMapper.findAll(search, getRowBounds(search.getPage(), search.getSize()));
    }

    @Override
    public Long findListCount(ArticleSearchDTO search) {
        return articleMapper.count(search);
    }

    @Override
    public Optional<Article> findByContentsId(String contentsId) {
        return articleRepository.findByContentsId(contentsId);
    }

}
