package jmnet.moka.core.tms.mvc.view;

import java.awt.Image;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jmnet.moka.common.JSONResult;
import jmnet.moka.common.cache.CacheManager;
import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.loader.DataLoader;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tms.merge.MokaDomainTemplateMerger;
import jmnet.moka.core.tms.merge.MokaFunctions;
import jmnet.moka.core.tms.merge.MokaTemplateMerger;
import jmnet.moka.core.tms.mvc.HttpParamMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.view.AbstractView;

/**
 * <pre>
 * 구글 AMP용 기사를 머징하여 브라우저로 보낸다
 * 2019. 9. 10. kspark 최초생성
 * </pre>
 *
 * @author kspark
 * @since 2020. 12. 24. 오후 3:54:35
 */
public class AmpArticleView extends AbstractView {
    private static final Logger logger = LoggerFactory.getLogger(AmpArticleView.class);

    @Value("${tms.mte.debug}")
    private boolean templateMergeDebug;

    @Value("${tms.page.cache}")
    private boolean isPageCache;

    @Autowired
    private MokaDomainTemplateMerger domainTemplateMerger;

    @Autowired(required = false)
    private CacheManager cacheManager;

    private MokaFunctions functions = new MokaFunctions();

    @Override
    protected boolean generatesDownloadContent() {
        return false;
    }

    /**
     * <pre>
     * http 머지 요청을 통해 수집된 정보를 취합하여 머지를 수행하여 결과를 반환한다.
     * </pre>
     *
     * @param model    모델
     * @param request  http 요청
     * @param response http 응답
     * @see AbstractView#renderMergedOutputModel(Map, HttpServletRequest, HttpServletResponse)
     */
    @Override
    protected final void renderMergedOutputModel(Map<String, Object> model, HttpServletRequest request, HttpServletResponse response) {

        // 머지 옵션설정
        MergeContext mergeContext = (MergeContext) model.get(MokaConstants.MERGE_CONTEXT);

        // debug 옵션
        mergeContext.getMergeOptions()
                    .setDebug(templateMergeDebug);
        long startTime = System.currentTimeMillis();

        String domainId = (String) mergeContext.get(MokaConstants.MERGE_DOMAIN_ID);
        String path = (String) mergeContext.get(MokaConstants.MERGE_PATH);
        String articleId = (String) mergeContext.get(MokaConstants.MERGE_CONTEXT_ARTICLE_ID);

        MokaTemplateMerger templateMerger = null;
        PrintWriter writer = null;
        String cacheType = "amparticle.merge";
        String cacheKey = String.format("%s_%s", domainId, articleId);

        try {
            String cached = null;
            if ( this.cacheManager != null) {
                cached = this.cacheManager.get(cacheType, cacheKey);
                if ( cached != null) { // cache가 있을 경우
                    writeArticle(request, response, cached);
                    return;
                }
            }
            templateMerger = this.domainTemplateMerger.getTemplateMerger(domainId);
            DataLoader loader = templateMerger.getDataLoader();
            Map<String,Object> paramMap = new HashMap<>();
            paramMap.put("totalId",articleId);
            JSONResult jsonResult = loader.getJSONResult("article",paramMap,true);
            Map<String,Object> articleInfo = rebuildInfo(jsonResult, mergeContext);
            mergeContext.set("article",articleInfo);
            StringBuilder sb = templateMerger.merge(MokaConstants.ITEM_ARTICLE_PAGE,
                    templateMerger.getArticlePageId(domainId, "A"), mergeContext);
            this.cacheManager.set(cacheType, cacheKey, sb.toString());
            writeArticle(request, response, sb.toString());
        } catch (TemplateMergeException e) {
            e.printStackTrace();
        } catch (TemplateParseException e) {
            e.printStackTrace();
        } catch (DataLoadException e) {
            e.printStackTrace();
        }
    }

    private void writeArticle(HttpServletRequest request,HttpServletResponse response, String content) {
        response.setContentType("text/html; charset=UTF-8");
        PrintWriter writer = null;
        try {
            writer = response.getWriter();
            writer.append(content);
        } catch (Exception e) {
            logger.error("Request:{}, Exception: {}", request.getRequestURI(), e.toString());
        } finally {
            if (writer != null) {
                writer.flush();
                writer.close();
            }
        }
    }

    private Map<String,Object> rebuildInfo(JSONResult jsonResult, MergeContext mergeContext) {
        Map<String,Object> article = new HashMap<>();
        article.put("basic",jsonResult.getDataListFirst("BASIC"));
        article.put("title",jsonResult.getDataList("TITLE"));
        article.put("content",jsonResult.getDataList("CONTENT"));
        article.put("reporter",jsonResult.getDataList("REPORTER"));
        article.put("meta",jsonResult.getDataList("META"));
        article.put("mastercode",jsonResult.getDataList("MASTERCODE"));
        article.put("servicemap",jsonResult.getDataList("SERVICEMAP"));
        article.put("keyword",jsonResult.getDataList("KEYWORD"));
        article.put("clickcnt",jsonResult.getDataList("CLICKCNT"));
        article.put("multi",jsonResult.getDataList("MULTI"));
        article.put("meta_fb",jsonResult.getDataListFirst("META_FB"));
        article.put("meta_tw",jsonResult.getDataListFirst("META_TW"));
        article.put("meta_ja",jsonResult.getDataListFirst("META_JA"));
        convertAmp(article);
        return article;
    }


    private void convertAmp(Map<String,Object> articleInfo) {
        List contentList = (List)articleInfo.get("content");
        Map contentMap = (Map)contentList.get(0);
        String originalContent = (String)contentMap.get("ART_CONTENT");
        // 본문
        String ampContent = originalContent.replaceAll("(?i)<br.*?\\/?>","<br>").replaceAll("\n","<br>").trim();
        // 제공하지 않는 컴포넌트 제거
        ampContent = ampContent.replaceAll("<div class=\"tag_pictorial\".+?<\\/div>","");
        ampContent = ampContent.replaceAll("<div class=\"tag_audio\".+?<\\/div>","");
        ampContent = ampContent.replaceAll("<div class=\"tag_jplus_link\".+?<\\/div>","");
        ampContent = ampContent.replaceAll("<div class=\"tag_poll\".+?<\\/div>","");

        //#region AMP Tag Converting
        //사용 태그 리스트
        String useTagList = "|";
        String[] convertResult; // convertResult[0]는 변환된 본문, convertResult[1]는 추가된 userTagList

        //이미지 (amp-img)
        ampContent = convertAmpImage(ampContent,false);

        //이미지 묶음 (amp-carousel)
        convertResult = convertAmpCarousel(ampContent);
        ampContent = convertResult[0];
        if ( convertResult[1].length() > 0 ) useTagList += convertResult[1];

        //이미지 - 기본 - 예전 기사 (amp-img)
        ampContent = convertAmpImage(ampContent,true);

        //동영상(amp-youtube)
        convertResult = convertAmpVod(ampContent);
        ampContent = convertResult[0];
        if ( convertResult[1].length() > 0) useTagList += convertResult[1];

        //아이프레임 (amp-iframe)
        convertResult = convertAmpIframe(ampContent);
        ampContent = convertResult[0];
        if ( convertResult[1].length() > 0) useTagList += convertResult[1];

        //SNS
        convertResult = convertAmpSns(ampContent);
        ampContent = convertResult[0];
        if ( convertResult[1].length() > 0) useTagList += convertResult[1];

        //QA
        ampContent = ampContent.replaceAll("(?i)<div class=\"tag_question\">(.*?)</div>","<dt>$1</dt>");
        ampContent = ampContent.replaceAll("(?i)<div class=\"tag_answer\">(.*?)</div>","<dd>$1</dd>");
        ampContent = ampContent.replaceAll("(?i)<div class=\"tag_interview\">(.*?)</div>","<div class=\"ab_qa\"><dl>$1</dl></div>");

        //인용구
        ampContent = ampContent.replaceAll("(?i)<div class=\"tag_quotation\">(.*?)</div>","<div class=\"ab_quot\"><p>$1</p></div>");

        // 서브 타이틀
        ampContent = convertAmpSubTitle(ampContent, articleInfo);

        // 메타 이미지

        // 타이틀 처리

        contentMap.put("ART_CONTENT",ampContent);
    }

    private static String DEFAULT_WIDTH = "480";
    private static String DEFAULT_HEIGHT = "270";
    private static String DEFAULT_IMAGE_PATH = "https://images.joins.com";
    private static Pattern PATTERN_PHOTO_BUNDLE = Pattern.compile("<div class=\"tag_photobundle\">.*?<img.+?<\\/div>", Pattern.CASE_INSENSITIVE);
    private static Pattern PATTERN_IMAGE = Pattern.compile("<div class=\"image\">.*?<img.+?<\\/div>", Pattern.CASE_INSENSITIVE);
    private static Pattern PATTERN_IMG = Pattern.compile("<img.+?>", Pattern.CASE_INSENSITIVE);
    private static Pattern PATTERN_SRC = Pattern.compile("src=\"[^\"]+", Pattern.CASE_INSENSITIVE);
    private static Pattern PATTERN_ALT = Pattern.compile("alt=\"[^\"]+", Pattern.CASE_INSENSITIVE);
    private static Pattern PATTERN_CAPTION = Pattern.compile("caption=\"[^\"]+", Pattern.CASE_INSENSITIVE);
    private static Pattern PATTERN_VOD = Pattern.compile("<div class=\"tag_vod\" data.+?<\\/div>", Pattern.CASE_INSENSITIVE);
    private static Pattern PATTERN_ID = Pattern.compile("id=\"[^\"]+", Pattern.CASE_INSENSITIVE);
    private static Pattern PATTERN_SERVICE = Pattern.compile("service=\"[^\"]+", Pattern.CASE_INSENSITIVE);
    private static Pattern PATTERN_HREF = Pattern.compile("href=\"[^\"]+", Pattern.CASE_INSENSITIVE);
    private static Pattern PATTERN_IFRAME = Pattern.compile("<iframe.+?<\\/iframe>", Pattern.CASE_INSENSITIVE);
    private static Pattern PATTERN_HEIGHT = Pattern.compile("height=\"[^\"]+", Pattern.CASE_INSENSITIVE);
    private static Pattern PATTERN_SNS = Pattern.compile("<div class=\"tag_sns\" data.+?<\\/div>", Pattern.CASE_INSENSITIVE);
    private static Pattern PATTERN_URL = Pattern.compile("url=\"[^\"]+", Pattern.CASE_INSENSITIVE);
    private static Pattern PATTERN_BR = Pattern.compile("<br>(\\s|&nbsp;)*?<br>", Pattern.CASE_INSENSITIVE);

    private String convertAmpImage(String ampContent, boolean old) {
        Matcher matcher;
        if ( old ) {
            matcher = PATTERN_IMG.matcher(ampContent);
        } else {
            matcher = PATTERN_IMAGE.matcher(ampContent);
        }
        while ( matcher.find()) {
            String image = matcher.group();
            String src = getFirstValue(PATTERN_SRC, image).replace("src=\"","");
            String alt = getFirstValue(PATTERN_ALT, image).replace("alt=\"","");
            String[] imageSize = this.getImageSize(src);
            if ( imageSize != null ) {
                String ampImage =
                        String.format("<amp-img src=\"%s\" width=\"%s\" height=\"%s\" layout=\"%s\" alt=\"%s\"></amp-img>",
                                src, imageSize[0], imageSize[1], "responsive", alt);
                ampContent = ampContent.replace(image, ampImage);
            } else {
                ampContent = ampContent
                        .replace(image, "")
                        .trim(); // 이미지정보가 없을 경우 제거함
            }
        }
        return ampContent;
    }

    private String[] convertAmpCarousel(String ampContent) {
        Matcher photoBundleMatcher = PATTERN_PHOTO_BUNDLE.matcher(ampContent);
        String useTagList = "";
        while ( photoBundleMatcher.find()) {
            String photoBuldle = photoBundleMatcher.group();
            String imageBuldleHtml = "";
            Matcher imageBuldleMatcher = PATTERN_IMG.matcher(photoBuldle);
            while ( imageBuldleMatcher.find()) {
                String image = imageBuldleMatcher.group();
                String src = getFirstValue(PATTERN_SRC, image).replace("src=\"","");
                String alt = getFirstValue(PATTERN_ALT, image).replace("alt=\"","");
                String caption = getFirstValue(PATTERN_CAPTION, image).replace("caption=\"", "");
                String[] imageSize = this.getImageSize(src);
                if ( imageSize != null ) {  // 이미지 width, height를 가져오는 처리 필요
                    imageBuldleHtml +=
                            String.format("<div class=\"%s\"><amp-img src=\"%s\" layout=\"%s\" alt=\"%s\"></amp-img>"
                                            + "<div class=\"%s\">%s</div></div>",
                                    "amp_slide",
                                    src,
                                    "fill",
                                    alt,
                                    "amp_caption",
                                    caption);
                }
            }
            if (McpString.isEmpty(imageBuldleHtml)) {
                ampContent = ampContent.replace(photoBuldle,"");
                continue;
            }
            ampContent = ampContent.replace(photoBuldle,
                    String.format("<div class=\"ab_photo photo_center\">"
                                    + "<amp-carousel class=\"%s\" width=\"%s\" height=\"%s\" layout=\"%s\" type=\"%s\">%s</amp-carousel>"
                                    + "</div>",
                    "amp_carousel",
                    450,
                    300,
                    "responsive",
                    "slides",
                    imageBuldleHtml)
                    ).trim();
            if (useTagList.indexOf("carousel") < 0) useTagList += "carousel|";
        }
        return new String[]{ampContent,useTagList};
    }

    private String[] convertAmpVod(String ampContent) {
        String useTagList = "";
        Matcher matcher= PATTERN_VOD.matcher(ampContent);
        while ( matcher.find()) {
            String vod = matcher.group();
            String id = getFirstValue(PATTERN_ID, vod).replace("id=\"","");
            String service = getFirstValue(PATTERN_SERVICE, vod).replace("service=\"","");
            if ( McpString.isEmpty(id) || McpString.isEmpty(service)) {
                ampContent = ampContent.replace(vod, "").trim();
                continue;
            }
            if ( vod.equals("youtube")) {
                ampContent.replace(vod,
                        String.format("<div class=\"ab_player\"><div class=\"player_area\">"
                                        + "<amp-youtube data-videoid=\"%s\" width=\"%s\" height=\"%s\" layout=\"%s\"></amp-youtube>"
                                        + "</div></div>",
                         id.substring(id.lastIndexOf("/") + 1),
                                DEFAULT_WIDTH,
                                DEFAULT_HEIGHT,
                                "responsive" ));
                if (useTagList.indexOf("youtube") < 0) useTagList += "youtube|";
            } else if ("facebooklive".indexOf(service) > -1) {
                String href ="";
                try {
                    href = URLDecoder.decode(getFirstValue(PATTERN_HREF, id).replace("href=\"",""),"UTF-8");
                    ampContent = ampContent.replace(vod,
                            String.format("<div class=\"ab_player\"><div class=\"player_area\"><amp-facebook data-href=\"%s\" "
                                            + "data-embed-as=\"%s\" width=\"%s\" height=\"%s\" layout=\"%s\"></amp-facebook></div></div>",
                                    href.replace("http:","https:"),
                                    "video",
                                    DEFAULT_WIDTH,
                                    DEFAULT_HEIGHT,
                                    "responsive" )
                            ).trim();
                    if (useTagList.indexOf("facebook") < 0) useTagList += "facebook|";
                } catch (UnsupportedEncodingException e) {
                    logger.warn("Url decode fail:{}",href);
                    ampContent = ampContent.replace(vod, "").trim();
                }
            } else if ("navercast,kakaotv".indexOf(service) > -1) {
                ampContent = ampContent.replace(vod,
                        String.format("<div class=\"ab_player\"><div class=\"player_area\">"
                                        + "<amp-iframe src=\"%s\" sandbox=\"%s\" width=\"%s\" height=\"%s\" "
                                        + "layout=\"%s\" frameborder=\"%s\" allowfullscreen>%s"
                                        + "</amp-iframe></div></div>",
                                id.replace("http:","https:"),
                                "allow-same-origin allow-scripts allow-popups allow-forms allow-modals",
                                DEFAULT_WIDTH,
                                DEFAULT_HEIGHT,
                                "responsive",
                                0,
                                "<amp-img layout=\"fill\" src=\"" + DEFAULT_IMAGE_PATH + "/mw/common/v_noimg.png\" placeholder></amp-img>" )
                ).trim();
                if (useTagList.indexOf("iframe") < 0) useTagList += "iframe|";
            } else {
                ampContent = ampContent.replace(vod,"").trim();
            }
        }
        return new String[]{ampContent,useTagList};
    }

    private String[] convertAmpIframe(String ampContent) {
        String useTagList = "";
        Matcher matcher = PATTERN_IFRAME.matcher(ampContent);
        while ( matcher.find()) {
            String iframe = matcher.group();
            String src = getFirstValue(PATTERN_SRC, iframe).replace("src=\"","");
            String height = getFirstValue(PATTERN_HEIGHT, iframe).replace("height=\"","");
            if ( src.indexOf("https:") < 0 || McpString.isEmpty(height)) {
                ampContent = ampContent.replace(iframe,"").trim();
                continue;
            }
            ampContent = ampContent.replace(iframe,
                    String.format("<amp-iframe src=\"{0}\" sandbox=\"{1}\" width=\"{2}\" height=\"{3}\" layout=\"{4}\" frameborder=\"{5}\">{6}</amp-iframe>",
                            src,
                            "allow-same-origin allow-scripts allow-popups allow-forms allow-modals",
                            DEFAULT_WIDTH,
                            height,
                            "responsive",
                            "0",
                            "<amp-img layout=\"fill\" src=\"" + DEFAULT_IMAGE_PATH + "/mw/common/v_noimg.png\" placeholder></amp-img>"
                            )).trim();
            if (useTagList.indexOf("iframe") < 0) useTagList += "iframe|";
        }
        return new String[]{ampContent,useTagList};
    }

    private String[] convertAmpSns(String ampContent) {
        String useTagList = "";
        Matcher matcher = PATTERN_SNS.matcher(ampContent);
        while ( matcher.find()) {
            String sns = matcher.group();
            String url = getFirstValue(PATTERN_URL, sns).replace("url=\"","");
            String service = getFirstValue(PATTERN_SERVICE, sns).replace("service=\"","");
            if ( McpString.isEmpty(url) || McpString.isEmpty(service)) {
                ampContent = ampContent.replace(sns, "").trim();
                continue;
            }
            if ("twitter,instagram".indexOf(service) > -1) {
                url = (url.endsWith("/")) ? url.substring(0, url.length() - 1) : url;
                String[] urlArray = url.split("/");
                url = urlArray[urlArray.length-1];
            }
            if ( service.equals("facebook")) {
                ampContent = ampContent.replace(sns,
                        String.format("<div class=\"ab_sns\"><amp-facebook data-href=\"%s\" width=\"%s\" height=\"%s\" layout=\"%s\">"
                                        + "</amp-facebook></div>",
                                url.replace("http:", "https:"),
                                DEFAULT_WIDTH,
                                DEFAULT_HEIGHT,
                                "responsive"
                                )
                        ).trim();
                if (useTagList.indexOf("facebook") < 0) useTagList += "facebook|";
            } else if ( service.equals("twitter")) {
                ampContent = ampContent.replace(sns,
                        String.format("<div class=\"ab_sns\"><amp-twitter data-tweetid=\"%s\" width=\"%s\" height=\"%s\" layout=\"%s\">"
                                        + "</amp-twitter></div>",
                                url,
                                DEFAULT_WIDTH,
                                DEFAULT_HEIGHT,
                                "responsive"
                        )
                ).trim();
                if (useTagList.indexOf("twitter") < 0) useTagList += "twitter|";
            } else if ( service.equals("instagram")) {
                ampContent = ampContent.replace(sns,
                        String.format("<div class=\"ab_sns\"><amp-instagram data-shortcode=\"%s\" data-captioned width=\"%s\" height=\"%s\" "
                                        + "layout=\"%s\"></amp-instagram></div>",
                                url,
                                DEFAULT_WIDTH,
                                DEFAULT_HEIGHT,
                                "responsive"
                        )
                ).trim();
                if (useTagList.indexOf("instagram") < 0) useTagList += "instagram|";
            } else if ( service.equals("pinterest")) {
                ampContent = ampContent.replace(sns,
                        String.format("<div class=\"ab_sns\"><amp-pinterest data-url=\"%s\" data-do=\"%s\" width=\"%s\" height=\"%s\">"
                                        + "</amp-pinterest></div>",
                                url,
                                "embedPin",
                                DEFAULT_WIDTH,
                                DEFAULT_HEIGHT
                        )
                ).trim();
                if (useTagList.indexOf("pinterest") < 0) useTagList += "pinterest|";
            } else {
                ampContent = ampContent.replace(sns, "").trim();
            }
        }
        return new String[]{ampContent,useTagList};
    }

    private String convertAmpSubTitle(String ampContent, Map<String,Object> articleInfo) {
        Map basicMap = (Map)articleInfo.get("basic");
        Object subTitleObj = basicMap.get("ART_SUB_TITLE");
        if ( subTitleObj == null) {
            return ampContent;
        }
        Matcher matcher = PATTERN_BR.matcher(ampContent);
        if ( !matcher.find()) { // 첫번째는 skip
            return ampContent;
        }
        if (matcher.find()) { // 두번째에 삽입
            StringBuffer sb = new StringBuffer(ampContent.length());
            matcher.appendReplacement(sb,"<div class=\"ab_subtitle\"><p>" + (String)subTitleObj + "</p></div>");
            matcher.appendTail(sb);
            ampContent = sb.toString();
        }
        return ampContent;
    }

    private String getFirstValue(Pattern pattern, String text) {
        Matcher matcher = pattern.matcher(text);
        if ( matcher.find()) {
            return matcher.group();
        } else {
            return "";
        }
    }

    private String[] getImageSize(String src) {
        try {
            URL imageUrl = new URL(src);
            Image image = ImageIO.read(imageUrl);
            String[] size = new String[2];
            size[0] = Integer.toString(image.getWidth(null));
            size[1] = Integer.toString(image.getHeight(null));
            return size;
        } catch (IOException e) {
            logger.warn("Can't get imageSize: {}",src);
        }
        return null;
    }
}