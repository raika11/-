package jmnet.moka.web.rcv.code;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.code
 * ClassName : OpCode
 * Created : 2020-11-03 003 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-03 003 오전 9:47
 */
public class OpCode {
    public static final int SERVE = 1;
    public static final int PAUSE = 2;
    public static final int RESUME = 3;
    public static final int LISTTASK = 4;
    public static final int STOP = -1;
    public static final int FORCE_EXECUTE = 10;
}
