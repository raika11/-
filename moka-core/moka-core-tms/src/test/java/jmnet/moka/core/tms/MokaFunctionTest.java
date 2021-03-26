package jmnet.moka.core.tms;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tms.merge.MokaFunctions;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tms
 * ClassName : MokaFunctionTest
 * Created : 2021-03-25 kspark
 * </pre>
 *
 * @author kspark
 * @since 2021-03-25 오후 7:54
 */
public class MokaFunctionTest {

    public static void main(String[] args) {
        MokaFunctions mf = new MokaFunctions();
        Random rand = new Random();
        int randSec = rand.nextInt(60); // 0 ~ 59
        int randMin = rand.nextInt(60); // 0 ~ 59
        int randHour = rand.nextInt(24); // 0 ~ 23
        String now = LocalDateTime
                .now().format(MokaConstants.dtf);
        String sec = LocalDateTime.now().minusSeconds(randSec).format(MokaConstants.dtf);
        String min = LocalDateTime.now().minusMinutes(randMin).format(MokaConstants.dtf);
        String hour = LocalDateTime.now().minusHours(randHour).format(MokaConstants.dtf);
        String yesterday = LocalDateTime.now().minusDays(1).minusHours(1).format(MokaConstants.dtf);
        String lastYear = LocalDateTime.now().minusYears(1).format(MokaConstants.dtf);
        String dateTimes = "sec="+sec+","
                + "min="+min+","
                + "hour="+hour+","
                + "day="+yesterday+","
                + "s="+yesterday+",e="+now+","
                + "s1="+lastYear+",e2="+now;
        Map<String, String> map = Arrays
                .stream( dateTimes.split(",") )
                .map(s -> s.split("="))
                .collect(Collectors.toMap(s -> s[0].trim(), s -> s[1].trim()));
        System.out.println("NOW: "+now);
        System.out.println("NOW: "+ mf.lunar(now));
        System.out.println("NOW: "+ mf.dateTime(now,"weekday"));
        System.out.println("SEC: "+map.get("sec")+" --> "+mf.timeAgo(map.get("sec")));
        System.out.println("MIN: "+map.get("min")+" --> "+mf.timeAgo(map.get("min")));
        System.out.println("HOUR: "+map.get("hour")+" --> "+mf.timeAgo(map.get("hour")));
        System.out.println("DAY: "+map.get("day")+" --> "+mf.timeAgo(map.get("day")));
        System.out.println(map.get("s")+" ~ " + map.get("e")+ " --> " +mf.dateBetween(map.get("s"),map.get("e")));
        System.out.println(map.get("s1")+" ~ " + map.get("e2")+ " --> " +mf.dateBetween(map.get("s1"),map.get("e2")));
    }

}
