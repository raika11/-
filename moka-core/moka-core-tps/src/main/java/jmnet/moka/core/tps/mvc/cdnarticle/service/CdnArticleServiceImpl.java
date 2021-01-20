/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.cdnarticle.service;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.ftp.FtpHelper;
import jmnet.moka.core.common.rest.RestTemplateHelper;
import jmnet.moka.core.tps.mvc.cdnarticle.dto.CdnArticleSearchDTO;
import jmnet.moka.core.tps.mvc.cdnarticle.entity.CdnArticle;
import jmnet.moka.core.tps.mvc.cdnarticle.repository.CdnArticleRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
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

    @Value("${static.url}")
    private String staticUrl;

    @Value("${cdn.article.domain}")
    private String[] cdnArticleDoaminList;

    @Value("${cdn.article.save.filepath}")
    private String[] cdnArticleSaveFilepathList;

    @Value("${cdn.article.url}")
    private String[] cdnArticleUrlList;

    @Value("${cdn.web.domain}")
    private String cdnWebDomain;

    @Value("${cdn.purge.url}")
    private String cdnPurgeUrl;

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
        boolean inserted = false;
        for (int i = 0; i < cdnArticleDoaminList.length; i++) {
            boolean ok = uploadCdn(article.getTotalId(), article
                    .getUsedYn()
                    .equals(MokaConstants.YES), cdnArticleDoaminList[i], cdnArticleSaveFilepathList[i], cdnArticleUrlList[i]);
            if (ok) {
                inserted = true;
            }
        }
        // cdn upload가 하나라도 되면, 디비에 등록한다.
        return inserted ? cdnArticleRepository.save(article) : null;

    }

    @Override
    public void clearCacheCdnArticle(Long totalId) {
        for (int i = 0; i < cdnArticleDoaminList.length; i++) {
            String url = cdnPurgeUrl + cdnArticleDoaminList[i] + "/" + totalId.toString() + ".html";
            restTemplateHelper.get(url);
        }
    }

    private boolean uploadCdn(Long totalId, boolean usedYn, String articleDoamin, String cdnSaveFilepath, String cdnArticleUrl)
            throws Exception {

        String articleUrl = articleDoamin + "/article/" + totalId.toString();   // 중앙 기사 서비스 URL
        String articleHtml = "";

        if (usedYn) {
            //html 가져오기
            InputStream in = new URL(articleUrl).openStream();
            try {
                articleHtml = IOUtils.toString(in, StandardCharsets.UTF_8);
            } finally {
                IOUtils.closeQuietly(in);
            }

            //static lib 경로 치환
            articleHtml = articleHtml.replaceAll(staticUrl + "/joongang_15re/scripts/lib/", cdnWebDomain + "/ui/script/lib/");

            //기자정보 링크 치환
            articleHtml = articleHtml.replaceAll("href=\"/reporter/", "href=\"" + articleDoamin + "/reporter/");

            //JA트래커가 CDN 아티클이라고 인식하도록 플래그 추가
            articleHtml = articleHtml.replaceAll("<!-- End JA Tracker Script -->",
                    "<script type=\"text/javascript\">\n\tjatracker('require', 'useOgUrl', true);\n</script>\n<!-- End JA Tracker Script -->");
        } else {
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
        if (usedYn) {
            String url = cdnPurgeUrl + cdnArticleUrl + "/" + totalId.toString() + ".html";
            restTemplateHelper.get(url);
        }
        return true;
    }


}
