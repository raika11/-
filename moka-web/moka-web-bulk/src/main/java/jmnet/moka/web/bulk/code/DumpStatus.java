package jmnet.moka.web.bulk.code;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.code
 * ClassName : DumpStatus
 * Created : 2021-02-03 003 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-03 003 오후 2:57
 */
public class DumpStatus {
    public final static int Error = -1;
    public final static int Processing = 1;
    public final static int ProcessingJhot = 3;
    public final static int TimeOutOvp = 5;
    public final static int Complete = 10;
    public final static int CompleteJhot = 15;
    public final static int SkipDatabase = 20;
}
