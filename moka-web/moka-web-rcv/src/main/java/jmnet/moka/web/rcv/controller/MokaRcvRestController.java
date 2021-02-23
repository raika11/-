package jmnet.moka.web.rcv.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.web.rcv.code.OpCode;
import jmnet.moka.web.rcv.task.base.TaskManager;
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
 * Package : jmnet.moka.web.rcv
 * ClassName : MokaRcvRestController
 * Created : 2020-10-27 027 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-27 027 오후 7:03
 */
@Slf4j
@RestController
@RequestMapping(produces = "application/json; charset=UTF-8")
public class MokaRcvRestController {
    private final TaskManager taskManager;

    public MokaRcvRestController(TaskManager taskManager) {
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

    @GetMapping("/sms/smsTest")
    public String doSmsTest() {
        log.info("doSmsTest");
        taskManager.getSlackMessageService().sendSms("smsTest", "sms" + McpDate.dateTimeStr(new Date()));
        return "doSmsTest";
    }

    @GetMapping("/sms/smsPause")
    public String doSmsPause() {
        log.info("doSmsPause");
        taskManager.getSlackMessageService().pause();
        return "doSmsTest";
    }
}
