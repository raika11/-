package jmnet.moka.web.bulk.controller;

import com.google.common.base.Charsets;
import com.google.common.util.concurrent.ThreadFactoryBuilder;
import java.io.File;
import java.nio.file.Paths;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadFactory;
import javax.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.input.Tailer;
import org.apache.commons.io.input.TailerListenerAdapter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyEmitter;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.rcv.controller
 * ClassName : MokaLogTailController
 * Created : 2021-02-23 023 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-23 023 오후 2:19
 */
@Controller
@Slf4j
public class MokaLogTailController {
    @Value("${logging.path}")
    private String logPath;

    @Value("${logging.file}")
    private String logFile;

    @Value("#{timeHumanizer.parse('${logging.logTail.waitingtime}', 10*60*1000)}") // 10분
    private long logTailWaitTime;

    public static class LogTailerListener extends TailerListenerAdapter {
        final private  ResponseBodyEmitter emitter;
        final private ExecutorService executorService;
        public LogTailerListener(ResponseBodyEmitter emitter, ExecutorService executorService) {
            this.emitter = emitter;
            this.executorService = executorService;
        }
        public void handle(String line) {
            try {
                this.emitter.send(line + "\n");
            } catch (Exception ignore) {
                this.emitter.complete();
                this.executorService.shutdownNow();
            }
        }
    }

    @GetMapping(value = "/logTail")
    public ResponseBodyEmitter logTail(HttpServletResponse response){
        response.setContentType("text/plain;charset=UTF-8");

        final ResponseBodyEmitter emitter = new ResponseBodyEmitter(this.logTailWaitTime);
        final ThreadFactory namedThreadFactory = new ThreadFactoryBuilder().setNameFormat("logTail-thread-%d").build();
        final ExecutorService executorService = Executors.newSingleThreadExecutor(namedThreadFactory);
        final LogTailerListener listener = new LogTailerListener(emitter, executorService);

        final String logFileName = Paths.get(this.logPath, this.logFile).toString();
        executorService.execute( new Tailer(new File(logFileName), Charsets.UTF_8, listener, 100L, true, true, 4096) );

        return emitter;
    }
}
