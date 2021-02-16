/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.cdnarticle.service;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.List;
import java.util.Optional;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.ftp.FtpHelper;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.common.rest.RestTemplateHelper;
import jmnet.moka.core.tps.common.util.ArticleEscapeUtil;
import jmnet.moka.core.tps.mvc.article.service.ArticleService;
import jmnet.moka.core.tps.mvc.cdnarticle.dto.CdnArticleSearchDTO;
import jmnet.moka.core.tps.mvc.cdnarticle.entity.CdnArticle;
import jmnet.moka.core.tps.mvc.cdnarticle.repository.CdnArticleRepository;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import jmnet.moka.core.tps.mvc.domain.service.DomainService;
import jmnet.moka.core.tps.mvc.merge.service.MergeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2021-01-19
 */
@Service
@Slf4j
public class CdnArticleServiceImpl implements CdnArticleService {

    @Autowired
    private CdnArticleRepository cdnArticleRepository;

    @Autowired
    private FtpHelper ftpHelper;

    @Autowired
    private RestTemplateHelper restTemplateHelper;

    @Autowired
    private ArticleService articleService;

    @Autowired
    private DomainService domainService;

    @Value("${static.url}")
    private String staticUrl;

    @Value("${cdn.uploads.domain-id}")
    private String[] uploadsDomainIdList;

    @Value("${cdn.uploads.save.filepath}")
    private String[] uploadsSaveFilepathList;

    @Value("${cdn.uploads.service-url}")
    private String[] uploadsServiceUrlList;

    @Value("${cdn.domain-url}")
    private String cdnDomainUrl;

    @Value("${cdn.purge-url}")
    private String cdnPurgeUrl;

    @Autowired
    private MessageByLocale messageByLocale;

    @Autowired
    private MergeService mergeService;

    @Override
    public Page<CdnArticle> findAllCdnArticle(CdnArticleSearchDTO search) {
        return cdnArticleRepository.findList(search, search.getPageable());
    }

    @Override
    public Optional<CdnArticle> findCdnArticleById(Long totalId) {
        return cdnArticleRepository.findById(totalId);
    }

    @Override
    public CdnArticle saveCdnArticle(CdnArticle article)
            throws Exception {
        if (!(uploadsDomainIdList.length == uploadsSaveFilepathList.length && uploadsSaveFilepathList.length == uploadsServiceUrlList.length)) {
            log.error("CDN PROPERTIES ERROR");
            throw new Exception("CDN PROPERTIES ERROR");
        }

        boolean saved = false;
        int uploadsCount = uploadsDomainIdList.length;

        // 1. 설정별로 cdn에 업로드
        for (int i = 0; i < uploadsCount; i++) {
            Domain domain = domainService
                    .findDomainById(uploadsDomainIdList[i])
                    .orElseThrow(() -> {
                        String message = messageByLocale.get("tps.common.error.no-data");
                        return new NoDataException(message);
                    });
            String filePath = uploadsSaveFilepathList[i];
            String serviceUrl = uploadsServiceUrlList[i];

            // cdn upload
            boolean uploaded = uploadCdn(article.getTotalId(), article.getUsedYn(), domain, filePath, serviceUrl);
            if (uploaded) {
                saved = true;

                // cdn기사 url 설정.
                // 첫번째 업로드된 것은 pc url, 두번째 업로드된 것은 mobile url로 cdn기사 정보 설정
                if (i == 0) {
                    article.setCdnUrlNews(serviceUrl + "/" + article
                            .getTotalId()
                            .toString() + ".html");
                } else {
                    article.setCdnUrlMnews(serviceUrl + "/" + article
                            .getTotalId()
                            .toString() + ".html");
                }
            }
        }

        // 2. cdn upload가 하나라도 되면, 디비에 등록한다.
        CdnArticle saveArticle = null;
        if (saved) {

            // escape
            if (McpString.isNotEmpty(article.getTitle())) {
                article.setTitle(ArticleEscapeUtil.htmlEscape(article.getTitle()));
            }

            // 디비등록
            saveArticle = cdnArticleRepository.save(article);

        }

        return saveArticle;
    }

    @Override
    public void clearCacheCdnArticle(Long totalId)
            throws Exception {
        if (!(uploadsDomainIdList.length == uploadsSaveFilepathList.length && uploadsSaveFilepathList.length == uploadsServiceUrlList.length)) {
            log.error("CDN PROPERTIES ERROR");
            throw new Exception("CDN PROPERTIES ERROR");
        }
        for (String articleUrl : uploadsServiceUrlList) {
            String url = cdnPurgeUrl + articleUrl + "/" + totalId.toString() + ".html";
            restTemplateHelper.get(url);
        }
    }

    @Override
    public List<CdnArticle> findUseCdnArticle(String usedYn) {
        return cdnArticleRepository.findAllByUsedYn(usedYn);
    }

    private boolean uploadCdn(Long totalId, String usedYn, Domain domain, String cdnSaveFilepath, String cdnServiceUrl)
            throws Exception {

        String articleHtml = "";
        if (usedYn.equals(MokaConstants.YES)) {
            // merge
            articleHtml = mergeService.getMergeArticle(totalId, domain.getDomainId());

            //static lib 경로 치환
            articleHtml = articleHtml.replaceAll(staticUrl + "/joongang_15re/scripts/lib/", cdnDomainUrl + "/ui/script/lib/");

            //기자정보 링크 치환
            articleHtml = articleHtml.replaceAll("href=\"/reporter/", "href=\"//" + domain.getDomainUrl() + "/reporter/");

            //JA트래커가 CDN 아티클이라고 인식하도록 플래그 추가
            articleHtml = articleHtml.replaceAll("<!-- End JA Tracker Script -->",
                    "<script type=\"text/javascript\">\n\tjatracker('require', 'useOgUrl', true);\n</script>\n<!-- End JA Tracker Script -->");
        } else {
            String articleUrl = domain.getDomainUrl() + "/article/" + totalId.toString();
            articleHtml = String.format("<html><meta http-equiv=\"refresh\" content=\"0; url=%s\" ></meta></html>", articleUrl);
        }

        //cdn에 업로드
        String uploadFileName = totalId.toString() + ".html";
        InputStream fileStream = new ByteArrayInputStream(articleHtml.getBytes());
        boolean upload = ftpHelper.upload(FtpHelper.CDN, uploadFileName, fileStream, cdnSaveFilepath, false);
        fileStream.close();
        if (upload) {
            log.debug("SAVE CDN FILE {}", uploadFileName);
        } else {
            log.debug("SAVE FAIL CDN FILE {}", uploadFileName);
            return false;
        }

        //cdn 캐쉬 삭제
        if (usedYn.equals(MokaConstants.YES)) {
            String url = cdnPurgeUrl + cdnServiceUrl + "/" + totalId.toString() + ".html";
            restTemplateHelper.get(url);
        }
        return true;
    }

}
