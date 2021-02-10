package jmnet.moka.core.dps.api.handler.command;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.LoggerContext;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.dps.api.ApiRequestHelper;
import jmnet.moka.core.dps.api.ext.ApiPeriodicTaskManager;
import jmnet.moka.core.dps.mvc.handler.ApiRequestHandler;
import jmnet.moka.core.dps.api.model.Api;
import jmnet.moka.core.dps.excepton.ParameterException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * <pre>
 * DPS에서 필요한 정보를 요청하는 command를 제공한다.
 * method가 command인지 여부를 (dps.)commandRequest.handler.methodPrefix에 설정한다.
 * 요청이 command인지 여부는 url경로의 구분은 (dps.)commandRequest.handler.uriPrefix에 설정한다.
 * 2019. 9. 27. kspark 최초생성
 * </pre>
 * @since 2019. 9. 27. 오후 7:09:59
 * @author kspark
 */
@Controller
public class CommandController {
	
	public final static Logger logger = LoggerFactory.getLogger(CommandController.class);
	
	@Autowired
	private ApiRequestHelper apiRequestHelper;
	
	@Autowired
	private ApiPeriodicTaskManager apiPeriodicTaskManager;
	
	@Autowired
    @Lazy
	private ApiRequestHandler apiRequestHandler;


    private ResponseEntity<?> responseException(Exception e) {
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
    public ResponseEntity<?> health(HttpServletRequest request, HttpServletResponse response) {
        return new ResponseEntity<>("OK", HttpStatus.OK);
    }

    @ApiOperation(value = "API Path목록 조회", nickname = "apiPathList")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Success", response = String.class),
            @ApiResponse(code = 500, message = "Failure")})
    @RequestMapping(method = RequestMethod.GET, path = "/command/apiPath",
            produces = "application/json")
    public ResponseEntity<?> apiPathList(HttpServletRequest request, HttpServletResponse response)
            throws ParameterException {
        List<String> apiList = apiRequestHelper.getApiPathList();
        ResultListDTO<String> resultListDto = new ResultListDTO<String>(apiList.size(), apiList);
        ResultDTO<ResultListDTO<String>> resultDTO =
                new ResultDTO<ResultListDTO<String>>(resultListDto);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    @ApiOperation(value = "API 목록 조회", nickname = "apiList")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "apiPath", value = "api 경로", required = true,
                    dataType = "string",
                    paramType = "query", defaultValue = ""),
            @ApiImplicitParam(name = "searchType", value = "검색 조건(id/idLike/description)",
                    required = false,
                    dataType = "string", paramType = "query", defaultValue = ""),
            @ApiImplicitParam(name = "keyword", value = "키워드", required = false,
                    dataType = "string",
                    paramType = "query", defaultValue = ""),
            @ApiImplicitParam(name = "page", value = "페이지", required = false, dataType = "string",
                    paramType = "query", defaultValue = "1"),
            @ApiImplicitParam(name = "size", value = "사이즈", required = false, dataType = "string",
                    paramType = "query", defaultValue = "10")})
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Success", response = String.class),
            @ApiResponse(code = 500, message = "Failure")})
//    @RequestMapping(method = RequestMethod.GET, path = "/command/api",
//            produces = "application/json")
    @GetMapping(value="/command/api", produces = "application/json")
    public ResponseEntity<?> apiList(HttpServletRequest request, HttpServletResponse response)
            throws ParameterException {
        String apiPath = request.getParameter("apiPath");
        String searchType = request.getParameter("searchType");
        String keyword = request.getParameter("keyword");
        String pageStr = request.getParameter("page");
        String sizeStr = request.getParameter("size");

        int page = 1;
        int size = 10;
        if (McpString.isNotEmpty(pageStr)) {
            page = Integer.parseInt(pageStr);
        }
        if (McpString.isNotEmpty(sizeStr)) {
            size = Integer.parseInt(sizeStr);
        }
        List<Api> apiList = apiRequestHelper.getApiSearch(apiPath, searchType, keyword);
        int totalCount = apiList.size();
        int fromIndex = (page - 1) * size;
        int toIndex = (page * size);
        toIndex = toIndex >= totalCount ? totalCount : toIndex;
        List<Api> pagingList = apiList.subList(fromIndex, toIndex);

        ResultListDTO<Api> resultListDto = new ResultListDTO<Api>(totalCount, pagingList);
        ResultDTO<ResultListDTO<Api>> resultDTO = new ResultDTO<ResultListDTO<Api>>(resultListDto);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    @ApiOperation(value = "API 재로딩", nickname = "apiReload")
    @ApiImplicitParams({@ApiImplicitParam(name = "apiPath", value = "api 경로", required = true,
            dataType = "string", paramType = "query", defaultValue = "sys_api")})
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Success", response = String.class),
            @ApiResponse(code = 500, message = "Failure")})
    @RequestMapping(method = RequestMethod.GET, path = "/command/load",
            produces = "application/json")
    public ResponseEntity<?> loadApi(HttpServletRequest request, HttpServletResponse response)
            throws ParameterException {
        String path = request.getParameter("apiPath");
        try {
            this.apiRequestHelper.load(path);
            List<Api> apiList = apiRequestHelper.getApiSearch(path, null, null);
            ResultListDTO<Api> resultListDto = new ResultListDTO<Api>(apiList.size(), apiList);
            ResultDTO<ResultListDTO<Api>> resultDTO =
                    new ResultDTO<ResultListDTO<Api>>(resultListDto);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            return responseException(e);
        }
    }

    @ApiOperation(value = "반복 API 중지", nickname = "removeApiSchedule")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "apiPath", value = "api 경로", required = true,
                    dataType = "string",
                    paramType = "query", defaultValue = ""),
            @ApiImplicitParam(name = "apiId", value = "api Id", required = true,
                    dataType = "string",
                    paramType = "query", defaultValue = "")})
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Success", response = String.class),
            @ApiResponse(code = 500, message = "Failure")})
    @RequestMapping(method = RequestMethod.GET, path = "/command/removeApiSchedule",
            produces = "application/json")
    public ResponseEntity<?> _unregisterSchedule(HttpServletRequest request,
            HttpServletResponse response) throws ParameterException {
        String apiPath = request.getParameter("apiPath");
        String apiId = request.getParameter("apiId");
        try {
            this.apiPeriodicTaskManager.unregisterSchedule(apiPath, apiId);
            return responseString(
                    String.format("api unregister schedule request: %s %s", apiPath, apiId));
        } catch (Exception e) {
            return responseException(e);
        }
    }

    @ApiOperation(value = "API Purge(All or One), 개별 key을 purge할 경우 api의 keys요소를 파라미터로 넘겨야 한다.",
            nickname = "purgeApi")
    @RequestMapping(method = RequestMethod.GET, path = "/command/purge",
            produces = "application/json")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "apiPath", value = "api 경로", required = true,
                    dataType = "string",
                    paramType = "query", defaultValue = ""),
            @ApiImplicitParam(name = "apiId", value = "api Id", required = true,
                    dataType = "string",
                    paramType = "query", defaultValue = ""),
            @ApiImplicitParam(name = "prefix", value = "key prefix", required = false,
                    dataType = "string", paramType = "query", defaultValue = "")})
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Success", response = String.class),
            @ApiResponse(code = 500, message = "Failure")})
    public ResponseEntity<?> _purge(HttpServletRequest request, HttpServletResponse response)
            throws ParameterException {
        try {
            List<Map<String, Object>> purgeResult = null;
            if ( request.getParameter("prefix") == null) {
                purgeResult = this.apiRequestHandler.purge(request, response);
            } else {
                purgeResult =
                        this.apiRequestHandler.purgeStartsWith(request, response);
            }
            ResultDTO<List<Map<String, Object>>> resultDTO =
                    new ResultDTO<List<Map<String, Object>>>(purgeResult);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            return responseException(e);
        }
    }

    /*
    @ApiOperation(value = "API Purge(StartsWith), 특정 문자열로 시작하는 key들을 purge한다.",
            nickname = "purgeStartsWithApi")
    @RequestMapping(method = RequestMethod.GET, path = "/command/purgeStartsWith",
            produces = "application/json")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "apiPath", value = "api 경로", required = true,
                    dataType = "string", paramType = "query", defaultValue = ""),
            @ApiImplicitParam(name = "apiId", value = "api Id", required = false,
                    dataType = "string", paramType = "query", defaultValue = ""),
            @ApiImplicitParam(name = "prefix", value = "key prefix", required = false,
                    dataType = "string", paramType = "query", defaultValue = "")})
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Success", response = String.class),
            @ApiResponse(code = 500, message = "Failure")})
    public ResponseEntity<?> _purgeStartsWith(HttpServletRequest request,
            HttpServletResponse response) throws ParameterException {
        try {
            List<Map<String, Object>> purgeResult =
                    this.apiRequestHandler.purgeStartsWith(request, response);
            ResultDTO<List<Map<String, Object>>> resultDTO =
                    new ResultDTO<List<Map<String, Object>>>(purgeResult);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            return responseException(e);
        }
    }
    */

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
    public ResponseEntity<?> changeLogLevel(HttpServletRequest request,
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
