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
import jmnet.moka.core.common.ftp.FtpHelper;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.article.dto.ArticleBasicDTO;
import jmnet.moka.core.tps.mvc.article.dto.ArticleBasicUpdateDTO;
import jmnet.moka.core.tps.mvc.article.dto.ArticleSearchDTO;
import jmnet.moka.core.tps.mvc.article.dto.ArticleTitleDTO;
import jmnet.moka.core.tps.mvc.article.dto.CdnUploadResultDTO;
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

    private final FtpHelper ftpHelper;

    @Value("${bulk.site.id}")
    private String[] bulkSiteId;

    @Value("${bulk.site.name}")
    private String[] bulkSiteName;

    @Value("${pds.url}")
    private String pdsUrl;

    @Value("${cdn.joongang.svr.ftp.root}")
    private String cdnFtpRoot;

    @Value("${cdn.joongang.svr.ftp.root.image}")
    private String cdnFtpRootImage;

    @Value("${cdn.joongang.svr.web.domain}")
    private String cdnWebDomain;

    @Value("${cdn.joongang.temp.filepath}")
    private String cdnTempFilepath;

    @Value("${cdn.joongang.temp.imgpath}")
    private String cdnTempImgpath;

    public ArticleServiceImpl(ArticleBasicRepository articleBasicRepository, ArticleTitleRepository articleTitleRepository,
            ArticleHistoryRepository articleHistoryRepository, ArticleMapper articleMapper, ModelMapper modelMapper, FtpHelper ftpHelper) {
        this.articleBasicRepository = articleBasicRepository;
        this.articleTitleRepository = articleTitleRepository;
        this.articleHistoryRepository = articleHistoryRepository;
        this.articleMapper = articleMapper;
        this.modelMapper = modelMapper;
        this.ftpHelper = ftpHelper;
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
                    .size() > 0 && listMap
                    .get(0)
                    .get(0) != null) {
                List<String> categoryList = modelMapper.map(listMap.get(0), new TypeReference<List<String>>() {
                }.getType());
                articleDto.setCategoryList(categoryList);
            }

            // 기자목록
            if (listMap.get(1) != null && listMap
                    .get(1)
                    .size() > 0 && listMap
                    .get(1)
                    .get(0) != null) {
                List<ArticleReporterVO> reporterList = modelMapper.map(listMap.get(1), ArticleReporterVO.TYPE);
                articleDto.setReporterList(reporterList);
            }

            // 태그목록
            if (listMap.get(2) != null && listMap
                    .get(2)
                    .size() > 0 && listMap
                    .get(2)
                    .get(0) != null) {
                List<String> tagList = modelMapper.map(listMap.get(2), new TypeReference<List<String>>() {
                }.getType());
                articleDto.setTagList(tagList);
            }

            // 벌크목록
            if (listMap.get(3) != null && listMap
                    .get(3)
                    .size() > 0 && listMap
                    .get(3)
                    .get(0) != null) {
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
        //        if (isReturnErr(articleMapper.callUpaArticleContentDel(paramMap))) {
        //            return false;
        //        }

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
        paramContentMap.put("serialNo", updateDto
                .getArtContent()
                .getSerialNo());
        paramContentMap.put("artContent", updateDto
                .getArtContent()
                .getArtContent());
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
    public boolean insertCdn(Long totalId, CdnUploadResultDTO resultDto) {

        return false;
    }

    //    @Override
    //    public boolean insertCdn(Long totalId, CdnUploadResultDTO resultDto)
    //            throws Exception {
    //        //1. html string
    //        //    1.1. html string생성
    //        String articleURL = "http://stg-news.joongang.co.kr/article" + "/" + totalId.toString();
    //        InputStream in = new URL(articleURL).openStream();
    //        String fullBodyTxt = "";
    //        try {
    //            fullBodyTxt = IOUtils.toString(in, StandardCharsets.UTF_8);
    //        } finally {
    //            IOUtils.closeQuietly(in);
    //        }
    //
    //        //    1.2. string에 이미지경로 수정
    //        //    ${pds.url}/TB_15RE_COMPONENT.COMP_FILE_URL -> ${cdn.joongang.svr.web.domain}${cdn.joongang.svr.ftp.root.image}/{이미지 파일명}
    //        //    TB_15RE_COMPONENT.COMP_FILE_URL -> ${cdn.joongang.svr.web.domain}${cdn.joongang.svr.ftp.root.image}/{이미지 파일명}
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
    //        //2.이미지 다운로드(http download). loop
    //        //${pds.url}/TB_15RE_COMPONENT.COMP_FILE_URL -> ${cdn.joongang.temp.imgpath}/{이미지 파일명}
    //        for (ArticleComponentVO vo : imageList) {
    //            String srcImgUrl = pdsUrl + vo.getCompFileUrl();
    //            String fileName = FilenameUtils.getName(srcImgUrl);
    //            String downImgUrl = cdnTempImgpath + File.separator + fileName;
    //            ImageUtil.downloadImage(srcImgUrl, downImgUrl);
    //        }
    //
    //        //3. html파일 skip bom으로 파일저장
    //        //html string -> ${cdn.joongang.temp.filepath}/tmp_{중복prefix_}{totalId}.html
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
    //        //4. html 기사 파일과 이미지 파일 cdn ftp upload
    //        //    4.1. 이미지 CDN에 FTP upload. loop
    //        //    ${cdn.joongang.temp.imgpath}/{이미지 파일명} -> ${cdn.joongang.svr.ftp.root.image}/{이미지 파일명}
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
    //        //    4.2. 본문 CDN에 FTP upload
    //        //    ${cdn.joongang.temp.filepath}/tmp_{중복prefix_}{totalId}.html -> ${cdn.joongang.svr.ftp.root}/{중복prefix_}{totalId}.html
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
    //        //5. 업로드 성공 후 처리
    //        //    5.1. 새로운 기사링크
    //        //    ${cdn.joongang.svr.web.domain}${cdn.joongang.svr.ftp.root}/{중복prefix_}{totalId}.html
    //        //    성공시 업로드된 경로노출, 경로복사버튼 제공
    //        resultDto.setSuccess(true);
    //        resultDto.setCdnUrl(cdnWebDomain + cdnFtpRoot + "/" + uploadFileName);
    //
    //        //    5.2. 기존 파일 redirection 처리
    //        //        5.2.1. 리다렉션 파일 생성
    //        //        내용: txtReDir = "<script type='text/javascript'>document.location.replace('" & WebRoot & LocalFilename & "');</script>"
    //        //        ${cdn.joongang.temp.filepath}/tmp_redir.html 로 파일 생성
    //        String redirectHtml =
    //                "<script type='text/javascript'>document.location.replace('" + cdnWebDomain + cdnFtpRoot + "/" + uploadFileName + "');</script>";
    //        McpFile.fileWrite(cdnTempFilepath + File.separator + "tmp_redir.html", redirectHtml);
    //
    //        //        5.2.2. 리다렉션 파일 ftp upload
    //        //        ${cdn.joongang.temp.filepath}/tmp_redir.html -> JOONGANG_SVR_FTP_ROOT/article/right(totalId,3)/{totalId}.html
    //        //        성공시 업로드된 경로 노출
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
    //        //        5.2.3. Aid 아웃링크용(중앙일보일 경우만)파일 ftp upload
    //        //        ${cdn.joongang.temp.filepath}/tmp_redir.html ->/article/aid/left(serviceday, 4)/mid(serviceday, 5, 2)/right(serviceday, 2 )/{aid}.html
    //        return true;
    //    }
}
