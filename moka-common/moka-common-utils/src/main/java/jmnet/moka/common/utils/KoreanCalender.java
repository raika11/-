package jmnet.moka.common.utils;

/**
 * <pre>
 *  출처: https://link2me.tistory.com/1696?category=1071351 [소소한 일상 및 업무TIP 다루기]
 * Project : moka-springboot-parent
 * Package : jmnet.moka.common.utils
 * ClassName : Lunar2Solar
 * Created : 2021-03-25 kspark
 * </pre>
 *
 * @author kspark
 * @since 2021-03-25 오후 6:38
 */
public class KoreanCalender {
    // 음력 데이터 (평달 - 작은달 :1,  큰달:2 )
    // (윤달이 있는 달 - 평달이 작고 윤달도 작으면 :3 , 평달이 작고 윤달이 크면 : 4)
    // (윤달이 있는 달 - 평달이 크고 윤달이 작으면 :5,  평달과 윤달이 모두 크면 : 6)
    private final static String[] LUNAR_INFO = new String[]
            {"1212122322121","1212121221220","1121121222120","2112132122122","2112112121220",
             "2121211212120","2212321121212","2122121121210","2122121212120","1232122121212",
             "1212121221220","1121123221222","1121121212220","1212112121220","2121231212121",
             "2221211212120","1221212121210","2123221212121","2121212212120","1211212232212",
             "1211212122210","2121121212220","1212132112212","2212112112210","2212211212120",
             "1221412121212","1212122121210","2112212122120","1231212122212","1211212122210",
             "2121123122122","2121121122120","2212112112120","2212231212112","2122121212120",
             "1212122121210","2132122122121","2112121222120","1211212322122","1211211221220",
             "2121121121220","2122132112122","1221212121120","2121221212110","2122321221212",
             "1121212212210","2112121221220","1231211221222","1211211212220","1221123121221",
             "2221121121210","2221212112120","1221241212112","1212212212120","1121212212210",
             "2114121212221","2112112122210","2211211412212","2211211212120","2212121121210",
             "2212214112121","2122122121120","1212122122120","1121412122122","1121121222120",
             "2112112122120","2231211212122","2121211212120","2212121321212","2122121121210",
             "2122121212120","1212142121212","1211221221220","1121121221220","2114112121222",
             "1212112121220","2121211232122","1221211212120","1221212121210","2121223212121",
             "2121212212120","1211212212210","2121321212221","2121121212220","1212112112210",
             "2223211211221","2212211212120","1221212321212","1212122121210","2112212122120",
             "1211232122212","1211212122210","2121121122210","2212312112212","2212112112120",
             "2212121232112","2122121212110","2212122121210","2112124122121","2112121221220",
             "1211211221220","2121321122122","2121121121220","2122112112322","1221212112120",
             "1221221212110","2122123221212","1121212212210","2112121221220","1211231212222",
             "1211211212220","1221121121220","1223212112121","2221212112120","1221221232112",
             "1212212122120","1121212212210","2112132212221","2112112122210","2211211212210",
             "2221321121212","2212121121210","2212212112120","1232212122112","1212122122110",
             "2121212322122","1121121222120","2112112122120","2211231212122","2121211212120",
             "2122121121210","2124212112121","2122121212120","1212121223212","1211212221220",
             "1121121221220","2112132121222","1212112121220","2121211212120","2122321121212",
             "1221212121210","2121221212120","1232121221212","1211212212210","2121123212221",
             "2121121212220","1212112112220","1221231211221","2212211211220","1212212121210",
             "2123212212121","2112122122120","1211212322212","1211212122210","2121121122120",
             "2212114112122","2212112112120","2212121211210","2212232121211","2122122121210",
             "2112122122120","1231212122212","1211211221220","2121121321222","2121121121220",
             "2122112112120","2122141211212","1221221212110","2121221221210","2114121221221"};

    private static final int[] arrayLDAY = new int[]{31,0,31,30,31,30,31,31,30,31,30,31};
//    private final static String arrayYUKSTR="甲-乙-丙-丁-戊-己-庚-辛-壬-癸";
    private static final String[] arrayYUK = "甲-乙-丙-丁-戊-己-庚-辛-壬-癸".split("-");

//    private final static String arrayGAPSTR="子-丑-寅-卯-辰-巳-午-未-申-酉-戌-亥";
    private static final String[] arrayGAP = "子-丑-寅-卯-辰-巳-午-未-申-酉-戌-亥".split("-");

//    private static final String arrayDDISTR="쥐-소-범-토끼-용-뱀-말-양-원숭이-닭-개-돼지";
    private static final String[] arrayDDI = "쥐-소-범-토끼-용-뱀-말-양-원숭이-닭-개-돼지".split("-");

//    private static final String arrayWEEKSTR="일-월-화-수-목-금-토";
    private static final String[] arrayWEEK = "일-월-화-수-목-금-토".split("-");
    
    public static String lun2sol(String yyyymmdd) {
        int YunMonthFlag = 0;
        int gf_lun2sol = 0;
        int gf_yun = 0;
        int leap = 0;
        int syear = 0;
        int smonth = 0;
        int sday = 0;

        int getYEAR = Integer.parseInt(yyyymmdd.substring(0,4));
        int getMONTH = Integer.parseInt(yyyymmdd.substring(4,6));
        int getDAY = Integer.parseInt(yyyymmdd.substring(6,8));

        if (getYEAR <= 1881 || getYEAR >= 2050) { //년수가 해당일자를 넘는 경우
            YunMonthFlag = 0;
        }

        if (getMONTH > 12) { // 달수가 13이 넘는 경우
            YunMonthFlag = 0;
        }

        int m1 = getYEAR - 1881;
        if (Integer.parseInt(LUNAR_INFO[m1].substring(12,13)) == 0) { // 윤달이 없는 해임
            YunMonthFlag = 0;
        } else {
            if (Integer.parseInt(LUNAR_INFO[m1].substring(getMONTH,getMONTH+1)) > 2) {
                YunMonthFlag = 1;
            } else {
                YunMonthFlag = 0;
            }
        }

        m1 = -1;
        int td = 0;

        if (getYEAR > 1881 && getYEAR < 2050) {
            m1 = getYEAR - 1882;
            for (int i=0; i <= m1; i++) {
                for (int j=0; j <= 12; j++) {
                    td = td + Integer.parseInt(LUNAR_INFO[i].substring(j,j+1));
                }
                if (Integer.parseInt(LUNAR_INFO[i].substring(12,13)) == 0) {
                    td = td + 336;
                } else {
                    td = td + 362;
                }
            }
        } else {
            gf_lun2sol = 0;
        }

        m1++;
        int n2 = getMONTH - 1;
        int m2 = -1;

        while(true) {
            m2++;
            if (Integer.parseInt(LUNAR_INFO[m1].substring(m2,m2+1)) > 2) {
                td = td + 26 + Integer.parseInt(LUNAR_INFO[m1].substring(m2,m2+1));
                n2++;
            } else {
                if (m2 == n2) {
                    if (gf_yun == 1) {
                        td = td + 28 + Integer.parseInt(LUNAR_INFO[m1].substring(m2,m2+1));
                    }
                    break;
                } else {
                    td = td + 28 + Integer.parseInt(LUNAR_INFO[m1].substring(m2,m2+1));
                }
            }
        }

        td = td + getDAY + 29;
        m1 = 1880;
        while(true) {
            m1++;
            if (m1 % 400 == 0 || m1 % 100 != 0 && m1 % 4 == 0) {
                leap = 1;
            } else {
                leap = 0;
            }

            if (leap == 1) {
                m2 = 366;
            } else {
                m2 = 365;
            }

            if (td < m2) break;
            td = td - m2;
        }
        syear = m1;
        arrayLDAY[1] = m2 - 337;

        m1 = 0;

        while(true) {
            m1++;
            if (td <= arrayLDAY[m1-1]) {
                break;
            }
            td = td - arrayLDAY[m1-1];
        }
        smonth = m1;
        sday = td;
        int y = syear - 1;
        td = (int)(y*365) + (int)(y/4) - (int)(y/100) + (int)(y/400);

        if (syear % 400 == 0 || syear % 100 != 0 && syear % 4 == 0) {
            leap = 1;
        } else {
            leap = 0;
        }

        if (leap == 1) {
            arrayLDAY[1] = 29;
        } else {
            arrayLDAY[1] = 28;
        }
        for (int i=0; i <= smonth-2; i++) {
            td = td + arrayLDAY[i];
        }
        td = td + sday;
        int w = td % 7;

        String sweek = arrayWEEK[w];
        gf_lun2sol = 1;

        return String.valueOf(syear+String.format("%02d", smonth)+String.format("%02d", sday));
    }

    public static String sol2lun(String yyyymmdd) {
        int gf_sol2lun = 0;
        int gf_yun = 0;

        int getYEAR = Integer.parseInt(yyyymmdd.substring(0,4));
        int getMONTH = Integer.parseInt(yyyymmdd.substring(4,6));
        int getDAY = Integer.parseInt(yyyymmdd.substring(6,8));

        Long[] dt = new Long[LUNAR_INFO.length];
        for (int i = 0; i < LUNAR_INFO.length; i++) {
            dt[i] = Long.parseLong(LUNAR_INFO[i]);
        }
        for (int i=0; i <= 168; i++) {
            dt[i] = Long.valueOf(0);
            for (int j=0;j < 12;j++) {
                switch (Integer.parseInt(LUNAR_INFO[i].substring(j,j+1))) {
                    case 1:
                        dt[i] += 29;
                        break;
                    case 3:
                        dt[i] += 29;
                        break;
                    case 2:
                        dt[i] += 30;
                        break;
                    case 4:
                        dt[i] += 30;
                        break;
                }
            }

            switch (Integer.parseInt(LUNAR_INFO[i].substring(12,13))) {
                case 0:
                    break;
                case 1:
                    dt[i] += 29;
                    break;
                case 3:
                    dt[i] += 29;
                    break;
                case 2:
                    dt[i] += 30;
                    break;
                case 4:
                    dt[i] += 30;
                    break;
            }
        }

        int td1 = 1880 * 365 + (int)(1880/4) - (int)(1880/100) + (int)(1880/400) + 30;
        int k11 = getYEAR - 1;

        int td2 = k11 * 365 + (int)(k11/4) - (int)(k11/100) + (int)(k11/400);

        if (getYEAR % 400 == 0 || getYEAR % 100 != 0 && getYEAR % 4 == 0) {
            arrayLDAY[1] = 29;
        } else {
            arrayLDAY[1] = 28;
        }

        if (getMONTH > 13) {
            gf_sol2lun = 0;
        }

        if (getDAY > arrayLDAY[getMONTH-1]) {
            gf_sol2lun = 0;
        }

        for (int i=0;i <= getMONTH-2;i++) {
            td2 += arrayLDAY[i];
        }

        td2 += getDAY;
        int td = td2 - td1 + 1;
        Long td0 = dt[0];

        int jcount = 0;
        int ryear = 0;
        int m1 = 0;
        int m2 = 0;
        int i = 0;
        for (i=0; i <= 168; i++) {
            if (td <= td0) {
                break;
            }
            td0 += dt[i + 1];
        }
        ryear = i + 1881;
        td0 -= dt[i];
        td -= td0;

        if (Integer.parseInt(LUNAR_INFO[i].substring(12,13)) == 0) {
            jcount = 11;
        } else {
            jcount = 12;
        }

        for (int j=0;j <= jcount;j++) { // 달수 check, 윤달 > 2 (by harcoon)
            if (Integer.parseInt(LUNAR_INFO[i].substring(j,j+1)) <= 2) {
                m2++;
                m1 = Integer.parseInt(LUNAR_INFO[i].substring(j,j+1)) + 28;
                gf_yun = 0;
            } else {
                m1 = Integer.parseInt(LUNAR_INFO[i].substring(j,j+1)) + 26;
                gf_yun = 1;
            }
            if (td <= m1) {
                break;
            }
            td = td - m1;
        }

        int k1=(ryear+6) % 10;
        String syuk = arrayYUK[k1];
        int k2=(ryear+8) % 12;
        String sgap = arrayGAP[k2];
        String sddi = arrayDDI[k2];

        gf_sol2lun = 1;

//        return String.valueOf(ryear+String.format("%02d", m2)+String.format("%02d", td)+"|"+syuk+sgap+"년|"+sddi+"띠");
        return String.valueOf(ryear+String.format("%02d", m2)+String.format("%02d", td)+"|"+gf_yun+"|"+syuk+sgap+"년|"+sddi+"띠");
    }
}
