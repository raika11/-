package jmnet.moka.web.rcv.controller;

import java.util.HashMap;
import java.util.Map;
import jmnet.moka.web.rcv.code.OpCode;
import jmnet.moka.web.rcv.task.base.TaskManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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

        /*
        final String fileName =
                "C:\\중앙일보\\JAM 수신 소스\\JAM 소스\\Joongang.JCMS.Receive.Web\\ReceiveData\\Joongang_Jopan\\Comp\\202009\\08\\1_820114_20200908050028.xml";
        File file = new File(fileName);
        try {
            JamArticleVo jamArticleVo = (JamArticleVo) JaxbObjectManager.getBasicVoFromXml(file, JamArticleVo.class);
            jamXmlRcvService.insertReceiveJobStep(jamArticleVo);
        } catch (XMLStreamException e) {
            e.printStackTrace();
        } catch (JAXBException e) {
            e.printStackTrace();
        }
*/
        Map<String, Object> responseMap = new HashMap<>();
        try {
            this.taskManager.operation(OpCode.LISTTASK, "", responseMap);
        } catch (InterruptedException e) {
            // no operation
        }
        return responseMap;
    }
}
