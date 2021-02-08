package jmnet.moka.web.bulk.code;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.code
 * ClassName : LoaderStatus
 * Created : 2021-02-02 002 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-02 002 오후 2:06
 */
public class LoaderStatus {
    public final static int Error = -1;
    public final static int Processing = 1;
    public final static int Complete = 10;
    public final static int CompleteBypass = 15;
}
