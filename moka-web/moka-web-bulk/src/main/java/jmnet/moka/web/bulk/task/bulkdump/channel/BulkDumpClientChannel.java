package jmnet.moka.web.bulk.task.bulkdump.channel;

import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.web.bulk.exception.BulkException;
import jmnet.moka.web.bulk.task.bulkdump.BulkDumpTask;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpTotalVo;
import jmnet.moka.web.bulk.util.BulkUtil;
import jmnet.moka.web.bulk.util.XMLUtil;
import lombok.extern.slf4j.Slf4j;
import org.w3c.dom.Node;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.task.bulkdump
 * ClassName : BulkDumpClientChannnel
 * Created : 2020-12-18 018 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-18 018 오전 10:00
 */
@Slf4j
public class BulkDumpClientChannel  {
    private final ThreadPoolExecutor executor;
    private final LinkedBlockingDeque<BulkDumpTotalVo> clientQueue = new LinkedBlockingDeque<>();

    private final AtomicInteger waitExecutorCount;

    public BulkDumpClientChannel(Node node, XMLUtil xu, BulkDumpTask bulkDumpTask)
            throws XPathExpressionException, BulkException {
        final int dumpClientCount = BulkUtil.parseInt( xu.getString(node, "./@bulkDumpClientCount", "0") );
        if (dumpClientCount == 0) {
            throw new BulkException("bulkDumpClientCount 환경 값 설정이 잘못되었습니다.");
        }
        this.executor = new ThreadPoolExecutor( dumpClientCount, dumpClientCount, 100, TimeUnit.MILLISECONDS, new LinkedBlockingDeque<>(dumpClientCount),
                (r, executor) -> log.info("BulkDumpClientChannel pool is full {}", executor.getQueue().size() ) );
        this.waitExecutorCount = new AtomicInteger(dumpClientCount);

        for( int i=0 ; i<dumpClientCount ; i++) {
            this.executor.execute(new BulkDumpClientHandler(this, bulkDumpTask));
        }
    }

    public void enqueue( BulkDumpTotalVo bulkDumpTotalVo) {
        clientQueue.add(bulkDumpTotalVo);
    }

    public BulkDumpTotalVo takeQueue()
            throws InterruptedException {
        return clientQueue.take();
    }

    public void incrementWaitExecutorCount() {
        waitExecutorCount.addAndGet(1);
    }

    public void decrementWaitExecutorCount() {
        waitExecutorCount.decrementAndGet();
    }

    public void stopChannel() {
        if( executor != null ) {
            try {
                executor.awaitTermination( 100, TimeUnit.MILLISECONDS );
                if( !executor.isTerminated())
                    executor.shutdownNow();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
    public int getWaitExecutorCount() {
        if( clientQueue.size() > 0 )
            return 0;
        if( this.waitExecutorCount != null )
            return waitExecutorCount.get();
        return 0;
    }
}