package jmnet.moka.core.tps.mvc.reporter.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.security.MessageDigest;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.common.rest.RestTemplateHelper;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.mvc.reporter.dto.ReporterJamSaveDTO;
import jmnet.moka.core.tps.mvc.reporter.dto.ReporterJamUpdateDTO;
import jmnet.moka.core.tps.mvc.reporter.dto.ReporterSearchDTO;
import jmnet.moka.core.tps.mvc.reporter.dto.ReporterSimpleDTO;
import jmnet.moka.core.tps.mvc.reporter.entity.Reporter;
import jmnet.moka.core.tps.mvc.reporter.service.ReporterService;
import jmnet.moka.core.tps.mvc.reporter.vo.ReporterSaveVO;
import jmnet.moka.core.tps.mvc.reporter.vo.ReporterVO;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <pre>
 * 기자관리
 * 2020. 11. 09. ssc 최초생성
 * RequestMapping 생성 규칙
 * RESTful 방식에 소문자만 허용하고 단어 사이 구분이 필요한 경우 '-' 사용
 * 메소드 생성 규칙
 * 목록 조회 : get{Target}List, HttpMethod = GET
 * 조회 : get{Target}, HttpMethod = GET
 * 수정  : put{Target}, HttpMethod = PUT
 * </pre>
 *
 * @author ssc
 * @since 2020. 1. 8. 오후 2:09:06
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/reporters")
@Api(tags = {"기자 API"})
public class ReporterRestController extends AbstractCommonController {

    private final ReporterService reporterService;

    private final ModelMapper modelMapper;

    private final MessageByLocale messageByLocale;

    private final TpsLogger tpsLogger;

    @Autowired
    private RestTemplateHelper restTemplateHelper;

    @Value("http://172.29.58.95:8100")  //로컬 BO API 주소
    //@Value("https://stg-backoffice.joongang.co.kr") //스테이징 BO API 주소
    private String backOfficeServer;

    public ReporterRestController(ReporterService reporterService, ModelMapper modelMapper, MessageByLocale messageByLocale, TpsLogger tpsLogger) {
        this.reporterService = reporterService;
        this.modelMapper = modelMapper;
        this.messageByLocale = messageByLocale;
        this.tpsLogger = tpsLogger;
    }

    /**
     * 기자관리목록조회
     *
     * @param search 검색조건 : 기자이름
     * @return 기자목록
     */
    @ApiOperation(value = "기자관리 목록 조회")
    @GetMapping
    public ResponseEntity<?> getReporterList(@Valid @SearchParam ReporterSearchDTO search) {

        // 조회(mybatis)
        List<ReporterVO> returnValue = reporterService.findAllReporter(search);

        // 리턴값 설정
        ResultListDTO<ReporterVO> resultList = new ResultListDTO<ReporterVO>();
        resultList.setList(returnValue);
        resultList.setTotalCnt(search.getTotal());

        ResultDTO<ResultListDTO<ReporterVO>> resultDTO = new ResultDTO<ResultListDTO<ReporterVO>>(resultList);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 기자관리 조회
     *
     * @param request 요청
     * @param repSeq  기자일련번호 (필수)
     * @return 기자정보
     * @throws NoDataException 기자 정보가 없음
     */
    @ApiOperation(value = "기자관리 조회")
    @GetMapping("/{repSeq}")
    public ResponseEntity<?> getReportMgr(HttpServletRequest request, @ApiParam("기자 일련번호") @PathVariable("repSeq")
    @Pattern(regexp = "[0-9]{4}$", message = "{tps.reporter.error.pattern.repSeq}") String repSeq)
            throws NoDataException {
        // 조회(mybatis)
        ReporterVO returnValue = reporterService.findBySeq(repSeq);
        ResultDTO<ReporterVO> resultDTO = new ResultDTO<ReporterVO>(returnValue);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 수정
     *
     * @param request           요청
     * @param repSeq            기자일련번호
     * @param reporterSimpleDTO 수정할 기자정보
     * @return 수정된 기자정보
     * @throws Exception 그외 모든 에러
     */
    @ApiOperation(value = "기자정보 수정")
    @PutMapping("/{repSeq}")
    public ResponseEntity<?> putReporter(HttpServletRequest request, @ApiParam("기자 일련번호") @PathVariable("repSeq")
    @Pattern(regexp = "[0-9]{4}$", message = "{tps.reporter.error.pattern.repSeq}") String repSeq, @Valid ReporterSimpleDTO reporterSimpleDTO)
            throws Exception {

        // GroupDTO -> Group 변환
        String infoMessage = messageByLocale.get("tps.reporter.error.no-data", request);
        String cd1Nm = reporterSimpleDTO.getR1CdNm();
        String cd2Nm = reporterSimpleDTO.getR2CdNm();
        String cd3Nm = reporterSimpleDTO.getR3CdNm();
        String cd4Nm = reporterSimpleDTO.getR4CdNm();

        Reporter newReporter = modelMapper.map(reporterSimpleDTO, Reporter.class);
        newReporter.setRepSeq(repSeq);

        reporterService
                .findReporterById(newReporter.getRepSeq())
                .orElseThrow(() -> new NoDataException(infoMessage));


        try {
            // update
            Reporter returnValue = reporterService.updateReporter(newReporter);

            // 결과리턴
            ReporterSimpleDTO dto = modelMapper.map(returnValue, ReporterSimpleDTO.class);
            dto.setR1CdNm(cd1Nm);
            dto.setR2CdNm(cd2Nm);
            dto.setR3CdNm(cd3Nm);
            dto.setR4CdNm(cd4Nm);
            ResultDTO<ReporterSimpleDTO> resultDto = new ResultDTO<ReporterSimpleDTO>(dto, msg("tps.common.success.insert"));

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.UPDATE);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE REPORTER] seq: {} {}", reporterSimpleDTO.getRepSeq(), e.getMessage());
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE DATASET]", e, true);
            throw new Exception(messageByLocale.get("tps.reporter.error.save", request), e);
        }
    }

    /**
     * 기자 생성
     *
     * @param reporterJamSaveDTO 생성할 기자 정보
     * @return
     */
    @ApiOperation(value = "기자 생성")
    @PostMapping("/createByJam")
    public ResponseEntity<?> createByJam(HttpServletRequest request, @Valid ReporterJamSaveDTO reporterJamSaveDTO)
            throws Exception {
        String result = "";
        String message = "";
        String State = "";

        String serverChk = request.getHeader("MOKA_SERVER");
        log.info("serverChk {} ", serverChk);

        //        if (McpString.isEmpty(serverChk) || (McpString.isNotEmpty(serverChk) && !serverChk.equals("JAM"))) {
        //            message = "State = \"N\", ErrMsg = \"올바른 접근이 아닙니다.\"";
        //            return new ResponseEntity<>(message, HttpStatus.OK);
        //        }

        if (reporterJamSaveDTO.getJamRepSeq() == 0) {
            message = "State = \"N\", ErrMsg = \"필수 항목(JAM 기자 일련번호)이 누락되었습니다.\"";
            return new ResponseEntity<>(message, HttpStatus.OK);
        }

        //md5 hash check   MD5(jcms기자고유번호(신규:0) + jam기자고유번호+ yyyymmdd)
        String hasedKey1 = getMD5("0" + reporterJamSaveDTO
                .getJamRepSeq()
                .toString() + McpDate.dateStr(McpDate.now(), "yyyyMMdd"));  //   DateTime.Now.ToString("yyyyMMdd")

        String hasedKey2 = getMD5("0" + reporterJamSaveDTO
                .getJamRepSeq()
                .toString() + McpDate.dateStr(McpDate.todayDatePlus(1), "yyyyMMdd"));

        log.info("hasedKey1 {} ", hasedKey1);
        log.info("hasedKey2 {} ", hasedKey2);

        if (!reporterJamSaveDTO
                .getHash()
                .equals(hasedKey1) && !reporterJamSaveDTO
                .getHash()
                .equals(hasedKey2)) {
            message = "State = \"N\", ErrMsg = \"올바른 접근이 아닙니다.\"";
            return new ResponseEntity<>(message, HttpStatus.OK);
        }

        ReporterSaveVO reporterSaveVO = modelMapper.map(reporterJamSaveDTO, ReporterSaveVO.class);

        try {
            int repSeq = reporterService.insertReporters(reporterSaveVO);

            if (McpString.isNotEmpty(repSeq)) {
                if (repSeq > 0) {
                    State = "Y";
                    result = "State = " + State + ", JamRepSeq =" + reporterJamSaveDTO.getJamRepSeq() + ", RepSeq =" + repSeq;
                    // 액션 로그에 성공 로그 출력
                    tpsLogger.success(ActionType.INSERT);
                } else {
                    State = "N";
                    String errMsg = "중복된 기자입니다.";
                    result = "State = " + State + ", ErrMsg =" + errMsg;
                }
            }
        } catch (Exception e) {
            String errMsg = "작업이 실패하였습니다.";
            result = "State = " + State + ", ErrMsg =" + errMsg;
        }

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * 기자 수정
     *
     * @param reporterJamUpdateDTO 수정할 기자 정보
     * @return
     */
    @ApiOperation(value = "기자 수정")
    @PutMapping(value = "/changeByJam")
    public ResponseEntity<?> changeByJam(HttpServletRequest request, @Valid ReporterJamUpdateDTO reporterJamUpdateDTO)
            throws Exception {
        String result = "";
        String message = "";
        String State = "";

        String serverChk = request.getHeader("MOKA_SERVER");
        log.info("serverChk {} ", serverChk);

        //        if (McpString.isEmpty(serverChk) || (McpString.isNotEmpty(serverChk) && !serverChk.equals("JAM"))) {
        //            message = "State = \"N\", ErrMsg = \"올바른 접근이 아닙니다.\"";
        //            return new ResponseEntity<>(message, HttpStatus.OK);
        //        }

        if (McpString.isEmpty(reporterJamUpdateDTO.getRepSeq()) || reporterJamUpdateDTO.getRepSeq() == 0) {
            message = "State = \"N\", ErrMsg = \"필수 항목(JCMS 기자 일련번호)이 누락되었습니다.\"";
            return new ResponseEntity<>(message, HttpStatus.OK);
        }
        if (McpString.isEmpty(reporterJamUpdateDTO.getJamRepSeq()) || reporterJamUpdateDTO.getJamRepSeq() == 0) {
            message = "State = \"N\", ErrMsg = \"필수 항목(JAM 기자 일련번호)이 누락되었습니다.\"";
            return new ResponseEntity<>(message, HttpStatus.OK);
        }

        //md5 hash check MD5(jcms기자고유번호 + jam기자고유번호+ yyyymmdd)
        String hasedKey1 = getMD5(reporterJamUpdateDTO
                .getRepSeq()
                .toString() + reporterJamUpdateDTO
                .getJamRepSeq()
                .toString() + McpDate.dateStr(McpDate.now(), "yyyyMMdd"));  //   DateTime.Now.ToString("yyyyMMdd")

        String hasedKey2 = getMD5(reporterJamUpdateDTO
                .getRepSeq()
                .toString() + reporterJamUpdateDTO
                .getJamRepSeq()
                .toString() + McpDate.dateStr(McpDate.todayDatePlus(1), "yyyyMMdd"));

        log.info("hasedKey1 {} ", hasedKey1);
        log.info("hasedKey2 {} ", hasedKey2);

        if (!reporterJamUpdateDTO
                .getHash()
                .equals(hasedKey1) && !reporterJamUpdateDTO
                .getHash()
                .equals(hasedKey2)) {
            message = "State = \"N\", ErrMsg = \"올바른 접근이 아닙니다.\"";
            return new ResponseEntity<>(message, HttpStatus.OK);
        }

        ReporterSaveVO reporterSaveVO = modelMapper.map(reporterJamUpdateDTO, ReporterSaveVO.class);
        try {
            int repSeqChk = reporterService.updateReporters(reporterSaveVO);

            log.info("repSeqChk {} ", repSeqChk);

            if (McpString.isNotEmpty(repSeqChk)) {
                if (repSeqChk > 0) {
                    State = "Y";
                    result = "State = " + State + ", JamRepSeq =" + reporterJamUpdateDTO.getJamRepSeq() + ", RepSeq ="
                            + reporterJamUpdateDTO.getRepSeq();
                    // 액션 로그에 성공 로그 출력
                    tpsLogger.success(ActionType.UPDATE);
                } else {
                    State = "N";
                    String errMsg = "수정된 항목이 없습니다.";
                    result = "State = " + State + ", ErrMsg =" + errMsg;
                }
            }
        } catch (Exception e) {
            String errMsg = "작업이 실패하였습니다.";
            result = "State = " + State + ", ErrMsg =" + errMsg;
        }

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    public static String getMD5(String str) {

        String rtnMD5 = "";

        try {
            //MessageDigest 인스턴스 생성
            MessageDigest md = MessageDigest.getInstance("MD5");
            //해쉬값 업데이트
            md.update(str.getBytes());
            //해쉬값(다이제스트) 얻기
            byte byteData[] = md.digest();

            StringBuffer sb = new StringBuffer();

            //출력
            for (byte byteTmp : byteData) {
                sb.append(Integer
                        .toString((byteTmp & 0xff) + 0x100, 16)
                        .substring(1));
                /*
                int tmp1 = (byteTmp & 0xff);
                int tmp2 = ((byteTmp&0xff) + 0x100);

                System.out.println(byteTmp +" : "+ tmp1 +" : "+ tmp2
                        +" : "+Integer.toString((byteTmp&0xff)+0x100, 16)
                        +" : "+(Integer.toString((byteTmp&0xff) + 0x100, 16).substring(1)));
                */

                // byte 타입의 범위 : -128~127 ( -2^7 ~ 2^7-1 )
                //-129 + 256 = 127
                // 0x100 = 256
            }
            rtnMD5 = sb.toString();
        } catch (Exception e) {
            e.printStackTrace();
            rtnMD5 = null;
        }
        return rtnMD5;
    }
}
