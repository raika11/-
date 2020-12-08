package jmnet.moka.core.tps.mvc.sns.mapper;

import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.sns.dto.ArticleSnsShareSearchDTO;
import jmnet.moka.core.tps.mvc.sns.vo.ArticleSnsShareItemVO;

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

}
