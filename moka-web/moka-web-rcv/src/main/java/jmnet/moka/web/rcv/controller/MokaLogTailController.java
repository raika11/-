package jmnet.moka.web.rcv.controller;

import com.google.common.base.Charsets;
import com.google.common.util.concurrent.ThreadFactoryBuilder;
import java.io.File;
import java.nio.file.Paths;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jmnet.moka.common.utils.McpString;
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
        final String include;
        final String exclude;

        public LogTailerListener(ResponseBodyEmitter emitter, ExecutorService executorService, String include, String exclude) {
            this.emitter = emitter;
            this.executorService = executorService;
            this.include = include;
            this.exclude = exclude;
        }
        public void handle(String line) {
            try {
                boolean produce = true;
                if( !McpString.isNullOrEmpty(this.exclude) ) {
                    for( String exclude : this.exclude.split(";") ){
                        if( line.contains(exclude) ) {
                            produce = false;
                            break;
                        }
                    }
                }

                if( produce ) {
                    if( !McpString.isNullOrEmpty(this.include) ) {
                        produce = false;
                        for( String include : this.include.split(";") ){
                            if( line.contains(include) ) {
                                produce = true;
                                break;
                            }
                        }
                    }
                }

                if( produce )
                    this.emitter.send(line + "\n");
            } catch (Exception ignore) {
                this.emitter.complete();
                this.executorService.shutdownNow();
            }
        }
    }

    @GetMapping(value = "/logTail")
    public ResponseBodyEmitter logTail(
            HttpServletRequest request, HttpServletResponse response ){
        response.setContentType("text/plain;charset=UTF-8");

        Map<String, String[]> map = request.getParameterMap();

        String include = null;
        String exclude = null;

        if( map.containsKey("include")) {
            String[] value = map.get("include");
            if( value.length > 0 )
                include = value[0];
        }
        if( map.containsKey("exclude")) {
            String[] value = map.get("exclude");
            if( value.length > 0 )
                exclude = value[0];
        }

        final ResponseBodyEmitter emitter = new ResponseBodyEmitter(this.logTailWaitTime);
        final ExecutorService executorService = Executors.newSingleThreadExecutor(new ThreadFactoryBuilder().setNameFormat("logTail-thread-%d").build());

        final String logFileName = Paths.get(this.logPath, this.logFile).toString();
        executorService.execute(
                new Tailer(
                        new File(logFileName), Charsets.UTF_8,
                        new LogTailerListener(emitter, executorService, include, exclude), 100L, true, true, 4096) );
        return emitter;
    }
}
