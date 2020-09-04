package jmnet.moka.core.common.purge;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.StringReader;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.Socket;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.core.common.purge.model.PurgeResult;

public class VarnishPurger {
    public static final Logger logger = LoggerFactory.getLogger(VarnishPurger.class);
    /**
     * 기본 Connect Timeout 1000 ms
     */
    public static final int DEFAULT_CONNECT_TIMEOUT = 1000;
    /**
     * 기본 Read Timeout 5000 ms
     */
    public static final int DEFAULT_READ_TIMEOUT = 5000;

    private int readTimeout;
    private int connectTimeout;

    /**
     * <pre>
     * 기본 생성자(메소드=PURGE)
     * readTimeout 5초
     * connectTimeout 1초
     * purge할 대상을 미리 저장해 놓고 사용하고자 할 경우 사용한다.
     * </pre>
     */
    public VarnishPurger()
    {
        this.readTimeout = DEFAULT_CONNECT_TIMEOUT;
        this.connectTimeout = DEFAULT_READ_TIMEOUT;
    }


    public PurgeResult purge(String host, int port, String domain, String path) {
        PurgeResult purgeResult =
                new PurgeResult(String.join("-", "Varnish", "PURGE", host, domain, path));
        try {
            String responseMessage =
                    request(createSocketAddress(host, port), "PURGE", domain, path);
            int responseCode = getResponseCode(responseMessage);
            purgeResult.setResponseCode(responseCode);
            purgeResult.setSuccess(responseCode == 200 ? true : false);
            purgeResult.setResponseMessage(responseMessage);
        } catch (Exception e) {
            purgeResult.setResponseCode(PurgeResult.PURGE_FAIL);
            purgeResult.setSuccess(false);
            purgeResult.setResponseMessage(e.getMessage());
            logger.error("Varnish Purge Fail: {}", purgeResult.getName(), e);
        }
        return purgeResult;
    }

    public PurgeResult ban(String host, int port, String domain, String path) {
        PurgeResult purgeResult =
                new PurgeResult(String.join("-", "Varnish", "BAN", host, domain, path));
        try {
            String responseMessage = request(createSocketAddress(host, port), "BAN", domain, path);
            int responseCode = getResponseCode(responseMessage);
            purgeResult.setResponseCode(responseCode);
            purgeResult.setSuccess(responseCode == 200 ? true : false);
            purgeResult.setResponseMessage(responseMessage);
        } catch (Exception e) {
            purgeResult.setResponseCode(PurgeResult.PURGE_FAIL);
            purgeResult.setSuccess(false);
            purgeResult.setResponseMessage(e.getMessage());
            logger.error("Varnish Purge Fail: {}", purgeResult.getName(), e);
        }
        return purgeResult;
    }

    private int getResponseCode(String resultMessage) {
        try (BufferedReader br = new BufferedReader(new StringReader(resultMessage))) {
            String line = br.readLine();
            br.close();
            String[] splitted = line.split("\\s+");
            return Integer.parseInt(splitted[1]);
        } catch (Exception e) {
            logger.error("Varnish Response Parse Fail: {}", e);
            return PurgeResult.PURGE_FAIL;
        }
    }


    private String request(InetSocketAddress addr, String method, String domain, String path)
            throws IOException {
        StringBuilder sb = new StringBuilder();
        byte[] message = makeMessage(addr, method, domain, path).getBytes();
        OutputStream os = null;
        InputStream is = null;
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (Socket s = makeSocket(addr, connectTimeout, readTimeout)) {
            os = s.getOutputStream();
            is = s.getInputStream();
            sb.setLength(0);

            // request
            os.write(message, 0, message.length);
            os.flush();
            int bytesRead;
            byte[] buffer = new byte[1024];
            while ((bytesRead = is.read(buffer)) >= 0) {
                baos.write(buffer, 0, bytesRead);
            }
            os.close();
            is.close();
        }
        return baos.toString();
    }

    /**
     * 서버정보를 이용하여 InetSocketAddress를 생성한다.
     * 
     * @param server IP 또는 IP:PORT
     * @return InetSocketAddress
     */
    static InetSocketAddress createSocketAddress(String server) {
        int n = server.indexOf(':');
        if (n < 0)
            return createSocketAddress(server, 80);
        else
            return createSocketAddress(server.substring(0, n),
                    Integer.parseInt(server.substring(n + 1).trim()));
    }

    /**
     * InetSocketAddress 를 생성한다.
     * 
     * @param host Host/IP
     * @param port Port
     * @return InetSocketAddress
     */
    static InetSocketAddress createSocketAddress(String host, int port) {
        try {
            InetAddress addr = InetAddress.getByName(host);
            return new InetSocketAddress(addr, port);
        } catch (Exception ex) {
            return new InetSocketAddress(host, port);
        }
    }

    /**
     * Socket 생성
     * 
     * @param addr InetSocketAddress
     * @param connectTimeout Connect Timeout
     * @param readTimeout Read Timeout
     * @return Socket
     * @throws IOException 예외
     */
    static Socket makeSocket(InetSocketAddress addr, int connectTimeout, int readTimeout)
            throws IOException {
        Socket s = new Socket();
        s.setSoTimeout(readTimeout);
        s.setTcpNoDelay(true);
        s.connect(addr, connectTimeout);
        return s;
    }

    /**
     * Purge 요청 메시지를 생성한다.
     * 
     * @param addr InetSocketAddress
     * @param method Method
     * @param domain Host
     * @param path Path
     * @param headers 헤더
     * @param sb 버퍼로 사용할 StringBuilder
     * @return HTTP 요청 메시지
     */
    private String makeMessage(InetSocketAddress addr, String method, String domain, String path) {
        StringBuilder sb = new StringBuilder();
        sb.append(method).append(" ").append(path)
                .append(" HTTP/1.0\r\n").append("Connection: close\r\n");
        sb.append("Host: ").append(domain).append("\r\n\r\n");
        return sb.toString();
    }

}
