package jmnet.moka.web.rcv.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.nio.charset.StandardCharsets;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.util
 * ClassName : RcvUtil
 * Created : 2020-10-29 029 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-29 029 오후 3:46
 */
public class RcvUtil {
    public static int ParseInt(String s) {
        try {
            return Integer.parseInt(s);
        } catch (Exception e) {
            // no
        }
        return 0;
    }

    public static String sendUrlGetRequest(String urlcall) {
        try {
            URL url = new URL(urlcall);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setConnectTimeout(1000);
            con.setReadTimeout(1000);
            con.setRequestMethod("GET");
            con.setDoOutput(false);

            if (con.getResponseCode() == HttpURLConnection.HTTP_OK) {
                BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream(), StandardCharsets.UTF_8));
                String line;

                StringBuilder sb = new StringBuilder();
                while ((line = br.readLine()) != null) {
                    sb
                            .append(line)
                            .append("\n");
                }
                br.close();

                return sb.toString();
            }
        } catch (IOException ignore) {
        }
        return null;
    }
}