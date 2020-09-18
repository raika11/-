package jmnet.moka.common.proxy.http;

import org.apache.http.conn.HttpClientConnectionManager;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;

import java.util.concurrent.TimeUnit;

public class IdleConnectionMonitor extends Thread {
    private final HttpClientConnectionManager connectionManager;
    private volatile boolean shutdown;
    private int intervalSec;
    private int idleTimeSec;

    public IdleConnectionMonitor(PoolingHttpClientConnectionManager connectionManager, int intervalSec, int idleTimeSec) {
        super();
        this.setName("HTTP-Idle-Connection-Monitor");
        this.connectionManager = connectionManager;
        this.intervalSec = intervalSec;
        this.idleTimeSec = idleTimeSec;
    }

    @Override
    public void run() {
        try {
            while (!shutdown) {
                synchronized (this) {
                    wait(intervalSec * 1000);
                    if (connectionManager != null) {
                        connectionManager.closeExpiredConnections();
                        connectionManager.closeIdleConnections(idleTimeSec, TimeUnit.SECONDS);
                    }
                }
            }
        } catch (InterruptedException ex) {
            shutdown();
        }
    }

    public void shutdown() {
        shutdown = true;
        synchronized (this) {
            notifyAll();
        }
    }
}
