package jmnet.moka.web.schedule.support.common;

import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 * 공용기능 > String 가공
 * Project : moka
 * Package : jmnet.moka.web.schedule.support.common
 * ClassName : ReplaceSymbol
 * </pre>
 *
 * @author 김정민
 * @since 2021-03-29
 */
@Slf4j
public class ReplaceSymbol {

    public String fnRemoveContentSpecialChar(String origin) {
        //fnRemoveContentSpecialChar
        origin = origin.replace("&lt;", "<");
        origin = origin.replace("&gt;", ">");
        origin = origin.replace("&#91;", "[");
        origin = origin.replace("&#93;", "]");
        origin = origin.replace("&amp;", "");
        origin = origin.replace("#39;", "'");
        origin = origin.replace("#39", "'");

        return origin;
    }

    public String fnDelete_tag(String origin) {
        //fnDelete_tag
        origin = origin.replaceAll("<(style|script|title|link|a)(.*)</(style|script|title|a)>", "");
        origin = origin.replaceAll("<html(.*|)<body([^>]*)>", "");
        origin = origin.replaceAll("</body(.*)</html>(.*)", "");
        origin = origin.replaceAll(
                "<[/]*(div|layer|tbody|html|head|meta|form|input|object|select|textarea|base|table|tr|td|!|b|br|font|img|map|area|hr|p|span|embed)[^>]*>",
                "");
        origin = origin.replaceAll("<[/]*(script|style|title|xmp|div)>", "");
        origin = origin.replaceAll("([a-z0-9]*script:)", "deny_$1");
        origin = origin.replaceAll("<(\\?|%)", "<$1");
        origin = origin.replaceAll("(\\?|%)>", "$1>");

        return origin;
    }
}
