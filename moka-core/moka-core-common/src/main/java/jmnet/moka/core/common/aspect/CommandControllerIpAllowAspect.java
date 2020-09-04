package jmnet.moka.core.common.aspect;

import java.io.IOException;
import java.io.Writer;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.core.common.util.HttpHelper;
import jmnet.moka.core.common.util.ResourceMapper;

/**
 * <pre>
 * 
 * CommandApi의 IP기반 접근 권한을 처리한다. (DPS, TMS 등)
 * 허용 ip의 설정은 ex) command.allow.ips = 127.0.0.1,192.168.42.100
 * 허용 ip가 없을 경우 전체 허용임
 * 
 * 2020. 5. 7. kspark 최초생성
 * </pre>
 * 
 * @since 2020. 5. 7. 오후 1:14:45
 * @author kspark
 */
@Aspect
public class CommandControllerIpAllowAspect {
    
    public static final Logger logger =
            LoggerFactory.getLogger(CommandControllerIpAllowAspect.class);

    private List<String> allowIpList;
    
    
    public CommandControllerIpAllowAspect(String commandAllowIps) {
        String[] allowIpsSplit = commandAllowIps.trim().split(",");
        if (commandAllowIps != null && commandAllowIps.trim().length() > 0) {
            // ip 비교를 startsWith방식으로 처리하기 위해 *부터 버림
            this.allowIpList = Arrays.stream(allowIpsSplit).map(
                    ip -> ip.contains("*") ? ip.substring(0, ip.indexOf('*')).trim() : ip.trim())
                    .filter(ip -> ip.length() > 0).collect(Collectors.toList());
        }
    }
    
    @Around("execution(public * jmnet.moka..CommandController.*(..))")
    public Object ifBlock(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        String methodName = proceedingJoinPoint.getSignature().getName();
        HttpServletRequest request = null;
        HttpServletResponse response = null;

        for (Object arg : proceedingJoinPoint.getArgs()) {
            if (arg instanceof HttpServletRequest) {
                request = (HttpServletRequest) arg;
            }
            if (arg instanceof HttpServletResponse) {
                response = (HttpServletResponse) arg;
            }
        }

        String remoteAddr = null;
        if (request != null) {
            remoteAddr = HttpHelper.getRemoteAddr(request);
        }

        if (allowIpList != null) {
            boolean blocked = true;
            for (String allowIp : allowIpList) {
                if (remoteAddr.startsWith(allowIp)) {
                    blocked = false;
                    return proceedingJoinPoint.proceed();
                }
            }
            if (blocked) {
                logger.warn("Requested Remote Address={}", remoteAddr);
                responseBlocked(methodName, response);
            }
        } else {
            // allowIp에 대한 설정이 없는 경우
            return proceedingJoinPoint.proceed();
        }
        return null;
    }

    private void responseBlocked(String methodName, HttpServletResponse response) {
        try {
            response.setContentType(MediaType.APPLICATION_JSON_UTF8_VALUE);
            ResultDTO<String> resultDTO =
                    new ResultDTO<String>(HttpStatus.FORBIDDEN, "Access Denied");
            Writer writer = response.getWriter();
            writer.write(ResourceMapper.getDefaultObjectMapper().writeValueAsString(resultDTO));
            writer.close();
        } catch (IOException e) {
            logger.error("Http Response Fail :{} {}", methodName, e);
        }

    }
}
