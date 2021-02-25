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

    @GetMapping("/taskmanager")
    public Map<String, Object> operation(@RequestParam Map<String, String> param) {
        Map<String, Object> responseMap = new HashMap<>();
        boolean success = false;
        //noinspection ConstantConditions
        do {
            if( !param.containsKey("opcode") ) {
                responseMap.put("errorMessage", "No opcode !!");
                break;
            }
            if( !param.containsKey("target") ) {
                responseMap.put("errorMessage", "No Target !!");
                break;
            }

            final String opCode = param.get("opcode");
            final String target = param.get("target");
            try {
                success = taskManager.operation( OpCode.valueOf(opCode), target, param, responseMap);
            }catch (IllegalArgumentException e) {
                responseMap.put("errorMessage", "opcode not found");
            }catch (Exception e) {
                responseMap.put("errorMessage", "exception occur !!");
            }
        }while( false );

        responseMap.put("success", success);

        return responseMap;
    }

    @GetMapping("/sms/smsTest")
    @SuppressWarnings("SameReturnValue")
    public String doSmsTest() {
        log.info("doSmsTest");
        taskManager.getSlackMessageService().sendSms("smsTest", "sms" + McpDate.dateTimeStr(new Date()));
        return "doSmsTest";
    }

    @GetMapping("/sms/smsPause")
    @SuppressWarnings("SameReturnValue")
    public String doSmsPause() {
        log.info("doSmsPause");
        taskManager.getSlackMessageService().pause();
        return "doSmsTest";
    }
}
