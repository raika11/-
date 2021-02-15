package jmnet.moka.web.push.support;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.atomic.AtomicInteger;


public class NamingThreadFactory implements ThreadFactory {
    private static Map<String, AtomicInteger> threadNameMap = new HashMap<>();
    private String name;

    public NamingThreadFactory(final String name) {
        this.name = name;
        threadNameMap.put(name, new AtomicInteger(0));
    }

    /* (non-Javadoc)
     * @see java.util.concurrent.ThreadFactory#newThread(java.lang.Runnable)
     */
    @Override
    public Thread newThread(Runnable r) {
        StringBuffer threadName = new StringBuffer(name)
                .append("-")
                .append(threadNameMap
                        .get(name)
                        .incrementAndGet());

        return new Thread(r, threadName.toString());
    }
}
