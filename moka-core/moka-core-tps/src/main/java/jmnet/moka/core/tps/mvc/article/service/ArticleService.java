package jmnet.moka.core.tps.mvc.article.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.article.dto.ArticleBasicDTO;
import jmnet.moka.core.tps.mvc.article.dto.ArticleBasicUpdateDTO;
import jmnet.moka.core.tps.mvc.article.dto.ArticleHistorySearchDTO;
import jmnet.moka.core.tps.mvc.article.dto.ArticleSearchDTO;
import jmnet.moka.core.tps.mvc.article.dto.ArticleTitleDTO;
import jmnet.moka.core.tps.mvc.article.entity.ArticleBasic;
import jmnet.moka.core.tps.mvc.article.vo.ArticleBasicVO;
import jmnet.moka.core.tps.mvc.article.vo.ArticleComponentVO;
import jmnet.moka.core.tps.mvc.article.vo.ArticleDetailVO;
import jmnet.moka.core.tps.mvc.article.vo.ArticleHistoryVO;

/**
 * Article 서비스
 *
 * @author jeon0525
 */
public interface ArticleService {

    /**
     * 서비스기사목록 조회(페이지편집용)
     *
     * @param search 검색조건
     * @return 서비스기사목록
     */
    List<ArticleBasicVO> findAllArticleBasicByService(ArticleSearchDTO search);

    /**
     * 기사 상세조회
     *
     * @param totalId 기사아이디
     * @return 기사상세
     */
    Optional<ArticleBasic> findArticleBasicById(Long totalId);

    /**
     * 기사 유형으로 최신 기사의 totalId 조회
     *
     * @param artType 기사 유형
     * @return totalId
     */
    Long findLastestArticleBasicByArtType(String artType);

    /**
     * 편집제목수정
     *
     * @param articleBasic    기사정보
     * @param articleTitleDTO 편집제목(pc,모바일)
     */
    void saveArticleTitle(ArticleBasic articleBasic, ArticleTitleDTO articleTitleDTO);

    Optional<ArticleDetailVO> findArticleDetailById(Long totalId);

    /**
     * 벌크전송된 기사목록 조회(네이버채널용)
     *
     * @param search 검색조건
     * @return 기사목록
     */
    List<ArticleBasicVO> findAllArticleBasicByBulkY(ArticleSearchDTO search);

    /**
     * 기사의 이미지 목록 조회
     *
     * @return 기사의 이미지 목록
     */
    List<ArticleComponentVO> findAllImageComponent(Long totalId);

    /**
     * 기사목록 조회
     *
     * @param search 검색조건
     * @return 서비스기사목록
     */
    List<ArticleBasicVO> findAllArticleBasic(ArticleSearchDTO search);

    /**
     * 기사부가정보 조회(분류,기자,키워드)
     *
     * @param articleDto 기사정보
     */
    void findArticleInfo(ArticleBasicDTO articleDto);

    /**
     * 등록기사를 삭제 또는 중지
     *
     * @param articleBasic 등록기사정보
     * @param iud          삭제는 'D', 중지는 'E'
     * @return
     */
    boolean insertArticleIudWithTotalId(ArticleBasic articleBasic, String iud);

    /**
     * 수신기사를 등록기사로 등록
     *
     * @param articleBasic 수신기사정보
     * @param updateDto    기자목록,분류코드목록,태그목록
     * @return 등록성공여부
     */
    boolean insertArticleIud(ArticleBasic articleBasic, ArticleBasicUpdateDTO updateDto);

    /**
     * 기사 히스토리 조회
     *
     * @param search 검색조건
     * @return 기사히스토리 목록
     */
    List<ArticleHistoryVO> findAllArticleHistory(ArticleHistorySearchDTO search);

    /**
     * 특수문자 escape
     *
     * @param updateDto 수정정보
     */
    void escapeHtml(ArticleBasicUpdateDTO updateDto);

    /**
     * 등록기사 dps, tms 갱신
     *
     * @param articleBasic 등록기사정보
     */
    String purge(ArticleBasic articleBasic)
            throws Exception;
}
