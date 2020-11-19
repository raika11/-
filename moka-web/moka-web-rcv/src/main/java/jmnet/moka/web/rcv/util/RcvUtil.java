package jmnet.moka.web.rcv.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
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
    public static int parseInt(String s) {
        try {
            return Integer.parseInt(s);
        } catch (Exception e) {
            // no
        }
        return 0;
    }

    public static String cpReplaceInsertData(String input) {
        if( input == null )
            return null;
        StringBuilder s = new StringBuilder(input.length());
        for (int i = 0; i < input.length(); i++) {
            switch (input.charAt(i)) {
                case '\'':
                    s.append("`");
                    break;
                case '[':
                    s.append("&#91;");
                    break;
                case ']':
                    s.append("&#93;");
                    break;
                case '\u001A':
                case '\u2009':
                    s.append(" ");
                    break;
                case '‧':
                    s.append("&#8901;");
                    break;
                default:
                    s.append(input.charAt(i));
                    break;
            }
        }
        return s.toString();
    }

    public static String sendUrlGetRequest(String urlAddress) {
        try {
            URL url = new URL(urlAddress);
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