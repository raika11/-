package jmnet.moka.web.bulk.task.bulkdump.channel;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.LinkedBlockingDeque;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpTotalVo;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.bulkdump.channel
 * ClassName : BulkDumpClientChannelQueueManager
 * Created : 2021-02-09 009 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-09 009 오전 9:41
 */

@Getter
@Setter
public class BulkDumpClientChannelQueueManager {
    private final List<LinkedBlockingDeque<BulkDumpTotalVo>> clientQueueList;
    private final int dumpClientCount;

    public BulkDumpClientChannelQueueManager(int dumpClientCount) {
        this.dumpClientCount = dumpClientCount;
        this.clientQueueList = new ArrayList<>();

        for (int i = 0; i < this.dumpClientCount; i++) {
            this.clientQueueList.add( new LinkedBlockingDeque<>());
        }
    }

    private int getIndex( int index ) {
        return index % dumpClientCount;
    }

    public LinkedBlockingDeque<BulkDumpTotalVo> getQueue(int index ) {
        return clientQueueList.get( getIndex(index));
    }

    public void enqueue(BulkDumpTotalVo bulkDumpTotalVo) {
        getQueue( bulkDumpTotalVo.getContentId() ).add(bulkDumpTotalVo);
    }
}
