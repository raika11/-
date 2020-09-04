package jmnet.moka.core.tms.mvc;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import com.fasterxml.jackson.core.type.TypeReference;
import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.LoggerContext;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import jmnet.moka.common.cache.CacheManager;
import jmnet.moka.common.cache.Cacheable;
import jmnet.moka.common.cache.exception.CacheException;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.core.common.purge.model.PagePurgeTask;
import jmnet.moka.core.common.purge.model.PurgeItem;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.tms.merge.KeyResolver;
import jmnet.moka.core.tms.merge.MspDomainTemplateMerger;
import jmnet.moka.core.tms.merge.item.DomainItem;
import jmnet.moka.core.tms.merge.item.MergeItem;
import jmnet.moka.core.tms.mvc.domain.DomainResolver;

/**
 * <pre>
 * TMS에서 필요한 정보를 요청하는 command를 제공한다.
 * 2019. 9. 27. kspark 최초생성
 * </pre>
 * 
 * @since 2019. 9. 27. 오후 7:09:59
 * @author kspark
 */
@Controller
public class CommandController {

    public final static Logger logger = LoggerFactory.getLogger(CommandController.class);

    public static final HttpHeaders HTTP_HTML_UTF8;
    static {
        HTTP_HTML_UTF8 = new HttpHeaders();
        HTTP_HTML_UTF8.setContentType(new MediaType("text", "html", StandardCharsets.UTF_8));
    }

    @Autowired
    private CacheManager cacheManager;

    @Lazy
    @Autowired
    private DomainResolver domainResolver;

    @Qualifier("domainTemplateMerger")
    @Autowired
    private MspDomainTemplateMerger domainTemplateMerger;

    private ResponseEntity<?> responseException(Exception e) {
        logger.error("Command Execute Fail:", e);
        String exceptionMessage = e.getClass().getName() + ":" + e.getMessage();
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

    @ApiOperation(value = "Command 목록제공", nickname = "commandList")
    @RequestMapping(method = RequestMethod.GET, path = "/command/commandList",
            produces = "application/json")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Success", response = String.class),
            @ApiResponse(code = 500, message = "Failure")})
    public ResponseEntity<?> _commandList(HttpServletRequest request,
            HttpServletResponse response) {
        try {
        HashMap<String, Object> commandMap = new LinkedHashMap<String, Object>(8);
        Method[] commandMethods = this.getClass().getMethods();
        for (Method commandMethod : commandMethods) {
            String methodName = commandMethod.getName();
            ApiOperation apiOperation = commandMethod.getAnnotation(ApiOperation.class);
            if (apiOperation != null) {
                RequestMapping requestMapping = commandMethod.getAnnotation(RequestMapping.class);
                commandMap.put(methodName, Arrays
                        .asList(new String[] {apiOperation.value(), requestMapping.path()[0]}));
            }
        }
            return new ResponseEntity<>(new ResultDTO<HashMap<String, Object>>(commandMap),
                    HttpStatus.OK);
        } catch (Exception e) {
            return responseException(e);
        }
    }

    @ApiOperation(value = "도메인 조회 및 갱신", nickname = "domainLoad")
    @RequestMapping(method = RequestMethod.GET, path = "/command/domain",
            produces = "application/json")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "load", value = "재로딩 여부:Y/N", required = false,
                    dataType = "string", allowableValues = "Y,N", paramType = "query",
                    defaultValue = "N")})
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Success", response = String.class),
            @ApiResponse(code = 500, message = "Failure")})
    public ResponseEntity<?> _domain(HttpServletRequest request, HttpServletResponse response) {
        try {
            String load = request.getParameter("load");
            boolean isLoad = (load == null || load.equalsIgnoreCase("N")) ? false : true;
            if (isLoad) {
                this.domainResolver.loadDomain();
            }
            List<DomainItem> domainList = this.domainResolver.getDomainInfoList();
            return new ResponseEntity<>(new ResultDTO<List<DomainItem>>(domainList), HttpStatus.OK);

        } catch (Exception e) {
            return responseException(e);
        }
    }

    @ApiOperation(value = "서비스 uri 조회 및 갱신", nickname = "uriLoad")
    @RequestMapping(method = RequestMethod.GET, path = "/command/uri",
            produces = "application/json")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "domainId", value = "도메인 Id", required = true,
                    dataType = "string", paramType = "query", defaultValue = ""),
            @ApiImplicitParam(name = "load", value = "재로딩 여부:true/false", required = false,
                    dataType = "boolean", paramType = "query", defaultValue = "")})
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Success", response = String.class),
            @ApiResponse(code = 500, message = "Failure")})
    public ResponseEntity<?> _uri(HttpServletRequest request, HttpServletResponse response) {
        try {
            String domainId = request.getParameter("domainId");
            String load = request.getParameter("load");
            boolean isLoad = (load == null || load.equals("true") == false) ? false : true;
            if (isLoad) {
                this.domainTemplateMerger.loadUri(domainId);
            }
            Map<String, String> uriMap = this.domainTemplateMerger.getUri2ItemMap(domainId);
            return new ResponseEntity<>(new ResultDTO<Map<String, String>>(uriMap), HttpStatus.OK);

        } catch (Exception e) {
            return responseException(e);
        }
    }

    @ApiOperation(value = "아이템 Purge", nickname = "itemPurge")
    @RequestMapping(method = RequestMethod.GET, path = "/command/purge",
            produces = "application/json")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "domainId", value = "도메인 Id", required = true,
                    dataType = "string", paramType = "query", defaultValue = ""),
            @ApiImplicitParam(name = "itemType", value = "아이템타입(PG,CT,CP,TP,AD", required = true,
                    dataType = "string", paramType = "query", defaultValue = ""),
            @ApiImplicitParam(name = "itemId", value = "아이템 Id", required = true,
                    dataType = "string",
                    paramType = "query", defaultValue = "")})
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Success", response = String.class),
            @ApiResponse(code = 500, message = "Failure")})
    public ResponseEntity<?> _purge(HttpServletRequest request, HttpServletResponse response) {
        try {
            String domainId = request.getParameter("domainId");
            String itemType = request.getParameter("itemType");
            String itemId = request.getParameter("itemId");
            if (McpString.isNotEmpty(domainId)) {
                // type과 key가 있는 경우
                if (McpString.isNotEmpty(itemType) && McpString.isNotEmpty(itemId)) {
                    List<Map<String, Object>> purgeResult = new ArrayList<Map<String, Object>>();
                    this.domainTemplateMerger.purgeItem(domainId, itemType, itemId);
                    Map<String, Object> purgeItemResult = new HashMap<String, Object>();
                    purgeItemResult.put(Cacheable.PURGE_TYPE, String.join(" ", domainId, itemType, itemId));
                    purgeItemResult.put(Cacheable.PURGE_RESULT, Cacheable.PURGE_RESULT_SUCCESS);
                    purgeResult.add(purgeItemResult);
                    String cacheType = KeyResolver.getCacheType(itemType);
                    String cacheKey = KeyResolver.makeItemKey(domainId, itemType, itemId);
                    try {
                        List<Map<String, Object>> purgeCacheResult =
                                this.cacheManager.purgeStartsWith(cacheType, cacheKey);
                        purgeResult.addAll(purgeCacheResult);
                    } catch (Exception e) {
                        Map<String, Object> purgeCacheResult = new HashMap<String, Object>();
                        purgeCacheResult.put(Cacheable.PURGE_TYPE, cacheType);
                        purgeCacheResult.put(Cacheable.PURGE_RESULT,
                                Cacheable.PURGE_RESULT_EXCEPTION);
                        purgeCacheResult.put(Cacheable.PURGE_EXCEPTION_MESSGAE, e.getMessage());
                        purgeResult.add(purgeCacheResult);
                    }
                    ResultDTO<List<Map<String, Object>>> resultDTO =
                            new ResultDTO<List<Map<String, Object>>>(purgeResult);
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

    @ApiOperation(value = "예약어 Purge", nickname = "reservedPurge")
    @RequestMapping(method = RequestMethod.GET, path = "/command/reservedPurge",
            produces = "application/json")
    @ApiImplicitParams({@ApiImplicitParam(name = "domainId", value = "도메인 Id", required = true,
            dataType = "string", paramType = "query", defaultValue = "")})
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Success", response = String.class),
            @ApiResponse(code = 500, message = "Failure")})
    public ResponseEntity<?> _reservedPurge(HttpServletRequest request,
            HttpServletResponse response) {
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


    @ApiOperation(value = "아이템 Bulk Purge", nickname = "bulkPurge")
    @RequestMapping(method = RequestMethod.GET, path = "/command/bulkPurge",
            produces = "application/json")
    @ApiImplicitParams({@ApiImplicitParam(name = "json", value = "아이템정보 json", required = true,
            dataType = "string", paramType = "query", defaultValue = "")})
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Success", response = String.class),
            @ApiResponse(code = 500, message = "Failure")})
    public ResponseEntity<?> _bulkPurge(HttpServletRequest request, HttpServletResponse response) {
        try {
            String json = request.getParameter(PagePurgeTask.TMS_BULK_PURGE_PARAM);
            if (McpString.isNotEmpty(json)) {
                List<PurgeItem> purgeItemList = ResourceMapper.getDefaultObjectMapper()
                        .readValue(json, new TypeReference<List<PurgeItem>>() {
                        });

                List<List<Map<String, Object>>> list = new ArrayList<List<Map<String, Object>>>();
                for (PurgeItem purgeItem : purgeItemList) {
                    String domainId = purgeItem.getDomainId();
                    String itemType = purgeItem.getItemType();
                    String itemId = purgeItem.getItemId();
                    try {
                        this.domainTemplateMerger.purgeItem(domainId, itemType, itemId);
                        String cacheType = KeyResolver.getCacheType(itemType);
                        String cacheKey = KeyResolver.makeItemKey(domainId, itemType, itemId);
                        List<Map<String, Object>> purgeResult =
                            this.cacheManager.purgeStartsWith(cacheType, cacheKey);
                        list.add(purgeResult);
                    } catch (Exception e) {
                        logger.warn("Purge Failed: {}", e);
                        list.add(this.cacheManager.errorResult(e));
                    }
                }
                ResultDTO<List<List<Map<String, Object>>>> resultDTO =
                        new ResultDTO<List<List<Map<String, Object>>>>(list);
                return new ResponseEntity<>(resultDTO, HttpStatus.OK);
            } else {
                throw new CacheException("json is null");
            }
        } catch (Exception e) {
            logger.warn("Purge Failed:{}", e.getMessage());
            return responseException(e);
        }
    }


    @ApiOperation(value = "아이템 정보 조회", nickname = "itemInfo")
    @RequestMapping(method = RequestMethod.GET, path = "/command/item",
            produces = "application/json")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "domainId", value = "도메인 Id", required = true,
                    dataType = "string", paramType = "query", defaultValue = ""),
            @ApiImplicitParam(name = "itemType", value = "아이템 Type: PG, CT, CP, TP, AD",
                    required = true, dataType = "string", paramType = "query", defaultValue = ""),
            @ApiImplicitParam(name = "itemId", value = "아이템 Id", required = false,
                    dataType = "string",
                    paramType = "query", defaultValue = "")})
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Success", response = String.class),
            @ApiResponse(code = 500, message = "Failure")})
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

    @ApiOperation(value = "log level변경", nickname = "changeLogLevel")
    @RequestMapping(method = RequestMethod.GET, path = "/command/logLevel",
            produces = "application/json")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "package", value = "패키지", required = true, dataType = "string",
                    paramType = "query", defaultValue = ""),
            @ApiImplicitParam(name = "level", value = "log level", required = true,
                    dataType = "string", paramType = "query", defaultValue = "")})
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Success", response = String.class),
            @ApiResponse(code = 500, message = "Failure")})
    public ResponseEntity<?> _changeLogLevel(HttpServletRequest request,
            HttpServletResponse response) {
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
