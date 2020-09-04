package jmnet.moka.core.common.purge;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.core.common.purge.model.PurgeResult;

public class HttpPurger {
    public static final Logger logger = LoggerFactory.getLogger(HttpPurger.class);
    /**
     * 기본 Connect Timeout 1000 ms
     */
    public static final int DEFAULT_CONNECT_TIMEOUT = 1000;
    /**
     * 기본 Read Timeout 5000 ms
     */
    public static final int DEFAULT_READ_TIMEOUT = 5000;

    private int readTimeout = DEFAULT_READ_TIMEOUT;
    private int connectTimeout = DEFAULT_CONNECT_TIMEOUT;

    public PurgeResult purge(String host, int port, String urlString) {
        PurgeResult purgeResult = new PurgeResult("HTTP-" + host);
        try {
            URL url = new URL(
                    String.join("", "http://", host, ":", Integer.toString(port), urlString));
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setConnectTimeout(connectTimeout); //서버에 연결되는 Timeout 시간 설정
            con.setReadTimeout(readTimeout); // InputStream 읽어 오는 Timeout 시간 설정
            con.setRequestMethod("GET");
            con.setDoOutput(false);
            StringBuilder sb = new StringBuilder();
            purgeResult.setResponseCode(con.getResponseCode());
            purgeResult.setSuccess(con.getResponseCode() == 200 ? true : false);
            BufferedReader br =
                    new BufferedReader(new InputStreamReader(con.getInputStream(), "utf-8"));
            String line;
            while ((line = br.readLine()) != null) {
                sb.append(line).append("\n");
            }
            br.close();
            purgeResult.setResponseMessage(sb.toString());
        } catch (Exception e) {
            purgeResult.setSuccess(false);
            purgeResult.setResponseCode(PurgeResult.PURGE_FAIL);
            purgeResult.setResponseMessage(e.getMessage());
            logger.error("Purge Failed: {}", purgeResult.getName(), e);
        }
        return purgeResult;
    }


}
