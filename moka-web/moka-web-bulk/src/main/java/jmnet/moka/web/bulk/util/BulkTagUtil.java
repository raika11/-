package jmnet.moka.web.bulk.util;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.util
 * ClassName : BulkTagUtil
 * Created : 2021-01-05 005 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-01-05 005 오전 11:50
 */
public class BulkTagUtil {
    public static String ripTag(String str, String start, String end) {
        do {
            final int first = str.toLowerCase().indexOf(start.toLowerCase());
            if (first < 0) {
                return str;
            }

            final int second = str.toLowerCase().indexOf(end.toLowerCase());
            if (second < 0) {
                return str;
            }

            if (second < first) {
                return str;
            }

            str = str.substring(0, first).concat(str.substring(second + end.length()));
        } while (true);
    }

    public static String ripTagWithOrderRule(String str, String start, String end) {
        return ripTagWithOrderRule( str, start, end, 0);
    }

    public static String ripTagWithOrderRule(String str, String start, String end, int len ) {
        do {
            final int first = str.toLowerCase().indexOf(start.toLowerCase());
            if (first < 0) {
                return str;
            }

            final int second = str.toLowerCase().indexOf(end.toLowerCase(), first);
            if (second < 0) {
                return str;
            }

            if (second < first) {
                return str;
            }

            if( len > 0 ) {
                if( (second - first) > len )
                    return str;
            }

            str = str.substring(0, first).concat(str.substring(second + end.length()));
        } while (true);
    }

    public static String restoreSpecialHtmlTag(String src)
    {
        return src.replace("&amp;", "&")
                .replace("&amp", "&")
                .replace("&lt;", "<")
                .replace("&gt;", ">")
                .replace("&nbsp;", " ")
                .replace("&nbsp", " ")
                .replace("&quot;", "\"")
                .replace("&quot", "\"")
                .replace("&#35;", "#")
                .replace("&#44;", "`")
                .replace("&#045;&#045;", "--")
                .replace("&#40;", "(")
                .replace("&#41;", ")")
                .replace("&#92;", "\"")
                .replace("&#59;", ";")
                .replace("&#47;*", "/*")
                .replace("*&#47;", "*/")
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
    }

    public static String standardBulkClearingTag( String str ) {
        str = restoreSpecialHtmlTag(str);
        str = ripTag(str, "<!--@img_tag_s@-->", "<!--@img_tag_e@-->");
        str = ripTag(str, "<table", "/table>");
        str = ripTag(str, "<form", "/form>");

        str = str.replace("(?i)<html(.*|)<body([^>]*)>", "")
                .replace("(?i)</body(.*)</html>(.*)", "")
                .replace("(?i)<(style|script|title|link)(.*)</(style|script|title)>", "")
                .replace("(?i)<[/]*(script|style|title|xmp)>", "")
                .replace("(?i)([a-z0-9]*script:)", "")
                .replace("(?i)<[/]*(A|ABBR|ACRONYM|ADDRESS|APPLET|AREA|B|BASE|BASEFONT|BGSOUND|BDO|BIG|BLINK|BLOCKQUOTE|BODY|BR|BUTTON|CAPTION|CENTER|CITE|CODE|COL|COLGROUP|COMMENT|DD|DEL|DFN|DIR|DIV|DL|DT|EM|EMBED|FIELDSET|FONT|FORM|FRAME|FRAMESET|H1|H2|H3|H4|H5|H6|HEAD|HR|HTA:APPLICATION|HTML|IFRAME|IMG|INPUT|INS|ISINDEX|jsp:declaration|jsp:directive|jsp:expression|jsp:fallback|jsp:forward|jsp:getProperty|jsp:include|jsp:param|jsp:params|jsp:plugin|jsp:root|jsp:scriptlet|jsp:setProperty|jsp:useBean|KBD|LABEL|LEGEND|LI|LINK|LISTING|MAP|MARQUEE|MENU|META|MULTICOL|NEXTID|NOBR|NOFRAMES|NOSCRIPT|OBJECT|OL|OPTGROUP|OPTION|P|PARAM|PLAINTEXT|PRE|Q|SAMP|SCRIPT|SELECT|SERVER|SMALL|SOUND|SPACER|SPAN|STRIKE|STRONG|STYLE|SUB|SUP|TABLE|TBODY|TD|TEXTAREA|TEXTFLOW|TFOOT|TH|THEAD|TITLE|TR|TT|U|UL|VAR|WBR|XMP)[^>]*>","")
                .replace("(?i)<(\\?|%)", "")
                .replace("(?i)(\\?|%)>", "");

        str = ripTag(str, "<!--", "-->");

        return str;
    }

    public static String getMatchesMarkTagList(Pattern pattern, String str, String tag, Map<String, String> map) {
        StringBuffer sb = new StringBuffer( str.length() * 2 );

        int index = 0;
        Matcher matcher = pattern.matcher(str);
        while( matcher.find() ) {
            final String keyText = String.format("[[%s_%03d]]", tag, index++ );
            map.put(keyText, matcher.group());
            matcher.appendReplacement(sb, keyText);
        }
        matcher.appendTail(sb);
        return sb.toString();
    }

    public static String outLinkBulkClearingTagEx(String str) {

        str = restoreSpecialHtmlTag(str);
        str = ripTag(str, "<form", "/form>")
                .replaceAll("(?i)<html(.*|)<body([^>]*)>", "")
                .replaceAll("(?i)</body(.*)</html>(.*)", "")
                .replaceAll("(?i)<(style|script|title|link)(.*)</(style|script|title)>", "")
                .replaceAll("(?i)<[/]*(script|style|title|xmp)>","")
                .replaceAll("(?i)([a-z0-9]*script:)","")
                .replaceAll("(?i)<[/]*(ABBR|ACRONYM|ADDRESS|APPLET|AREA|BASE|BASEFONT|BGSOUND|BDO|BIG|BLINK|BLOCKQUOTE|BODY|BUTTON|CAPTION|CITE|CODE|COL|COLGROUP|COMMENT|DEL|DFN|DIR|FIELDSET|FORM|FRAME|FRAMESET|HEAD|HTA:APPLICATION|HTML|INPUT|INS|ISINDEX|jsp:declaration|jsp:directive|jsp:expression|jsp:fallback|jsp:forward|jsp:getProperty|jsp:include|jsp:param|jsp:params|jsp:plugin|jsp:root|jsp:scriptlet|jsp:setProperty|jsp:useBean|KBD|LEGEND|LINK|LISTING|MENU|META|MULTICOL|NEXTID|NOBR|NOFRAMES|NOSCRIPT|OPTGROUP|OPTION|PLAINTEXT|PRE|SAMP|SCRIPT|SELECT|SERVER|SMALL|SOUND|SPACER|SPAN|STRIKE|STYLE|SUB|SUP|TEXTAREA|TEXTFLOW|TFOOT|THEAD|TITLE|TT|VAR|WBR|XMP)[^>]*>","")
                .replaceAll("<([?%])","")
                .replaceAll("([?%])>","");

        str = ripTag(str, "<!--", "-->")
                .replaceAll("<a(\\s+)([^/a]+[^<]+)>", "<a$1$2 target=\"_joins_nw\">");

        return str;
    }

    public static String regexReplaceGroup(String content, Pattern pattern, String groupName, String replace) {
        return regexReplaceGroup( content, pattern, Collections.singletonList(groupName), Collections.singletonList(replace));
    }

    public static String regexReplaceGroup(String content, Pattern pattern, List<String> groupName, List<String> replace) {
        Matcher matcher = pattern.matcher(content);
        StringBuffer sb = new StringBuffer( content.length() * 2 );
        int arrayCount = Math.min( groupName.size(), replace.size());
        while( matcher.find() ) {
            String replaced = matcher.group(0);
            for( int i=0 ; i<arrayCount ; i++ )
                replaced = replaced.replaceFirst(matcher.group(groupName.get(i)), replace.get(i));
            matcher.appendReplacement(sb, replaced);
        }
        matcher.appendTail(sb);
        return sb.toString();
    }
}
