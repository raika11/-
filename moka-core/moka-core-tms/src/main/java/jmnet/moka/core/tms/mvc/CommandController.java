package jmnet.moka.core.tms.mvc;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.LoggerContext;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.io.Writer;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jmnet.moka.common.cache.CacheManager;
import jmnet.moka.common.cache.exception.CacheException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.purge.model.PurgeItem;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.tms.merge.CacheHelper;
import jmnet.moka.core.tms.merge.MokaDomainTemplateMerger;
import jmnet.moka.core.tms.merge.item.DomainItem;
import jmnet.moka.core.tms.merge.item.MergeItem;
import jmnet.moka.core.tms.mvc.abtest.AbTest;
import jmnet.moka.core.tms.mvc.abtest.AbTestResolver;
import jmnet.moka.core.tms.mvc.domain.DomainResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * <pre>
 * TMS?????? ????????? ????????? ???????????? command??? ????????????.
 * 2019. 9. 27. kspark ????????????
 * </pre>
 *
 * @author kspark
 * @since 2019. 9. 27. ?????? 7:09:59
 */
@Controller
@Api(tags = {"?????? API"})
public class CommandController {

    public final static Logger logger = LoggerFactory.getLogger(CommandController.class);

    public static final HttpHeaders HTTP_HTML_UTF8;

    static {
        HTTP_HTML_UTF8 = new HttpHeaders();
        HTTP_HTML_UTF8.setContentType(new MediaType("text", "html", StandardCharsets.UTF_8));
    }

    @Autowired
    private CacheManager cacheManager;

    @Autowired
    private HttpParamFactory httpParamFactory;

    @Lazy
    @Autowired
    private DomainResolver domainResolver;

    @Autowired
    private CdnRedirector cdnRedirector;

    @Qualifier("domainTemplateMerger")
    @Autowired
    private MokaDomainTemplateMerger domainTemplateMerger;


    @Qualifier("abTestResolver")
    @Autowired
    private AbTestResolver abTestResolver;

    @Value("${tms.merge.save.page.path}")
    private String savePagePath;

    private ResponseEntity<?> responseException(Exception e) {
        logger.error("Command Execute Fail:", e);
        String exceptionMessage = e
                .getClass()
                .getName() + ":" + e.getMessage();
        ResultDTO<String> resultDTO = new ResultDTO<String>(500, exceptionMessage);
        StringWriter sw = new StringWriter();
        e.printStackTrace(new PrintWriter(sw));
        resultDTO.setBody(sw.toString());
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    private ResponseEntity<?> responseString(String message) {
        ResultDTO<String> resultDTO = new ResultDTO<String>(message);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.GET, path = "/command/health", produces = "text/plain")
    public ResponseEntity<?> _health(HttpServletRequest request, HttpServletResponse response) {
        return new ResponseEntity<>("OK", HttpStatus.OK);
    }

    @ApiOperation(value = "Command ????????????", nickname = "commandList")
    @RequestMapping(method = RequestMethod.GET, path = "/command/commandList", produces = "application/json")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Success", response = String.class), @ApiResponse(code = 500, message = "Failure")})
    public ResponseEntity<?> _commandList(HttpServletRequest request, HttpServletResponse response) {
        try {
            HashMap<String, Object> commandMap = new LinkedHashMap<String, Object>(8);
            Method[] commandMethods = this
                    .getClass()
                    .getMethods();
            for (Method commandMethod : commandMethods) {
                String methodName = commandMethod.getName();
                ApiOperation apiOperation = commandMethod.getAnnotation(ApiOperation.class);
                if (apiOperation != null) {
                    RequestMapping requestMapping = commandMethod.getAnnotation(RequestMapping.class);
                    commandMap.put(methodName, Arrays.asList(apiOperation.value(), requestMapping.path()[0]));
                }
            }
            return new ResponseEntity<>(new ResultDTO<HashMap<String, Object>>(commandMap), HttpStatus.OK);
        } catch (Exception e) {
            return responseException(e);
        }
    }

    @ApiOperation(value = "????????? ?????? ??? ??????", nickname = "domainLoad")
    @RequestMapping(method = RequestMethod.GET, path = "/command/domain", produces = "application/json")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "load", value = "????????? ??????:Y/N", required = false, dataType = "string", allowableValues = "Y,N", paramType = "query", defaultValue = "N")})
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Success", response = String.class), @ApiResponse(code = 500, message = "Failure")})
    public ResponseEntity<?> _domain(HttpServletRequest request, HttpServletResponse response) {
        try {
            String load = request.getParameter("load");
            boolean isLoad = load != null && !load.equalsIgnoreCase("N");
            if (isLoad) {
                this.domainResolver.loadDomain();
            }
            List<DomainItem> domainList = this.domainResolver.getDomainInfoList();
            return new ResponseEntity<>(new ResultDTO<List<DomainItem>>(domainList), HttpStatus.OK);

        } catch (Exception e) {
            return responseException(e);
        }
    }

    @ApiOperation(value = "????????? uri ?????? ??? ??????", nickname = "uriLoad")
    @RequestMapping(method = RequestMethod.GET, path = "/command/uri", produces = "application/json")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "domainId", value = "????????? Id", required = true, dataType = "string", paramType = "query", defaultValue = ""),
            @ApiImplicitParam(name = "load", value = "????????? ??????:true/false", required = false, dataType = "boolean", paramType = "query", defaultValue = "")})
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Success", response = String.class), @ApiResponse(code = 500, message = "Failure")})
    public ResponseEntity<?> _uri(HttpServletRequest request, HttpServletResponse response) {
        try {
            String domainId = request.getParameter("domainId");
            String load = request.getParameter("load");
            boolean isLoad = load != null && load.equals("true") != false;
            if (isLoad) {
                this.domainTemplateMerger.loadUri(domainId);
            }
            Map<String, String> uriMap = this.domainTemplateMerger.getUri2ItemMap(domainId);
            return new ResponseEntity<>(new ResultDTO<Map<String, String>>(uriMap), HttpStatus.OK);

        } catch (Exception e) {
            return responseException(e);
        }
    }

    /*
    @ApiOperation(value = "????????? Purge", nickname = "itemPurge")
    @RequestMapping(method = RequestMethod.GET, path = "/command/purge", produces = "application/json")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "domainId", value = "????????? Id", required = true, dataType = "string", paramType = "query", defaultValue = ""),
            @ApiImplicitParam(name = "itemType", value = "???????????????(PG,CT,CP,TP,AD", required = true, dataType = "string", paramType = "query", defaultValue = ""),
            @ApiImplicitParam(name = "itemId", value = "????????? Id", required = true, dataType = "string", paramType = "query", defaultValue = "")})
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Success", response = String.class), @ApiResponse(code = 500, message = "Failure")})
    public ResponseEntity<?> _purge(HttpServletRequest request, HttpServletResponse response) {
        try {
            String domainId = request.getParameter("domainId");
            String itemType = request.getParameter("itemType");
            String itemId = request.getParameter("itemId");
            if (McpString.isNotEmpty(domainId)) {
                // type??? key??? ?????? ??????
                if (McpString.isNotEmpty(itemType) && McpString.isNotEmpty(itemId)) {
                    List<Map<String, Object>> purgeResult = new ArrayList<Map<String, Object>>();
                    this.domainTemplateMerger.purgeItem(domainId, itemType, itemId);
                    Map<String, Object> purgeItemResult = new HashMap<String, Object>();
                    purgeItemResult.put(Cacheable.PURGE_TYPE, String.join(" ", domainId, itemType, itemId));
                    purgeItemResult.put(Cacheable.PURGE_RESULT, Cacheable.PURGE_RESULT_SUCCESS);
                    purgeResult.add(purgeItemResult);
                    if (!itemType.equals(MokaConstants.ITEM_DATASET)) { // ???????????? ??????????????? ????????? ????????? purge??????.
                        String cacheType = KeyResolver.getCacheType(itemType);
                        String cacheKey = KeyResolver.makeItemKey(domainId, itemType, itemId);
                        try {
                            List<Map<String, Object>> purgeCacheResult = this.cacheManager.purgeStartsWith(cacheType, cacheKey);
                            purgeResult.addAll(purgeCacheResult);
                        } catch (Exception e) {
                            Map<String, Object> purgeCacheResult = new HashMap<String, Object>();
                            purgeCacheResult.put(Cacheable.PURGE_TYPE, cacheType);
                            purgeCacheResult.put(Cacheable.PURGE_RESULT, Cacheable.PURGE_RESULT_EXCEPTION);
                            purgeCacheResult.put(Cacheable.PURGE_EXCEPTION_MESSGAE, e.getMessage());
                            purgeResult.add(purgeCacheResult);
                        }
                    }
                    ResultDTO<List<Map<String, Object>>> resultDTO = new ResultDTO<List<Map<String, Object>>>(purgeResult);
                    return new ResponseEntity<>(resultDTO, HttpStatus.OK);
                } else {
                    throw new CacheException("ItemType or ItemId not found");
                }
            } else {
                throw new CacheException("domainId not found");
            }
        } catch (Exception e) {
            logger.warn("Purge Failed:{}", e.getMessage());
            return responseException(e);
        }
    }
     */

    @ApiOperation(value = "????????? ??? ?????? Purge", nickname = "purge")
    @RequestMapping(method = RequestMethod.POST, path = "/command/purge", produces = "application/json")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "itemListJson", value = "??????????????? json", required = true, dataType = "string", paramType = "body", defaultValue = "")})
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Success", response = String.class), @ApiResponse(code = 500, message = "Failure")})
    public ResponseEntity<?> _purge(HttpServletRequest request, HttpServletResponse response, @RequestBody String itemListJson) {
        try {
            if (McpString.isNotEmpty(itemListJson)) {
                List<PurgeItem> purgeItemList = ResourceMapper
                        .getDefaultObjectMapper()
                        .readValue(itemListJson, new TypeReference<List<PurgeItem>>() {
                        });

                List<List<Map<String, Object>>> list = new ArrayList<List<Map<String, Object>>>();
                for (PurgeItem purgeItem : purgeItemList) {
                    String domainId = purgeItem.getDomainId();
                    String itemType = purgeItem.getItemType();
                    String itemId = purgeItem.getItemId();
                    try {
                        this.domainTemplateMerger.purgeItem(domainId, itemType, itemId);
                        if (!itemType.equals(MokaConstants.ITEM_DATASET) && !itemType.equals(MokaConstants.ITEM_ARTICLE_PAGE)) {
                            // Dataset ???????????? ???????????? ??????
                            // ?????????????????? ??????????????? ?????? ???????????? ?????????????????? ????????? ??????????????? ????????? ??????????????? ?????? ????????? ????????? ??????????????? ??????
                            String cacheType = CacheHelper.getCacheType(itemType);
                            String cacheKey = CacheHelper.makeItemKey(domainId, itemType, itemId);
                            List<Map<String, Object>> purgeResult = this.cacheManager.purgeStartsWith(cacheType, cacheKey);
                            list.add(purgeResult);
                        }
                    } catch (Exception e) {
                        logger.warn("Purge Failed: {}", e);
                        list.add(this.cacheManager.errorResult(e));
                    }
                }
                ResultDTO<List<List<Map<String, Object>>>> resultDTO = new ResultDTO<List<List<Map<String, Object>>>>(list);
                return new ResponseEntity<>(resultDTO, HttpStatus.OK);
            } else {
                throw new CacheException("json is null");
            }
        } catch (Exception e) {
            logger.warn("Purge Failed:{}", e.getMessage());
            return responseException(e);
        }
    }

    @ApiOperation(value = "????????? ??????????????? Purge", nickname = "articlePurge")
    @RequestMapping(method = RequestMethod.GET, path = "/command/articlePurge", produces = "application/json")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "articleId", value = "?????? Id", required = true, dataType = "string", paramType = "query", defaultValue = "")})
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Success", response = String.class), @ApiResponse(code = 500, message = "Failure")})
    public ResponseEntity<?> _articlePurge(HttpServletRequest request, HttpServletResponse response) {
        try {
            List<List<Map<String, Object>>> list = new ArrayList<List<Map<String, Object>>>();
            String articleId = request.getParameter("articleId");
            if (McpString.isNotEmpty(articleId)) {
                // ??????????????? purge
                String cacheType = CacheHelper.CACHE_ARTICLE_MERGE;
                for (DomainItem domainItem : domainResolver.getDomainInfoList()) {
                    String cacheKey = CacheHelper.makeArticleCacheKey(domainItem.getItemId(), articleId);
                    List<Map<String, Object>> purgeResult = this.cacheManager.purge(cacheType, cacheKey);
                    list.add(purgeResult);
                }
                // ?????????????????? AMP ????????? purge
                cacheType = CacheHelper.CACHE_AMP_ARTICLE_MERGE;
                for (DomainItem domainItem : domainResolver.getDomainInfoList()) {
                    String cacheKey = CacheHelper.makeArticleCacheKey(domainItem.getItemId(), articleId);
                    List<Map<String, Object>> purgeResult = this.cacheManager.purge(cacheType, cacheKey);
                    list.add(purgeResult);
                }

                ResultDTO<List<List<Map<String, Object>>>> resultDTO = new ResultDTO<>(list);
                return new ResponseEntity<>(resultDTO, HttpStatus.OK);
            } else {
                throw new CacheException("ArticleId not found");
            }
        } catch (Exception e) {
            logger.warn("Article Purge Failed:{}", e.getMessage());
            return responseException(e);
        }
    }

    @ApiOperation(value = "????????? Update", nickname = "reservedUpdate")
    @RequestMapping(method = RequestMethod.GET, path = "/command/reservedUpdate", produces = "application/json")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "domainId", value = "????????? Id", required = true, dataType = "string", paramType = "query", defaultValue = "")})
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Success", response = String.class), @ApiResponse(code = 500, message = "Failure")})
    public ResponseEntity<?> _reservedPurge(HttpServletRequest request, HttpServletResponse response) {
        try {
            String domainId = request.getParameter("domainId");
            if (McpString.isNotEmpty(domainId)) {
                this.domainResolver.purgeReserveMap(domainId);
                ResultDTO<String> resultDTO = new ResultDTO<String>("Reserved Purged");
                return new ResponseEntity<>(resultDTO, HttpStatus.OK);
            } else {
                throw new CacheException("domainId not found");
            }
        } catch (Exception e) {
            logger.warn("Reserved Purge Failed:{}", e.getMessage());
            return responseException(e);
        }
    }

    @ApiOperation(value = "CDN ?????? ??????", nickname = "CDNUpdate")
    @RequestMapping(method = RequestMethod.POST, path = "/command/cdnUpdate", produces = "application/json", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
            @ApiImplicitParam(name = "cdnArticle", value = "CDN ?????? ??????", required = true, dataType = "string", paramType = "body", defaultValue = "")})
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Success", response = String.class), @ApiResponse(code = 500, message = "Failure")})
    public ResponseEntity<?> _cdnUpdate(HttpServletRequest request, HttpServletResponse response, @RequestBody String cdnArticle) {
        try {
            if (McpString.isNotEmpty(cdnArticle)) {
                ObjectMapper mapper = ResourceMapper.getDefaultObjectMapper();
                List<Map<String, Object>> cdnRedirectList = mapper.readValue(cdnArticle, new TypeReference<List<Map<String, Object>>>() {
                });
                this.cdnRedirector.updateCdnRedirect(cdnRedirectList);
            } else {
                throw new CacheException("json data is invalid");
            }
            ResultDTO<String> resultDTO = new ResultDTO<String>("CDN Article Updated");
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            logger.warn("CDN Article update Failed:{}", e.getMessage());
            return responseException(e);
        }
    }

    @ApiOperation(value = "????????? ??????", nickname = "pageUpdate")
    @RequestMapping(method = RequestMethod.POST, path = "/command/pageUpdate", produces = "application/json")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "domainId", value = "????????? Id", required = true, dataType = "string", paramType = "query", defaultValue = ""),
            @ApiImplicitParam(name = "itemId", value = "????????? Id", required = true, dataType = "string", paramType = "query", defaultValue = ""),
            @ApiImplicitParam(name = "category", value = "????????????", required = false, dataType = "string", paramType = "query", defaultValue = ""),
            @ApiImplicitParam(name = "html", value = "????????? ??????", required = true, dataType = "string", paramType = "query", defaultValue = "")})
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Success", response = String.class), @ApiResponse(code = 500, message = "Failure")})
    public ResponseEntity<?> _pageUpdate(HttpServletRequest request, HttpServletResponse response, @RequestParam String domainId,
            @RequestParam String itemId, @RequestParam(required = false) String category, @RequestParam String html) {
        try {
            if (McpString.isNotEmpty(html)) {
                // ?????? ????????????
                MergeContext mergeContext = new MergeContext();
                // ???????????? ????????? ???????????? ??????
                CacheHelper.addExtraCacheParam(mergeContext, MokaConstants.PARAM_CATEGORY);
                CacheHelper.addExtraCacheParam(mergeContext, MokaConstants.PARAM_FILTER);
                CacheHelper.addExtraCacheParam(mergeContext, MokaConstants.PARAM_DATE);
                HttpParamMap httpParamMap = this.httpParamFactory.creatHttpParamMap(request);
                mergeContext.set(MokaConstants.MERGE_CONTEXT_PARAM, httpParamMap);

                String cacheKey = CacheHelper.makePgItemCacheKey(domainId, itemId, mergeContext);
                MergeItem pageItem = this.domainTemplateMerger.getItem(domainId, MokaConstants.ITEM_PAGE, itemId);
                if (pageItem.getBoolYN(ItemConstants.PAGE_FILE_YN)) {
                    this.cacheManager.set(CacheHelper.CACHE_PG_MERGE, cacheKey, html, 24 * 60 * 60 * 1000L);
                    // page????????? ????????????.
                    String domainPath = String.join("/", this.savePagePath, domainId);
                    String pagePath = domainPath + "/" + itemId;
                    try {
                        File domainDir = new File(domainPath);
                        if (!domainDir.exists()) {
                            domainDir.mkdirs();
                        }
                        File pageFile = new File(pagePath);
                        Writer writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(pageFile), StandardCharsets.UTF_8));
                        writer.write(html);
                        writer.close();
                    } catch (IOException e) {
                        logger.error("Page Not Saved: {}", pagePath);
                    }
                } else {
                    this.cacheManager.set(CacheHelper.CACHE_PG_MERGE, cacheKey, html);
                }
            } else {
                throw new CacheException("page content not found");
            }
            ResultDTO<String> resultDTO = new ResultDTO<String>("Page Content Updated");
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            logger.warn("Page Content update Failed:{}", e.getMessage());
            return responseException(e);
        }
    }

    @ApiOperation(value = "????????? ?????? ??????", nickname = "itemInfo")
    @RequestMapping(method = RequestMethod.GET, path = "/command/item", produces = "application/json")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "domainId", value = "????????? Id", required = true, dataType = "string", paramType = "query", defaultValue = ""),
            @ApiImplicitParam(name = "itemType", value = "????????? Type: PG, CT, CP, TP, AD", required = true, dataType = "string", paramType = "query", defaultValue = ""),
            @ApiImplicitParam(name = "itemId", value = "????????? Id", required = false, dataType = "string", paramType = "query", defaultValue = "")})
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Success", response = String.class), @ApiResponse(code = 500, message = "Failure")})
    public ResponseEntity<?> _item(HttpServletRequest request, HttpServletResponse response) {
        try {
            String domainId = request.getParameter("domainId");
            String itemType = request.getParameter("itemType");
            String itemId = request.getParameter("itemId");
            MergeItem item = this.domainTemplateMerger.getItem(domainId, itemType, itemId);
            return new ResponseEntity<>(new ResultDTO<MergeItem>(item), HttpStatus.OK);
        } catch (Exception e) {
            return responseException(e);
        }
    }

    @ApiOperation(value = "AB????????? ?????? ??????", nickname = "abTestAdd", notes = "??????)url=/abtest,domain=2000,component=128,template=677,dataset=76")
    @RequestMapping(method = RequestMethod.GET, path = "/command/abTestAdd", produces = "application/json")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id", value = "????????? Id", required = true, dataType = "string", paramType = "query", defaultValue = ""),
            @ApiImplicitParam(name = "domainId", value = "????????? Id", required = true, dataType = "string", paramType = "query", defaultValue = ""),
            @ApiImplicitParam(name = "componentId", value = "???????????? Id", required = true, dataType = "string", paramType = "query", defaultValue = ""),
            @ApiImplicitParam(name = "templateId", value = "????????? Id", required = false, dataType = "string", paramType = "query", defaultValue = ""),
            @ApiImplicitParam(name = "datasetId", value = "???????????? Id", required = false, dataType = "string", paramType = "query", defaultValue = ""),
            @ApiImplicitParam(name = "start", value = "????????? ??????", required = true, dataType = "string", paramType = "query", defaultValue = ""),
            @ApiImplicitParam(name = "end", value = "????????? ??????", required = true, dataType = "string", paramType = "query", defaultValue = "")})
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Success", response = String.class), @ApiResponse(code = 500, message = "Failure")})
    public ResponseEntity<?> _abTestAdd(HttpServletRequest request, HttpServletResponse response) {
        try {
            String id = request.getParameter("id");
            String domainId = request.getParameter("domainId");
            String componentId = request.getParameter("componentId");
            String templateId = request.getParameter("templateId");
            String datasetId = request.getParameter("datasetId");
            String start = request.getParameter("start");
            String end = request.getParameter("end");
            LocalDateTime startDt = LocalDateTime.parse(start, MokaConstants.dtf);
            LocalDateTime endDt = LocalDateTime.parse(end, MokaConstants.dtf);
            AbTest abTest = new AbTest();
            abTest.setId(id);
            abTest.setDomainId(domainId);
            abTest.setComponentId(componentId);
            abTest.setTemplateId(templateId);
            abTest.setDatasetId(datasetId);
            abTest.setStart(startDt);
            abTest.setEnd(endDt);
            this.abTestResolver.addAbTest(abTest);
            return new ResponseEntity<>(new ResultDTO<Map<String, AbTest>>(abTestResolver.getTestMap()), HttpStatus.OK);
        } catch (Exception e) {
            return responseException(e);
        }
    }


    @ApiOperation(value = "log level??????", nickname = "changeLogLevel")
    @RequestMapping(method = RequestMethod.GET, path = "/command/logLevel", produces = "application/json")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "package", value = "?????????", required = true, dataType = "string", paramType = "query", defaultValue = ""),
            @ApiImplicitParam(name = "level", value = "log level", required = true, dataType = "string", paramType = "query", defaultValue = "")})
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Success", response = String.class), @ApiResponse(code = 500, message = "Failure")})
    public ResponseEntity<?> _changeLogLevel(HttpServletRequest request, HttpServletResponse response) {
        String packageName = request.getParameter("package");
        String level = request.getParameter("level");

        LoggerContext loggerContext = (LoggerContext) LoggerFactory.getILoggerFactory();
        ch.qos.logback.classic.Logger targetLogger = null;
        if (packageName == null || packageName.length() == 0) {
            targetLogger = loggerContext.getLogger(Logger.ROOT_LOGGER_NAME);
        } else {
            targetLogger = loggerContext.getLogger(packageName);
        }
        if (targetLogger != null) {
            targetLogger.setLevel(Level.toLevel(level));
            return responseString("LogLevel Changed:" + packageName + "," + level);
        } else {
            return responseString("LogLevel Not Changed:" + packageName + "," + level);
        }

    }
}
