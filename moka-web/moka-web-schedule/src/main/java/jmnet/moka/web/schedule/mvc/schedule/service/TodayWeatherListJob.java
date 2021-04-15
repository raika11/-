package jmnet.moka.web.schedule.mvc.schedule.service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContent;
import jmnet.moka.web.schedule.mvc.gen.entity.GenStatus;
import jmnet.moka.web.schedule.mvc.mybatis.dto.TodayWeatherListJobDTO;
import jmnet.moka.web.schedule.mvc.mybatis.mapper.TodayWeatherListJobMapper;
import jmnet.moka.web.schedule.mvc.mybatis.vo.TodayWeatherVO;
import jmnet.moka.web.schedule.support.StatusResultType;
import jmnet.moka.web.schedule.support.common.FileUpload;
import jmnet.moka.web.schedule.support.schedule.AbstractScheduleJob;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * <pre>
 * 오늘자 날씨 데이터를 생성하여 js 파일로 FTP 업로드
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.schedule.service
 * ClassName : TodayWeatherListJob
 * </pre>
 *
 * @author 김정민
 * @since 2021-04-05
 */
@Slf4j
@Component
public class TodayWeatherListJob extends AbstractScheduleJob {

    @Value("https://images.joins.com")
    String imagesSvrWebDomain;

    @Autowired
    TodayWeatherListJobMapper todayWeatherListJobMapper;

    Map<String, Map<String, String>> legionInfoMap = new HashMap<>();

    @Override
    public void invoke(GenContent info) {
        GenContent scheduleInfo = info;
        GenStatus scheduleResult = info.getGenStatus();

        //필요정보 초기화
        getLegionInfo();

        try {
            //날씨데이터 조회
            TodayWeatherListJobDTO dto = new TodayWeatherListJobDTO();
            List<TodayWeatherVO> list = todayWeatherListJobMapper.findAll(dto);

            StringBuffer stringBuffer = new StringBuffer();
            stringBuffer.append("var TODAY_WEATHER_LIST = {");
            stringBuffer.append(System.lineSeparator());

            for (TodayWeatherVO vo : list) {
                //시작인 경우
                if (list.indexOf(vo) == 0) {
                    stringBuffer.append("   'TARGET_DATE': '" + vo.getTargetDate() + "',");
                    stringBuffer.append(System.lineSeparator());
                    stringBuffer.append("   'DATA': [");
                    stringBuffer.append(System.lineSeparator());
                }

                stringBuffer.append("       {");
                stringBuffer.append("'REGION_CD': " + vo.getRegionCd() + ", ");
                stringBuffer.append("'REGION_NM': '" + vo.getRegionNm() + "', ");
                stringBuffer.append("'REGION_NM_ENG': '" + legionInfoMap
                        .get(vo.getRegionCd())
                        .get("strRegionNmEng") + "', ");
                stringBuffer.append("'REGION_NM_CHN': '" + legionInfoMap
                        .get(vo.getRegionCd())
                        .get("strRegionNmChn") + "', ");
                stringBuffer.append("'REGION_NM_JPN': '" + legionInfoMap
                        .get(vo.getRegionCd())
                        .get("strRegionNmJpn") + "', ");
                stringBuffer.append("'CUR_TEMP': '" + vo.getCurTemp() + "', ");
                stringBuffer.append("'HIGH_TEMP': '" + vo.getHighTemp() + "', ");
                stringBuffer.append("'LOW_TEMP': '" + vo.getLowTemp() + "', ");
                stringBuffer.append("'WEATHER_CD': " + vo.getWeatherCd() + ", ");
                stringBuffer.append("'WEATHER_ICON_URL': '" + vo.getWeatherIconUrl() + "', ");
                stringBuffer.append(
                        "'WEATHER_ICON_JTBC_URL': '" + imagesSvrWebDomain + "/ui_jtbc/news/index/i_w" + getWeatherIconJtbcUrl(vo.getWeatherCd())
                                + ".jpg', ");
                stringBuffer.append("'WEATHER_STS': '" + vo.getWeatherSts() + "', ");
                stringBuffer.append("'WEATHER_STS_ENG': '" + vo.getWeatherStsEng() + "', ");
                stringBuffer.append("'WEATHER_STS_CHN': '" + vo.getWeatherStsChn() + "', ");
                stringBuffer.append("'WEATHER_STS_JPN': '" + vo.getWeatherStsJpn() + "', ");
                stringBuffer.append("'PM10_VALUE': '" + vo.getDustVal() + "', ");
                stringBuffer.append("'PM10_GRADE': '" + vo.getDustGrade() + "'");
                stringBuffer.append("}");
                
                if (list.indexOf(vo) + 1 < list.size()) {
                    stringBuffer.append(",");
                    stringBuffer.append(System.lineSeparator());
                }
                //끝인 경우
                else {
                    stringBuffer.append(System.lineSeparator());
                    stringBuffer.append("   ]");
                    stringBuffer.append(System.lineSeparator());
                    stringBuffer.append("};");
                }
            }

            scheduleResult.setSendExecTime((new Date()).getTime());

            FileUpload fileUpload = new FileUpload(scheduleInfo, mokaCrypt);
            boolean success = fileUpload.stringFileUpload(stringBuffer.toString(), "");

            //업로드 성공 시 GenStatus.content에 파일생성에 사용된 String 저장
            if (success) {
                scheduleResult.setContent(stringBuffer.toString());
                scheduleResult.setSendResult(StatusResultType.SUCCESS.getCode());
                scheduleResult.setSendExecTime(((new Date()).getTime() - scheduleResult.getSendExecTime()) / 1000);
            }
            else {
                scheduleResult.setSendResult(StatusResultType.FAILED.getCode());
                scheduleResult.setSendExecTime(0l);
            }

            //AbstractScheduleJob.finish() 에서 필요한 schedule 실행 결과 값 입력
            setFinish(success, info);

        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.toString());
            setFinish(StatusResultType.FAILED_JOB, e.getMessage(), info);
        }

    }

    //코드화에 대한 방침이 없는 관계로 소스 하드코딩 대신 데이터의 하드코딩으로 대체 > 추후 DB화 시 대체필요
    //완성된 설계없이 추가된 사항을 하나씩 전달하는 현재 업무진행방식으로는 코드화 불가능
    private void getLegionInfo() {
        Map<String, String> legionInfo = new HashMap<>();

        legionInfo.put("strRegionNmEng", "");
        legionInfo.put("strRegionNmChn", "");
        legionInfo.put("strRegionNmJpn", "");
        legionInfoMap.put("", legionInfo);

        legionInfo = new HashMap<>();
        legionInfo.put("strRegionNmEng", "Seoul");
        legionInfo.put("strRegionNmChn", "特別市");
        legionInfo.put("strRegionNmJpn", "ソウル");
        legionInfoMap.put("1", legionInfo);

        legionInfo = new HashMap<>();
        legionInfo.put("strRegionNmEng", "Daejeon");
        legionInfo.put("strRegionNmChn", "大田");
        legionInfo.put("strRegionNmJpn", "大田");
        legionInfoMap.put("2", legionInfo);

        legionInfo = new HashMap<>();
        legionInfo.put("strRegionNmEng", "Chuncheon");
        legionInfo.put("strRegionNmChn", "春川");
        legionInfo.put("strRegionNmJpn", "春川");
        legionInfoMap.put("3", legionInfo);

        legionInfo = new HashMap<>();
        legionInfo.put("strRegionNmEng", "Cheongju");
        legionInfo.put("strRegionNmChn", "淸州");
        legionInfo.put("strRegionNmJpn", "淸州");
        legionInfoMap.put("4", legionInfo);

        legionInfo = new HashMap<>();
        legionInfo.put("strRegionNmEng", "Gangneung");
        legionInfo.put("strRegionNmChn", "江陵");
        legionInfo.put("strRegionNmJpn", "江陵");
        legionInfoMap.put("5", legionInfo);

        legionInfo = new HashMap<>();
        legionInfo.put("strRegionNmEng", "Jeongju");
        legionInfo.put("strRegionNmChn", "全州");
        legionInfo.put("strRegionNmJpn", "全州");
        legionInfoMap.put("6", legionInfo);

        legionInfo = new HashMap<>();
        legionInfo.put("strRegionNmEng", "Daegu");
        legionInfo.put("strRegionNmChn", "大邱");
        legionInfo.put("strRegionNmJpn", "大邱");
        legionInfoMap.put("7", legionInfo);

        legionInfo = new HashMap<>();
        legionInfo.put("strRegionNmEng", "Gwangju");
        legionInfo.put("strRegionNmChn", "光州");
        legionInfo.put("strRegionNmJpn", "光州");
        legionInfoMap.put("8", legionInfo);

        legionInfo = new HashMap<>();
        legionInfo.put("strRegionNmEng", "Busan");
        legionInfo.put("strRegionNmChn", "釜山");
        legionInfo.put("strRegionNmJpn", "釜山");
        legionInfoMap.put("9", legionInfo);

        legionInfo = new HashMap<>();
        legionInfo.put("strRegionNmEng", "Jeju");
        legionInfo.put("strRegionNmChn", "濟州");
        legionInfo.put("strRegionNmJpn", "済州");
        legionInfoMap.put("10", legionInfo);

        legionInfo = new HashMap<>();
        legionInfo.put("strRegionNmEng", "Dokdo");
        legionInfo.put("strRegionNmChn", "獨島");
        legionInfo.put("strRegionNmJpn", "独島");
        legionInfoMap.put("11", legionInfo);
    }

    //기존 소스 하드코딩 > 추후 DB코드화 필요
    private String getWeatherIconJtbcUrl(String weatherCd) {
        String res = "";

        switch (weatherCd) {
            case "1":
                res = "1";
                break;
            case "2":
                res = "2";
                break;
            case "3":
            case "4":
                res = "3";
                break;
            case "5":
            case "8":
                res = "4";
                break;
            case "6":
                res = "5";
                break;
            case "9":
            case "10":
                res = "6";
                break;
            case "12":
                res = "9";
                break;
            case "11":
                res = "13";
                break;
            case "7":
                res = "18";
                break;
        }

        return res;
    }
}
