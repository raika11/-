package jmnet.moka.web.schedule.config;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Pattern;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jmnet.moka.core.common.util.HttpHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.web.schedule.config
 * ClassName : IpAuthenticationProvider
 * Created : 2021-02-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-08 10:55
 */
public class IpAuthenticationFilter extends BasicAuthenticationFilter {

    Set<String> whitelist = new HashSet<>();

    public IpAuthenticationFilter(AuthenticationManager authenticationManager) {
        super(authenticationManager);
        whitelist.add("172.29.58.*");
        whitelist.add("192.168.0.1");
        whitelist.add("127.0.0.1");
        whitelist.add("0:0:0:0:0:0:0:1");
    }

    // endpoint every request hit with authorization
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        String userIp = HttpHelper.getRemoteAddr(request);
        if (!whitelist
                .stream()
                .anyMatch(s -> {
                    String pattenr = s
                            .replaceAll("\\.", "\\\\.")
                            .replaceAll("\\.\\*", "\\..*")
                            .trim();
                    return Pattern
                            .compile(s)
                            .matcher(userIp)
                            .find();
                })) {
            throw new BadCredentialsException("Invalid IP Address");
        }
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userIp, null, null);
        SecurityContextHolder
                .getContext()
                .setAuthentication(authenticationToken);

        // lastAcessTime??? ?????????
        request.getSession(false);

        // Continue filter execution
        chain.doFilter(request, response);
    }



}
