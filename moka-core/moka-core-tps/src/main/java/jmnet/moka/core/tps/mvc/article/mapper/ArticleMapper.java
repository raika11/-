package jmnet.moka.core.tps.mvc.article.mapper;

import java.util.List;
import java.util.Map;
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

    /**
     * 기사 부가정보 조회(분류코드,기자,키워드)
     *
     * @param map rid:기사키
     * @return 분류코드목록, 기자목록, 키워드목록,벌크,본문
     */
    List<List<Object>> findInfo(Map<String, Object> map);

    /**
     * 등록기사를 중지 또는 삭제
     *
     * @param paramMap totalId:기사키, iud: 삭제는 'D', 중지는 'E' ,수정은 'U', returnValue: 리턴값
     */
    void insertArticleIud(Map paramMap);

    /**
     * 분류삭제
     *
     * @param param
     * @return 성공여부
     */
    Integer callUpaArticleCodelistDel(Map<String, Object> param);

    /**
     * 마스터코드로 분류등록
     *
     * @param param
     * @return 성공여부
     */
    Integer callUpaArticleCodelistInsByMasterCode(Map<String, Object> param);

    /**
     * 태그삭제
     *
     * @param param
     * @return 성공여부
     */
    Integer callUpaArticleKeywordDel(Map<String, Object> param);

    /**
     * 태그등록
     *
     * @param param
     * @return 성공여부
     */
    Integer callUpaArticleKeywordIns(Map<String, Object> param);

    /**
     * 기자삭제
     *
     * @param param
     * @return 성공여부
     */
    Integer callUpa15ReArticleReporterDel(Map<String, Object> param);

    /**
     * 기자등록
     *
     * @param param
     * @return 성공여부
     */
    Integer callUpa15ReArticleReporterIns(Map<String, Object> param);

    /**
     * DIV별 삭제(PC제목 삭제시 사용)
     *
     * @param param
     * @return 성공여부
     */
    Integer callUpaArticleTitleDelByDiv(Map<String, Object> param);

    /**
     * DIV별 제목등록(PC제목 등록시 사용)
     *
     * @param param
     * @return 성공여부
     */
    Integer callUpaArticleTitleInsByDiv(Map<String, Object> param);

    /**
     * 본문삭제
     *
     * @param param
     * @return 성공여부
     */
    Integer callUpaArticleContentDel(Map<String, Object> param);

    /**
     * 본문등록. 본문이 있을 경우 수정되며, 없는데 serialNo가 다른 본문이 있으면, serialNo++해서 본문 추가함.
     *
     * @param param
     * @return 성공여부
     */
    Integer callUpaArticleContentInsByTotalId(Map<String, Object> param);

    /**
     * 제목,기자 수정
     *
     * @param param
     * @return 성공여부
     */
    Integer callUpaArticleBasicUpdByTotalId(Map<String, Object> param);
}
