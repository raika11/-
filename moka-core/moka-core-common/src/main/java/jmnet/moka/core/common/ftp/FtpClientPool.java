package jmnet.moka.core.common.ftp;

import java.io.IOException;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.pool2.BaseObjectPool;
import org.springframework.util.ObjectUtils;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.common.ftp
 * ClassName : FtpClientPool
 * Created : 2020-11-20 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-20 10:39
 */
@Slf4j
public class FtpClientPool extends BaseObjectPool<FTPClient> {

    private static final int DEFAULT_POOL_SIZE = 8;

    private final BlockingQueue<FTPClient> ftpBlockingQueue;
    private final FtpClientFactory ftpClientFactory;


    /**
     * Initialize the connection pool, you need to inject a factory to provide an FTPClient instance
     *
     * @param ftpClientFactory ftp factory
     * @throws Exception 에러 처리
     */
    public FtpClientPool(FtpClientFactory ftpClientFactory) {
        this(DEFAULT_POOL_SIZE, ftpClientFactory);
    }

    public FtpClientPool(int poolSize, FtpClientFactory factory) {
        this.ftpClientFactory = factory;
        ftpBlockingQueue = new ArrayBlockingQueue<>(poolSize);
        initPool(poolSize);
    }

    public FtpClientFactory getFactory() {
        return this.ftpClientFactory;
    }

    /**
     * Initialize the connection pool, you need to inject a factory to provide an FTPClient instance
     *
     * @param maxPoolSize maximum number of connections
     * @throws Exception 에러 처리
     */
    private void initPool(int maxPoolSize) {
        for (int i = 0; i < maxPoolSize; i++) {
            // Add objects to the pool
            try {
                addObject();
            } catch (Exception ex) {
                log.error(ex.toString());
            }
        }
    }

    /**
     * Get objects from the connection pool
     */
    @Override
    public FTPClient borrowObject()
            throws Exception {
        FTPClient client = ftpBlockingQueue.take();
        if (ObjectUtils.isEmpty(client)) {
            client = ftpClientFactory.create();
            // Put into the connection pool
            returnObject(client);
            // Verify that the object is valid
        } else if (!ftpClientFactory.validateObject(ftpClientFactory.wrap(client))) {
            // Process invalid objects
            invalidateObject(client);
            // Create a new object
            client = ftpClientFactory.create();
            // Put the new object into the connection pool
            returnObject(client);
        }
        return client;
    }

    /**
     * Return objects to the connection pool
     */
    @Override
    public void returnObject(FTPClient client) {
        try {
            if (client != null && !ftpBlockingQueue.offer(client, 3, TimeUnit.SECONDS)) {
                ftpClientFactory.destroyObject(ftpClientFactory.wrap(client));
            }
        } catch (InterruptedException e) {
            log.error("return ftp client interrupted ...{}", e.toString());
        }
    }

    /**
     * Remove invalid objects
     */
    @Override
    public void invalidateObject(FTPClient client) {
        try {
            client.changeWorkingDirectory("/");
        } catch (IOException e) {
            log.error(e.toString());
        } finally {
            ftpBlockingQueue.remove(client);
            invalidateFtpBlockingQueue();
        }
    }


    public void invalidateFtpBlockingQueue() {
        for (FTPClient ftpClient : ftpBlockingQueue) {
            try {
                ftpClient.changeWorkingDirectory("/");
            } catch (IOException e) {
                log.error(e.toString());
            } finally {
                ftpBlockingQueue.remove(ftpClient);
            }
        }
    }

    /**
     * Add a new link, timeout expired
     */
    @Override
    public void addObject()
            throws Exception {
        // insert object into the queue
        ftpBlockingQueue.offer(ftpClientFactory.create(), 3, TimeUnit.SECONDS);
    }

    /**
     * Close the connection pool
     */
    @Override
    public void close() {
        try {
            while (ftpBlockingQueue
                    .iterator()
                    .hasNext()) {
                FTPClient client = ftpBlockingQueue.take();
                ftpClientFactory.destroyObject(ftpClientFactory.wrap(client));
            }
        } catch (Exception e) {
            log.error("close ftp client ftpBlockingQueue failed...{}", e.toString());
        }
    }

}
