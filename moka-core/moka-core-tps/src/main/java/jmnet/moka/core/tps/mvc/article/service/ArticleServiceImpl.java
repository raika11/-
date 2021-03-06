package jmnet.moka.core.tps.mvc.article.service;

import com.fasterxml.jackson.core.type.TypeReference;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.persistence.EntityManager;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.DpsApiConstants;
import jmnet.moka.core.common.ftp.FtpHelper;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.code.BulkSiteCode;
import jmnet.moka.core.tps.common.util.ArticleEscapeUtil;
import jmnet.moka.core.tps.helper.PurgeHelper;
import jmnet.moka.core.tps.mvc.article.dto.ArticleBasicDTO;
import jmnet.moka.core.tps.mvc.article.dto.ArticleBasicUpdateDTO;
import jmnet.moka.core.tps.mvc.article.dto.ArticleHistorySearchDTO;
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
import jmnet.moka.core.tps.mvc.article.vo.ArticleContentVO;
import jmnet.moka.core.tps.mvc.article.vo.ArticleDetailVO;
import jmnet.moka.core.tps.mvc.article.vo.ArticleHistoryVO;
import jmnet.moka.core.tps.mvc.article.vo.ArticleReporterVO;
import jmnet.moka.core.tps.mvc.article.vo.ArticleServiceVO;
import jmnet.moka.core.tps.mvc.reporter.vo.ReporterVO;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Article ????????? ?????????
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

    private final FtpHelper ftpHelper;

    @Autowired
    private PurgeHelper purgeHelper;

    @Value("${tms.default.api.path}")
    private String defaultApiPath;

    private final EntityManager entityManager;

    public ArticleServiceImpl(ArticleBasicRepository articleBasicRepository, ArticleTitleRepository articleTitleRepository,
            ArticleHistoryRepository articleHistoryRepository, ArticleMapper articleMapper, ModelMapper modelMapper, FtpHelper ftpHelper,
            @Qualifier("tpsEntityManagerFactory") EntityManager entityManager) {
        this.articleBasicRepository = articleBasicRepository;
        this.articleTitleRepository = articleTitleRepository;
        this.articleHistoryRepository = articleHistoryRepository;
        this.articleMapper = articleMapper;
        this.modelMapper = modelMapper;
        this.ftpHelper = ftpHelper;
        this.entityManager = entityManager;
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
        // ?????????
        if (McpString.isNotEmpty(articleTitleDTO.getArtEditTitle())) {

            // escape
            articleTitleDTO.setArtEditTitle(ArticleEscapeUtil.htmlEscape(articleTitleDTO.getArtEditTitle()));

            Optional<ArticleTitle> articleTitle = articleTitleRepository.findByTotalIdAndTitleDiv(articleBasic.getTotalId(), "DP");
            if (articleTitle.isPresent()) {
                // ??????
                articleTitle
                        .get()
                        .setTitle(articleTitleDTO.getArtEditTitle());
                articleTitleRepository.save(articleTitle.get());
            } else {
                // ??????
                ArticleTitle newTitle = ArticleTitle
                        .builder()
                        .totalId(articleBasic.getTotalId())
                        .titleDiv("DP")
                        .title(articleTitleDTO.getArtEditTitle())
                        .build();
                articleTitleRepository.save(newTitle);
            }
        }

        // ???????????????
        if (McpString.isNotEmpty(articleTitleDTO.getArtEditMobTitle())) {

            // escape
            articleTitleDTO.setArtEditMobTitle(ArticleEscapeUtil.htmlEscape(articleTitleDTO.getArtEditMobTitle()));

            Optional<ArticleTitle> articleTitle = articleTitleRepository.findByTotalIdAndTitleDiv(articleBasic.getTotalId(), "DM");
            if (articleTitle.isPresent()) {
                // ??????
                articleTitle
                        .get()
                        .setTitle(articleTitleDTO.getArtEditMobTitle());
                articleTitleRepository.save(articleTitle.get());
            } else {
                // ??????
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
            // ????????????
            if (listMap.get(0) != null && listMap
                    .get(0)
                    .size() > 0 && listMap
                    .get(0)
                    .get(0) != null) {
                List<String> categoryList = modelMapper.map(listMap.get(0), new TypeReference<List<String>>() {
                }.getType());
                articleDto.setCategoryList(categoryList);
            }

            // ????????????
            List<ArticleReporterVO> reporterList = new ArrayList<>();
            if (listMap.get(1) != null && listMap
                    .get(1)
                    .size() > 0 && listMap
                    .get(1)
                    .get(0) != null) {
                reporterList = modelMapper.map(listMap.get(1), ArticleReporterVO.TYPE);
            }

            // ??????????????? ?????? ?????? ??????
            if (McpString.isNotEmpty(articleDto.getArtReporter())) {
                String[] otherReps = articleDto
                        .getArtReporter()
                        .split("\\.");
                int ordNo = 1;
                for (String rep : otherReps) {
                    long cnt = reporterList
                            .stream()
                            .filter(r -> r
                                    .getRepName()
                                    .equals(rep))
                            .count();
                    if (cnt == 0) {
                        ArticleReporterVO vo = ArticleReporterVO
                                .builder()
                                .repName(rep)
                                .ordNo(ordNo)
                                .build();
                        reporterList.add(vo);
                    }
                    ordNo++;
                }
            }

            if (reporterList.size() > 0) {
                List<ArticleReporterVO> sortList = reporterList
                        .stream()
                        .sorted((prev, next) -> {
                            return (int) (long) (prev.getOrdNo() - next.getOrdNo());
                        })
                        .collect(Collectors.toList());
                ;
                articleDto.setReporterList(sortList);
            }

            // ????????????
            if (listMap.get(2) != null && listMap
                    .get(2)
                    .size() > 0 && listMap
                    .get(2)
                    .get(0) != null) {
                List<String> tagList = modelMapper.map(listMap.get(2), new TypeReference<List<String>>() {
                }.getType());
                articleDto.setTagList(tagList);
            }

            // ???????????????, ????????????
            if (listMap.get(3) != null && listMap
                    .get(3)
                    .size() > 0 && listMap
                    .get(3)
                    .get(0) != null) {
                ArticleServiceVO articleServiceVO = modelMapper.map(listMap
                        .get(3)
                        .get(0), ArticleServiceVO.class);
                articleDto.setArticleService(articleServiceVO);

                if (articleServiceVO.getBulkSite() != null) {
                    String[] bulkSiteList = articleServiceVO
                            .getBulkSite()
                            .split(",");
                    List<ArticleBulkSimpleVO> list = new ArrayList<>();

                    for (BulkSiteCode bulk : BulkSiteCode.values()) {
                        boolean bFind = Arrays
                                .asList(bulkSiteList)
                                .stream()
                                .filter(m -> m.equals(bulk.getCode()))
                                .findFirst()
                                .isPresent();
                        ArticleBulkSimpleVO vo = ArticleBulkSimpleVO
                                .builder()
                                .siteId(bulk.getCode())
                                .siteName(bulk.getName())
                                .bulkYn(bFind ? "Y" : "N")
                                .build();
                        list.add(vo);
                    }

                    articleDto.setBulkSiteList(list);
                }

            }

            // ??????
            if (listMap.get(4) != null && listMap
                    .get(4)
                    .size() > 0 && listMap
                    .get(4)
                    .get(0) != null) {
                List<ArticleContentVO> contentList = modelMapper.map(listMap.get(4), ArticleContentVO.TYPE);
                articleDto.setArtContent(contentList.get(0));
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
    @Transactional
    public boolean insertArticleIud(ArticleBasic articleBasic, ArticleBasicUpdateDTO updateDto) {

        // html escape
        this.escapeHtml(updateDto);

        Map paramMap = new HashMap();
        paramMap.put("totalId", articleBasic.getTotalId());
        paramMap.put("sourceCode", articleBasic.getSourceCode());

        // ???????????? : UPA_ARTICLE_CODELIST_DEL
        if (isReturnErr(articleMapper.callUpaArticleCodelistDel(paramMap))) {
            return false;
        }

        // ???????????? : UPA_ARTICLE_KEYWORD_DEL
        if (isReturnErr(articleMapper.callUpaArticleKeywordDel(paramMap))) {
            return false;
        }

        // ???????????? : UPA_15RE_ARTICLE_REPORTER_DEL
        if (isReturnErr(articleMapper.callUpa15ReArticleReporterDel(paramMap))) {
            return false;
        }

        // ???????????? : UPA_ARTICLE_TITLE_DEL_BY_DIV
        if (isReturnErr(articleMapper.callUpaArticleTitleDelByDiv(paramMap))) {
            return false;
        }

        // ???????????? : UPA_ARTICLE_CONTENT_DEL
        if (isReturnErr(articleMapper.callUpaArticleContentDel(paramMap))) {
            return false;
        }

        // ???????????? : UPA_ARTICLE_CODELIST_INS_BY_MASTER_CODE
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

        // ???????????? : UPA_ARTICLE_KEYWORD_INS
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

        // ???????????? : UPA_15RE_ARTICLE_REPORTER_INS
        Map paramRepMap = new HashMap();
        paramRepMap.put("totalId", articleBasic.getTotalId());
        paramRepMap.put("sourceCode", articleBasic.getSourceCode());
        for (ArticleReporterVO reporter : updateDto.getReporterList()) {
            paramRepMap.put("ordNo", reporter.getOrdNo());
            paramRepMap.put("serviceDay", McpDate.dateStr(articleBasic.getServiceDaytime(), "yyyyMMdd"));
            paramRepMap.put("repName", reporter.getRepName());
            paramRepMap.put("repEmail1", reporter.getRepEmail1());
            if (isReturnErr(articleMapper.callUpa15ReArticleReporterIns(paramRepMap))) {
                return false;
            }
        }

        // ???????????? : UPA_ARTICLE_TITLE_INS_BY_DIV
        Map paramTitleMap = new HashMap();
        paramTitleMap.put("totalId", articleBasic.getTotalId());
        paramTitleMap.put("title", updateDto.getArtTitle());
        paramTitleMap.put("titleDiv", "P"); //PC???????????? ??????
        if (isReturnErr(articleMapper.callUpaArticleTitleInsByDiv(paramTitleMap))) {
            return false;
        }

        // ???????????? : UPA_ARTICLE_CONTENT_INS_BY_TOTALID
        Map paramContentMap = new HashMap();
        paramContentMap.put("totalId", articleBasic.getTotalId());
        paramContentMap.put("artContent", updateDto
                .getArtContent()
                .getArtContent());
        if (isReturnErr(articleMapper.callUpaArticleContentInsByTotalId(paramContentMap))) {
            return false;
        }

        // ARTICLE_BASIC??? ??????,?????????,?????? ?????? (????????????????????????): UPA_ARTICLE_BASIC_UPD_BY_TOTALID
        String reporters = updateDto
                .getReporterList()
                .stream()
                .map(ArticleReporterVO::getRepName)
                .collect(Collectors.joining("."));

        Map paramBasicMap = new HashMap();
        paramBasicMap.put("totalId", articleBasic.getTotalId());
        paramBasicMap.put("artReporter", reporters);
        paramBasicMap.put("artTitle", updateDto.getArtTitle());
        paramBasicMap.put("artSubTitle", updateDto.getArtSubTitle());
        if (isReturnErr(articleMapper.callUpaArticleBasicUpdByTotalId(paramBasicMap))) {
            return false;
        }

        // ARTICLE_IUD??? ??????
        insertArticleIudWithTotalId(articleBasic, "U");

        // ???????????? ??????
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
                .artSubTitle(updateDto.getArtSubTitle())
                .keywordList(tagList)
                .iudDiv(TpsConstants.WORKTYPE_UPDATE)
                .build();
        articleHistoryRepository.save(history);

        entityManager.flush();

        return true;
    }

    @Override
    public List<ArticleHistoryVO> findAllArticleHistory(ArticleHistorySearchDTO search) {
        return articleMapper.upaArticleHistoryListSel(search);
        //        return articleHistoryRepository.findByTotalIdOrderBySeqNoDesc(totalId, search.getPageable());
    }

    @Override
    public void escapeHtml(ArticleBasicUpdateDTO updateDto) {
        if (McpString.isNotEmpty(updateDto.getArtTitle())) {
            updateDto.setArtTitle(ArticleEscapeUtil.htmlEscape(updateDto.getArtTitle()));
        }

        if (McpString.isNotEmpty(updateDto.getArtSubTitle())) {
            updateDto.setArtSubTitle(ArticleEscapeUtil.htmlEscape(updateDto.getArtSubTitle()));
        }
    }

    @Override
    public String purge(ArticleBasic articleBasic)
            throws Exception {
        String totalId = articleBasic
                .getTotalId()
                .toString();

        // 1. dps purge
        String returnValue = "";
        String retArticle = purgeHelper.dpsPurge(defaultApiPath, DpsApiConstants.ARTICLE, totalId);
        if (McpString.isNotEmpty(retArticle)) {
            log.error("[FAIL TO PURGE ARTILCE] totalId: {} {}", totalId, retArticle);
            returnValue = String.join("\r\n", retArticle);
        }

        // 2. tms articlePurge
        String retArticlePurge = purgeHelper.tmsArticlePurge(totalId);
        if (McpString.isNotEmpty(retArticlePurge)) {
            log.error("[FAIL TO ARTILCE_PURGE] totalId: {} {}", totalId, retArticlePurge);
            returnValue = String.join("\r\n", retArticlePurge);
        }

        return returnValue;
    }

    //    @Override
    //    public boolean insertCdn(Long totalId, CdnUploadResultDTO resultDto) {
    //
    //        return false;
    //    }

    //    @Override
    //    public boolean insertCdn(Long totalId, CdnUploadResultDTO resultDto)
    //            throws Exception {
    //        //1. html string
    //        //    1.1. html string??????
    //        String articleURL = "http://stg-news.joongang.co.kr/article" + "/" + totalId.toString();
    //        InputStream in = new URL(articleURL).openStream();
    //        String fullBodyTxt = "";
    //        try {
    //            fullBodyTxt = IOUtils.toString(in, StandardCharsets.UTF_8);
    //        } finally {
    //            IOUtils.closeQuietly(in);
    //        }
    //
    //        //    1.2. string??? ??????????????? ??????
    //        //    ${pds.url}/TB_15RE_COMPONENT.COMP_FILE_URL -> ${cdn.joongang.svr.web.domain}${cdn.joongang.svr.ftp.root.image}/{????????? ?????????}
    //        //    TB_15RE_COMPONENT.COMP_FILE_URL -> ${cdn.joongang.svr.web.domain}${cdn.joongang.svr.ftp.root.image}/{????????? ?????????}
    //        List<ArticleComponentVO> imageList = articleMapper.findAllImageComponent(totalId);
    //        for (ArticleComponentVO vo : imageList) {
    //            String srcImgUrl = pdsUrl + vo.getCompFileUrl();
    //            String newImgUrl = cdnWebDomain + cdnFtpRootImage + vo.getCompFileUrl();
    //            fullBodyTxt = fullBodyTxt.replaceAll(srcImgUrl, newImgUrl);
    //
    //            srcImgUrl = vo.getCompFileUrl();
    //            newImgUrl = cdnWebDomain + cdnFtpRootImage + vo.getCompFileUrl();
    //            fullBodyTxt = fullBodyTxt.replaceAll(srcImgUrl, newImgUrl);
    //        }
    //
    //
    //        //2.????????? ????????????(http download). loop
    //        //${pds.url}/TB_15RE_COMPONENT.COMP_FILE_URL -> ${cdn.joongang.temp.imgpath}/{????????? ?????????}
    //        for (ArticleComponentVO vo : imageList) {
    //            String srcImgUrl = pdsUrl + vo.getCompFileUrl();
    //            String fileName = FilenameUtils.getName(srcImgUrl);
    //            String downImgUrl = cdnTempImgpath + File.separator + fileName;
    //            ImageUtil.downloadImage(srcImgUrl, downImgUrl);
    //        }
    //
    //        //3. html?????? skip bom?????? ????????????
    //        //html string -> ${cdn.joongang.temp.filepath}/tmp_{??????prefix_}{totalId}.html
    //        String tmpFileName = "tmp_" + totalId.toString() + ".html";
    //        String tmpFilePath = cdnTempFilepath + File.separator + tmpFileName;
    //        File file = new File(tmpFilePath);
    //        if (file.exists()) {
    //            String tmpPath = tmpFilePath;
    //            Integer num = 1;
    //            while ((new File(tmpPath)).exists()) {
    //                tmpFileName = "tmp_" + num.toString() + "_" + totalId.toString() + ".html";
    //                tmpPath = cdnTempFilepath + File.separator + tmpFileName;
    //                num++;
    //            }
    //            tmpFilePath = tmpPath;
    //        }
    //        McpFile.fileWrite(tmpFilePath, fullBodyTxt);
    //
    //        //4. html ?????? ????????? ????????? ?????? cdn ftp upload
    //        //    4.1. ????????? CDN??? FTP upload. loop
    //        //    ${cdn.joongang.temp.imgpath}/{????????? ?????????} -> ${cdn.joongang.svr.ftp.root.image}/{????????? ?????????}
    //        for (ArticleComponentVO vo : imageList) {
    //            String srcImgUrl = pdsUrl + vo.getCompFileUrl();
    //            String fileName = FilenameUtils.getName(srcImgUrl);
    //            String downImgPath = cdnTempImgpath + File.separator + fileName;
    //            boolean upload = ftpHelper.upload(FtpHelper.CDN, new File(downImgPath), cdnFtpRootImage, false);
    //            if (upload) {
    //                log.debug("SAVE CDN IMAGE FILE");
    //            } else {
    //                log.debug("SAVE FAIL CDN IMAGE FILE");
    //                return false;
    //            }
    //        }
    //
    //        //    4.2. ?????? CDN??? FTP upload
    //        //    ${cdn.joongang.temp.filepath}/tmp_{??????prefix_}{totalId}.html -> ${cdn.joongang.svr.ftp.root}/{??????prefix_}{totalId}.html
    //        String uploadFileName = tmpFileName.replace("tmp_", "");
    //        FileInputStream fileStream = new FileInputStream(tmpFilePath);
    //        boolean upload = ftpHelper.upload(FtpHelper.CDN, uploadFileName, fileStream, cdnFtpRoot);
    //        fileStream.close();
    //        if (upload) {
    //            log.debug("SAVE CDN FILE FILE");
    //        } else {
    //            log.debug("SAVE FAIL CDN FILE FILE");
    //            return false;
    //        }
    //
    //        //5. ????????? ?????? ??? ??????
    //        //    5.1. ????????? ????????????
    //        //    ${cdn.joongang.svr.web.domain}${cdn.joongang.svr.ftp.root}/{??????prefix_}{totalId}.html
    //        //    ????????? ???????????? ????????????, ?????????????????? ??????
    //        resultDto.setSuccess(true);
    //        resultDto.setCdnUrl(cdnWebDomain + cdnFtpRoot + "/" + uploadFileName);
    //
    //        //    5.2. ?????? ?????? redirection ??????
    //        //        5.2.1. ???????????? ?????? ??????
    //        //        ??????: txtReDir = "<script type='text/javascript'>document.location.replace('" & WebRoot & LocalFilename & "');</script>"
    //        //        ${cdn.joongang.temp.filepath}/tmp_redir.html ??? ?????? ??????
    //        String redirectHtml =
    //                "<script type='text/javascript'>document.location.replace('" + cdnWebDomain + cdnFtpRoot + "/" + uploadFileName + "');</script>";
    //        McpFile.fileWrite(cdnTempFilepath + File.separator + "tmp_redir.html", redirectHtml);
    //
    //        //        5.2.2. ???????????? ?????? ftp upload
    //        //        ${cdn.joongang.temp.filepath}/tmp_redir.html -> JOONGANG_SVR_FTP_ROOT/article/right(totalId,3)/{totalId}.html
    //        //        ????????? ???????????? ?????? ??????
    //        //        String uploadFileNameR = "tmp_redir.html";
    //        //        FileInputStream fileStreamR = new FileInputStream(tmpFilePath);
    //        //        boolean uploadJ = ftpHelper.upload(FtpHelper.WEB, uploadFileNameR, fileStreamR, cdnFtpRoot);
    //        //        fileStreamR.close();
    //        //        if (uploadJ) {
    //        //            log.debug("SAVE CDN FILE FILE");
    //        //        String redirectUrl = "/article/" + totalId
    //        //                .toString()
    //        //                .substring(-3) + "/" + totalId.toString() + ".html";
    //        //        resultDto.setRedirectUrl(redirectUrl);
    //        //        } else {
    //        //            log.debug("SAVE FAIL CDN FILE FILE");
    //        //            return false;
    //        //        }
    //
    //        //        5.2.3. Aid ???????????????(??????????????? ?????????)?????? ftp upload
    //        //        ${cdn.joongang.temp.filepath}/tmp_redir.html ->/article/aid/left(serviceday, 4)/mid(serviceday, 5, 2)/right(serviceday, 2 )/{aid}.html
    //        return true;
    //    }
}
