package jmnet.moka.common.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

public class McpDate {

    public static final String DATE_FORMAT = "yyyyMMdd";
    public static final String TIME_FORMAT = "HHmmss";
    public static final String DATETIME_FORMAT = DATE_FORMAT + TIME_FORMAT;

    /**
     * 
     * <pre>
     * 날짜를 SimpleDateFomat의 patten을 적용시켜 문자열로 만들어 반환한다.
     * </pre>
     * 
     * @param date 날짜
     * @param pattern 형식
     * @return 바뀐 형식
     */
    public static String dateStr(java.util.Date date, String pattern) {
        SimpleDateFormat sdf = new SimpleDateFormat(pattern);
        if (date != null) {
            return sdf.format(date);
        } else {
            return "";
        }
    }

    /**
     * 
     * <pre>
     * 날짜를 SimpleDateFomat의 patten을 적용시켜 문자열로 만들어 반환한다.
     * </pre>
     * 
     * @param date 날짜
     * @param pattern 형식
     * @return 바뀐 날짜
     */
    public static String dateStr(java.sql.Date date, String pattern) {
        return dateStr(covertSqlDataToUtilDate(date), pattern);
    }

    /**
     * 
     * <pre>
     * 문자열에 기본 날짜포맷팅을 적용시켜서 날자형으로 변환한다.
     * </pre>
     * 
     * @param value 값
     * @return 날짜
     * @throws ParseException 파싱 예외
     */
    public static Date date(String value) throws ParseException {
        if (value == null) {
            return null;
        }
        SimpleDateFormat sdf = new SimpleDateFormat(DATETIME_FORMAT);
        return sdf.parse(value);
    }

    /**
     * 
     * <pre>
     * 문자열에 날짜포맷팅을 적용시켜서 날자형으로 변환한다.
     * </pre>
     * 
     * @param format 날짜포맷
     * @param value 값
     * @return 날짜
     * @throws ParseException 파싱 예외
     */
    public static Date date(String format, String value) throws ParseException {
        if (value == null) {
            return null;
        }
        SimpleDateFormat sdf = new SimpleDateFormat(format);
        return sdf.parse(value);
    }




    /**
     * 오늘의 날짜를 java.util.Date 를 준다.
     * 
     * @return 시, 분, 초, 1/100초가 0으로 초기화된 날짜.
     */
    public static java.util.Date todayDate() {
        Calendar cal = Calendar.getInstance();
        // cal.set(Calendar.HOUR, 0);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);

        /*
         * net.sf.json.JSONObject 에서 내부적으로 사용하는 BeanPropertyUtil에서 Date형에 대해 getHours()
         * 메소드를 호출하는데, java.sql.Date를 사용하면 해당 메소드(getHours())가 존재하지 않아 오류가 발생하게 된다.
         */
        // java.sql.Date today = new java.sql.Date(cal.getTime().getTime());
        java.util.Date today = new java.util.Date(cal.getTime().getTime());

        return today;
    }

    /**
     * 
     * <pre>
     * 오늘 날짜에 인자값만큼 더한 후 java.util.Date형을 반환한다. 반환시 시간, 분, 초, MILLISECOND는 0으로 초기화 된값이다.
     * </pre>
     * 
     * @param plus
     * @return Date
     */
    public static java.util.Date todayDatePlus(int plus) {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DATE, plus);

        cal.set(Calendar.HOUR, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);

        java.util.Date todayplus = new java.util.Date(cal.getTime().getTime());
        return todayplus;
    }

    /**
     * 
     * <pre>
     * 특정날짜에 plus만큼 연산을 한다.
     * </pre>
     * 
     * @param date
     * @param plus
     * @return Date
     */
    public static java.util.Date dateMinus(java.util.Date date, int plus) {
        return dateMinus(date, plus, false);
    }

    /**
     * 
     * <pre>
     * 특정날짜에 plus만큼 연산을 한다.
     * </pre>
     * 
     * @param date
     * @param plus
     * @return Date
     */
    public static java.util.Date datePlus(java.util.Date date, int plus) {
        return datePlus(date, plus, false);
    }

    /**
     * 
     * <pre>
     * 특정날짜에 plus만큼 연산을 한다.
     * </pre>
     * 
     * @param date
     * @param plus
     * @return Date
     */
    public static java.util.Date dateMinus(java.util.Date date, int plus, boolean onlyDate) {
        Calendar cal = Calendar.getInstance();
        cal.clear();
        cal.setTime(date);
        cal.add(Calendar.DATE, plus * (-1));

        if (onlyDate) {
            cal.set(Calendar.HOUR, 0);
            cal.set(Calendar.MINUTE, 0);
            cal.set(Calendar.SECOND, 0);
            cal.set(Calendar.MILLISECOND, 0);
        }

        java.util.Date todayplus = new java.util.Date(cal.getTime().getTime());
        return todayplus;
    }

    /**
     * 
     * <pre>
     * 특정날짜에 plus만큼 연산을 한다.
     * </pre>
     * 
     * @param date
     * @param plus
     * @return Date
     */
    public static java.util.Date datePlus(java.util.Date date, int plus, boolean onlyDate) {
        Calendar cal = Calendar.getInstance();
        cal.clear();
        cal.setTime(date);
        cal.add(Calendar.DATE, plus);

        if (onlyDate) {
            cal.set(Calendar.HOUR, 0);
            cal.set(Calendar.MINUTE, 0);
            cal.set(Calendar.SECOND, 0);
            cal.set(Calendar.MILLISECOND, 0);
        }

        java.util.Date todayplus = new java.util.Date(cal.getTime().getTime());
        return todayplus;
    }

    /**
     * 
     * <pre>
     * 특정날짜에 분을 plus만큼 감소시킨다.
     * </pre>
     * 
     * @param date
     * @param plus
     * @return Date
     */
    public static java.util.Date minuteMinus(java.util.Date date, int plus) {
        Calendar cal = Calendar.getInstance();
        cal.clear();
        cal.setTime(date);

        cal.add(Calendar.MINUTE, plus * (-1));
        java.util.Date todayplus = new java.util.Date(cal.getTime().getTime());
        return todayplus;
    }

    /**
     * 
     * <pre>
     * 특정날짜에 분을 plus만큼 증가시킨다.
     * </pre>
     * 
     * @param date
     * @param plus
     * @return Date
     */
    public static java.util.Date minutePlus(java.util.Date date, int type, int plus) {
        Calendar cal = Calendar.getInstance();
        cal.clear();
        cal.setTime(date);

        cal.add(Calendar.MINUTE, plus);

        java.util.Date todayplus = new java.util.Date(cal.getTime().getTime());
        return todayplus;
    }

    /**
     * 
     * <pre>
     * 특정날짜에 시간을 plus만큼 감소시킨다.
     * </pre>
     * 
     * @param date
     * @param plus
     * @return Date
     */
    public static java.util.Date hourMinus(java.util.Date date, int plus) {
        Calendar cal = Calendar.getInstance();
        cal.clear();
        cal.setTime(date);

        cal.add(Calendar.HOUR, plus * (-1));

        java.util.Date todayplus = new java.util.Date(cal.getTime().getTime());
        return todayplus;
    }

    /**
     * 
     * <pre>
     * 특정날짜에 시간을 plus만큼 증가시킨다.
     * </pre>
     * 
     * @param date
     * @param plus
     * @return Date
     */
    public static java.util.Date hourPlus(java.util.Date date, int type, int plus) {
        Calendar cal = Calendar.getInstance();
        cal.clear();
        cal.setTime(date);

        cal.add(Calendar.HOUR, plus);

        java.util.Date todayplus = new java.util.Date(cal.getTime().getTime());
        return todayplus;
    }

    /**
     * 
     * <pre>
     * 어제 날짜
     * </pre>
     * 
     * @return Date
     */
    public static java.util.Date yesterday() {

        return dateMinus(todayDate(), 1, true);
    }

    /**
     * 
     * <pre>
     * 어제 날짜를 문자열로 리턴
     * </pre>
     * 
     * @return Date
     */
    public static String yesterdayStr() {

        return dateStr(dateMinus(todayDate(), 1, true), DATE_FORMAT);
    }

    /**
     * 현재 날짜+시간 리턴
     * 
     * @return 현재 날짜+시간
     */
    public static Date now() {
        return new Date();
    }

    /**
     * 현재 날짜+시간 리턴
     * 
     * @return 현재 날짜+시간
     */
    public static String nowStr() {
        return dateStr(new Date(), DATETIME_FORMAT);
    }

    /**
     * 
     * <pre>
     * 현재 날짜 변환
     * </pre>
     * 
     * @return 현재날짜 String
     */
    public static String nowDateStr() {
        Calendar c = Calendar.getInstance();
        return c.get(Calendar.YEAR) + String.format("%02d", (c.get(Calendar.MONTH) + 1))
                + String.format("%02d", c.get(Calendar.DATE));
    }

    /**
     * 
     * <pre>
     * 현재 시간 반환
     * </pre>
     * 
     * @return 현재시간 String
     */
    public static String nowTimeStr() {
        Calendar c = Calendar.getInstance();
        return String.format("%02d", (c.get(Calendar.HOUR_OF_DAY)))
                + String.format("%02d", (c.get(Calendar.MINUTE)))
                + String.format("%02d", (c.get(Calendar.SECOND)));
    }

    /**
     * 
     * <pre>
     * 날짜 시간을 문자열로 변환
     * </pre>
     * 
     * @return 현재날짜 String
     */
    public static String dateTimeStr(Date date) {
        return dateStr(date, DATETIME_FORMAT);
    }

    /**
     * 
     * <pre>
     * 현재 날짜 변환
     * </pre>
     * 
     * @return 현재날짜 String
     */
    public static String dateStr(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.clear();
        cal.setTime(date);
        return cal.get(Calendar.YEAR) + String.format("%02d", (cal.get(Calendar.MONTH) + 1))
                + String.format("%02d", cal.get(Calendar.DATE));
    }

    /**
     * 
     * <pre>
     * 현재 시간 반환
     * </pre>
     * 
     * @return 현재시간 String
     */
    public static String timeStr(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.clear();
        cal.setTime(date);
        return String.format("%02d", (cal.get(Calendar.HOUR_OF_DAY)))
                + String.format("%02d", (cal.get(Calendar.MINUTE)))
                + String.format("%02d", (cal.get(Calendar.SECOND)));
    }



    /**
     * 
     * <pre>
     * YYYY 형태의 년도 문자열 반환
     * </pre>
     * 
     * @return 년도 String
     */
    public static String yearStr() {
        return String.valueOf(Calendar.getInstance().get(Calendar.YEAR));
    }

    /**
     * 
     * <pre>
     * MM 형태의 월 문자열 반환
     * </pre>
     * 
     * @return 월 String
     */
    public static String monthStr() {
        return String.format("%02d", (Calendar.getInstance().get(Calendar.MONTH) + 1));
    }

    /**
     * 
     * <pre>
     * DD 형태의 일 문자열 변환
     * </pre>
     * 
     * @return 일 String
     */
    public static String dayStr() {
        return String.format("%02d", (Calendar.getInstance().get(Calendar.DATE)));
    }

    /**
     * 
     * <pre>
     * 시간을 문자열로
     * </pre>
     * 
     * @return 시간 String
     */
    public static String hourStr() {
        Calendar cal = Calendar.getInstance();
        cal.clear();
        return String.format("%02d", (cal.get(Calendar.HOUR_OF_DAY)));
    }

    /**
     * 
     * <pre>
     * 시간을 숫자로
     * </pre>
     * 
     * @return 일
     */
    public static int hour() {
        Calendar cal = Calendar.getInstance();
        return cal.get(Calendar.HOUR_OF_DAY);
    }

    /**
     * 
     * <pre>
     * java.sql.Date를 java.util.Date로 변환
     * </pre>
     * 
     * @param date java.sql.Date
     * @return java.util.Date
     */
    public static java.util.Date covertSqlDataToUtilDate(java.sql.Date date) {
        return new java.util.Date(date.getTime());
    }

    public static LocalDate toLocalDate(String date) {
        return LocalDate.parse(date, DateTimeFormatter.BASIC_ISO_DATE);
    }

    /**
     *
     * <pre>
     * 일자기준 between 시작일시, 종료일시를 리턴한다.
     * </pre>
     *
     * @param format 날짜포맷
     * @param day 값
     * @return 시작일시,종료일시 배열
     * @throws ParseException 파싱 예외
     */
    public static List<Date> betweenDate(String format, String day) throws ParseException {
        if (day == null) {
            return null;
        }
        List<Date> dateList = new ArrayList<Date>();
        SimpleDateFormat sdf = new SimpleDateFormat(format);
        dateList.add(sdf.parse(day + " 00:00:00"));
        dateList.add(sdf.parse(day + " 23:59:59"));
        return dateList;
    }

    /**
     * <pre>
     * date 값이 null이면 현재Date를 리턴한다.
     * </pre>
     *
     * @param date date
     * @return
     */
    public static Date defaultValue(Date date) {
        if(date == null) {
            return now();
        }
        return date;
    }
}
