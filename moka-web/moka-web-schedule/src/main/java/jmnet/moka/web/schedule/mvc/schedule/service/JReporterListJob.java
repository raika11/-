package jmnet.moka.web.schedule.mvc.schedule.service;

import java.util.List;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.schedule.mvc.mybatis.dto.JReporterListJobDTO;
import jmnet.moka.web.schedule.mvc.mybatis.mapper.JReporterListJobMapper;
import jmnet.moka.web.schedule.mvc.mybatis.vo.JReporterVO;
import jmnet.moka.web.schedule.support.schedule.AbstractScheduleJob;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * <pre>
 * 기자목록을 조회하여 js 파일로 FTP 업로드
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.schedule.service
 * ClassName : JReporterListJob
 * </pre>
 *
 * @author 김정민
 * @since 2021-03-18
 */
@Slf4j
@Component
public class JReporterListJob extends AbstractScheduleJob {

    @Autowired
    private JReporterListJobMapper jReporterListJobMapper;

    @Override
    public void invoke() {
        boolean success = false;

        List<JReporterVO> list = jReporterListJobMapper.findAll(new JReporterListJobDTO());

        if (list != null) {
            StringBuffer stringBuffer = new StringBuffer();
            stringBuffer.append("var jsonReporters = {");
            stringBuffer.append(System.lineSeparator());

            for (JReporterVO vo : list) {
                stringBuffer.append("\"REP_" + vo.getRepSeq() + "\": {");
                stringBuffer.append("\"REP_SEQ\":\"" + vo.getRepSeq() + "\", ");
                stringBuffer.append("\"USED_YN\":\"" + McpString.defaultValue(vo.getUsedYn()) + "\", ");
                stringBuffer.append("\"REP_NAME\":\"" + McpString.defaultValue(vo.getRepName()) + "\", ");
                stringBuffer.append("\"REP_EMAIL1\":\"" + McpString.defaultValue(vo.getRepEmail1()) + "\", ");
                stringBuffer.append("\"REP_EMAIL2\":\"" + McpString.defaultValue(vo.getRepEmail2()) + "\", ");
                stringBuffer.append("\"JOINS_ID\":\"" + McpString.defaultValue(vo.getJoinsId()) + "\", ");
                stringBuffer.append("\"JNET_ID\":\"" + McpString.defaultValue(vo.getJnetId()) + "\", ");
                stringBuffer.append("\"REP_VIEW_IMG\":\"" + McpString.defaultValue(vo.getRepViewImg()) + "\", ");
                stringBuffer.append("\"JPLUS_CD\":\"" + McpString.defaultValue(vo.getJplusCd()) + "\", ");
                stringBuffer.append("\"R4_CD_NM\":\"" + McpString.defaultValue(vo.getR4CdNm()) + "\"");
                stringBuffer.append("}");
                if (list.indexOf(vo) + 1 < list.size()) {
                    stringBuffer.append(",");
                }
                stringBuffer.append(System.lineSeparator());
            }
            stringBuffer.append("}");
            stringBuffer.append(System.lineSeparator());
            stringBuffer.append(System.lineSeparator());

            stringBuffer.append("//이름과 메일로 검색");
            stringBuffer.append(System.lineSeparator());
            stringBuffer.append(
                    "function fnGetRepoterInfo(repName, repMail) { var strRepName = repName.replace(/기자/gi, \"\").replace(/ /gi, \"\").replace(/~A|B|C|([0-9])$/gi, \"\"); var strMailAlias = (repMail.indexOf(\"@\") > -1 ? repMail.split(\"@\")[0].toString() : repMail) + \"@\"; var strReturnVal = null; $.each(jsonReporters, function(key, value) { if(value.REP_NAME.indexOf(strRepName) == 0 && (value.REP_EMAIL1.indexOf(strMailAlias) == 0 || value.REP_EMAIL2.indexOf(strMailAlias) >= 0) && value.USED_YN == \"Y\") { strReturnVal = value; return false; } }); return strReturnVal; }");
            stringBuffer.append(System.lineSeparator());

            stringBuffer.append("//SEQ로 검색");
            stringBuffer.append(System.lineSeparator());
            stringBuffer.append(
                    "\"function fnGetRepoterInfoBySeq(repSeq) { var jsonRepInfo = eval(\\\"jsonReporters.REP_\\\" + repSeq.toString()); var strReturnVal = null; if(typeof(jsonRepInfo) == \\\"object\\\" && jsonRepInfo.USED_YN == \\\"Y\\\") { strReturnVal = jsonRepInfo; } return strReturnVal; }\"");
            stringBuffer.append(System.lineSeparator());

            stringBuffer.append("//메일로 검색");
            stringBuffer.append(System.lineSeparator());
            stringBuffer.append(
                    "function fnGetRepoterInfoByMail(repMail) { var strMailAlias = (repMail.indexOf(\"@\") > -1 ? repMail.split(\"@\")[0].toString() : repMail) + \"@\"; var strReturnVal = null; $.each(jsonReporters, function(key, value) { if((value.REP_EMAIL1.indexOf(strMailAlias) == 0 || value.REP_EMAIL2.indexOf(strMailAlias) == 0) && value.USED_YN == \"Y\") { strReturnVal = value; return false; } }); return strReturnVal; }");
            stringBuffer.append(System.lineSeparator());

            stringBuffer.append("//Jnet아이디로 검색");
            stringBuffer.append(System.lineSeparator());
            stringBuffer.append(
                    "function fnGetRepoterInfoByJnetId(repJnetId) { var strReturnVal = null; $.each(jsonReporters, function(key, value) { if(value.JNET_ID.indexOf(repJnetId) == 0 && value.USED_YN == \"Y\") { strReturnVal = value; return false; } }); return strReturnVal; }");
            stringBuffer.append(System.lineSeparator());

            stringBuffer.append("//joins아이디로 검색");
            stringBuffer.append(System.lineSeparator());
            stringBuffer.append(
                    "function fnGetRepoterInfoByJoinsId(repJoinsId) { var strReturnVal = null; $.each(jsonReporters, function(key, value) { if(value.JOINS_ID.indexOf(repJoinsId) == 0 && value.USED_YN == \"Y\") { strReturnVal = value; return false; } }); return strReturnVal; }");
            stringBuffer.append(System.lineSeparator());

            stringBuffer.append("//이름으로 검색 (여러건존재 가능:배열로 리턴)");
            stringBuffer.append(System.lineSeparator());
            stringBuffer.append(
                    "function fnGetRepoterInfoByRepName(repName) { var strRepName = repName.replace(/기자/gi, \"\").replace(/ /gi, \"\").replace(/~A|B|C|([0-9])$/gi, \"\"); var strReturnVal = []; $.each(jsonReporters, function(key, value) { if(value.REP_NAME.indexOf(strRepName) == 0 && value.USED_YN == \"Y\") { strReturnVal.push(value); } }); return strReturnVal; }");
            stringBuffer.append(System.lineSeparator());

            //log.debug("string : {}", stringBuffer);

            success = stringFileUpload(stringBuffer.toString());
            log.debug("file upload : {}", success);
        }

        //AbstractScheduleJob.finish() 에서 필요한 schedule 실행 결과 값 입력
        //임시로 성공/실패만 입력 + 그외 입력값은 입력정의 필요
        setFinish(success);
    }
}
