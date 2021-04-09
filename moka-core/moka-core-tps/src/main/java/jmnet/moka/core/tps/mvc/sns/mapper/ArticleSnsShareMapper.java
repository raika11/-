package jmnet.moka.core.tps.mvc.sns.mapper;

import java.util.List;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.sns.dto.ArticleSnsShareSearchDTO;
import jmnet.moka.core.tps.mvc.sns.dto.InstantArticleSearchDTO;
import jmnet.moka.core.tps.mvc.sns.vo.ArticleSnsShareItemVO;
import jmnet.moka.core.tps.mvc.sns.vo.InstantArticleVO;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.sns.mapper
 * ClassName : ArticleSnsShareMapper
 * Created : 2020-12-04 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-04 09:41
 */
public interface ArticleSnsShareMapper extends BaseMapper<ArticleSnsShareItemVO, ArticleSnsShareSearchDTO> {

    int insertFbInstanceArticle(ArticleSnsShareItemVO vo);

    List<InstantArticleVO> findAllFbInstantArticles(InstantArticleSearchDTO search);

    Integer saveFbInstantArticle(InstantArticleVO vo);
}
