package jmnet.moka.core.tps.mvc.sns.service;

import java.util.List;
import jmnet.moka.core.tps.mvc.sns.dto.ArticleSnsShareSearchDTO;
import jmnet.moka.core.tps.mvc.sns.entity.ArticleSnsShare;
import jmnet.moka.core.tps.mvc.sns.mapper.ArticleSnsShareMapper;
import jmnet.moka.core.tps.mvc.sns.repository.ArticleSnsShareRepository;
import jmnet.moka.core.tps.mvc.sns.vo.ArticleSnsShareItemVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;

/**
 * <pre>
 *
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

    @Autowired
    private ArticleSnsShareRepository articleSnsShareRepository;

    @Autowired
    private ArticleSnsShareMapper articleSnsShareMapper;

    @Override
    public Page<ArticleSnsShare> findAllArticleSnsShare(ArticleSnsShareSearchDTO searchDTO) {
        return articleSnsShareRepository.findAllArticleSnsShare(searchDTO);
    }

    @Override
    public Page<ArticleSnsShareItemVO> findAllArticleSnsShareItem(ArticleSnsShareSearchDTO searchDTO) {
        List<ArticleSnsShareItemVO> articleSnsShareList = articleSnsShareMapper.findAll(searchDTO);
        return new PageImpl<ArticleSnsShareItemVO>(articleSnsShareList, searchDTO.getPageable(), searchDTO.getTotal());
    }
}
