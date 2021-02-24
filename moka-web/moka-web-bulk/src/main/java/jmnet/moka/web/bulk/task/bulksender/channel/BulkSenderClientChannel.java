package jmnet.moka.web.bulk.task.bulksender.channel;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import jmnet.moka.web.bulk.task.bulkdump.env.BulkDumpEnv;
import jmnet.moka.web.bulk.task.bulksender.BulkSenderTask;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.bulksender.channel
 * ClassName : BulkSenderClientChannel
 * Created : 2021-01-26 026 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-01-26 026 오후 3:46
 */
@Slf4j
@Getter
public class BulkSenderClientChannel {
    private final ThreadPoolExecutor executor;
    private final List<BulkSenderClientHandler> clientHandlerList = new ArrayList<>();

    public BulkSenderClientChannel(BulkDumpEnv bulkDumpEnv, BulkSenderTask bulkSenderTask) {
        final int cpCount = bulkDumpEnv.getDumpEnvCPs().size();
        if( cpCount > 0) {
            this.executor = new ThreadPoolExecutor(cpCount, cpCount, 100, TimeUnit.MILLISECONDS, new LinkedBlockingDeque<>(cpCount),
                            (r, executor) -> log.info("BulkDumpClientChannel pool is full {}", executor
                                    .getQueue()
                                    .size()));
            for (int i = 0; i < cpCount; i++) {
                final BulkSenderClientHandler bulkSenderClientHandler = new BulkSenderClientHandler(bulkDumpEnv.getDumpEnvCPs().get(i), bulkSenderTask);
                clientHandlerList.add(bulkSenderClientHandler);
                this.executor.execute(bulkSenderClientHandler);
            }
        }
        else
            executor= null;
    }

    public void stopChannel() {
        if( executor != null ) {
            try {
                if( !executor.isTerminated()) {
                    executor.shutdownNow();
                    if (!Thread.interrupted())
                        executor.awaitTermination(100, TimeUnit.MILLISECONDS);
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
