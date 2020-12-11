package jmnet.moka.web.wms.mvc.menu.service;

import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.wms.config.ReactRoutesHandlerMapping;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.DependsOn;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.stereotype.Service;

/**
 * <pre>
 * 메뉴 Route Service implementation
 * Project : moka
 * Package : jmnet.moka.web.wms.mvc.menu.service
 * ClassName : RouteConfigServiceImpl
 * Created : 2020-11-06 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-06 09:14
 */
@Slf4j
@Service
@DependsOn(value = {"reactRoute", "httpSecurity"})
public class RouteConfigServiceImpl implements RouteConfigService {

    @Autowired
    private ReactRoutesHandlerMapping reactRoute;

    @Autowired
    private HttpSecurity httpSecurity;

    @Override
    public void addMenuRoute(String route) {
        reactRoute.addReactRoutesList(route);
        setRoutPermit(route);
    }

    @Override
    public void changeMenuRoute(String orgRoute, String route) {
        reactRoute.removeReactRoutesList(orgRoute);
        reactRoute.addReactRoutesList(route);
        setRoutPermit(route);
    }

    @Override
    public void removeMenuRoute(String route) {
        reactRoute.removeReactRoutesList(route);
        setRoutPermit(route);
    }

    private void setRoutPermit(String route) {

        String[] reactRoutes = reactRoute
                .getReactRoutesList()
                .stream()
                .filter(s -> McpString.isNotEmpty(s))
                .map(s -> s + "/**")
                .toArray(value -> new String[value]);
        try {
            log.debug("change menus {}", reactRoutes);
            synchronized (RouteConfigServiceImpl.class) {
                httpSecurity
                        .authorizeRequests()
                        .antMatchers(reactRoutes)
                        .permitAll();
            }
        } catch (Exception ex) {
            log.error("[FAIL ROUTE Config] : {}, {}", route, ex.toString());
        }
    }
}
