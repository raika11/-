package jmnet.moka.web.bulk.controller;

import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jmnet.moka.web.bulk.code.OpCode;
import jmnet.moka.web.bulk.task.base.TaskManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk
 * ClassName : MokaBulkRestController
 * Created : 2020-10-27 027 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-27 027 오후 7:03
 */
@Slf4j
@RestController
@RequestMapping(produces = "application/json; charset=UTF-8")
public class MokaBulkRestController {
    private final TaskManager taskManager;

    public MokaBulkRestController(TaskManager taskManager) {
        this.taskManager = taskManager;
    }

    @RequestMapping(method = RequestMethod.GET, path = "/command/health", produces = "text/plain")
    public ResponseEntity<?> _health(HttpServletRequest request, HttpServletResponse response) {
        return new ResponseEntity<>("OK", HttpStatus.OK);
    }

    @GetMapping("/taskmanager/pause")
    public Map<String, Object> doPause(@RequestParam Map<String, String> param) {
        log.info("doPause");

        try {
            this.taskManager.operation(OpCode.PAUSE, param.get("id"), null);
        } catch (InterruptedException e) {
            // no
        }

        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("success", true);        // success
        return responseMap;
    }

    @GetMapping("/taskmanager/resume")
    public Map<String, Object> doResume() {
        log.info("doResume");

        try {
            this.taskManager.operation(OpCode.RESUME);
        } catch (InterruptedException e) {
            // no
        }

        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("success", true);        // success
        return responseMap;
    }

    @GetMapping("/taskmanager/listtask")
    public Map<String, Object> doListTask() {
        log.info("doListTask");

        Map<String, Object> responseMap = new HashMap<>();
        try {
            this.taskManager.operation(OpCode.LISTTASK, "", responseMap);
        } catch (InterruptedException e) {
            // no operation
        }
        return responseMap;
    }
}
