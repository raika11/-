package jmnet.moka.web.bulk.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;
import jmnet.moka.common.utils.McpString;
import org.apache.commons.io.FilenameUtils;

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

    public static String remvConvSpecialChar( String content ){
        if( content == null )
            return null;

        String [] removeChar = { "\u200B", "\u00A0" };
        for( String r : removeChar ) {
            if (content.contains(r))
                content = content.replace(r, "");
        }
        return content.replace("•", "·");
    }

    private static final SimpleDateFormat transFormat = new SimpleDateFormat("yyyyMMddHHmmss");

    public static Date getDateFromJamDateString( String input ) {
        //noinspection ConstantConditions
        do {
            if(McpString.isNullOrEmpty(input))
                break;
            if( input.length() < 14 )
                break;
            try {
                return transFormat.parse(input);
            } catch (ParseException ignore) {

            }
        }while( false );

        return null;
    }

    public static String getJamMiddleUrlPath( String path ) {
        // https://pds.joins.com/news/component/htmlphoto_mmdata/202009/08/051b7abe-fe3d-43aa-823a-aec5fed86864.jpg.tn_250.jpg
        // url      -> /news/component/htmlphoto_mmdata/202009/08/
        final String tmpUrl = FilenameUtils
                .getPath(path)
                .replaceFirst("http://", "")
                .replaceFirst("https://", "");      //  pds.joins.com/news/component/htmlphoto_mmdata/202009/08/
        return tmpUrl.substring(tmpUrl.indexOf('/'));
    }

//    public static String getJamUrlPath( String path ) {
//        // https://pds.joins.com/news/component/htmlphoto_mmdata/202009/08/051b7abe-fe3d-43aa-823a-aec5fed86864.jpg.tn_250.jpg
//        // url      -> /news/component/htmlphoto_mmdata/202009/08/051b7abe-fe3d-43aa-823a-aec5fed86864.jpg.tn_250.jpg
//        final String tmpUrl = path
//                .replaceFirst("http://", "")
//                .replaceFirst("https://", "");
//        return tmpUrl.substring(tmpUrl.indexOf('/'));
//    }

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

    public static String sendUrlGetRequest(String urlAddress) {
        return sendUrlRequest( urlAddress, "", true);
    }

    public static String SendUrlPostRequest( String urlAddress, String json ) {
        return sendUrlRequest( urlAddress, json, false);
    }

    public static boolean downloadData(String sourceUrl, String targetFilename) {
        return BulkImageUtil.downloadImage(sourceUrl, targetFilename);
    }
}