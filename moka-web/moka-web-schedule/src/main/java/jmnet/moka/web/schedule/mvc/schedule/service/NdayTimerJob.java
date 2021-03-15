package jmnet.moka.web.schedule.mvc.schedule.service;

import jmnet.moka.web.schedule.support.schedule.AbstractScheduleJob;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * <pre>
 * 현재시각 데이터를 생성하여 js 파일로 FTP 업로드
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.schedule.service
 * ClassName : NdayTimerJob
 * </pre>
 *
 * @author 김정민
 * @since 2021-03-15
 */
@Slf4j
@Component
public class NdayTimerJob extends AbstractScheduleJob {

    @Override
    public void invoke() {
        Date date = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);

        SimpleDateFormat format1 = new SimpleDateFormat("yyyy-MM-dd");
        SimpleDateFormat format2 = new SimpleDateFormat("a");
        SimpleDateFormat format3 = new SimpleDateFormat("yyyy");
        SimpleDateFormat format4 = new SimpleDateFormat("MM");
        SimpleDateFormat format5 = new SimpleDateFormat("dd");
        SimpleDateFormat format6 = new SimpleDateFormat("HH");
        SimpleDateFormat format7 = new SimpleDateFormat("mm");
        SimpleDateFormat format8 = new SimpleDateFormat("ss");
        SimpleDateFormat format9 = new SimpleDateFormat("hh");
        SimpleDateFormat format10 = new SimpleDateFormat("E");
        SimpleDateFormat format11 = new SimpleDateFormat("HH:mm");
        SimpleDateFormat format12 = new SimpleDateFormat("yyyyMMddHHmm");
        SimpleDateFormat format13 = new SimpleDateFormat("yyyyMMddHHmmss");

        String now = format1.format(date);
        String strNampmK = format2.format(date);
        String strNyear = format3.format(date);
        int strNMonth = Integer.parseInt(format4.format(date));
        String strNDay = format5.format(date);
        String strNHour24 = format6.format(date);
        String strNMinute = format7.format(date);
        String strNSecond = format8.format(date);
        String strNHour12 = format9.format(date);
        String strNweekdayK = format10.format(date);
        String hsTime = format11.format(date);
        String ymdhm = format12.format(date);
        String ymdhms = format13.format(date);

        int strNWeekday = calendar.get(Calendar.DAY_OF_WEEK);
        String strNampm = calendar.get(Calendar.AM_PM) == Calendar.AM ? "AM" : "PM";

        StringBuffer stringBuffer = new StringBuffer();
        stringBuffer.append("/*@ 현재 서버 날짜 & 시간 GEN @*/");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("var  __Ndaytime= {");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("    \"ba\":{\"year\":\""+strNyear+"\",\"month\":\""+strNMonth+"\",\"day\": \""+strNDay+"\",\"hour24\": \""+strNHour24+"\",\"minute\": \""+strNMinute+"\",\"second\": \""+strNSecond+"\",\"weekday\": \""+(strNWeekday-1)+"\"}");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("    ,\"ex\":{\"month_js\":\""+(strNMonth-1)+"\",\"hour12\": \""+strNHour12+"\",\"ampm\": \""+strNampm+"\",\"ampmK\": \""+strNampmK+"\",\"weekdayK\": \""+strNweekdayK+"\"}");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("    ,\"pr\":{\"ymday\": \""+now+"\",\"hsTime\": \""+hsTime+"\"}");
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("    ,\"ymdhm\":"+ymdhm);
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append("    ,\"ymdhms\":"+ymdhms);
        stringBuffer.append(System.lineSeparator());
        stringBuffer.append(" };");
        log.debug("string : {}", stringBuffer);

        boolean success = stringFileUpload(stringBuffer.toString());
        log.debug("file upload : {}", success);

        //AbstractSchduleJob.finish() 에서 필요한 schedule 실행 결과 값 입력
        //임시로 성공/실패만 입력 + 그외 입력값은 입력정의 필요
        setFinish(success);

    }
}
