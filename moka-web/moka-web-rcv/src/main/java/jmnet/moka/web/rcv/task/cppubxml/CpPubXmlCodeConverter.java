package jmnet.moka.web.rcv.task.cppubxml;

import java.util.HashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.cppubxml
 * ClassName : CpPubXmlCodeConverter
 * Created : 2020-11-17 017 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-17 017 오후 1:33
 */
@Slf4j
public class CpPubXmlCodeConverter {
    public static String convText(String text) {
        text = text
                //.replaceAll("<GroupInfo groupID=(.+)\\\">", "")
                //.replaceAll("</GroupInfo>", "")
                .replaceAll("<(/)?GroupInfo.*(/)?>", "")
                .replace("<ByLineDept>피플&섹션데스크</ByLineDept>", "<ByLineDept><![CDATA[피플&섹션데스크]]></ByLineDept>")
                .replace("<F005>", "·")
                .replace("<EC2E>", "『")
                .replace("<EC2F>", "』")
                .replace("<EC37>", "‘")
                .replace("<EC38>", "’")
                .replace("<EC05>", "·")
                .replace("<EC36>", "…")
                .replace("<EA1B>", "◆")
                .replace("<EC39>", "＂")
                .replace("<EC3B>", "”")
                .replace("<2002>", "")
                .replace("<2003>", "")
                .replace("<2004>", "")
                .replace("<2005>", "")
                .replace("<E0E1>", "■")
                .replace("<EDF0>", "△")
                .replace("<F765><F711><F715>", "X")
                .replace("<EA06><E2BA>", ":")
                .replace("<E0BF>", "X")
                .replace("<2219>", "·")
                .replace("<EDC9>", "右")
                .replace("<EDC8>", "左")
                .replace("<E6B0>", "㎞")
                .replace("<EE86>", "…")
                .replace("<E6B8>", "kg")
                .replace("<E6A2>", "ml")
                .replace("<EDC6>", "中")
                .replace("<EEE2>", "↓")
                .replace("<EEE4>", "↑")
                .replace("<EC86>", "…")
                .replace("<EC11>", "→")
                .replace("<EC53>", "˚")
                .replace("<EDC7>", "下")
                .replace("<E6A6>", "cc")
                .replace("<E2BA>", ":")
                .replace("<E1DF>", "(주)")
                .replace("<E0D8>", "※")
                .replace("<E0DB>", "○")
                .replace("<E0DC>", "●")
                .replace("<EDC5>", "上")
                .replace("<EDC7>", "下")
                .replace("<EEA3>", "m")
                .replace("<E6AF>", "cm")
                .replace("<E6AE>", "mm")
                .replace("<E0E6>", "→")
                .replace("<EDF3>", "▲")
                .replace("<E4E1>", "α")
                .replace("<EDC8>", "(좌)")
                .replace("<EDC9>", "(우)")
                .replace("<E2DE>", "▶")
                .replace("<EE05>", "·")
                .replace("<EA33>", "~")
                .replace("<5733>", "?")
                .replace("<EA11>", "→")
                .replace("<5DF5>", "?")
                .replace("", "\r\n")
                .replace("●1", "①")
                .replace("●2", "②")
                .replace("●3", "③")
                .replace("●4", "④")
                .replace("●5", "⑤")
                .replace("●6", "⑥")
                .replace("●7", "⑦")
                .replace("●8", "⑧")
                .replace("●9", "⑨")
                .replace("＾", "▶")
                .replace("", "→");

        Pattern pattern = Pattern.compile("(<[0-9A-Fa-f]{4}>)");
        Set<String> list = new HashSet<>();
        Matcher m = pattern.matcher(text);
        while (m.find()) {
            list.add(m.group());
        }

        for (String s : list) {
            try{
                final String replace = String.format("&#%d", Integer.parseInt(s.substring(1, 5), 16));
                log.debug("change hexa Code  {} ->  {}", s, replace);
                text = text.replace(s, replace);
            }catch (Exception e){
                log.debug("convText Exception error ->  {}", e.getMessage());
            }
        }
        return text;
    }
}
