package jmnet.moka.web.rcv.util;

import java.util.Map;
import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.util
 * ClassName : ThreadUtil
 * Created : 2020-10-27 027 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-27 027 오후 5:54
 */
@Slf4j
public class ThreadUtil {
    private static final Object mutex = new Object();
    private static ThreadGroup THREAD_GROUP;

    private static ThreadGroup getThreadGroup() {
        if( THREAD_GROUP == null ) {
            synchronized (mutex) {
                if (THREAD_GROUP == null)
                    THREAD_GROUP = new ThreadGroup("RCV");
            }
        }
        return THREAD_GROUP;
    }

    static {
        Runtime.getRuntime().addShutdownHook(new Thread(ThreadUtil::interruptAll));
    }

    public static Thread create(String name, Runnable runnable) {
        return new Thread(getThreadGroup(), runnable, runnable
                .getClass()
                .getName() + "[" + name + "]");
    }

    public static void interruptAll() {
        interruptAll(0);
    }

    public static void interruptAll(int ms) {
        interruptAll(null, ms);
    }

    public static void interruptAll(String groupName, int ms) {
        if (groupName == null) {
            groupName = getThreadGroup().getName();
        }

        Map<Thread, StackTraceElement[]> tm = Thread.getAllStackTraces();
        ThreadGroup tg;
        for (Thread t : tm.keySet()) {
            if (t.isAlive()) {
                tg = t.getThreadGroup();
                if (tg == null) {
                    log.info("Interrupt to {}", t.getName());
                    t.interrupt();
                } else {
                    if (groupName.equals(tg.getName())) {
                        log.info("Interrupt to {} of {}", t.getName(), tg.getName());
                        t.interrupt();
                    }
                }
                if (ms > 0) {
                    try {
                        t.join(ms);
                    } catch (Exception ignore) {
                        log.trace("ThreadUtil :: interruptAll Exception" );
                    }
                }
            }
        }
    }
}
