package jmnet.moka.web.wms.mvc.menu.service;

/**
 * <pre>
 * 메뉴 Route Service
 * Project : moka
 * Package : jmnet.moka.web.wms.mvc.menu.service
 * ClassName : RouteConfigService
 * Created : 2020-11-06 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-06 09:14
 */
public interface RouteConfigService {

    /**
     * route 추가
     *
     * @param route 메뉴 경로
     */
    void addMenuRoute(String route);

    /**
     * route 변경
     *
     * @param orgRoute 이전 메뉴 경로
     * @param route    메뉴 경로
     */
    void changeMenuRoute(String orgRoute, String route);

    /**
     * route 제거
     *
     * @param route 메뉴 경로
     */
    void removeMenuRoute(String route);
}
