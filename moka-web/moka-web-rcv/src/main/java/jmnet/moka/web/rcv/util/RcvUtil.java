package jmnet.moka.web.rcv.util;

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
/*
    public static String getSummaryText(String body) {
        body = ripTag( body, "<script", "/script>");
        body = body.replaceAll("\r\n", "")
                   .replaceAll("<[^>]+>", "")
                   .replace("&lt;", "<")
                   .replace("&gt;", ">")
                   .replace("&nbsp;", " ")
                   .replace("&nbsp", " ")
                   .replace("&amp;", "&")
                   .replace("&amp", "&")
                   .replace("&quot;", "\"")
                   .replace("&quot", "\"")
                   .replace("&#091;", "[")
                   .replace("&#91;", "[")
                   .replace("&#091", "[")
                   .replace("&#91;", "[")
                   .replace("&#093;", "]")
                   .replace("&#93;", "]")
                   .replace("&#093", "]")
                   .replace("&#93", "]")
                   .replace("&#039;", "'")
                   .replace("&#39;", "'")
                   .replace("&#039", "'")
                   .replace("&#39", "'")
                   .replace("<br>", "\r\n")
                   .replace("<br/>", "\r\n");
        body = ripTag( body, "<table", "/table>");
        body = ripTag( body, "<form", "/form>");

        body = body.replaceAll("(?i)<html(.*|)<body([^>]*)>", "")
                   .replaceAll("(?i)</body(.*)</html>(.*)", "");

        body = ripTag( body, "<style", "/style>");
        body = ripTag( body, "<script", "/script>");
        body = ripTag( body, "<title", "/title>");
        body = ripTag( body, "<link", "/link>");
        body = ripTag( body, "<xmp", "/xmp>");

        body = body.replaceAll("(?i)([a-z0-9]*script:)", "")
                   .replaceAll("(?i)<[/]*(A|ABBR|ACRONYM|ADDRESS|APPLET|AREA|B|BASE|BASEFONT|BGSOUND|BDO|BIG|BLINK|BLOCKQUOTE|BODY|BR|BUTTON|CAPTION|CENTER|CITE|CODE|COL|COLGROUP|COMMENT|DD|DEL|DFN|DIR|DIV|DL|DT|EM|EMBED|FIELDSET|FONT|FORM|FRAME|FRAMESET|H1|H2|H3|H4|H5|H6|HEAD|HR|HTA:APPLICATION|HTML|IFRAME|IMG|INPUT|INS|ISINDEX|jsp:declaration|jsp:directive|jsp:expression|jsp:fallback|jsp:forward|jsp:getProperty|jsp:include|jsp:param|jsp:params|jsp:plugin|jsp:root|jsp:scriptlet|jsp:setProperty|jsp:useBean|KBD|LABEL|LEGEND|LI|LINK|LISTING|MAP|MARQUEE|MENU|META|MULTICOL|NEXTID|NOBR|NOFRAMES|NOSCRIPT|OBJECT|OL|OPTGROUP|OPTION|P|PARAM|PLAINTEXT|PRE|Q|SAMP|SCRIPT|SELECT|SERVER|SMALL|SOUND|SPACER|SPAN|STRIKE|STRONG|STYLE|SUB|SUP|TABLE|TBODY|TD|TEXTAREA|TEXTFLOW|TFOOT|TH|THEAD|TITLE|TR|TT|U|UL|VAR|WBR|XMP)[^>]*>", "")
                   .replaceAll("<(\\?|%)", "")
                   .replaceAll("(\\?|%)>", "")
                   .replaceAll("(?i)<[/]*(div|dl|dt|dd|ul|li|script|layer|body|html|head|meta|form|input|select|textarea|center|hr|base|table|tr|td|img|font|b|strong|span|p|a|br|tbody|!--|-|=|startclickprintexclude|IMAGE|h2|h3|h4|map|area|sup|style|object)[^>]*>", "")
                   .replace("<br>", "");

        if(body.length() > 300)
            return body.substring(0, 300);
        return body;
    }
*/
//    private static String ripTag( String str, String start, String end) {
//        do {
//            final int first = str.toLowerCase().indexOf(start.toLowerCase());
//            if( first < 0 )
//                return str;
//
//            final int second = str.toLowerCase().indexOf(end.toLowerCase());
//            if( second < 0 )
//                return str;
//
//            str = str.substring(0, first).concat(str.substring( second + end.length() ) );
//        }while( true );
//    }
}