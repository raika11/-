package jmnet.moka.core.tps.mvc.article.service;

import com.fasterxml.jackson.core.type.TypeReference;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.article.dto.ArticleBasicDTO;
import jmnet.moka.core.tps.mvc.article.dto.ArticleBasicUpdateDTO;
import jmnet.moka.core.tps.mvc.article.dto.ArticleSearchDTO;
import jmnet.moka.core.tps.mvc.article.dto.ArticleTitleDTO;
import jmnet.moka.core.tps.mvc.article.entity.ArticleBasic;
import jmnet.moka.core.tps.mvc.article.entity.ArticleHistory;
import jmnet.moka.core.tps.mvc.article.entity.ArticleTitle;
import jmnet.moka.core.tps.mvc.article.mapper.ArticleMapper;
import jmnet.moka.core.tps.mvc.article.repository.ArticleBasicRepository;
import jmnet.moka.core.tps.mvc.article.repository.ArticleHistoryRepository;
import jmnet.moka.core.tps.mvc.article.repository.ArticleTitleRepository;
import jmnet.moka.core.tps.mvc.article.vo.ArticleBasicVO;
import jmnet.moka.core.tps.mvc.article.vo.ArticleBulkSimpleVO;
import jmnet.moka.core.tps.mvc.article.vo.ArticleCodeVO;
import jmnet.moka.core.tps.mvc.article.vo.ArticleComponentRelVO;
import jmnet.moka.core.tps.mvc.article.vo.ArticleComponentVO;
import jmnet.moka.core.tps.mvc.article.vo.ArticleDetailVO;
import jmnet.moka.core.tps.mvc.article.vo.ArticleReporterVO;
import jmnet.moka.core.tps.mvc.reporter.vo.ReporterVO;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
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

    private final ArticleHistoryRepository articleHistoryRepository;

    private final ArticleMapper articleMapper;

    private final ModelMapper modelMapper;

    @Value("${bulk.site.id}")
    private String[] bulkSiteId;

    @Value("${bulk.site.name}")
    private String[] bulkSiteName;

    public ArticleServiceImpl(ArticleBasicRepository articleBasicRepository, ArticleTitleRepository articleTitleRepository,
            ArticleHistoryRepository articleHistoryRepository, ArticleMapper articleMapper, ModelMapper modelMapper) {
        this.articleBasicRepository = articleBasicRepository;
        this.articleTitleRepository = articleTitleRepository;
        this.articleHistoryRepository = articleHistoryRepository;
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
        if (listMap.size() == 5) {
            // 분류목록
            if (listMap.get(0) != null && listMap
                    .get(0)
                    .size() > 0) {
                List<String> categoryList = modelMapper.map(listMap.get(0), new TypeReference<List<String>>() {
                }.getType());
                articleDto.setCategoryList(categoryList);
            }

            // 기자목록
            if (listMap.get(1) != null && listMap
                    .get(1)
                    .size() > 0) {
                List<ArticleReporterVO> reporterList = modelMapper.map(listMap.get(1), ArticleReporterVO.TYPE);
                articleDto.setReporterList(reporterList);
            }

            // 태그목록
            if (listMap.get(2) != null && listMap
                    .get(2)
                    .size() > 0) {
                List<String> tagList = modelMapper.map(listMap.get(2), new TypeReference<List<String>>() {
                }.getType());
                articleDto.setTagList(tagList);
            }

            // 벌크목록
            if (listMap.get(3) != null && listMap
                    .get(3)
                    .size() > 0) {
                List<String> dbList = modelMapper.map(listMap.get(3), new TypeReference<List<String>>() {
                }.getType());
                if (dbList.size() > 0) {
                    String[] bulkSiteList = dbList
                            .get(0)
                            .split(",");
                    List<ArticleBulkSimpleVO> list = new ArrayList<>();

                    for (int i = 0; i < bulkSiteId.length; i++) {
                        String id = bulkSiteId[i];
                        boolean bFind = Arrays
                                .asList(bulkSiteList)
                                .stream()
                                .filter(m -> m.equals(id))
                                .findFirst()
                                .isPresent();
                        ArticleBulkSimpleVO vo = ArticleBulkSimpleVO
                                .builder()
                                .siteId(bulkSiteId[i])
                                .siteName(bulkSiteName[i])
                                .bulkYn(bFind ? "Y" : "N")
                                .build();
                        list.add(vo);
                    }
                    articleDto.setBulkSiteList(list);
                }
            }

            // 본문
            if (listMap.get(4) != null && listMap
                    .get(4)
                    .size() > 0) {
                List<String> contentList = modelMapper.map(listMap.get(4), new TypeReference<List<String>>() {
                }.getType());
                if (contentList.size() > 0) {
                    articleDto.setArtContent(contentList.get(0));
                }
            }
        }

    }

    @Override
    public boolean insertArticleIudWithTotalId(ArticleBasic articleBasic, String iud) {
        Map paramMap = new HashMap();
        Integer returnValue = TpsConstants.PROCEDURE_SUCCESS;
        paramMap.put("totalId", articleBasic.getTotalId());
        paramMap.put("iud", iud);
        paramMap.put("returnValue", returnValue);
        articleMapper.insertArticleIud(paramMap);
        if ((int) paramMap.get("returnValue") < 0) {
            log.debug("INSERT FAIL ARTICLE_IUD totalId: {} errorCode: {} ", articleBasic.getTotalId(), returnValue);
            return false;
        }
        return true;
    }

    private boolean isReturnErr(Integer ret) {
        if (ret == null) {
            return true;
        }
        return ret == -800 || ret == -900;
    }

    @Override
    public boolean insertArticleIud(ArticleBasic articleBasic, ArticleBasicUpdateDTO updateDto) {

        Map paramMap = new HashMap();
        paramMap.put("totalId", articleBasic.getTotalId());
        paramMap.put("sourceCode", articleBasic.getSourceCode());

        // 분류삭제 : UPA_ARTICLE_CODELIST_DEL
        if (isReturnErr(articleMapper.callUpaArticleCodelistDel(paramMap))) {
            return false;
        }

        // 태그삭제 : UPA_ARTICLE_KEYWORD_DEL
        if (isReturnErr(articleMapper.callUpaArticleKeywordDel(paramMap))) {
            return false;
        }

        // 기자삭제 : UPA_15RE_ARTICLE_REPORTER_DEL
        if (isReturnErr(articleMapper.callUpa15ReArticleReporterDel(paramMap))) {
            return false;
        }

        // 제목삭제 : UPA_ARTICLE_TITLE_DEL_BY_DIV
        if (isReturnErr(articleMapper.callUpaArticleTitleDelByDiv(paramMap))) {
            return false;
        }

        // 본문삭제 : UPA_ARTICLE_CONTENT_DEL
        if (isReturnErr(articleMapper.callUpaArticleContentDel(paramMap))) {
            return false;
        }

        // 분류등록 : UPA_ARTICLE_CODELIST_INS_BY_MASTER_CODE
        Map paramCatMap = new HashMap();
        paramCatMap.put("totalId", articleBasic.getTotalId());
        paramCatMap.put("sourceCode", articleBasic.getSourceCode());
        int ordNo = 1;
        for (String category : updateDto.getCategoryList()) {
            paramCatMap.put("code", category);
            paramCatMap.put("ordNo", ordNo);
            paramCatMap.put("contentType", articleBasic.getContentType());
            paramCatMap.put("serviceDaytime", articleBasic.getServiceDaytime());
            paramCatMap.put("pressNumber", articleBasic.getPressNumber());
            paramCatMap.put("artTitle", updateDto.getArtTitle());
            if (isReturnErr(articleMapper.callUpaArticleCodelistInsByMasterCode(paramCatMap))) {
                return false;
            }
            ordNo++;
        }

        // 태그등록 : UPA_ARTICLE_KEYWORD_INS
        Map paramKeywordMap = new HashMap();
        paramKeywordMap.put("totalId", articleBasic.getTotalId());
        paramKeywordMap.put("sourceCode", articleBasic.getSourceCode());
        ordNo = 1;
        for (String tag : updateDto.getTagList()) {
            paramKeywordMap.put("keyword", tag);
            paramKeywordMap.put("serialNo", ordNo);
            paramKeywordMap.put("serviceDay", McpDate.dateStr(articleBasic.getServiceDaytime(), "yyyyMMdd"));
            if (isReturnErr(articleMapper.callUpaArticleKeywordIns(paramKeywordMap))) {
                return false;
            }
            ordNo++;
        }

        // 기자등록 : UPA_15RE_ARTICLE_REPORTER_INS
        Map paramRepMap = new HashMap();
        paramRepMap.put("totalId", articleBasic.getTotalId());
        paramRepMap.put("sourceCode", articleBasic.getSourceCode());
        for (ArticleReporterVO reporter : updateDto.getReporterList()) {
            paramRepMap.put("ordNo", reporter.getOrdNo());
            paramRepMap.put("serviceDay", McpDate.dateStr(articleBasic.getServiceDaytime(), "yyyyMMdd"));
            paramRepMap.put("repName", reporter.getRepName());
            paramRepMap.put("repEmail", reporter.getRepEmail());
            if (isReturnErr(articleMapper.callUpa15ReArticleReporterIns(paramRepMap))) {
                return false;
            }
        }

        // 제목등록 : UPA_ARTICLE_TITLE_INS_BY_DIV
        Map paramTitleMap = new HashMap();
        paramTitleMap.put("totalId", articleBasic.getTotalId());
        paramTitleMap.put("title", updateDto.getArtTitle());
        paramTitleMap.put("titleDiv", "P"); //PC제목으로 등록
        if (isReturnErr(articleMapper.callUpaArticleTitleInsByDiv(paramTitleMap))) {
            return false;
        }

        // 본문등록 : UPA_ARTICLE_CONTENT_INS_BY_TOTALID
        Map paramContentMap = new HashMap();
        paramContentMap.put("totalId", articleBasic.getTotalId());
        paramContentMap.put("serialNo", 1);
        paramContentMap.put("artContent", updateDto.getArtContent());
        if (isReturnErr(articleMapper.callUpaArticleContentInsByTotalId(paramContentMap))) {
            return false;
        }

        // ARTICLE_BASIC에 제목,기자 수정 : UPA_ARTICLE_BASIC_UPD_BY_TOTALID
        String reporters = updateDto
                .getReporterList()
                .stream()
                .map(ArticleReporterVO::getRepName)
                .collect(Collectors.joining("."));

        Map paramBasicMap = new HashMap();
        paramBasicMap.put("totalId", articleBasic.getTotalId());
        paramBasicMap.put("artReporter", reporters);
        paramBasicMap.put("artTitle", updateDto.getArtTitle());
        if (isReturnErr(articleMapper.callUpaArticleBasicUpdByTotalId(paramBasicMap))) {
            return false;
        }

        // ARTICLE_IUD에 등록
        insertArticleIudWithTotalId(articleBasic, "U");

        // 히스토리 등록
        String masterCodeList = updateDto
                .getCategoryList()
                .stream()
                .collect(Collectors.joining(","));

        String tagList = updateDto
                .getTagList()
                .stream()
                .collect(Collectors.joining(","));

        ArticleHistory history = ArticleHistory
                .builder()
                .totalId(articleBasic.getTotalId())
                .masterCodeList(masterCodeList)
                .artTitle(updateDto.getArtTitle())
                .artReporter(reporters)
                .artSubTitle(articleBasic.getArtSubTitle())
                .keywordList(tagList)
                .iudDiv(TpsConstants.WORKTYPE_UPDATE)
                .build();
        articleHistoryRepository.save(history);

        return true;
    }

    @Override
    public Page<ArticleHistory> findAllArticleHistory(Long totalId, SearchDTO search) {
        return articleHistoryRepository.findByTotalIdOrderBySeqNo(totalId, search.getPageable());
    }

    @Override
    public String insertCdn(Long totalId) {
        return null;
    }
}
