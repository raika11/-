package jmnet.moka.web.push.mvc.system.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <pre>
 * 시스템 Controller
 * Project : moka
 * Package : jmnet.moka.web.push.mvc.system.controller
 * ClassName : SystemController
 * Created : 2021-02-05 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-05 17:40
 */
@RestController
@RequestMapping(produces = "application/json; charset=UTF-8")
public class SystemController {

    @GetMapping(path = "/command/health", produces = "text/plain")
    public ResponseEntity<?> _health(HttpServletRequest request, HttpServletResponse response) {
        return new ResponseEntity<>("OK", HttpStatus.OK);
    }
}
