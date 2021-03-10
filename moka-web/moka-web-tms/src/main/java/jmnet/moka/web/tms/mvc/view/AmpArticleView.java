package jmnet.moka.web.tms.mvc.view;

import java.awt.Image;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.net.URLDecoder;
import java.util.HashMap;
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
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.DpsApiConstants;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.logger.ActionLogger;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.util.HttpHelper;
import jmnet.moka.core.tms.merge.KeyResolver;
import jmnet.moka.core.tms.merge.MokaDomainTemplateMerger;
import jmnet.moka.core.tms.merge.MokaFunctions;
import jmnet.moka.core.tms.merge.MokaTemplateMerger;
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
    private static Pattern PATTERN_ALT_REFINE = Pattern.compile("alt=\".*?\"", Pattern.CASE_INSENSITIVE);
    private static Pattern PATTERN_YOUTUBE_ID = Pattern.compile("[\\w-]{11}");
    private static Pattern PATTERN_ETC = Pattern.compile("(div|span|style)", Pattern.CASE_INSENSITIVE);
    private static String AD_IN_BODY = "<br><br><div class=\"shopping_box\">"
            + "<amp-ad width=\"336\" height=\"280\" type=\"doubleclick\" data-slot=\"/30349040/AMP_Joongang_article_336x280\"></amp-ad>"
            + "</div><br>";
    @Value("${tms.mte.debug}")
    private boolean templateMergeDebug;
    @Value("${tms.page.cache}")
    private boolean isPageCache;
    @Autowired
    private MokaDomainTemplateMerger domainTemplateMerger;
    @Autowired(required = false)
    private CacheManager cacheManager;
    @Autowired
    private ActionLogger actionLogger;
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
        mergeContext
                .getMergeOptions()
                .setDebug(templateMergeDebug);
        long startTime = System.currentTimeMillis();

        String domainId = (String) mergeContext.get(MokaConstants.MERGE_DOMAIN_ID);
        String path = (String) mergeContext.get(MokaConstants.MERGE_PATH);
        String articleId = (String) mergeContext.get(MokaConstants.MERGE_CONTEXT_ARTICLE_ID);

        MokaTemplateMerger templateMerger = null;
        PrintWriter writer = null;
        String cacheType = KeyResolver.CACHE_AMP_ARTICLE_MERGE;
        String cacheKey = KeyResolver.makeAmpArticleCacheKey(domainId, articleId);
        try {
            String cached = null;
            if (this.cacheManager != null) {
                cached = this.cacheManager.get(cacheType, cacheKey);
                if (cached != null) { // cache가 있을 경우
                    writeArticle(request, response, cached);
                    actionLogger.success(HttpHelper.getRemoteAddr(request), ActionType.ARTICLE,
                            System.currentTimeMillis() - (long) mergeContext.get(MokaConstants.MERGE_START_TIME), articleId);
                    return;
                }
            }
            templateMerger = this.domainTemplateMerger.getTemplateMerger(domainId);
            DataLoader loader = templateMerger.getDataLoader();
            Map<String, Object> paramMap = new HashMap<>();
            paramMap.put("totalId", articleId);
            JSONResult jsonResult = loader.getJSONResult(DpsApiConstants.ARTICLE, paramMap, true);
            Map<String, Object> articleInfo = (Map<String, Object>)jsonResult.get("article");
            convertAmp(articleInfo);
            mergeContext.set("article", articleInfo);
            StringBuilder sb = templateMerger.merge(MokaConstants.ITEM_ARTICLE_PAGE, templateMerger.getArticlePageId(domainId, "A"), mergeContext);
            if (this.cacheManager != null) {
                this.cacheManager.set(cacheType, cacheKey, sb.toString());
            }
            writeArticle(request, response, sb.toString());
            actionLogger.success(HttpHelper.getRemoteAddr(request), ActionType.AMP_ARTICLE,
                    System.currentTimeMillis() - (long) mergeContext.get(MokaConstants.MERGE_START_TIME), articleId);
        } catch (TemplateMergeException | TemplateParseException | DataLoadException e) {
            e.printStackTrace();
            actionLogger.fail(HttpHelper.getRemoteAddr(request), ActionType.AMP_ARTICLE,
                    System.currentTimeMillis() - (long) mergeContext.get(MokaConstants.MERGE_START_TIME), articleId + " " + e.getMessage());
        }

    }

    private void writeArticle(HttpServletRequest request, HttpServletResponse response, String content) {
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

    private void convertAmp(Map<String, Object> articleInfo) {
        String originalContent = (String) articleInfo.get("ART_CONTENT");
        // 본문
        String ampContent = originalContent
                .replaceAll("(?i)<br.*?\\/?>", "<br>")
                .replaceAll("\n", "<br>")
                .trim();
        // 제공하지 않는 컴포넌트 제거
        ampContent = ampContent.replaceAll("<div class=\"tag_pictorial\".+?<\\/div>", "");
        ampContent = ampContent.replaceAll("<div class=\"tag_audio\".+?<\\/div>", "");
        ampContent = ampContent.replaceAll("<div class=\"tag_jplus_link\".+?<\\/div>", "");
        ampContent = ampContent.replaceAll("<div class=\"tag_poll\".+?<\\/div>", "");

        //#region AMP Tag Converting
        //사용 태그 리스트
        String useTagList = "|";
        String[] convertResult; // convertResult[0]는 변환된 본문, convertResult[1]는 추가된 userTagList

        //이미지 (amp-img)
        ampContent = convertAmpImage(ampContent, false);

        //이미지 묶음 (amp-carousel)
        convertResult = convertAmpCarousel(ampContent);
        ampContent = convertResult[0];
        if (convertResult[1].length() > 0) {
            useTagList += convertResult[1];
        }

        //이미지 - 기본 - 예전 기사 (amp-img)
        ampContent = convertAmpImage(ampContent, true);

        //동영상(amp-youtube)
        convertResult = convertAmpVod(ampContent);
        ampContent = convertResult[0];
        if (convertResult[1].length() > 0) {
            useTagList += convertResult[1];
        }

        //아이프레임 (amp-iframe)
        convertResult = convertAmpIframe(ampContent);
        ampContent = convertResult[0];
        if (convertResult[1].length() > 0) {
            useTagList += convertResult[1];
        }

        //SNS
        convertResult = convertAmpSns(ampContent);
        ampContent = convertResult[0];
        if (convertResult[1].length() > 0) {
            useTagList += convertResult[1];
        }

        //QA
        ampContent = ampContent.replaceAll("(?i)<div class=\"tag_question\">(.*?)</div>", "<dt>$1</dt>");
        ampContent = ampContent.replaceAll("(?i)<div class=\"tag_answer\">(.*?)</div>", "<dd>$1</dd>");
        ampContent = ampContent.replaceAll("(?i)<div class=\"tag_interview\">(.*?)</div>", "<div class=\"ab_qa\"><dl>$1</dl></div>");

        //인용구
        ampContent = ampContent.replaceAll("(?i)<div class=\"tag_quotation\">(.*?)</div>", "<div class=\"ab_quot\"><p>$1</p></div>");

        //서브 타이틀
        ampContent = convertAmpSubTitle(ampContent, articleInfo);

        //메타 이미지 (
        setMetaImage(articleInfo);

        //타이틀 처리
        setMobileTitle(articleInfo);

        //alt 태그 수정
        ampContent = convertAmpAlt(ampContent);

        //유튜브 태그 수정 -> 동영상(amp-youtube)에서 처리

        //비정상 태그 수정
        //제외 태그
        ampContent = convertAmpEtc(ampContent);

        //본문 광고 삽입
        ampContent = setAmpAd(ampContent);

        articleInfo.put("ART_CONTENT", ampContent);
        articleInfo.put("userTagList", useTagList);
    }

    private String convertAmpImage(String ampContent, boolean old) {
        Matcher matcher;
        if (old) {
            matcher = PATTERN_IMG.matcher(ampContent);
        } else {
            matcher = PATTERN_IMAGE.matcher(ampContent);
        }
        StringBuilder sb = new StringBuilder(ampContent.length() * 2);
        while (matcher.find()) {
            String image = matcher.group();
            String src = getFirstValue(PATTERN_SRC, image).replace("src=\"", "");
            String alt = getFirstValue(PATTERN_ALT, image).replace("alt=\"", "");
            String[] imageSize = this.getImageSize(src);
            if (imageSize != null) {
                matcher.appendReplacement(sb,
                        String.format("<amp-img src=\"%s\" width=\"%s\" height=\"%s\" layout=\"%s\" alt=\"%s\"></amp-img>", src, imageSize[0],
                                imageSize[1], "responsive", alt));
            } else {
                matcher.appendReplacement(sb, "");
            }
        }
        matcher.appendTail(sb);
        return sb.toString();
    }

    private String[] convertAmpCarousel(String ampContent) {
        Matcher photoBundleMatcher = PATTERN_PHOTO_BUNDLE.matcher(ampContent);
        String useTagList = "";
        StringBuilder sb = new StringBuilder(ampContent.length() * 2);
        while (photoBundleMatcher.find()) {
            String photoBuldle = photoBundleMatcher.group();
            String imageBuldleHtml = "";
            Matcher imageBuldleMatcher = PATTERN_IMG.matcher(photoBuldle);
            while (imageBuldleMatcher.find()) {
                String image = imageBuldleMatcher.group();
                String src = getFirstValue(PATTERN_SRC, image).replace("src=\"", "");
                String alt = getFirstValue(PATTERN_ALT, image).replace("alt=\"", "");
                String caption = getFirstValue(PATTERN_CAPTION, image).replace("caption=\"", "");
                String[] imageSize = this.getImageSize(src);
                if (imageSize != null) {  // 이미지 width, height를 가져오는 처리 필요
                    imageBuldleHtml += String.format(
                            "<div class=\"%s\"><amp-img src=\"%s\" layout=\"%s\" alt=\"%s\"></amp-img>" + "<div class=\"%s\">%s</div></div>",
                            "amp_slide", src, "fill", alt, "amp_caption", caption);
                }
            }
            if (McpString.isEmpty(imageBuldleHtml)) {
                photoBundleMatcher.appendReplacement(sb, "");
            } else {
                photoBundleMatcher.appendReplacement(sb, String.format("<div class=\"ab_photo photo_center\">"
                                + "<amp-carousel class=\"%s\" width=\"%s\" height=\"%s\" layout=\"%s\" type=\"%s\">%s</amp-carousel>" + "</div>",
                        "amp_carousel", "450", "300", "responsive", "slides", imageBuldleHtml));
                if (useTagList.indexOf("carousel") < 0) {
                    useTagList += "carousel|";
                }
            }
        }
        photoBundleMatcher.appendTail(sb);
        return new String[] {sb.toString(), useTagList};
    }

    private String[] convertAmpVod(String ampContent) {
        String useTagList = "";
        Matcher matcher = PATTERN_VOD.matcher(ampContent);
        StringBuilder sb = new StringBuilder(ampContent.length() * 2);
        while (matcher.find()) {
            String vod = matcher.group();
            String id = getFirstValue(PATTERN_ID, vod).replace("id=\"", "");
            String service = getFirstValue(PATTERN_SERVICE, vod).replace("service=\"", "");
            if (McpString.isEmpty(id) || McpString.isEmpty(service)) {
                matcher.appendReplacement(sb, "");
            } else {
                if (service.equals("youtube")) {
                    String youtubeId = id.substring(id.lastIndexOf("/") + 1);
                    youtubeId = getFirstValue(PATTERN_YOUTUBE_ID, youtubeId); // 11자리 Id를 추출
                    matcher.appendReplacement(sb, String.format("<div class=\"ab_player\"><div class=\"player_area\">"
                                    + "<amp-youtube data-videoid=\"%s\" width=\"%s\" height=\"%s\" layout=\"%s\"></amp-youtube>" + "</div></div>", youtubeId,
                            DEFAULT_WIDTH, DEFAULT_HEIGHT, "responsive"));
                    if (useTagList.indexOf("youtube") < 0) {
                        useTagList += "youtube|";
                    }
                } else if ("facebooklive".indexOf(service) > -1) {
                    String href = "";
                    try {
                        href = URLDecoder.decode(getFirstValue(PATTERN_HREF, id).replace("href=\"", ""), "UTF-8");
                        matcher.appendReplacement(sb, String.format(
                                "<div class=\"ab_player\"><div class=\"player_area\"><amp-facebook data-href=\"%s\" "
                                        + "data-embed-as=\"%s\" width=\"%s\" height=\"%s\" layout=\"%s\"></amp-facebook></div></div>",
                                href.replace("http:", "https:"), "video", DEFAULT_WIDTH, DEFAULT_HEIGHT, "responsive"));
                        if (useTagList.indexOf("facebook") < 0) {
                            useTagList += "facebook|";
                        }
                    } catch (UnsupportedEncodingException e) {
                        logger.warn("Url decode fail:{}", href);
                        matcher.appendReplacement(sb, "");
                    }
                } else if ("navercast,kakaotv".indexOf(service) > -1) {
                    matcher.appendReplacement(sb, String.format("<div class=\"ab_player\"><div class=\"player_area\">"
                                    + "<amp-iframe src=\"%s\" sandbox=\"%s\" width=\"%s\" height=\"%s\" "
                                    + "layout=\"%s\" frameborder=\"%s\" allowfullscreen>%s" + "</amp-iframe></div></div>", id.replace("http:", "https:"),
                            "allow-same-origin allow-scripts allow-popups allow-forms allow-modals", DEFAULT_WIDTH, DEFAULT_HEIGHT, "responsive", 0,
                            "<amp-img layout=\"fill\" src=\"" + DEFAULT_IMAGE_PATH + "/mw/common/v_noimg.png\" placeholder></amp-img>"));
                    if (!useTagList.contains("iframe")) {
                        useTagList += "iframe|";
                    }
                } else {
                    matcher.appendReplacement(sb, "");
                }
            }
        }
        matcher.appendTail(sb);
        return new String[] {sb.toString(), useTagList};
    }

    private String[] convertAmpIframe(String ampContent) {
        String useTagList = "";
        Matcher matcher = PATTERN_IFRAME.matcher(ampContent);
        StringBuilder sb = new StringBuilder(ampContent.length() * 2);
        while (matcher.find()) {
            String iframe = matcher.group();
            String src = getFirstValue(PATTERN_SRC, iframe).replace("src=\"", "");
            String height = getFirstValue(PATTERN_HEIGHT, iframe).replace("height=\"", "");
            if (!src.contains("https:") || McpString.isEmpty(height)) {
                matcher.appendReplacement(sb, "");
            } else {
                matcher.appendReplacement(sb, String.format(
                        "<amp-iframe src=\"%s\" sandbox=\"%s\" width=\"%s\" height=\"%s\" layout=\"%s\" frameborder=\"%s\">%s</amp-iframe>", src,
                        "allow-same-origin allow-scripts allow-popups allow-forms allow-modals", DEFAULT_WIDTH, height, "responsive", "0",
                        "<amp-img layout=\"fill\" src=\"" + DEFAULT_IMAGE_PATH + "/mw/common/v_noimg.png\" placeholder></amp-img>"));
                if (useTagList.indexOf("iframe") < 0) {
                    useTagList += "iframe|";
                }
            }
        }
        matcher.appendTail(sb);
        return new String[] {sb.toString(), useTagList};
    }

    private String[] convertAmpSns(String ampContent) {
        String useTagList = "";
        Matcher matcher = PATTERN_SNS.matcher(ampContent);
        StringBuilder sb = new StringBuilder(ampContent.length() * 2);
        while (matcher.find()) {
            String sns = matcher.group();
            String url = getFirstValue(PATTERN_URL, sns).replace("url=\"", "");
            String service = getFirstValue(PATTERN_SERVICE, sns).replace("service=\"", "");
            if (McpString.isEmpty(url) || McpString.isEmpty(service)) {
                matcher.appendReplacement(sb, "");
            } else {
                if ("twitter,instagram".indexOf(service) > -1) {
                    url = (url.endsWith("/")) ? url.substring(0, url.length() - 1) : url;
                    String[] urlArray = url.split("/");
                    url = urlArray[urlArray.length - 1];
                }
                if (service.equals("facebook")) {
                    matcher.appendReplacement(sb, String.format(
                            "<div class=\"ab_sns\"><amp-facebook data-href=\"%s\" width=\"%s\" height=\"%s\" layout=\"%s\">"
                                    + "</amp-facebook></div>", url.replace("http:", "https:"), DEFAULT_WIDTH, DEFAULT_HEIGHT, "responsive"));
                    if (useTagList.indexOf("facebook") < 0) {
                        useTagList += "facebook|";
                    }
                } else if (service.equals("twitter")) {
                    matcher.appendReplacement(sb, String.format(
                            "<div class=\"ab_sns\"><amp-twitter data-tweetid=\"%s\" width=\"%s\" height=\"%s\" layout=\"%s\">"
                                    + "</amp-twitter></div>", url, DEFAULT_WIDTH, DEFAULT_HEIGHT, "responsive"));
                    if (useTagList.indexOf("twitter") < 0) {
                        useTagList += "twitter|";
                    }
                } else if (service.equals("instagram")) {
                    matcher.appendReplacement(sb, String.format(
                            "<div class=\"ab_sns\"><amp-instagram data-shortcode=\"%s\" data-captioned width=\"%s\" height=\"%s\" "
                                    + "layout=\"%s\"></amp-instagram></div>", url, DEFAULT_WIDTH, DEFAULT_HEIGHT, "responsive"));
                    if (useTagList.indexOf("instagram") < 0) {
                        useTagList += "instagram|";
                    }
                } else if (service.equals("pinterest")) {
                    matcher.appendReplacement(sb, String.format(
                            "<div class=\"ab_sns\"><amp-pinterest data-url=\"%s\" data-do=\"%s\" width=\"%s\" height=\"%s\">"
                                    + "</amp-pinterest></div>", url, "embedPin", DEFAULT_WIDTH, DEFAULT_HEIGHT));
                    if (useTagList.indexOf("pinterest") < 0) {
                        useTagList += "pinterest|";
                    }
                } else {
                    matcher.appendReplacement(sb, "");
                }
            }
        }
        matcher.appendTail(sb);
        return new String[] {sb.toString(), useTagList};
    }

    private String convertAmpSubTitle(String ampContent, Map<String, Object> articleInfo) {
        Object subTitleObj = articleInfo.get("ART_SUB_TITLE");
        if (McpString.isEmpty(subTitleObj)) {
            return ampContent;
        }
        Matcher matcher = PATTERN_BR.matcher(ampContent);
        if (!matcher.find()) { // 첫번째는 skip
            return ampContent;
        }
        if (matcher.find()) { // 두번째에 삽입
            StringBuffer sb = new StringBuffer(ampContent.length());
            matcher.appendReplacement(sb, "<div class=\"ab_subtitle\"><p>" + (String) subTitleObj + "</p></div>");
            matcher.appendTail(sb);
            ampContent = sb.toString();
        }
        return ampContent;
    }

    private void setMetaImage(Map<String, Object> articleInfo) {
        String jaImage = (String) articleInfo.get("ART_THUMB");
        String[] size = null;
        if (McpString.isNotEmpty(jaImage)) {
            size = getImageSize(jaImage);
        }
        if (size != null) {
            articleInfo.put("IMAGE_WIDTH", size[0]);
            articleInfo.put("IMAGE_HEIGHT", size[1]);
        } else {
            articleInfo.put("IMG_URL", "https://static.joins.com/joongang_15re/profile_joongang_200.png");
            articleInfo.put("IMAGE_WIDTH", 200);
            articleInfo.put("IMAGE_HEIGHT", 200);
        }
    }

    private void setMobileTitle(Map<String, Object> articleInfo) {
        String mobileTitle = (String)articleInfo.get("MOB_TITLE");
        mobileTitle = mobileTitle
                .replace("<.*?>", "")
                .trim();
        articleInfo.put("MOB_TITLE", mobileTitle);
    }

    private String convertAmpAlt(String ampContent) {
        Matcher matcher = PATTERN_ALT_REFINE.matcher(ampContent);
        StringBuilder sb = new StringBuilder(ampContent.length() * 2);
        while (matcher.find()) {
            String alt = matcher.group();
            String altRefined = alt.substring(5, alt.length() - 1);
            if (PATTERN_ETC
                    .matcher(altRefined)
                    .results()
                    .count() > 0) {
                altRefined = "";
            } else {
                altRefined = altRefined
                        .replace("\"", "'")
                        .replace("&#34;", "'")
                        .replace("&#39;", "'");
            }
            matcher.appendReplacement(sb, "alt=\"" + altRefined + "\"");
        }
        matcher.appendTail(sb);
        return sb.toString();
    }

    private String convertAmpEtc(String ampContent) {
        //비정상 태그 수정
        ampContent = ampContent.replaceAll("(?i); bgcolor=\"(\\s?)(#\\w{6})\" b", ";\" b");
        ampContent = ampContent.replaceAll("(?i)(a\\s)?target=('|\"|”)?_?(new|blank|joinsnews|notice_win)\\2?", "target=\"_blank\"");
        ampContent = ampContent
                .replace("\"“", "\"")
                .replace("”\"", "\"")
                .replace("\"‘", "\"")
                .replace("’\"", "\"")
                .replace("hhttp", "http");
        ampContent = ampContent.replace("<a class=\"style2\" style=\"MARGIN-TOP: 0px; MARGIN-BOTTOM: 0px; LINE-HEIGHT: 100%\"<font size=\"2\">", "");

        //제외 태그
        ampContent = ampContent.replaceAll("<div class=\"dim\".+?>.*?<\\/div>", "");
        ampContent = ampContent.replaceAll("(?i)<(embed|map|script|style|video).*?<\\/\\1>", "");
        ampContent =
                ampContent.replaceAll("(?i)<\\/?(blog|embed|font|form|hr|http|img|jtbc|link|mbc|meta|new|object|param|special|width|yonhap).*?>", "");
        ampContent = ampContent.replaceAll("<\\/?[\\w\\s-.]+@+[\\w\\s-.,]+>", "");
        ampContent = ampContent.replaceAll("<[a-z0-9.]+(\\.{1})[a-z]+>", "");
        ampContent = ampContent.replaceAll("<!--.*?-->", "");
        ampContent = ampContent.replaceAll("(?i)<[EF]\\w{3}>", "");
        ampContent = ampContent.replaceAll("(?i)<[^amp|^<|^>]*?[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+.*?>", "");
        ampContent = ampContent.replaceAll(
                "(?i)(background|basefont|bordercolor|contenteditable|fonttext|name|onclick|rgb|style|to-remove-element|cols|rows|colspan|rowspan)=('|\").*?\\2",
                "");
        ampContent = ampContent.replaceAll("(?i)('|\")javascript:.*?\\1", "");
        ampContent = ampContent
                .replace("&#34;", "\"")
                .replace("&#39;", "'");
        ampContent = ampContent.replace("<hr><hr>", "");

        return ampContent;
    }

    private String setAmpAd(String ampContent) {
        Matcher matcher = PATTERN_BR.matcher(ampContent);
        int matchCount = 0;
        while (matcher.find()) {
            matchCount++;
            if (matchCount == 4) {
                StringBuffer sb = new StringBuffer(ampContent.length());
                matcher.appendReplacement(sb, AD_IN_BODY);
                matcher.appendTail(sb);
                return sb.toString();
            }
        }
        return ampContent + AD_IN_BODY;
    }

    private String getFirstValue(Pattern pattern, String text) {
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
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
            logger.warn("Can't get imageSize: {}", src);
        }
        return null;
    }
}
