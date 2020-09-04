package jmnet.moka.web.wms.mvc.error.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.boot.autoconfigure.web.servlet.error.BasicErrorController;
import org.springframework.boot.autoconfigure.web.servlet.error.ErrorViewResolver;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import jmnet.moka.common.utils.dto.ResultHeaderDTO;

@Controller
@RequestMapping("${server.error.path:${error.path:/error}}")
public class CustomErrorController extends BasicErrorController {

    private static final Logger logger = LoggerFactory.getLogger(CustomErrorController.class);

    public CustomErrorController(ErrorAttributes errorAttributes, ServerProperties serverProperties,
            List<ErrorViewResolver> errorViewResolvers) {
        super(errorAttributes, serverProperties.getError(), errorViewResolvers);
    }

    /**
     * <pre>
     * GlobalException에서 처리하지 않고, Content-Type이 text/html인 대한 에러 처리
     * </pre>
     * 
     * @param request HTTP요청
     * @param response HTTP응답
     * @return 페이지
     * @see org.springframework.boot.autoconfigure.web.servlet.error.BasicErrorController#errorHtml(javax.servlet.http.HttpServletRequest,
     *      javax.servlet.http.HttpServletResponse)
     */
    @Override
    @RequestMapping(produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView errorHtml(HttpServletRequest request, HttpServletResponse response) {
        logError(request);

        String prefix = "/html/error/";

        int errorValue = this.getStatus(request).value();
        String errorPath = null;
        if (errorValue == 401) {
            errorPath = prefix + "401.html";
        }
        // 인증되지 않은 경우 인증 오류 페이지에서 관리자/사용자 로그인 페이지 정보를 전달한다.
        // org.springframework.boot.autoconfigure.web.DefaultErrorAttributes의 속성을 참고한다.
        else if (errorValue == 403) {
            //            return new ModelAndView(prefix + "403.html", this.getStatus(request));
            errorPath = prefix + "403.html";
        } else if (errorValue == 404) {
            errorPath = prefix + "404.html";
        } else if (errorValue >= 400 && errorValue < 500) {
            errorPath = prefix + "400.html";
        } else if (errorValue >= 500) {
            errorPath = prefix + "500.html";
        }

        if (errorPath == null) {
            errorPath = prefix + "error.html";
        }

        if (request.getMethod().equals("POST")) {
            return new ModelAndView("redirect:" + errorPath, this.getStatus(request));
        } else {
            return new ModelAndView(errorPath, this.getStatus(request));
        }

    }

    /**
     * <pre>
     * GlobalException에서 처리하지 않고, Content-Type이 text/html이 아닌 요청에 대한 에러 처리
     * </pre>
     * 
     * @param request HTTP 요청
     * @return error json
     * @see org.springframework.boot.autoconfigure.web.servlet.error.BasicErrorController#error(javax.servlet.http.HttpServletRequest)
     */
    @Override
    @RequestMapping
    public ResponseEntity<Map<String, Object>> error(HttpServletRequest request) {
        logError(request);

        Map<String, Object> result = new HashMap<String, Object>();
        HttpStatus status = this.getStatus(request);

        ResultHeaderDTO header = new ResultHeaderDTO();
        header.setSuccess(false);
        header.setResultCode(status.value());
        header.setMessage(status.getReasonPhrase());

        result.put("header", header);
        result.put("body", null);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * <pre>
     * 에러 로그를 찍는다
     * </pre>
     * 
     * @param request HTTP요청
     */
    private void logError(HttpServletRequest request) {
        HttpStatus status = getStatus(request);
        Map<String, Object> model = Collections.unmodifiableMap(
                getErrorAttributes(request, isIncludeStackTrace(request, MediaType.TEXT_HTML)));
        // key [ path, trace, error, timestamp ]
        logger.error("{}, {}", status, model.get("path"));
    }
}
