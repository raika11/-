package jmnet.moka.core.tps.mvc.sns.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.mvc.sns.dto.ArticleSnsShareSearchDTO;
import jmnet.moka.core.tps.mvc.sns.entity.ArticleSnsShare;
import jmnet.moka.core.tps.mvc.sns.entity.ArticleSnsSharePK;
import jmnet.moka.core.tps.mvc.sns.mapper.ArticleSnsShareMapper;
import jmnet.moka.core.tps.mvc.sns.repository.ArticleSnsShareRepository;
import jmnet.moka.core.tps.mvc.sns.vo.ArticleSnsShareItemVO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;

/**
 * <pre>
 * SNS 기사 Service Implementation
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.sns.service
 * ClassName : ArticleSnsShareServiceImpl
 * Created : 2020-12-04 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-04 11:17
 */
@Service
public class ArticleSnsShareServiceImpl implements ArticleSnsShareService {

    private final ArticleSnsShareRepository articleSnsShareRepository;

    private final ArticleSnsShareMapper articleSnsShareMapper;

    public ArticleSnsShareServiceImpl(ArticleSnsShareRepository articleSnsShareRepository, ArticleSnsShareMapper articleSnsShareMapper) {
        this.articleSnsShareRepository = articleSnsShareRepository;
        this.articleSnsShareMapper = articleSnsShareMapper;
    }

    @Override
    public Page<ArticleSnsShare> findAllArticleSnsShare(ArticleSnsShareSearchDTO searchDTO) {
        return articleSnsShareRepository.findAllArticleSnsShare(searchDTO);
    }

    @Override
    public Optional<ArticleSnsShare> findArticleSnsShareById(Long totalId) {
        ArticleSnsShare articleSnsShare = null;
        List<ArticleSnsShare> list = articleSnsShareRepository.findByIdTotalId(totalId);
        if (list != null && list.size() > 0) {
            articleSnsShare = list.get(0);
        }
        return Optional.ofNullable(articleSnsShare);
    }

    @Override
    public Optional<ArticleSnsShare> findArticleSnsShareById(Long totalId, String type) {
        if (McpString.isNotEmpty(type)) {
            return articleSnsShareRepository.findById(ArticleSnsSharePK
                    .builder()
                    .totalId(totalId)
                    .snsType(type)
                    .build());
        } else {
            return findArticleSnsShareById(totalId);
        }
    }

    @Override
    public Optional<ArticleSnsShare> findArticleSnsShareById(ArticleSnsSharePK id) {
        return articleSnsShareRepository.findById(id);
    }

    @Override
    public ArticleSnsShare insertArticleSnsShare(ArticleSnsShare entity) {
        return articleSnsShareRepository.save(entity);
    }

    @Override
    public int insertFbInstanceArticle(ArticleSnsShareItemVO vo) {
        return articleSnsShareMapper.insertFbInstanceArticle(vo);
    }

    @Override
    public ArticleSnsShare updateArticleSnsShare(ArticleSnsShare entity) {
        return articleSnsShareRepository.save(entity);
    }

    @Override
    public void deleteArticleSnsShare(ArticleSnsShare entity) {
        articleSnsShareRepository.delete(entity);
    }

    @Override
    public void deleteArticleSnsShareById(Long totalId, String snsType) {
        articleSnsShareRepository.deleteById(ArticleSnsSharePK
                .builder()
                .totalId(totalId)
                .snsType(snsType)
                .build());
    }

    @Override
    public Page<ArticleSnsShareItemVO> findAllSendArticle(ArticleSnsShareSearchDTO searchDTO) {
        List<ArticleSnsShareItemVO> articleSnsShareList = articleSnsShareMapper.findAll(searchDTO);
        return new PageImpl<>(articleSnsShareList, searchDTO.getPageable(), searchDTO.getTotal());
    }
}
