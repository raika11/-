package jmnet.moka.core.tps.mvc.desking.controller;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.common.utils.dto.ResultMapDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.dto.InvalidDataDTO;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.rest.RestTemplateHelper;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.dto.ValidList;
import jmnet.moka.core.tps.helper.UploadFileHelper;
import jmnet.moka.core.tps.mvc.area.dto.AreaDTO;
import jmnet.moka.core.tps.mvc.area.entity.Area;
import jmnet.moka.core.tps.mvc.area.service.AreaService;
import jmnet.moka.core.tps.mvc.desking.dto.DeskingHistDTO;
import jmnet.moka.core.tps.mvc.desking.dto.DeskingHistSearchDTO;
import jmnet.moka.core.tps.mvc.desking.dto.DeskingWorkDTO;
import jmnet.moka.core.tps.mvc.desking.dto.DeskingWorkSearchDTO;
import jmnet.moka.core.tps.mvc.desking.entity.DeskingHist;
import jmnet.moka.core.tps.mvc.desking.entity.DeskingWork;
import jmnet.moka.core.tps.mvc.desking.service.DeskingService;
import jmnet.moka.core.tps.mvc.desking.vo.ComponentHistVO;
import jmnet.moka.core.tps.mvc.desking.vo.ComponentWorkVO;
import jmnet.moka.core.tps.mvc.desking.vo.DeskingWorkVO;
import jmnet.moka.core.tps.mvc.template.service.TemplateService;
import jmnet.moka.core.tps.mvc.template.vo.TemplateVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@Validated
@Slf4j
@RequestMapping("/api/desking")
@Api(tags = {"페이지편집 API"})
public class DeskingRestController extends AbstractCommonController {

    private final DeskingService deskingService;

    private final AreaService areaService;

    private final UploadFileHelper uploadFileHelper;

    private final TemplateService templateService;

    private final RestTemplateHelper restTemplateHelper;

    public DeskingRestController(DeskingService deskingService, AreaService areaService, UploadFileHelper uploadFileHelper,
            RestTemplateHelper restTemplateHelper, TemplateService templateService) {
        this.deskingService = deskingService;
        this.areaService = areaService;
        this.uploadFileHelper = uploadFileHelper;
        this.restTemplateHelper = restTemplateHelper;
        this.templateService = templateService;
    }

    /**
     * 편집영역의 모든 Work 초기화 및 컴포넌트워크 목록 조회
     *
     * @param areaSeq   편집영역순번
     * @param principal 로그인 사용자 세션
     * @return Work 컴포넌트목록
     * @throws Exception 예외
     */
    @ApiOperation(value = "편집영역의 모든 Work 초기화 및 컴포넌트워크 목록 조회")
    @GetMapping("/{areaSeq}")
    public ResponseEntity<?> getComponentWorkList(
            @ApiParam("편집영역 일련번호(필수)") @PathVariable("areaSeq") @Min(value = 0, message = "{tps.area.error.min.areaSeq}") Long areaSeq,
            @ApiParam(hidden = true) Principal principal)
            throws Exception {

        try {
            DeskingWorkSearchDTO search = DeskingWorkSearchDTO
                    .builder()
                    .areaSeq(areaSeq)
                    .regId(principal.getName())
                    .build();
            search.setReturnValue(TpsConstants.PROCEDURE_SUCCESS);

            // work조회 : 임시저장(deskingWork)된 것을 조회
            List<ComponentWorkVO> returnValue = deskingService.findAllComponentWork(search);

            // area
            Area area = areaService
                    .findAreaBySeq(areaSeq)
                    .orElseThrow(() -> {
                        String message = msg("tps.common.error.no-data");
                        tpsLogger.fail(message, true);
                        return new NoDataException(message);
                    });

            AreaDTO areaDto = modelMapper.map(area, AreaDTO.class);

            // 컴포넌트타입일 경우, areaComps-> areaComp로 컴포넌트 정보 이동
            if (areaDto
                    .getAreaDiv()
                    .equals(MokaConstants.ITEM_COMPONENT)) {
                areaService.compsToComp(areaDto);
            }

            ResultMapDTO resultMapDTO = new ResultMapDTO(HttpStatus.OK);
            resultMapDTO.addBodyAttribute("desking", returnValue);
            resultMapDTO.addBodyAttribute("area", areaDto);
            tpsLogger.success(true);
            return new ResponseEntity<>(resultMapDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO LOAD COMPONENT WORK LIST]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD COMPONENT WORK LIST]", e, true);
            throw new Exception(msg("tps.desking.error.work.init"), e);
        }
    }

    /**
     * 단일 작업컴포넌트 조회
     *
     * @param componentWorkSeq 컴포넌트아이디 (필수)
     * @return Work컴포넌트
     * @throws NoDataException Work컴포넌트 정보가 없음
     * @throws Exception       기타예외
     */
    @ApiOperation(value = "단일 컴포넌트워크 조회")
    @GetMapping("/components/{componentWorkSeq}")
    public ResponseEntity<?> getComponentWork(@ApiParam("컴포넌트워크 일련번호(필수)") @PathVariable("componentWorkSeq")
    @Min(value = 0, message = "{tps.desking.error.min.componentWorkSeq}") Long componentWorkSeq) {

        // work조회
        ComponentWorkVO returnValue = deskingService.findComponentWorkBySeq(componentWorkSeq, true);

        // 리턴값 설정
        ResultDTO<ComponentWorkVO> resultDto = new ResultDTO<ComponentWorkVO>(returnValue);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 컴포넌트 임시저장
     *
     * @param componentWorkSeq 컴포넌트워크 SEQ
     * @param templateSeq      템플릿SEQ
     * @param principal        로그인사용자 세션
     * @return 등록된 편집 컴포넌트정보
     * @throws Exception
     */
    @ApiOperation(value = "컴포넌트 임시저장")
    @PostMapping("/components/save/{componentWorkSeq}")
    public ResponseEntity<?> postSaveComponentWork(@ApiParam("컴포넌트워크 일련번호(필수)") @PathVariable("componentWorkSeq")
    @Min(value = 0, message = "{tps.desking.error.min.componentWorkSeq}") Long componentWorkSeq,
            @ApiParam("템플릿 일련번호(네이버채널만 사용 그 외는 모두 null줄 것)") Long templateSeq, @ApiParam(hidden = true) Principal principal)
            throws Exception {

        try {
            // 컴포넌트워크 조회(편집기사워크포함)
            ComponentWorkVO componentWork = deskingService.findComponentWorkBySeq(componentWorkSeq, true);

            // 컴포넌트 저장, 편집기사 저장
            deskingService.save(componentWork, principal.getName(), templateSeq);

            // 다시 조회
            ComponentWorkVO returnValue = deskingService.findComponentWorkBySeq(componentWorkSeq, true);

            // work를 그대로 리턴
            String message = msg("tps.desking.success.save");
            ResultDTO<ComponentWorkVO> resultDto = new ResultDTO<ComponentWorkVO>(returnValue, message);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO SAVE DESKING]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO SAVE DESKING]", e, true);
            throw new Exception(msg("tps.desking.error.save"), e);
        }
    }

    /**
     * 컴포넌트 전송
     *
     * @param componentWorkSeq 워크아이디
     * @param areaSeq          편집영역seq
     * @param templateSeq      템플릿SEQ
     * @param principal        로그인사용자 세션
     * @return 등록된 편집 컴포넌트정보
     * @throws Exception
     */
    @ApiOperation(value = "컴포넌트 전송")
    @PostMapping("/components/publish/{componentWorkSeq}")
    public ResponseEntity<?> postPublishComponentWork(HttpServletRequest request, @ApiParam("컴포넌트워크 일련번호(필수)") @PathVariable("componentWorkSeq")
    @Min(value = 0, message = "{tps.desking.error.min.componentWorkSeq}") Long componentWorkSeq,
            @ApiParam("편집영역 일련번호(필수)") @Min(value = 0, message = "{tps.area.error.min.areaSeq}") Long areaSeq,
            @ApiParam("템플릿 일련번호(네이버채널만 사용 그 외는 모두 null줄 것)") Long templateSeq, @ApiParam(hidden = true) Principal principal)
            throws Exception {

        boolean checkPublish = false;       // 전송여부
        boolean checkAfterApi = false;      // afterApi성공여부
        try {
            // 컴포넌트워크 조회(편집기사워크포함)
            ComponentWorkVO componentWork = deskingService.findComponentWorkBySeq(componentWorkSeq, true);

            // 컴포넌트 저장, 편집기사 저장, purge
            deskingService.publish(componentWork, principal.getName(), templateSeq);
            checkPublish = true;

            String message = msg("tps.desking.success.publish");

            // 편집영역에 after api있을경우 실행
            Area area = areaService
                    .findAreaBySeq(areaSeq)
                    .orElseThrow(() -> {
                        String messageArea = msg("tps.common.error.no-data");
                        tpsLogger.fail(messageArea, true);
                        return new NoDataException(messageArea);
                    });
            String afterApi = area.getAfterApi();
            if (McpString.isNotEmpty(afterApi)) {
                String token = request.getHeader(MokaConstants.AUTHORIZATION);
                MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
                headers.add(MokaConstants.CONTENT_TYPE, MediaType.APPLICATION_JSON_UTF8_VALUE);
                headers.add(MokaConstants.ACCEPT, MediaType.APPLICATION_JSON_UTF8_VALUE);
                headers.add(MokaConstants.AUTHORIZATION, token);
                ResponseEntity<String> responseEntity = restTemplateHelper.get(afterApi, null, headers);
                if (responseEntity.getStatusCode() == HttpStatus.OK) {
                    // localhost로 호출한 경우
                    if (afterApi.contains("localhost")) {
                        String response = responseEntity.getBody();
                        ResultDTO<Boolean> map = ResourceMapper
                                .getDefaultObjectMapper()
                                .readValue(response, new TypeReference<ResultDTO<Boolean>>() {
                                });
                        message = map
                                .getHeader()
                                .getMessage();
                    }
                    checkAfterApi = true;
                } else {
                    message = msg("tps.desking.error.after-api");
                    log.warn(message);
                }
            }

            // 다시조회
            ComponentWorkVO returnValue = deskingService.findComponentWorkBySeq(componentWorkSeq, true);

            // work를 그대로 리턴
            ResultDTO<ComponentWorkVO> resultDto = new ResultDTO<ComponentWorkVO>(returnValue, message);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (JsonParseException je) {
            log.error("[SENT IT, BUT THERE WAS AN ERROR IN PARSING THE RESPONSE DATA.]", je);
            tpsLogger.error(ActionType.SELECT, "[SENT IT, BUT THERE WAS AN ERROR IN PARSING THE RESPONSE DATA.]", je, true);
            throw new Exception(msg("tps.desking.error.after-api"), je);
        } catch (Exception e) {
            String msg = "";
            if (checkPublish && !checkAfterApi) {
                msg = msg("tps.desking.error.after-api");
            } else {
                msg = msg("tps.desking.error.publish");
            }
            log.error("[FAIL TO PUBLISH DESKING]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO PUBLISH DESKING]", e, true);
            throw new Exception(msg, e);
        }
    }

    /**
     * 컴포넌트 예약
     *
     * @param componentWorkSeq 컴포넌트워크 SEQ
     * @param principal        로그인사용자 세션
     * @param reserveDt        예약시간
     * @return 등록된 편집 컴포넌트정보
     * @throws Exception
     */
    @ApiOperation(value = "컴포넌트 예약")
    @PostMapping("/components/reserve/{componentWorkSeq}")
    public ResponseEntity<?> postReserveComponentWork(@ApiParam("컴포넌트워크 일련번호(필수)") @PathVariable("componentWorkSeq")
    @Min(value = 0, message = "{tps.desking.error.min.componentWorkSeq}") Long componentWorkSeq, @ApiParam(hidden = true) Principal principal,
            @ApiParam("예약시간") Date reserveDt, @ApiParam("템플릿 일련번호(네이버채널만 사용 그 외는 모두 null줄 것)") Long templateSeq)
            throws Exception {

        try {
            // 컴포넌트워크 조회(편집기사워크포함)
            ComponentWorkVO updateValue = deskingService.findComponentWorkBySeq(componentWorkSeq, true);

            // 컴포넌트 예약, 편집기사 예약
            deskingService.reserve(updateValue, principal.getName(), reserveDt, templateSeq);

            // 수정된 결과 재조회
            ComponentWorkVO returnValue = deskingService.findComponentWorkBySeq(componentWorkSeq, true);

            // work를 그대로 리턴
            String message = msg("tps.desking.success.reserve");
            ResultDTO<ComponentWorkVO> resultDto = new ResultDTO<ComponentWorkVO>(returnValue, message);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO RESERVE DESKING]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO RESERVE DESKING]", e, true);
            throw new Exception(msg("tps.desking.error.reserve"), e);
        }
    }

    /**
     * 컴포넌트 예약
     *
     * @param componentWorkSeq 컴포넌트워크 SEQ
     * @param principal        로그인사용자 세션
     * @return 등록된 편집 컴포넌트정보
     * @throws Exception
     */
    @ApiOperation(value = "컴포넌트 예약 삭제")
    @DeleteMapping("/components/reserve/{componentWorkSeq}")
    public ResponseEntity<?> deleteReserveComponentWork(@ApiParam("컴포넌트워크 일련번호(필수)") @PathVariable("componentWorkSeq")
    @Min(value = 0, message = "{tps.desking.error.min.componentWorkSeq}") Long componentWorkSeq, @ApiParam(hidden = true) Principal principal)
            throws Exception {

        try {
            // 컴포넌트워크 조회(편집기사워크포함)
            ComponentWorkVO updateValue = deskingService.findComponentWorkBySeq(componentWorkSeq, true);

            // 컴포넌트 예약, 편집기사 예약
            deskingService.deleteReserve(updateValue);

            // 수정된 결과 재조회
            ComponentWorkVO returnValue = deskingService.findComponentWorkBySeq(componentWorkSeq, true);

            // work를 그대로 리턴
            String message = msg("tps.desking.success.delete-reserve");
            ResultDTO<ComponentWorkVO> resultDto = new ResultDTO<ComponentWorkVO>(returnValue, message);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO RESERVE DESKING]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO RESERVE DESKING]", e, true);
            throw new Exception(msg("tps.desking.error.delete-reserve"), e);
        }
    }

    //    @ApiOperation(value = "컴포넌트 예약 존재여부")
    //    @GetMapping("/components/reserve/{componentWorkSeq}/exists")
    //    public ResponseEntity<?> getExistReserveComponentWork(
    //            @ApiParam("컴포넌트워크 일련번호(필수)") @PathVariable("componentWorkSeq") @Min(value = 0, message = "{tps.desking.error.min.componentWorkSeq}") Long componentWorkSeq,
    //           @ApiParam(hidden=true) Principal principal, Date reserveDt)
    //            throws Exception {
    //
    //        try {
    //            // 컴포넌트워크 조회(편집기사워크포함)
    //            ComponentWorkVO updateValue = deskingService.findComponentWorkBySeq(componentWorkSeq, true);
    //
    //            // 컴포넌트 예약, 편집기사 예약
    //            boolean exist = deskingService.existReserve(updateValue);
    //
    //            String message = "";
    //            if (exist) {
    //                message = messageByLocale.get("tps.desking.success.select.reserve-exist");
    //            }
    //            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(exist, message);
    //            tpsLogger.success(ActionType.SELECT, true);
    //            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    //
    //        } catch (Exception e) {
    //            log.error("[FAIL TO CHECK RESERVE DESKING]", e);
    //            tpsLogger.error(ActionType.SELECT, "[FAIL TO CECHK RESERVE DESKING]", e, true);
    //            throw new Exception(msg("tps.desking.error.reserve-exist"), e);
    //        }
    //    }

    /**
     * 컴포넌트워크 수정
     *
     * @param componentWorkSeq 컴포넌트워크 순번
     * @param componentWorkVO  컴포넌트 정보
     * @param principal        작업자
     * @return 컴포넌트 정보
     * @throws Exception 예외
     */
    @ApiOperation(value = "컴포넌트워크 수정(snapshot수정 안됨. 편집기사워크 수정 안됨 )")
    @PutMapping(value = "/components/{componentWorkSeq}", headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> putComponentWork(@ApiParam("컴포넌트워크 일련번호(필수)") @PathVariable("componentWorkSeq")
    @Min(value = 0, message = "{tps.desking.error.min.componentWorkSeq}") Long componentWorkSeq,
            @ApiParam("컴포넌트워크 정보") @RequestBody @Valid ComponentWorkVO componentWorkVO, @ApiParam(hidden = true) Principal principal)
            throws Exception {

        try {
            // 스냅샷 수정
            deskingService.updateComponentWorkSnapshot(componentWorkSeq, MokaConstants.NO, null, principal.getName());

            // 컴포넌트 워크 저장
            deskingService.updateComponentWork(componentWorkVO, principal.getName());

            // 컴포넌트 워크 조회(편집기사포함)
            ComponentWorkVO returnValue = deskingService.findComponentWorkBySeq(componentWorkSeq, true);

            // 리턴값 설정
            ResultDTO<ComponentWorkVO> resultDto = new ResultDTO<ComponentWorkVO>(returnValue, msg("tps.desking.component.success.work.update"));
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO COMPONENT WORK UPDATE]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO COMPONENT WORK UPDATE]", e, true);
            throw new Exception(msg("tps.desking.component.error.work.update"), e);
        }
    }

    /**
     * 컴포넌트워크 snapshot 수정
     *
     * @param componentWorkSeq 컴포넌트워크 순번
     * @param snapshotYn       템플릿편집여부
     * @param snapshotBody     템플릿
     * @param principal        작업자
     * @return 컴포넌트 정보
     * @throws Exception 예외
     */
    @ApiOperation(value = "컴포넌트워크 snapshot 수정")
    @PutMapping(value = "/components/{componentWorkSeq}/snapshot", headers = {
            "content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> putSnapshotComponentWork(@ApiParam("컴포넌트워크 일련번호(필수)") @PathVariable("componentWorkSeq")
    @Min(value = 0, message = "{tps.desking.error.min.componentWorkSeq}") Long componentWorkSeq,
            @ApiParam("HTML편집 여부") @RequestBody @Valid Map<String, String> snapshot, @ApiParam(hidden = true) Principal principal)
            throws Exception {

        try {
            String snapshotYn = snapshot.get("snapshotYn");
            String snapshotBody = snapshot.get("snapshotBody");

            // 스냅샷 수정
            deskingService.updateComponentWorkSnapshot(componentWorkSeq, snapshotYn, snapshotBody, principal.getName());

            // 컴포넌트 워크 조회(편집기사포함)
            ComponentWorkVO returnValue = deskingService.findComponentWorkBySeq(componentWorkSeq, true);

            // 리턴값 설정
            ResultDTO<ComponentWorkVO> resultDto = new ResultDTO<ComponentWorkVO>(returnValue);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO COMPONENT WORK SNAPSHOT UPDATE]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO COMPONENT WORK SNAPSHOT UPDATE]", e, true);
            throw new Exception(msg("tps.desking.component.error.work.update"), e);
        }
    }

    /**
     * 편집기사워크 추가 (파일업로드 안됨. 멀티추가 가능)
     *
     * @param request          요청
     * @param componentWorkSeq work컴포넌트순번
     * @param datasetSeq       데이타셋순번
     * @param validList        등록할 편집기사 목록
     * @param principal        작업자
     * @return 컴포넌트워크
     * @throws Exception 예외
     */
    @ApiOperation(value = "편집기사워크 추가 (파일업로드 안됨. 멀티추가 가능)")
    @PostMapping(value = "/components/{componentWorkSeq}/contents/{datasetSeq}/list", headers = {
            "content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> postDeskingWorkList(HttpServletRequest request, @ApiParam("컴포넌트워크 일련번호(필수)") @PathVariable("componentWorkSeq")
    @Min(value = 0, message = "{tps.desking.error.min.componentWorkSeq}") Long componentWorkSeq,
            @ApiParam("데이타셋 일련번호(필수)") @PathVariable("datasetSeq") @Min(value = 0, message = "{tps.dataset.error.min.datasetSeq}") Long datasetSeq,
            @ApiParam("편집기사워크 목록") @RequestBody @Valid ValidList<DeskingWorkDTO> validList, @ApiParam(hidden = true) Principal principal)
            throws Exception {
        try {

            List<DeskingWorkDTO> deskingWorkDTOList = validList.getList();

            if (deskingWorkDTOList.size() > 0) {
                // escape
                deskingWorkDTOList
                        .stream()
                        .forEach((dto -> deskingService.escapeHtml(dto)));

                // 스냅샷 수정
                deskingService.updateComponentWorkSnapshot(componentWorkSeq, MokaConstants.NO, null, principal.getName());

                // 편집기사워크 추가 및 정렬
                deskingService.insertDeskingWorkList(deskingWorkDTOList, datasetSeq, principal.getName());

                // 컴포넌트워크 조회(편집기사사포함)
                ComponentWorkVO returnValue = deskingService.findComponentWorkBySeq(componentWorkSeq, true);

                // 리턴값 설정
                ResultDTO<ComponentWorkVO> resultDto = new ResultDTO<ComponentWorkVO>(returnValue);
                return new ResponseEntity<>(resultDto, HttpStatus.OK);
            } else {
                throw new Exception(msg("tps.desking.error.work.insert", request));
            }

        } catch (Exception e) {
            log.error("[FAIL TO DESKING WORK LIST INSERT]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO DESKING WORK LIST INSERT]", e, true);
            throw new Exception(msg("tps.desking.error.work.insert", request), e);
        }
    }

    /**
     * 편집기사워크 삭제 (파일업로드 안됨. 멀티삭제 가능. 관련기사포함 삭제)
     *
     * @param componentWorkSeq 컴포넌트워크아이디(사용안함)
     * @param datasetSeq       데이타셋순번(사용안함)
     * @param validList        삭제할 work편집기사 목록
     * @param principal        작업자
     * @return work컴포넌트
     * @throws Exception 예외
     */
    @ApiOperation(value = "편집기사워크 삭제 (파일업로드 안됨. 멀티삭제 가능. 관련기사포함 삭제)")
    @PostMapping(value = "/components/{componentWorkSeq}/contents/{datasetSeq}/delete", headers = {
            "content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> deleteDeskingWorkList(@ApiParam("컴포넌트워크 일련번호(필수)") @PathVariable("componentWorkSeq")
    @Min(value = 0, message = "{tps.desking.error.min.componentWorkSeq}") Long componentWorkSeq,
            @ApiParam("데이타셋 일련번호(필수)") @PathVariable("datasetSeq") @Min(value = 0, message = "{tps.dataset.error.min.datasetSeq}") Long datasetSeq,
            @ApiParam("삭제할 편집기사워크 목록") @RequestBody @Valid ValidList<DeskingWorkVO> validList, @ApiParam(hidden = true) Principal principal)
            throws Exception {
        try {
            List<DeskingWorkVO> deskingWorkVOList = validList.getList();

            // 스냅샷 수정
            deskingService.updateComponentWorkSnapshot(componentWorkSeq, MokaConstants.NO, null, principal.getName());

            // work 편집기사 삭제 및 정렬
            deskingService.deleteDeskingWorkList(deskingWorkVOList, datasetSeq, principal.getName());

            // 컴포넌트워크 조회(편집기사사포함)
            ComponentWorkVO returnValue = deskingService.findComponentWorkBySeq(componentWorkSeq, true);

            // 리턴값 설정
            ResultDTO<ComponentWorkVO> resultDto = new ResultDTO<ComponentWorkVO>(returnValue);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DESKING WORK LIST DELETE]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO DESKING WORK LIST DELETE]", e, true);
            throw new Exception(msg("tps.desking.error.work.delete"), e);
        }
    }



    /**
     * 편집기사워크 수정(폼데이터)
     *
     * @param deskingWorkDTO   데스킹워크DTO
     * @param componentWorkSeq 컴포넌트워크아이디
     * @param principal        Principal
     * @return 결과
     * @throws InvalidDataException 데이터검증
     * @throws NoDataException      데이터없음
     * @throws Exception            그외 에러
     */
    @ApiOperation(value = "편집기사워크 수정")
    @PutMapping(path = "/components/{componentWorkSeq}/contents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> putDeskingWork(@ApiParam("컴포넌트워크 일련번호(필수)") @PathVariable("componentWorkSeq")
    @Min(value = 0, message = "{tps.desking.error.min.componentWorkSeq}") Long componentWorkSeq,
            @ApiParam("편집기사워크") @Valid DeskingWorkDTO deskingWorkDTO, @ApiParam(hidden = true) Principal principal,
            @ApiParam("편집영역 일련번호(필수)") @RequestParam("areaSeq") @Min(value = 0, message = "{tps.area.error.min.areaSeq}") Long areaSeq)
            throws InvalidDataException, NoDataException, Exception {

        // 데이터 검증
        List<InvalidDataDTO> invalidList = this.validDeskingWorkDTO(deskingWorkDTO);
        if (invalidList.size() > 0) {
            String message = msg("tps.desking.error.invalidContent");
            throw new InvalidDataException(invalidList, message);
        }

        // escape
        deskingService.escapeHtml(deskingWorkDTO);

        // 오리진 데스킹워크 조회
        DeskingWork orgDW = deskingService
                .findDeskingWorkBySeq(deskingWorkDTO.getSeq())
                .orElseThrow(() -> new NoDataException(msg("tps.desking.error.work.noContent")));

        // 오리진을 복사한 new데스킹워크 생성, dto 값 셋팅
        DeskingWork newDW = modelMapper.map(deskingWorkDTO, DeskingWork.class);
        newDW.setRegId(principal.getName());

        // 썸네일 파일 저장
        if (deskingWorkDTO.getThumbnailFile() != null) {
            MultipartFile mfile = deskingWorkDTO.getThumbnailFile();
            String fileName = deskingService.saveDeskingWorkImage(areaSeq, newDW, mfile);
            if (McpString.isNotEmpty(fileName)) {
                tpsLogger.success(ActionType.UPLOAD, true);

                int[] imgInfo = uploadFileHelper.getImgFileSize(mfile);

                // 썸네일 정보 셋팅
                newDW.setThumbFileName(fileName);
                newDW.setThumbSize((int) mfile.getSize());
                newDW.setThumbWidth(imgInfo[0]);
                newDW.setThumbHeight(imgInfo[1]);
            } else {
                String message = msg("tps.desking.error.update.image-upload");
                tpsLogger.fail(message, true);
                throw new InvalidDataException(invalidList, message);
            }
        }

        try {
            // 스냅샷 수정
            deskingService.updateComponentWorkSnapshot(componentWorkSeq, MokaConstants.NO, null, principal.getName());

            deskingService.updateDeskingWork(newDW);

            // 컴포넌트 워크 조회(편집기사포함)
            ComponentWorkVO workVO = deskingService.findComponentWorkBySeq(componentWorkSeq, true);

            ResultDTO<ComponentWorkVO> resultDto = new ResultDTO<ComponentWorkVO>(workVO);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO DESKING WORK UPDATE]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO DESKING WORK UPDATE]", e, true);
            throw new Exception(msg("tps.desking.error.work.save"), e);
        }
    }

    private List<InvalidDataDTO> validDeskingWorkDTO(DeskingWorkDTO workDTO) {
        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (workDTO != null) {

        }

        return invalidList;
    }

    /**
     * <pre>
     * 기사정렬변경
     * </pre>
     *
     * @param request          요청
     * @param componentWorkSeq work컴포넌트순번
     * @param datasetSeq       데이타셋순번
     * @param validList        편집기사목록
     * @param principal        작업자정보
     * @return 변경된 컴포넌트
     * @throws Exception
     */
    @ApiOperation(value = "기사정렬변경")
    @PutMapping(value = "/components/{componentWorkSeq}/contents/{datasetSeq}/sort", headers = {
            "content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> putDeskingWorkListSort(HttpServletRequest request, @ApiParam("컴포넌트워크 일련번호(필수)") @PathVariable("componentWorkSeq")
    @Min(value = 0, message = "{tps.desking.error.min.componentWorkSeq}") Long componentWorkSeq,
            @ApiParam("데이타셋 일련번호(필수)") @PathVariable("datasetSeq") @Min(value = 0, message = "{tps.dataset.error.min.datasetSeq}") Long datasetSeq,
            @ApiParam("정렬된 편집기사워크 목록") @RequestBody @Valid ValidList<DeskingWorkVO> validList, @ApiParam(hidden = true) Principal principal)
            throws Exception {

        try {
            // 데이타유효성검사.
            // validData(request, datasetSeq, workVO);

            List<DeskingWorkVO> deskingWorkVOList = validList.getList();

            // 스냅샷 수정
            deskingService.updateComponentWorkSnapshot(componentWorkSeq, MokaConstants.NO, null, principal.getName());

            // 정렬변경
            deskingService.updateDeskingWorkSort(datasetSeq, deskingWorkVOList, principal.getName());

            // 컴포넌트 워크 조회(편집기사포함)
            ComponentWorkVO workVO = deskingService.findComponentWorkBySeq(componentWorkSeq, true);

            ResultDTO<ComponentWorkVO> resultDto = new ResultDTO<ComponentWorkVO>(workVO);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            throw new Exception(msg("tps.desking.error.priority", request), e);
        }
    }


    //    /**
    //     * 다른사람이 저장했는지 조사
    //     *
    //     * @param request          요청
    //     * @param componentWorkSeq 컴포넌트워크아이디
    //     * @param datasetSeq       데이타셋순번
    //     * @param interval         시간간격(분)
    //     * @param principal        작업자
    //     * @return 작업자명
    //     * @throws Exception
    //     */
    //    @GetMapping(value = "/components/{componentWorkSeq}/contents/{datasetSeq}/hasOtherSaved")
    //    public ResponseEntity<?> hasOtherSaved(HttpServletRequest request,
    //            @ApiParam("컴포넌트워크 일련번호(필수)") @PathVariable("componentWorkSeq") @Min(value = 0, message = "{tps.desking.error.min.componentWorkSeq}") Long componentWorkSeq,
    //            @PathVariable("datasetSeq") @Min(value = 0, message = "{tps.dataset.error.min.datasetSeq}") Long datasetSeq, Integer interval,
    //           @ApiParam(hidden=true) Principal principal)
    //            throws Exception {
    //
    //        try {
    //            // wms_desking만 조회
    //            List<Desking> deskingList = deskingService.hasOtherSaved(datasetSeq, interval.intValue(), principal.getName());
    //
    //            if (deskingList.size() > 0) {
    //                String userName = deskingList.get(0)
    //                                             .getCreator();
    //                return new ResponseEntity<>(new ResultDTO<String>(userName), HttpStatus.OK);
    //            } else {
    //                return new ResponseEntity<>(new ResultDTO<Boolean>(false), HttpStatus.OK);
    //            }
    //
    //        } catch (Exception e) {
    //            throw new Exception(msg("tps.desking.error.hasOtherSaved", request), e);
    //        }
    //    }

    /**
     * work편집기사, 더미기사 추가
     *
     * @param request          요청
     * @param componentWorkSeq work컴포넌트순번
     * @param datasetSeq       데이타셋순번
     * @param deskingWorkDTO   등록할 편집기사
     * @param principal        작업자
     * @return work컴포넌트
     * @throws Exception 예외
     */
    @ApiOperation(value = "더미기사 추가")
    @PostMapping(value = "/components/{componentWorkSeq}/contents/{datasetSeq}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> postDeskingWork(HttpServletRequest request, @ApiParam("컴포넌트워크 일련번호(필수)") @PathVariable("componentWorkSeq")
    @Min(value = 0, message = "{tps.desking.error.min.componentWorkSeq}") Long componentWorkSeq,
            @ApiParam("데이타셋 일련번호(필수)") @PathVariable("datasetSeq") @Min(value = 0, message = "{tps.dataset.error.min.datasetSeq}") Long datasetSeq,
            @ApiParam("편집영역 일련번호(필수)") @RequestParam("areaSeq") @Min(value = 0, message = "{tps.area.error.min.areaSeq}") Long areaSeq,
            @ApiParam("더미기사") @ModelAttribute @Valid DeskingWorkDTO deskingWorkDTO, @ApiParam(hidden = true) Principal principal)
            throws Exception {

        try {
            // 데이터 검증
            List<InvalidDataDTO> invalidList = this.validDeskingWorkDTO(deskingWorkDTO);
            if (invalidList.size() > 0) {
                String message = msg("tps.desking.error.invalidContent");
                throw new InvalidDataException(invalidList, message);
            }

            // 더미기사인지 체크
            if (deskingWorkDTO.getContentType() != null && deskingWorkDTO
                    .getContentType()
                    .equals("D")) {
                // 컨텐츠아이디 생성
                deskingWorkDTO.setContentId("D" + McpDate.dateStr(new Date(), "yyyyMMddHHmmss"));
            }

            // escape
            deskingService.escapeHtml(deskingWorkDTO);

            // 썸네일 파일 저장
            if (deskingWorkDTO.getThumbnailFile() != null) {
                DeskingWork deskingWork = modelMapper.map(deskingWorkDTO, DeskingWork.class);
                MultipartFile mfile = deskingWorkDTO.getThumbnailFile();
                String fileName = deskingService.saveDeskingWorkImage(areaSeq, deskingWork, mfile);
                if (McpString.isNotEmpty(fileName)) {
                    tpsLogger.success(ActionType.UPLOAD, true);
                    int[] imgInfo = uploadFileHelper.getImgFileSize(mfile);

                    // 썸네일 정보 셋팅
                    deskingWorkDTO.setThumbFileName(fileName);
                    deskingWorkDTO.setThumbSize((int) mfile.getSize());
                    deskingWorkDTO.setThumbWidth(imgInfo[0]);
                    deskingWorkDTO.setThumbHeight(imgInfo[1]);
                } else {
                    String message = msg("tps.desking.error.insert.image-upload");
                    tpsLogger.fail(message, true);
                    throw new InvalidDataException(invalidList, message);
                }
            }

            // 스냅샷 수정
            deskingService.updateComponentWorkSnapshot(componentWorkSeq, MokaConstants.NO, null, principal.getName());

            // work편집기사 추가 및 정렬
            List<DeskingWorkDTO> appendList = new ArrayList<>();
            appendList.add(deskingWorkDTO);
            deskingService.insertDeskingWorkList(appendList, datasetSeq, principal.getName());

            // 컴포넌트 워크 조회(편집기사포함)
            ComponentWorkVO workVO = deskingService.findComponentWorkBySeq(componentWorkSeq, true);

            // 리턴값 설정
            ResultDTO<ComponentWorkVO> resultDto = new ResultDTO<ComponentWorkVO>(workVO, msg("tps.desking.success.work.dummy.insert"));
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DESKING WORK DUMMY INSERT]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO DESKING WORK DUMMY INSERT]", e, true);
            throw new Exception(msg("tps.desking.error.work.dummy.insert", request), e);
        }
    }



    /**
     * work편집기사목록 이동(source->target)
     *
     * @param request             요청
     * @param componentWorkSeq    target work컴포넌트순번
     * @param datasetSeq          target 데이타셋순번
     * @param srcComponentWorkSeq source work컴포넌트순번
     * @param srcDatasetSeq       source 데이타셋순번
     * @param validList           이동할 편집기사 목록
     * @param principal           작업자
     * @return target work컴포넌트
     * @throws Exception 예외
     */
    @ApiOperation(value = "work편집기사목록 이동(source->target)")
    @PostMapping(value = "/components/{componentWorkSeq}/contents/{datasetSeq}/move", headers = {
            "content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> postDeskingWorkListMove(HttpServletRequest request, @ApiParam("컴포넌트워크 일련번호(필수)") @PathVariable("componentWorkSeq")
    @Min(value = 0, message = "{tps.desking.error.min.componentWorkSeq}") Long componentWorkSeq,
            @ApiParam("데이타셋 일련번호(필수)") @PathVariable("datasetSeq") @Min(value = 0, message = "{tps.dataset.error.min.datasetSeq}") Long datasetSeq,
            @ApiParam("소스 컴포넌트워크 일련번호(필수)") @Min(value = 0, message = "{tps.desking.error.min.componentWorkSeq}") Long srcComponentWorkSeq,
            @ApiParam("소스 데이타셋 일련번호(필수)") @Min(value = 0, message = "{tps.dataset.error.min.datasetSeq}") Long srcDatasetSeq,
            @ApiParam("이동할 편집기사 목록") @RequestBody @Valid ValidList<DeskingWorkDTO> validList, @ApiParam(hidden = true) Principal principal)
            throws Exception {

        try {
            // valid deskingWorkDTO

            List<DeskingWorkDTO> deskingWorkDTOList = validList.getList();

            if (deskingWorkDTOList.size() > 0) {
                // 스냅샷 수정
                deskingService.updateComponentWorkSnapshot(componentWorkSeq, MokaConstants.NO, null, principal.getName());
                deskingService.updateComponentWorkSnapshot(srcComponentWorkSeq, "N", null, principal.getName());


                // target work편집기사 목록 추가 및 정렬
                for (DeskingWorkDTO appendDeskingWorkDTO : deskingWorkDTOList) {
                    deskingService.moveDeskingWork(appendDeskingWorkDTO, datasetSeq, srcDatasetSeq, principal.getName());
                }

                // source 정렬
                deskingService.deleteDeskingWorkList(null, srcDatasetSeq, principal.getName());

                // work 컴포넌트 조회(편집기사,관련편집기사포함)
                ComponentWorkVO targetWorkVO = deskingService.findComponentWorkBySeq(componentWorkSeq, true);
                ComponentWorkVO sourceWorkVO = deskingService.findComponentWorkBySeq(srcComponentWorkSeq, true);

                // 리턴값 설정
                ResultMapDTO resultMapDTO = new ResultMapDTO(HttpStatus.OK);
                resultMapDTO.addBodyAttribute("target", targetWorkVO);
                resultMapDTO.addBodyAttribute("source", sourceWorkVO);
                tpsLogger.success(true);
                return new ResponseEntity<>(resultMapDTO, HttpStatus.OK);

            } else {
                throw new Exception(msg("tps.desking.error.work.move", request));
            }

        } catch (Exception e) {
            log.error("[FAIL TO DESKING WORK MOVE]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO DESKING WORK MOVE]", e, true);
            throw new Exception(msg("tps.desking.error.work.move", request), e);
        }
    }

    /**
     * 데스킹 히스토리 조회(컴포넌트별)
     *
     * @param componentSeq 컴포넌트 아이디
     * @param search       검색조건
     * @return 결과
     * @throws NoDataException 데이터없음
     * @throws Exception       그외 에러
     */
    @ApiOperation(value = "히스토리 조회(컴포넌트별)")
    @GetMapping("/components/histories/{componentSeq}")
    public ResponseEntity<?> getComponentHistoryList(@ApiParam("컴포넌트 일련번호(필수)") @PathVariable("componentSeq")
    @Min(value = 0, message = "{tps.deskinghist.error.min.componentSeq}") Long componentSeq, @Valid @SearchParam DeskingHistSearchDTO search)
            throws NoDataException, Exception {

        search.setComponentSeq(componentSeq);

        try {
            // 그룹 데이터 조회(mybatis)
            List<ComponentHistVO> returnValue = deskingService.findAllComponentHist(search);

            // 리턴 DTO 생성
            ResultListDTO<ComponentHistVO> resultList = new ResultListDTO<ComponentHistVO>();
            resultList.setList(returnValue);
            resultList.setTotalCnt(search.getTotal());

            ResultDTO<ResultListDTO<ComponentHistVO>> resultDTO = new ResultDTO<ResultListDTO<ComponentHistVO>>(resultList);
            tpsLogger.success(true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO LOAD DESKING HIST ]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD DESKING HIST]", e, true);
            throw new Exception(msg("tps.desking.error.hist"), e);
        }
    }

    /**
     * 데스킹 히스토리 상세조회
     *
     * @param componentHistSeq 컴포넌트 히스토리 아이디
     * @return 결과(기사목록)
     * @throws Exception 에러처리
     */
    @ApiOperation(value = "히스토리 상세조회")
    @GetMapping("/histories/{componentHistSeq}")
    public ResponseEntity<?> getDeskingHistory(@ApiParam("컴포넌트 히스토리 일련번호(필수)") @PathVariable("componentHistSeq")
    @Min(value = 0, message = "{tps.deskinghist.error.min.componentHistSeq}") Long componentHistSeq)
            throws Exception {

        try {
            // 데스킹 기사목록 조회
            List<DeskingHist> returnValue = deskingService.findAllDeskingHist(componentHistSeq);

            // 리턴 DTO 생성
            ResultListDTO<DeskingHistDTO> resultListMessage = new ResultListDTO<>();
            List<DeskingHistDTO> dtoList = modelMapper.map(returnValue, DeskingHistDTO.TYPE);
            resultListMessage.setTotalCnt(returnValue.size());
            resultListMessage.setList(dtoList);

            ResultDTO<ResultListDTO<DeskingHistDTO>> resultDto = new ResultDTO<>(resultListMessage);
            tpsLogger.success(ActionType.SELECT);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO LOAD DESKING HIST DEAIL ]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD DESKING HIST DEAIL]", e, true);
            throw new Exception(msg("tps.desking.error.hist"), e);
        }
    }

    /**
     * 히스토리를 편집기사 워크로 등록 (파일업로드 안됨)
     *
     * @param componentWorkSeq 컴포넌트워크 아이디
     * @param componentHistSeq 컴포넌트 히스토리 아이디
     * @return 결과
     * @throws NoDataException 데이터없음
     * @throws Exception       그외 에러
     */
    @ApiOperation(value = "히스토리 불러오기")
    @PutMapping("/components/{componentWorkSeq}/history/{componentHistSeq}")
    public ResponseEntity<?> putDeskingWorkHistory(@ApiParam("컴포넌트워크 일련번호(필수)") @PathVariable("componentWorkSeq")
    @Min(value = 0, message = "{tps.deskinghist.error.min.componentWorkSeq}") Long componentWorkSeq,
            @ApiParam("컴포넌트 히스토리 일련번호(필수)") @PathVariable("componentHistSeq")
            @Min(value = 0, message = "{tps.deskinghist.error.min.componentHistSeq}") Long componentHistSeq,
            @ApiParam("템플릿수정여부(네이버채널은 Y, 그 외는 N 할 것)") String updateTemplateYn, @ApiParam(hidden = true) Principal principal)
            throws NoDataException, Exception {

        try {
            deskingService.importDeskingWorkHistory(componentWorkSeq, componentHistSeq, principal.getName(), updateTemplateYn);

            // 컴포넌트 워크 조회(편집기사포함)
            ComponentWorkVO returnValue = deskingService.findComponentWorkBySeq(componentWorkSeq, true);

            // 리턴값 설정
            ResultDTO<ComponentWorkVO> resultDto = new ResultDTO<ComponentWorkVO>(returnValue, msg("tps.deskinghist.success.work.update"));
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO IMPORT DESKING HIST ]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO IMPORT DESKING HIST]", e, true);
            throw new Exception(msg("tps.deskinghist.error.work.update"), e);
        }
    }

    @ApiOperation(value = "단일 컴포넌트워크 템플릿 조회")
    @GetMapping("/components/{componentSeq}/template")
    public ResponseEntity<?> getTemplate(@ApiParam("컴포넌트 일련번호(필수)") @PathVariable("componentSeq")
    @Min(value = 0, message = "{tps.component.error.min.componentSeq}") Long componentSeq) {

        TemplateVO returnValue = templateService.findTemplateByComponentHist(componentSeq);

        // 리턴값 설정
        ResultDTO<TemplateVO> resultDto = new ResultDTO<TemplateVO>(returnValue);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    @ApiOperation(value = "단일 컴포넌트워크 템플릿 수정")
    @PutMapping("/components/{componentWorkSeq}/template/{templateSeq}")
    public ResponseEntity<?> putTemplateComponentWork(@ApiParam("컴포넌트워크 일련번호(필수)") @PathVariable("componentWorkSeq")
    @Min(value = 0, message = "{tps.desking.error.min.componentWorkSeq}") Long componentWorkSeq,
            @ApiParam("템플릿 일련번호(필수)") @PathVariable("templateSeq") @Min(value = 0, message = "{tps.template.error.min.templateSeq}") Long templateSeq,
            @ApiParam(hidden = true) Principal principal)
            throws Exception {

        try {
            // 템플릿 수정
            deskingService.updateComponentWorkTemplate(componentWorkSeq, templateSeq, principal.getName());

            // 컴포넌트 워크 조회(편집기사포함)
            ComponentWorkVO returnValue = deskingService.findComponentWorkBySeq(componentWorkSeq, true);

            // 리턴값 설정
            ResultDTO<ComponentWorkVO> resultDto = new ResultDTO<ComponentWorkVO>(returnValue);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO COMPONENT WORK TEMPLATE UPDATE]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO COMPONENT WORK TEMPLATE UPDATE]", e, true);
            throw new Exception(msg("tps.desking.component.error.work.update"), e);
        }
    }

}
