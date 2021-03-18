package jmnet.moka.web.schedule.mvc.schedule.service;

import jmnet.moka.web.schedule.support.schedule.AbstractScheduleJob;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.text.SimpleDateFormat;
import java.util.*;

/**
 * <pre>
 * 오늘자 중앙 PDF 이미지 데이터를 조회하여 js 파일로 FTP 업로드
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.schedule.service
 * ClassName : TodayJoongangPdfJob
 * </pre>
 *
 * @author 김정민
 * @since 2021-03-17
 */
@Slf4j
@Component
public class TodayJoongangPdfJob extends AbstractScheduleJob {
    @Value("http://papers.eyescrap.com/joinsmsn/list.aspx?SCT=AA014&paper_date=")
    private String SundayJoongangUrl;

    @Value("http://papers.eyescrap.com/joinsmsn/list.aspx?SCT=AA00899&paper_date=")
    private String TodayJoongangUrl;

    @Override
    public void invoke() {
        boolean success = false;

        Date date = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        SimpleDateFormat format1 = new SimpleDateFormat("yyyy-MM-dd");
        String now = format1.format(date);
        ArrayList<String> returnImageUrlList = new ArrayList<>();
        String url = SundayJoongangUrl + now;
/*
        //일요일인 경우
        if(calendar.get(Calendar.DAY_OF_WEEK) == 1) {
            returnImageUrlList = getTodayJoongang(url);
        }
*/
        //SCT=AA014로 조회하는 경우 토요일에만 데이터가 나오는 관계로 무조건 조회로 변경
        returnImageUrlList = getTodayJoongang(url);

        //데이터가 없는 경우
        if(returnImageUrlList.size() == 0){
            //최대 10일전까지만 조회
            for(int i=0; i<10; i++){
                url = TodayJoongangUrl + now;
                log.debug("url : {}", url);
                returnImageUrlList = getTodayJoongang(url);

                //데이터가 존재하면 종료
                if(0 < returnImageUrlList.size() ){
                    break;
                }
                //데이터가 없으면 1일전으로 변경
                else{
                    calendar.add(Calendar.DATE, - 1);
                    date = calendar.getTime();
                    now = format1.format(date);
                }
            }
        }

        //조회된 데이터가 있는 경우 > FTP로 파일생성 + 전송
        if(0 < returnImageUrlList.size()){
            StringBuffer stringBuffer = new StringBuffer();
            stringBuffer.append("var JOONGANG_PDF_IMAGE_JSON = { data:[ ");
            stringBuffer.append(System.lineSeparator());

            for(int i=0; i<returnImageUrlList.size(); i++){
                stringBuffer.append("{\"pblsh_date\":\""+ now.replace("-", "") +"\", \"pblsh_myun\":\""+ (i + 1) +"\", \"jpg_file_url\":\""+ returnImageUrlList.get(i) +"\", \"jpg_file_nm\":\""+ now.replace("-", "") +"A00"+ (i + 1) +".jpg\", \"pdf_id\":\"45412"+ (i + 1) +"\"} ");
                if(i < returnImageUrlList.size()-1){
                    stringBuffer.append(",");
                }
                stringBuffer.append(System.lineSeparator());
            }
            stringBuffer.append(" ] };");
            log.debug("stringBuffer : {}", stringBuffer);

            success = stringFileUpload(stringBuffer.toString());
            log.debug("file upload : {}", success);
        }


        //AbstractScheduleJob.finish() 에서 필요한 schedule 실행 결과 값 입력
        //임시로 성공/실패만 입력 + 그외 입력값은 입력정의 필요
        setFinish(success);
    }

    private ArrayList<String> getTodayJoongang(String url){
        ArrayList<String> resultList = new ArrayList<>();

        String requestUrl = url;
        MultiValueMap<String, Object> params = new LinkedMultiValueMap<>();
        ResponseEntity<String> responseEntity = restTemplateHelper.get(requestUrl, params);

        String [] tmpArray = responseEntity.getBody().split("\n");
        //newline으로 구분해서
        for(String tmp : tmpArray){
            //image url이 포함된 경우
            if(0 < tmp.indexOf("http://papers.eyesurfer.com")){
                //log.debug("tmp {} : {}", tmp.trim().indexOf("http://papers.eyesurfer.com"), tmp.trim());
                String[] tmpArray2 = tmp.split("\"");
                //image url만 추출하여 resultList에 입력
                for(String tmp2 : tmpArray2){
                    //log.debug("tmp2 {} : {}", tmp2.indexOf("http://papers.eyesurfer.com"), tmp2);
                    if(tmp2.indexOf("http://papers.eyesurfer.com") == 0){
                        resultList.add(tmp2);
                    }
                }
            }

            //5개까지만 처리
            if(4 < resultList.size()){
                return resultList;
            }
        }


        return resultList;
    }
}
