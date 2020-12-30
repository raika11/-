package jmnet.moka.core.tps.mvc.article.mapper;

import java.util.List;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.article.dto.ArticleSearchDTO;
import jmnet.moka.core.tps.mvc.article.vo.ArticleBasicVO;
import jmnet.moka.core.tps.mvc.article.vo.ArticleComponentVO;
import jmnet.moka.core.tps.mvc.article.vo.ArticleDetailVO;

/**
 * Article Mapper
 *
 * @author jeon0525
 */
public interface ArticleMapper extends BaseMapper<ArticleBasicVO, ArticleSearchDTO> {

    /**
     * 서비스 기사목록 조회 (페이지편집용)
     *
     * @param search 검색조건
     * @return 기사목록
     */
    List<ArticleBasicVO> findAllByService(ArticleSearchDTO search);

    /**
     * 기사 상세 조회
     *
     * @param totalId 기사키
     * @return 기사정보
     */
    ArticleDetailVO findArticleDetailById(Long totalId);

    /**
     * 벌크전송된 기사목록 조회(네이버채널용)
     *
     * @param search 검색조건
     * @return 기사목록
     */
    List<ArticleBasicVO> findAllByBulkY(ArticleSearchDTO search);

    /**
     * 기사의 이미지 목록 조회
     *
     * @param totalId 기사키
     * @return 기사이미지목록
     */
    List<ArticleComponentVO> findAllImageComponent(Long totalId);
}
