package jmnet.moka.web.wms.config.security;

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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.web.wms.config.security
 * ClassName : InboundIpAuthenticationFilter
 * Created : 2021-02-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-08 10:55
 */
public class InboundIpAuthenticationFilter extends BasicAuthenticationFilter {

    Set<String> whitelist = new HashSet<>();

    public InboundIpAuthenticationFilter(AuthenticationManager authenticationManager, String[] ips) {
        super(authenticationManager);
        for (String ip : ips) {
            whitelist.add(ip);
        }
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
            // Continue filter execution
            chain.doFilter(request, response);
            return;
        }
        if (request.getHeader("MOKA_SERVER") != null) {
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userIp, null, null);
            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authenticationToken);
        }
        chain.doFilter(request, response);

    }



}
