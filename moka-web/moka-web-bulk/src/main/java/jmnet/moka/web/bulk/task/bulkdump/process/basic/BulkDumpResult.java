package jmnet.moka.web.bulk.task.bulkdump.process.basic;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.bulkdump.process.basic
 * ClassName : BulkProcessResult
 * Created : 2021-02-10 010 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-10 010 오후 2:13
 */
public enum BulkDumpResult {
    SUCCESS(1),
    SKIP_DATABASE(2),
    TIMEOUT_OVP(-10),
    FAIL_DUMP_CP_PROCESS(-5),
    FAIL_DUMP_CP_TOTAL(-6);

    final private int result;
    BulkDumpResult(int result) {
        this.result = result;
    }
}
