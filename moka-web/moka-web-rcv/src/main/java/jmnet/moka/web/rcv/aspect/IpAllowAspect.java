package jmnet.moka.web.rcv.aspect;

import java.io.IOException;
import java.io.Writer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.core.common.util.HttpHelper;
import jmnet.moka.core.common.util.ResourceMapper;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.rcv.aspect
 * ClassName : IpAllowAspect
 * Created : 2021-02-24 024 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-24 024 오후 5:09
 */
@Aspect
@Slf4j
public class IpAllowAspect {
    private final List<String> allowIpList;

    public IpAllowAspect(String allowIp) {
        String[] allowIpsSplit = allowIp.trim().split(",");
        if (allowIp.trim().length() > 0) {
            this.allowIpList = Arrays.stream(allowIpsSplit).map(
                            ip -> ip.contains("*") ? ip.substring(0, ip.indexOf('*')).trim() : ip.trim())
                                     .filter(ip -> ip.length() > 0).collect(Collectors.toList());
        }else
            this.allowIpList = new ArrayList<>();
    }

    @Around("execution(public * jmnet.moka.web.rcv..*Controller.*(..))")
    public Object ifBlock(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        String methodName = proceedingJoinPoint.getSignature().getName();

        final ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpServletRequest request = servletRequestAttributes.getRequest();
        HttpServletResponse response = servletRequestAttributes.getResponse();

        String remoteAddr = HttpHelper.getRemoteAddr(request);

        if (allowIpList == null)
            return proceedingJoinPoint.proceed();

        if( !McpString.isNullOrEmpty(remoteAddr)) {
            for (String allowIp : allowIpList) {
                if (remoteAddr.startsWith(allowIp)) {
                    return proceedingJoinPoint.proceed();
                }
            }
        }

        log.warn("Requested Remote Address={}", remoteAddr);
        if( response != null)
            responseBlocked(methodName, response);
        return null;
    }

    private void responseBlocked(String methodName, HttpServletResponse response) {
        try {
            response.setContentType(MediaType.APPLICATION_JSON_UTF8_VALUE);
            ResultDTO<String> resultDTO = new ResultDTO<String>(HttpStatus.FORBIDDEN, "Access Denied");
            Writer writer = response.getWriter();
            writer.write(ResourceMapper.getDefaultObjectMapper().writeValueAsString(resultDTO));
            writer.close();
        } catch (IOException e) {
            log.error("Http Response Fail :{} {}", methodName, e);
        }
    }
}
