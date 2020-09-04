/**
 * msp-tps MainController.java 2020. 1. 3. 오후 7:37:21 ssc
 */
package jmnet.moka.web.wms.mvc.main.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * <pre>
 * 
 * 2020. 1. 3. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 1. 3. 오후 7:37:21
 * @author ssc
 */
@Controller
public class MainController {

    @RequestMapping(method = RequestMethod.GET, path = "/command/health", produces = "text/plain")
    public ResponseEntity<?> health(HttpServletRequest request, HttpServletResponse response) {
        return new ResponseEntity<>("OK", HttpStatus.OK);
    }

}
