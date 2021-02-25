package jmnet.moka.web.bulk.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Map;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.util
 * ClassName : BulkUtil
 * Created : 2020-10-29 029 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-29 029 오후 3:46
 */
public class BulkUtil {
    public static int parseInt(String s) {
        try {
            return Integer.parseInt(s);
        } catch (Exception e) {
            // no
        }
        return 0;
    }

    @SuppressWarnings("rawtypes")
    public static String getMapStringData( Map map, String key ){
        return getMapStringData(map, key, false);
    }

    @SuppressWarnings("rawtypes")
    public static String getMapStringData(Map map, String key, boolean isNull) {
        if( !map.containsKey(key) )
            return isNull ? null : "";
        return map.get(key).toString();
    }

    private static String sendUrlRequest( String urlAddress, String json, boolean isGet ) {
        try {
            URL url = new URL(urlAddress);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setConnectTimeout(1000);
            con.setReadTimeout(1000);
            if( isGet ) {
                con.setRequestMethod("GET");
                con.setDoOutput(false);
            }
            else {
                con.setRequestMethod("POST");
                con.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
                con.setRequestProperty("Accept-Charset", "UTF-8");
                con.setDoOutput(true);

                OutputStream os = con.getOutputStream();
                os.write(json.getBytes(StandardCharsets.UTF_8));
                os.flush();
            }

            if (con.getResponseCode() == HttpURLConnection.HTTP_OK) {
                BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream(), StandardCharsets.UTF_8));
                String line;

                StringBuilder sb = new StringBuilder();
                while ((line = br.readLine()) != null) {
                    sb.append(line).append("\n");
                }
                br.close();

                return sb.toString();
            }
        } catch (IOException ignore) {
        }
        return null;
    }

    public static boolean downloadData(String sourceUrl, String targetFilename) {
        return BulkImageUtil.downloadImage(sourceUrl, targetFilename);
    }
}