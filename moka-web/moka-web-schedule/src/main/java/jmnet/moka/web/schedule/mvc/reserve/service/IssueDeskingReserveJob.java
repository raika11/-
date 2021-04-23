package jmnet.moka.web.schedule.mvc.reserve.service;

import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.core.common.rest.RestTemplateHelper;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContentHistory;
import jmnet.moka.web.schedule.mvc.gen.entity.GenStatus;
import jmnet.moka.web.schedule.support.StatusFlagType;
import jmnet.moka.web.schedule.support.StatusResultType;
import jmnet.moka.web.schedule.support.reserve.AbstractReserveJob;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.util.Date;

/**
 * <pre>
 * 이슈편집기사 스케줄링
 * Project : moka
 * Package : jjmnet.moka.web.schedule.mvc.reserve.service
 * ClassName : IssueArticleReserveJob
 * </pre>
 *
 * @author 유영제
 * @since 2021-04-23
 */

@Slf4j
@Component
public class IssueDeskingReserveJob extends AbstractReserveJob {

    //@Value("http://172.29.58.94:8100")  //로컬 BO API 주소
    @Value("https://stg-backoffice.joongang.co.kr") //스테이징 BO API 주소
    private String backOfficeServer;

    @Autowired
    private RestTemplateHelper restTemplateHelper;

    private final int JOB_TASK_ID_PKGSEQ = 0x02;
    private final int JOB_TASK_ID_COMPNO = 0x03;

    @Override
    public GenContentHistory invoke(GenContentHistory history) {
        log.debug("비동기 예약 작업 처리 : {}", history.getJobSeq());
        GenStatus desingResult = history.getGenContent().getGenStatus();
        /**
         * todo 1. 작업 테이블에서 조회하여 이미 완료 되었거나, 삭제 된 작업이 아닌 경우 진행 시작
         * - AbstractReserveJob에 공통 메소드 생성하여 사용할 수 있도록 조치 필요
         */
        try {
            JSONParser jsonParser = new JSONParser();

            String url = "";
            MultiValueMap<String, Object> params = new LinkedMultiValueMap<>();
            MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();

            /**
             * todo 2. 작업 테이블의 파라미터 정보를 Map 형태로 전환하여, procedure 또는 업무별 service 객체 호출
             * - 각 업무 담당자가 해당 영역 코딩은 구현할 예정
             */
            //실행할 API url
            url = backOfficeServer + "/api/internal/issue";
            //BackOffice 접근을 위한 session 더미입력
            headers.add("MOKA_SERVER", "");
            headers.add(MokaConstants.CONTENT_TYPE, MediaType.APPLICATION_JSON_UTF8_VALUE);
            headers.add("Accept", MediaType.APPLICATION_JSON_UTF8_VALUE);

            if(checkJobTaskID(history.getJobTaskId())) {
                params.add("pkgSeq", parseJobTarkID(JOB_TASK_ID_PKGSEQ, history.getJobTaskId()));
                params.add("compNo", parseJobTarkID(JOB_TASK_ID_COMPNO, history.getJobTaskId()));

                desingResult.setSendExecTime((new Date()).getTime());

                //api 실행
                ResponseEntity<String> responseEntity = restTemplateHelper.post(url, params, headers);

                JSONObject jsonObject = (JSONObject) jsonParser.parse(responseEntity.getBody());
                JSONObject header = (JSONObject) jsonObject.get("header");

                log.debug("DeskingReserveJob response : {}", header.get("success"));
                log.debug("DeskingReserveJob response : {}", header.get("resultCode"));
                log.debug("DeskingReserveJob response : {}", header.get("message"));

                desingResult.setSendResult(StatusResultType.SUCCESS.getCode());
                desingResult.setSendExecTime(((new Date()).getTime() - desingResult.getSendExecTime()) / 1000);

                //실행결과 false 인 경우 실패처리
                if (!(boolean) header.get("success")) {
                    desingResult.setSendExecTime(0l);
                    desingResult.setSendResult(StatusResultType.FAILED_JOB.getCode());
                    history.setStatus(StatusFlagType.FAILED_TASK);
                    throw new MokaException("API 실행이 실패했습니다.");
                }
            }
            else {
                desingResult.setSendExecTime(0l);
                desingResult.setSendResult(StatusResultType.FAILED_JOB.getCode());
                history.setStatus(StatusFlagType.FAILED_TASK);
                throw new MokaException("유효하지 않은 JOB_TASK_ID 입니다.");
            }
        } catch (Exception ex) {
            log.error("[GEN STATUS HISTORY ERROR] : {}", ex.getMessage());
            desingResult.setSendExecTime(0l);
            history.setStatus(StatusFlagType.FAILED_TASK);
            history
                    .getGenContent()
                    .getGenStatus()
                    .setErrMgs(ex.getMessage());
        }

        history.setStatus(StatusFlagType.DONE);
        return history;
    }

    private boolean checkJobTaskID(String strJobTaskID)
    {
        boolean retValue = true;
        if(StringUtils.countMatches(strJobTaskID, "_") == 3) {
            String[] strSplit =  strJobTaskID.split("_");
            if( StringUtils.isNumeric(strSplit[JOB_TASK_ID_PKGSEQ]) == false ||
                StringUtils.isNumeric(strSplit[JOB_TASK_ID_COMPNO]) == false) {
                retValue = false;
            }
        }
        else {
            retValue = false;
        }

        return retValue;
    }

    private String parseJobTarkID(int type, String strJobTaskID) {
        String[] strSplit =  strJobTaskID.split("_");
        return strSplit[type];
    }

}