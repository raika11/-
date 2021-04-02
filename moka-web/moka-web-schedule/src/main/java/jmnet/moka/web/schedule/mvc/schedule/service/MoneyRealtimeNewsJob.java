package jmnet.moka.web.schedule.mvc.schedule.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContent;
import jmnet.moka.web.schedule.mvc.gen.entity.GenStatus;
import jmnet.moka.web.schedule.mvc.mybatis.dto.MoneyRealtimeNewsJobDTO;
import jmnet.moka.web.schedule.mvc.mybatis.mapper.MoneyRealtimeNewsJobMapper;
import jmnet.moka.web.schedule.mvc.mybatis.vo.MoneyRealtimeNewsVO;
import jmnet.moka.web.schedule.support.StatusResultType;
import jmnet.moka.web.schedule.support.common.FileUpload;
import jmnet.moka.web.schedule.support.schedule.AbstractScheduleJob;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * <pre>
 * 부동산 실시간 뉴스 데이터를 생성하여 js 파일로 FTP 업로드
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.schedule.service
 * ClassName : MoneyRealtimeNewsJob
 * </pre>
 *
 * @author 김정민
 * @since 2021-03-31
 */
@Slf4j
@Component
public class MoneyRealtimeNewsJob extends AbstractScheduleJob {

    @Value("https://images.joins.com")
    String imagesSvrWebDomain;

    @Autowired
    MoneyRealtimeNewsJobMapper moneyRealtimeNewsJobMapper;

    @Override
    public void invoke(GenContent info) {
        GenContent scheduleInfo = info;
        GenStatus scheduleResult = info.getGenStatus();

        try {
            MoneyRealtimeNewsJobDTO dto = new MoneyRealtimeNewsJobDTO();
            List<MoneyRealtimeNewsVO> list = moneyRealtimeNewsJobMapper.findAll(dto);
            log.debug("list : {}", list.size());


            StringBuffer stringBuffer = new StringBuffer();
            stringBuffer.append("[");
            stringBuffer.append(System.lineSeparator());

            for (MoneyRealtimeNewsVO vo : list) {
                //기사제목
                String sArticleTitle = vo.getArtTitle();
                if (McpString.isEmpty(sArticleTitle)) {
                    sArticleTitle = vo.getJiTitle();
                }
                sArticleTitle = sArticleTitle.replace("\"", "\\\"");
                sArticleTitle = sArticleTitle.replaceAll("<[^<|>]*>", "");
                sArticleTitle = sArticleTitle.replace("\n", " ");
                sArticleTitle = sArticleTitle.replace("\"", "&quot;");

                //기사내용
                String sArticleSummary = vo
                        .getArtSummary()
                        .trim();
                sArticleSummary = sArticleSummary.replace("\"", "\\\"");
                sArticleSummary = sArticleSummary.replace("\n", " ");
                sArticleSummary = sArticleSummary.replace("%", "");

                //썸네일
                String sArticleThumbnail = McpString.defaultValue(vo.getArtThumb());
                if (McpString.isNotEmpty(sArticleThumbnail) && sArticleThumbnail
                        .trim()
                        .length() > 0) {
                    sArticleThumbnail = imagesSvrWebDomain + sArticleThumbnail.replace(".tn_120.jpg", "");
                }

                //날자
                String sServiceDay = vo
                        .getServiceDaytime()
                        .substring(0, 10);

                //시간
                String sServiceTime = vo
                        .getServiceDaytime()
                        .substring(11, 16);

                //시간차이
                String sServiceDate = "";
                Date now = new Date();
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.sss");
                Date articleDate = sdf.parse(vo.getServiceDaytime());
                log.debug("sServiceDate : {} : {}", now, articleDate);
                long diff = now.getTime() - articleDate.getTime();
                long diffSeconds = diff / 1000;
                long diffMinutes = diff / (60 * 1000);
                long diffHours = diff / (60 * 60 * 1000);
                long diffDays = diff / (60 * 60 * 1000 * 24);
                log.debug("sServiceDate diff : {} : {} : {} : {} : {}", diff, diffSeconds, diffMinutes, diffHours, diffDays);
                if (diffSeconds < 60) {
                    sServiceDate = "방금 전";
                } else if (diffMinutes < 60) {
                    sServiceDate = diffMinutes + "분 전";
                } else if (diffHours < 24) {
                    sServiceDate = diffHours + "시간 전";
                } else if (diffDays == 1) {
                    sServiceDate = "어제";
                } else if (1 < diffDays) {
                    sServiceDate = diffDays + "일 전";
                }

                //serivce_time, serivce_date 기존 소스 오타 그대로 옮김
                stringBuffer.append(
                        "		{\"total_id\":\"" + vo.getTotalId() + "\", \"ctg\":\"" + vo.getServiceCode() + "\", \"sc\":\"" + vo.getSourceCode()
                                + "\", \"title\":\"" + sArticleTitle + "\", \"summary\":\"" + sArticleSummary + "\", \"thumbnail\":\""
                                + sArticleThumbnail + "\", \"service_day\":\"" + sServiceDay + "\", \"serivce_time\":\"" + sServiceTime
                                + "\", \"serivce_date\":\"" + sServiceDate + "\"}");
                if (list.indexOf(vo) + 1 < list.size()) {
                    stringBuffer.append(",");
                }
                stringBuffer.append(System.lineSeparator());

            }

            stringBuffer.append("]");
            log.debug("string : {}", stringBuffer);

            FileUpload fileUpload = new FileUpload(scheduleInfo, mokaCrypt);
            boolean success = fileUpload.stringFileUpload(stringBuffer.toString(), "");

            //업로드 성공 시 GenStatus.content에 파일생성에 사용된 String 저장
            if (success) {
                scheduleResult.setContent(stringBuffer.toString());
            }

            //AbstractScheduleJob.finish() 에서 필요한 schedule 실행 결과 값 입력
            setFinish(success, info);

        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.toString());
            setFinish(StatusResultType.FAILED_JOB, e.getMessage(), info);
        }
    }
}
