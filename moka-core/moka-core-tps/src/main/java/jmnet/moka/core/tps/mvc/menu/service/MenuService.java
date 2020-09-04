/**
 * msp-tps MenuService.java 2020. 6. 22. 오전 11:40:40 ssc
 */
package jmnet.moka.core.tps.mvc.menu.service;

import jmnet.moka.core.tps.mvc.menu.dto.MenuNode;

/**
 * <pre>
 * 
 * 2020. 6. 22. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 6. 22. 오전 11:40:40
 * @author ssc
 */
public interface MenuService {

    /**
     * <pre>
      * 메뉴목록 조회
     * </pre>
     * 
     * @return 메뉴목록
     */
    MenuNode makeTree();

}
