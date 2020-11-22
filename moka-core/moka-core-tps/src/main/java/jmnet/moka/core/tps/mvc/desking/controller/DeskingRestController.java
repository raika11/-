package jmnet.moka.core.tps.mvc.desking.controller;

import io.swagger.annotations.ApiOperation;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultMapDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.dto.InvalidDataDTO;
import jmnet.moka.core.tps.common.dto.ValidList;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.helper.UploadFileHelper;
import jmnet.moka.core.tps.mvc.area.dto.AreaDTO;
import jmnet.moka.core.tps.mvc.area.entity.Area;
import jmnet.moka.core.tps.mvc.area.service.AreaService;
import jmnet.moka.core.tps.mvc.desking.dto.DeskingWorkDTO;
import jmnet.moka.core.tps.mvc.desking.dto.DeskingWorkSearchDTO;
import jmnet.moka.core.tps.mvc.desking.entity.DeskingWork;
import jmnet.moka.core.tps.mvc.desking.service.DeskingService;
import jmnet.moka.core.tps.mvc.desking.vo.ComponentWorkVO;
import jmnet.moka.core.tps.mvc.desking.vo.DeskingWorkVO;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;

@Controller
@Validated
@Slf4j
@RequestMapping("/api/desking")
public class DeskingRestController {

    @Autowired
    private DeskingService deskingService;

    @Autowired
    private AreaService areaService;

    @Autowired
    private UploadFileHelper uploadFileHelper;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private MessageByLocale messageByLocale;

    @Autowired
    private TpsLogger tpsLogger;

    /**
     * 편집영역의 모든 Work 초기화 및 컴포넌트Work 목록 조회
     *
     * @param areaSeq   편집영역순번
     * @param principal 로그인 사용자 세션
     * @return Work 컴포넌트목록
     * @throws Exception 예외
     */
    @ApiOperation(value = "편집영역의 모든 Work 초기화 및 컴포넌트Work 목록 조회")
    @GetMapping("/{areaSeq}")
    public ResponseEntity<?> getComponentWorkList(@PathVariable("areaSeq") @Min(value = 0, message = "{tps.area.error.min.areaSeq}") Long areaSeq,
            Principal principal)
            throws Exception {

        try {
            DeskingWorkSearchDTO search = DeskingWorkSearchDTO.builder()
                                                              .areaSeq(areaSeq)
                                                              .regId(principal.getName())
                                                              .build();
            search.setReturnValue(TpsConstants.PROCEDURE_SUCCESS);

            // work조회 : 임시저장(deskingWork)된 것을 조회
            List<ComponentWorkVO> returnValue = deskingService.findAllComponentWork(search);

            // area
            Area area = areaService.findAreaBySeq(areaSeq)
                                   .orElseThrow(() -> {
                                       String message = messageByLocale.get("tps.common.error.no-data");
                                       tpsLogger.fail(message, true);
                                       return new NoDataException(message);
                                   });

            AreaDTO areaDto = modelMapper.map(area, AreaDTO.class);

            ResultMapDTO resultMapDTO = new ResultMapDTO(HttpStatus.OK);
            resultMapDTO.addBodyAttribute("desking", returnValue);
            resultMapDTO.addBodyAttribute("area", areaDto);
            tpsLogger.success(true);
            return new ResponseEntity<>(resultMapDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO LOAD COMPONENT WORK LIST]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD COMPONENT WORK LIST]", e, true);
            throw new Exception(messageByLocale.get("tps.desking.error.work.init"), e);
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
    @ApiOperation(value = "단일 컴포넌트Work 조회")
    @GetMapping("/components/{componentWorkSeq}")
    public ResponseEntity<?> getComponentWork(
            @PathVariable("componentWorkSeq") @Min(value = 0, message = "{tps.desking.error.min.componentWorkSeq}") Long componentWorkSeq) {

        // work조회
        ComponentWorkVO returnValue = deskingService.findComponentWorkBySeq(componentWorkSeq, true);

        // 리턴값 설정
        ResultDTO<ComponentWorkVO> resultDto = new ResultDTO<ComponentWorkVO>(returnValue);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 컴포넌트 임시저장
     *
     * @param componentWorkSeq  컴포넌트work SEQ
     * @param principal         로그인사용자 세션
     * @return                  등록된 편집 컴포넌트정보
     * @throws Exception
     */
    @ApiOperation(value = "컴포넌트 임시저장")
    @PostMapping("/components/save/{componentWorkSeq}")
    public ResponseEntity<?> postSaveComponentWork(
            @PathVariable("componentWorkSeq") @Min(value = 0, message = "{tps.desking.error.min.componentWorkSeq}") Long componentWorkSeq,
            Principal principal)
            throws Exception {

        try {
            // 컴포넌트work 조회(편집기사work포함)
            ComponentWorkVO returnValue = deskingService.findComponentWorkBySeq(componentWorkSeq, true);

            // 컴포넌트 저장, 편집기사 저장
            deskingService.save(returnValue, principal.getName());

            // work를 그대로 리턴
            String message = messageByLocale.get("tps.desking.success.save");
            ResultDTO<ComponentWorkVO> resultDto = new ResultDTO<ComponentWorkVO>(returnValue, message);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            throw new Exception(messageByLocale.get("tps.desking.error.save"), e);
        }
    }

    /**
     * 컴포넌트 전송
     *
     * @param componentWorkSeq 워크아이디
     * @param principal        로그인사용자 세션
     * @return 등록된 편집 컴포넌트정보
     * @throws Exception
     */
    @ApiOperation(value = "컴포넌트 전송")
    @PostMapping("/components/publish/{componentWorkSeq}")
    public ResponseEntity<?> postPublishComponentWork(
            @PathVariable("componentWorkSeq") @Min(value = 0, message = "{tps.desking.error.min.componentWorkSeq}") Long componentWorkSeq,
            Principal principal)
            throws Exception {

        try {
            // 컴포넌트work 조회(편집기사work포함)
            ComponentWorkVO returnValue = deskingService.findComponentWorkBySeq(componentWorkSeq, true);

            // 컴포넌트 저장, 편집기사 저장
            deskingService.publish(returnValue, principal.getName());

            // work를 그대로 리턴
            String message = messageByLocale.get("tps.desking.success.publish");
            ResultDTO<ComponentWorkVO> resultDto = new ResultDTO<ComponentWorkVO>(returnValue, message);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            throw new Exception(messageByLocale.get("tps.desking.error.publish"), e);
        }
    }

    /**
     * 컴포넌트 예약
     *
     * @param componentWorkSeq  컴포넌트work SEQ
     * @param principal         로그인사용자 세션
     * @param reserveDt         예약시간
     * @return                  등록된 편집 컴포넌트정보
     * @throws Exception
     */
    @ApiOperation(value = "컴포넌트 예약")
    @PostMapping("/components/reserve/{componentWorkSeq}")
    public ResponseEntity<?> postReserveComponentWork(
            @PathVariable("componentWorkSeq") @Min(value = 0, message = "{tps.desking.error.min.componentWorkSeq}") Long componentWorkSeq,
            Principal principal, Date reserveDt)
            throws Exception {

        try {
            // 컴포넌트work 조회(편집기사work포함)
            ComponentWorkVO returnValue = deskingService.findComponentWorkBySeq(componentWorkSeq, true);

            // 컴포넌트 예약, 편집기사 예약
            deskingService.reserve(returnValue, principal.getName(), reserveDt);

            // work를 그대로 리턴
            String message = messageByLocale.get("tps.desking.success.reserve");
            ResultDTO<ComponentWorkVO> resultDto = new ResultDTO<ComponentWorkVO>(returnValue, message);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            throw new Exception(messageByLocale.get("tps.desking.error.reserve"), e);
        }
    }

    /**
     * 컴포넌트work 수정
     *
     * @param componentWorkSeq  컴포넌트work 순번
     * @param componentWorkVO   컴포넌트 정보
     * @param principal         작업자
     * @return 컴포넌트 정보
     * @throws Exception 예외
     */
    @ApiOperation(value = "컴포넌트work 수정(편집기사work 수정 제외. snapshot제외)")
    @PutMapping(value = "/components/{componentWorkSeq}", headers = {
            "content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> putComponentWork(
            @PathVariable("componentWorkSeq") @Min(value = 0, message = "{tps.desking.error.min.componentWorkSeq}") Long componentWorkSeq,
            @RequestBody @Valid ComponentWorkVO componentWorkVO, Principal principal)
            throws Exception {

        try {
            // 컴포넌트 워크 저장
            deskingService.updateComponentWork(componentWorkVO, principal.getName());

            // 컴포넌트 워크 조회(편집기사포함)
            ComponentWorkVO returnValue = deskingService.findComponentWorkBySeq(componentWorkSeq, true);

            // 리턴값 설정
            ResultDTO<ComponentWorkVO> resultDto = new ResultDTO<ComponentWorkVO>(returnValue);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            throw new Exception(messageByLocale.get("tps.desking.component.error.work.update"), e);
        }
    }

    /**
     * 컴포넌트work snapshot 수정
     *
     * @param componentWorkSeq  컴포넌트work 순번
     * @param snapshotYn        템플릿편집여부
     * @param snapshotBody      템플릿
     * @param principal         작업자
     * @return 컴포넌트 정보
     * @throws Exception 예외
     */
    @ApiOperation(value = "컴포넌트work snapshot 수정")
    @PutMapping("/components/{componentWorkSeq}/snapshot")
    public ResponseEntity<?> putSnapshotComponentWork(
            @PathVariable("componentWorkSeq") @Min(value = 0, message = "{tps.desking.error.min.componentWorkSeq}") Long componentWorkSeq,
            String snapshotYn, String snapshotBody, Principal principal)
            throws Exception {

        try {
            // 스냅샷 수정
            deskingService.updateComponentWorkSnapshot(componentWorkSeq, snapshotYn, snapshotBody, principal.getName());

            // 컴포넌트 워크 조회(편집기사포함)
            ComponentWorkVO returnValue = deskingService.findComponentWorkBySeq(componentWorkSeq, true);

            // 리턴값 설정
            ResultDTO<ComponentWorkVO> resultDto = new ResultDTO<ComponentWorkVO>(returnValue);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            throw new Exception(messageByLocale.get("tps.desking.component.error.work.update"), e);
        }
    }

    /**
     * 편집기사work 추가 (파일업로드 안됨. 멀티추가 가능)
     *
     * @param request          요청
     * @param componentWorkSeq work컴포넌트순번
     * @param datasetSeq       데이타셋순번
     * @param validList        등록할 편집기사 목록
     * @param principal        작업자
     * @return 컴포넌트work
     * @throws Exception 예외
     */
    @ApiOperation(value = "편집기사work 추가 (파일업로드 안됨. 멀티추가 가능)")
    @PostMapping(value = "/components/{componentWorkSeq}/contents/{datasetSeq}/list", headers = {
            "content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> postDeskingWorkList(HttpServletRequest request,
            @PathVariable("componentWorkSeq") @Min(value = 0, message = "{tps.desking.error.min.componentWorkSeq}") Long componentWorkSeq,
            @PathVariable("datasetSeq") @Min(value = 0, message = "{tps.dataset.error.invalid.datasetSeq}") Long datasetSeq,
            @RequestBody @Valid ValidList<DeskingWorkDTO> validList, Principal principal)
            throws Exception {
        try {

            List<DeskingWorkDTO> deskingWorkDTOList = validList.getList();

            if (deskingWorkDTOList.size() > 0) {
                // 스냅샷 수정
                deskingService.updateComponentWorkSnapshot(componentWorkSeq, "N", null, principal.getName());

                // 편집기사work 추가 및 정렬
                for (DeskingWorkDTO appendDeskingWorkDTO : deskingWorkDTOList) {
                    DeskingWork appendDeskingWork = modelMapper.map(appendDeskingWorkDTO, DeskingWork.class);
                    deskingService.insertDeskingWork(appendDeskingWork, datasetSeq, principal.getName());
                }

                // 컴포넌트work 조회(편집기사사포함)
                ComponentWorkVO returnValue = deskingService.findComponentWorkBySeq(componentWorkSeq, true);

                // 리턴값 설정
                ResultDTO<ComponentWorkVO> resultDto = new ResultDTO<ComponentWorkVO>(returnValue);
                return new ResponseEntity<>(resultDto, HttpStatus.OK);
            } else {
                throw new Exception(messageByLocale.get("tps.desking.error.work.insert", request));
            }

        } catch (Exception e) {
            throw new Exception(messageByLocale.get("tps.desking.error.work.insert", request), e);
        }
    }

    /**
     * 편집기사work 삭제 (파일업로드 안됨. 멀티삭제 가능. 관련기사포함 삭제)
     *
     * @param componentWorkSeq 컴포넌트워크아이디(사용안함)
     * @param datasetSeq       데이타셋순번(사용안함)
     * @param validList        삭제할 work편집기사 목록
     * @param principal        작업자
     * @return work컴포넌트
     * @throws Exception 예외
     */
    @ApiOperation(value = "편집기사work 삭제 (파일업로드 안됨. 멀티삭제 가능. 관련기사포함 삭제)")
    @PostMapping(value = "/components/{componentWorkSeq}/contents/{datasetSeq}/delete", headers = {
            "content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> deleteDeskingWorkList(
            @PathVariable("componentWorkSeq") @Min(value = 0, message = "{tps.desking.error.min.componentWorkSeq}") Long componentWorkSeq,
            @PathVariable("datasetSeq") @Min(value = 0, message = "{tps.dataset.error.invalid.datasetSeq}") Long datasetSeq,
            @RequestBody @Valid ValidList<DeskingWorkVO> validList, Principal principal)
            throws Exception {
        try {
            List<DeskingWorkVO> deskingWorkVOList = validList.getList();

            // 스냅샷 수정
            deskingService.updateComponentWorkSnapshot(componentWorkSeq, "N", null, principal.getName());

            // work 편집기사 삭제 및 정렬
            deskingService.deleteDeskingWorkList(deskingWorkVOList, datasetSeq, principal.getName());

            // 컴포넌트work 조회(편집기사사포함)
            ComponentWorkVO returnValue = deskingService.findComponentWorkBySeq(componentWorkSeq, true);

            // 리턴값 설정
            ResultDTO<ComponentWorkVO> resultDto = new ResultDTO<ComponentWorkVO>(returnValue);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            throw new Exception(messageByLocale.get("tps.desking.error.work.delete"), e);
        }
    }
























    /**
     * 편집기사work 수정(폼데이터)
     *
     * @param deskingWorkDTO   데스킹워크DTO
     * @param componentWorkSeq 컴포넌트워크아이디
     * @param principal        Principal
     * @return 결과
     * @throws InvalidDataException 데이터검증
     * @throws NoDataException      데이터없음
     * @throws Exception            그외 에러
     */
    @ApiOperation(value = "편집기사work 수정")
    @PutMapping("/components/{componentWorkSeq}/contents")
    public ResponseEntity<?> putDeskingWork(@Valid DeskingWorkDTO deskingWorkDTO, Principal principal,
            @PathVariable("componentWorkSeq") Long componentWorkSeq)
            throws InvalidDataException, NoDataException, Exception {

        // 데이터 검증
        List<InvalidDataDTO> invalidList = this.validDeskingWorkDTO(deskingWorkDTO);
        if (invalidList.size() > 0) {
            String message = messageByLocale.get("tps.desking.error.invalidContent");
            throw new InvalidDataException(invalidList, message);
        }

        // 오리진 데스킹워크 조회
        DeskingWork orgDW = deskingService.findDeskingWorkBySeq(deskingWorkDTO.getSeq())
                                          .orElseThrow(() -> new NoDataException(messageByLocale.get("tps.desking.error.work.noContent")));

        // 오리진을 복사한 new데스킹워크 생성, dto 값 셋팅
        DeskingWork newDW = modelMapper.map(deskingWorkDTO, DeskingWork.class);
        newDW.setRegId(principal.getName());
//        newDW.setDeskingSeq(orgDW.getDeskingSeq());
//        newDW.setDatasetSeq(orgDW.getDatasetSeq());
        //        DeskingWork newDW = (DeskingWork) orgDW.clone();
        //        newDW.setTotalId(deskingWorkDTO.getTotalId());
        //        newDW.setContentsAttr(deskingWorkDTO.getContentsAttr());
        //        newDW.setNameplate(deskingWorkDTO.getNameplate());
        //        newDW.setTitle(deskingWorkDTO.getTitle());
        //        newDW.setMobileTitle(deskingWorkDTO.getMobileTitle());
        //        newDW.setSubtitle(deskingWorkDTO.getSubtitle());
        //        newDW.setLinkUrl(deskingWorkDTO.getLinkUrl());
        //        newDW.setLinkTarget(deskingWorkDTO.getLinkTarget());
        //        newDW.setMoreUrl(deskingWorkDTO.getMoreUrl());
        //        newDW.setMoreTarget(deskingWorkDTO.getMoreTarget());
        //        newDW.setBodyHead(deskingWorkDTO.getBodyHead());

        // 썸네일 파일 저장
        if (deskingWorkDTO.getThumbnailFile() != null) {
            MultipartFile mfile = deskingWorkDTO.getThumbnailFile();
            String fileName = deskingService.saveDeskingWorkImage(newDW, mfile);
            int[] imgInfo = uploadFileHelper.getImgFileSize(mfile);

            // 썸네일 정보 셋팅
            newDW.setThumbFileName(fileName);
            newDW.setThumbSize((int) mfile.getSize());
            newDW.setThumbWidth(imgInfo[0]);
            newDW.setThumbHeight(imgInfo[1]);
        }

        try {
            // 스냅샷 수정
            deskingService.updateComponentWorkSnapshot(componentWorkSeq, "N", null, principal.getName());

            deskingService.updateDeskingWork(newDW);

            // 컴포넌트 워크 조회(편집기사포함)
            ComponentWorkVO workVO = deskingService.findComponentWorkBySeq(componentWorkSeq, true);

            ResultDTO<ComponentWorkVO> resultDto = new ResultDTO<ComponentWorkVO>(workVO);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            throw new Exception(messageByLocale.get("tps.desking.error.work.save"), e);
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
     * @param workVO           작업컴포넌트
     * @param principal        작업자정보
     * @return 변경된 컴포넌트
     * @throws Exception
     */
    @ApiOperation(value = "기사정렬변경")
    @PutMapping(value = "/components/{componentWorkSeq}/contents/{datasetSeq}/priority", headers = {
            "content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> putDeskingWorkPriority(HttpServletRequest request,
            @PathVariable("componentWorkSeq") @Min(value = 0, message = "{tps.desking.error.min.componentWorkSeq}") Long componentWorkSeq,
            @PathVariable("datasetSeq") @Min(value = 0, message = "{tps.dataset.error.invalid.datasetSeq}") Long datasetSeq,
            @RequestBody @Valid ComponentWorkVO workVO, Principal principal)
            throws Exception {

        try {
            // 데이타유효성검사.
            // validData(request, datasetSeq, workVO);

            DeskingWorkSearchDTO search = DeskingWorkSearchDTO.builder()
                                                              .componentSeq(workVO.getComponentSeq())
                                                              .regId(principal.getName())
                                                              .datasetSeq(workVO.getDatasetSeq())
                                                              //                                                              .editionSeq(workVO.getEditionSeq())
                                                              .build();

            // 스냅샷 수정
            deskingService.updateComponentWorkSnapshot(componentWorkSeq, "N", null, principal.getName());

            // 정렬변경
            List<DeskingWorkVO> deskingList =
                    deskingService.updateDeskingWorkPriority(datasetSeq, workVO.getDeskingWorks(), principal.getName(), search);

            workVO.getDeskingWorks()
                  .clear();
            workVO.setDeskingWorks(deskingList);


            // 리턴값 설정
            ResultDTO<ComponentWorkVO> resultDto = new ResultDTO<ComponentWorkVO>(workVO);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            throw new Exception(messageByLocale.get("tps.desking.error.priority", request), e);
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
    //            @PathVariable("componentWorkSeq") @Min(value = 0, message = "{tps.desking.error.min.componentWorkSeq}") Long componentWorkSeq,
    //            @PathVariable("datasetSeq") @Min(value = 0, message = "{tps.dataset.error.invalid.datasetSeq}") Long datasetSeq, Integer interval,
    //            Principal principal)
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
    //            throw new Exception(messageByLocale.get("tps.desking.error.hasOtherSaved", request), e);
    //        }
    //    }
    //
    //    /**
    //     * work편집기사, 더미기사 추가
    //     *
    //     * @param request          요청
    //     * @param componentWorkSeq work컴포넌트순번
    //     * @param datasetSeq       데이타셋순번
    //     * @param deskingWorkDTO   등록할 편집기사
    //     * @param principal        작업자
    //     * @return work컴포넌트
    //     * @throws Exception 예외
    //     */
    //    @PostMapping(value = "/components/{componentWorkSeq}/contents/{datasetSeq}")
    //    public ResponseEntity<?> postDeskingWork(HttpServletRequest request,
    //            @PathVariable("componentWorkSeq") @Min(value = 0, message = "{tps.desking.error.min.componentWorkSeq}") Long componentWorkSeq,
    //            @PathVariable("datasetSeq") @Min(value = 0, message = "{tps.dataset.error.invalid.datasetSeq}") Long datasetSeq,
    //            @ModelAttribute @Valid DeskingWorkDTO deskingWorkDTO, Principal principal)
    //            throws Exception {
    //
    //        try {
    //            // valid deskingWorkDTO
    //
    //            // 더미기사인지 체크
    //            if (deskingWorkDTO.getContentsAttr() != null && deskingWorkDTO.getContentsAttr()
    //                                                                          .equals("D")) {
    //                // 컨텐츠아이디 생성
    //                deskingWorkDTO.setContentsId("D" + McpDate.nowStr());
    //                deskingWorkDTO.setDistYmdt(null);
    //            }
    //
    //            DeskingWork deskingWork = modelMapper.map(deskingWorkDTO, DeskingWork.class);
    //
    //            // 썸네일 파일 저장
    //            if (deskingWorkDTO.getThumbnailFile() != null) {
    //                MultipartFile mfile = deskingWorkDTO.getThumbnailFile();
    //                String fileName = deskingService.saveDeskingWorkImage(deskingWork, mfile);
    //                int[] imgInfo = uploadFileHelper.getImgFileSize(mfile);
    //
    //                // 썸네일 정보 셋팅
    //                deskingWork.setThumbnailFileName(fileName);
    //                deskingWork.setThumbnailSize((int) mfile.getSize());
    //                deskingWork.setThumbnailWidth(imgInfo[0]);
    //                deskingWork.setThumbnailHeight(imgInfo[1]);
    //            }
    //
    //            // 스냅샷 수정
    //            deskingService.updateComponentWorkSnapshot(componentWorkSeq, "N", null, principal.getName());
    //
    //            // work편집기사 추가 및 정렬
    //            deskingService.insertDeskingWork(deskingWork, datasetSeq, 0L, principal.getName());
    //
    //            // work 컴포넌트 조회(편집기사,관련편집기사포함)
    //            DeskingComponentWorkVO workVO = deskingService.getComponentWork(componentWorkSeq);
    //
    //            // 리턴값 설정
    //            ResultDTO<DeskingComponentWorkVO> resultDto = new ResultDTO<DeskingComponentWorkVO>(workVO);
    //            return new ResponseEntity<>(resultDto, HttpStatus.OK);
    //
    //        } catch (Exception e) {
    //            throw new Exception(messageByLocale.get("tps.desking.error.work.insert", request), e);
    //        }
    //    }



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
    public ResponseEntity<?> moveDeskingWorkList(HttpServletRequest request,
            @PathVariable("componentWorkSeq") @Min(value = 0, message = "{tps.desking.error.min.componentWorkSeq}") Long componentWorkSeq,
            @PathVariable("datasetSeq") @Min(value = 0, message = "{tps.dataset.error.invalid.datasetSeq}") Long datasetSeq,
            @Min(value = 0, message = "{tps.desking.error.min.componentWorkSeq}") Long srcComponentWorkSeq,
            @Min(value = 0, message = "{tps.dataset.error.invalid.datasetSeq}") Long srcDatasetSeq,
            @RequestBody @Valid ValidList<DeskingWorkDTO> validList, Principal principal)
            throws Exception {

        try {
            // valid deskingWorkDTO

            List<DeskingWorkDTO> deskingWorkDTOList = validList.getList();

            if (deskingWorkDTOList.size() > 0) {
                // 스냅샷 수정
                deskingService.updateComponentWorkSnapshot(componentWorkSeq, "N", null, principal.getName());
                deskingService.updateComponentWorkSnapshot(srcComponentWorkSeq, "N", null, principal.getName());

                // target work편집기사 목록 추가 및 정렬
                for (DeskingWorkDTO appendDeskingWorkDTO : deskingWorkDTOList) {
                    DeskingWork appendDeskingWork = modelMapper.map(appendDeskingWorkDTO, DeskingWork.class);
                    deskingService.moveDeskingWork(appendDeskingWork, datasetSeq, srcDatasetSeq, 0L, principal.getName());
                }

                // source 정렬
                List<Long> deleteList = deskingWorkDTOList.stream()
                                                          .map(DeskingWorkDTO::getSeq)
                                                          .collect(Collectors.toList());
                deskingService.sortBeforeDeleteDeskingWork(deleteList, srcDatasetSeq, principal.getName());

                // work 컴포넌트 조회(편집기사,관련편집기사포함)
                ComponentWorkVO workVO = deskingService.findComponentWorkBySeq(componentWorkSeq, true);

                // 리턴값 설정
                ResultDTO<ComponentWorkVO> resultDto = new ResultDTO<ComponentWorkVO>(workVO);
                return new ResponseEntity<>(resultDto, HttpStatus.OK);
            } else {
                throw new Exception(messageByLocale.get("tps.desking.error.work.move", request));
            }

        } catch (Exception e) {
            throw new Exception(messageByLocale.get("tps.desking.error.work.move", request), e);
        }
    }

    //    /**
    //     * DeskingRelWorks (관련기사 워크) 저장
    //     *
    //     * @param request          HTTP요청
    //     * @param validList        DeskingRelWorkDTO 리스트
    //     * @param principal        Principal
    //     * @param componentWorkSeq 컴포넌트워크아이디
    //     * @param contentsId       대표기사 아이디
    //     * @return 결과
    //     * @throws NoDataException 데이터없음
    //     * @throws Exception       에러 처리
    //     */
    //    @PutMapping("/components/{componentWorkSeq}/contents/{datasetSeq}/{contentsId}/relations")
    //    public ResponseEntity<?> updateDeskingRelWorks(HttpServletRequest request, @RequestBody @Valid ValidList<DeskingRelWorkDTO> validList,
    //            @PathVariable("componentWorkSeq") Long componentWorkSeq, @PathVariable("contentsId") String contentsId, Principal principal)
    //            throws NoDataException, Exception {
    //
    //        String noDataMessage = messageByLocale.get("tps.desking.error.noComponentInfo");
    //
    //        // 데스킹워크 seq를 찾기 위해서 데스킹컴포넌트워크의 데스킹워크리스트에서 contentsId로 데스킹워크를 찾음
    //        DeskingComponentWorkVO resultWorkVO = deskingService.getComponentWork(componentWorkSeq);
    //
    //        if (resultWorkVO == null) {
    //            throw new NoDataException(noDataMessage);
    //        }
    //        Optional<DeskingWorkVO> maybeWorkVO = resultWorkVO.getDeskingWorks()
    //                                                          .stream()
    //                                                          .filter(deskingWork -> {
    //                                                              return deskingWork.getContentsId()
    //                                                                                .equals(contentsId);
    //                                                          })
    //                                                          .findFirst();
    //
    //        DeskingWorkVO workVO = maybeWorkVO.orElseThrow(() -> new NoDataException(noDataMessage));
    //
    //        try {
    //            String nowStr = McpDate.nowStr();
    //            List<DeskingRelWorkDTO> dtoList = validList.getList();
    //            List<DeskingRelWork> relWorks = modelMapper.map(dtoList, DeskingRelWork.TYPE);
    //            ResultListDTO<DeskingRelWork> resultList = new ResultListDTO<DeskingRelWork>();
    //
    //            if (relWorks.size() > 0) {
    //                for (DeskingRelWork relWork : relWorks) {
    //                    relWork.setCreator(principal.getName());
    //                    relWork.setCreateYmdt(nowStr);
    //                }
    //            }
    //
    //            // 스냅샷 수정
    //            deskingService.updateComponentWorkSnapshot(componentWorkSeq, "N", null, principal.getName());
    //
    //            // 새로운 릴레이션 저장
    //            List<DeskingRelWork> result = deskingService.updateDeskingRelWorks(workVO.getDeskingSeq(), principal.getName(), relWorks);
    //            resultList.setList(result);
    //            resultList.setTotalCnt(result.size());
    //
    //            ResultDTO<ResultListDTO<DeskingRelWork>> resultDto = new ResultDTO<ResultListDTO<DeskingRelWork>>(resultList);
    //
    //            return new ResponseEntity<>(resultDto, HttpStatus.OK);
    //        } catch (Exception e) {
    //            throw new Exception(messageByLocale.get("tps.desking.error.work.relation.save", request), e);
    //        }
    //    }
    //
    //    /**
    //     * DeskingRelWorks (관련기사 워크) 삭제
    //     *
    //     * @param request   HTTP요청
    //     * @param drwDTO    DeskingRelWorkDTO
    //     * @param principal Principal
    //     * @return 결과
    //     * @throws Exception 에러 처리
    //     */
    //    @DeleteMapping("/components/{componentWorkSeq}/contents/{datasetSeq}/{contentsId}/relations")
    //    public ResponseEntity<?> deleteDeskingRelWork(HttpServletRequest request, @PathVariable("componentWorkSeq") Long componentWorkSeq,
    //            @Valid DeskingRelWorkDTO drwDTO, Principal principal)
    //            throws Exception {
    //
    //        try {
    //            DeskingRelWork deskingRelWork = modelMapper.map(drwDTO, DeskingRelWork.class);
    //            deskingRelWork.setCreator(principal.getName());
    //
    //            // 스냅샷 수정
    //            deskingService.updateComponentWorkSnapshot(componentWorkSeq, "N", null, principal.getName());
    //
    //            deskingService.deleteDeskingRelWork(deskingRelWork);
    //            ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(true);
    //
    //            return new ResponseEntity<>(resultDto, HttpStatus.OK);
    //        } catch (Exception e) {
    //            throw new Exception(messageByLocale.get("tps.desking.error.work.relation.delete", request), e);
    //        }
    //    }
    //
    //    /**
    //     * 페이지 내 모든 컴포넌트의 데스킹 히스토리 조회
    //     *
    //     * @param request   HTTP요청
    //     * @param search    검색객체
    //     * @param pageSeq   페이지아이디
    //     * @param principal Principal
    //     * @return 히스토리 목록
    //     * @throws Exception 에러
    //     */
    //    @GetMapping("/histories")
    //    public ResponseEntity<?> getAllDeskingHistories(HttpServletRequest request, @Valid @SearchParam DeskingHistSearchDTO search,
    //            @RequestParam("pageSeq") Long pageSeq, Principal principal)
    //            throws Exception {
    //
    //        try {
    //            search.setCreator(principal.getName());
    //
    //            // 히스토리 그룹 목록 조회(mybatis)
    //            List<DeskingHistGroupVO> returnValue = deskingService.findAllDeskingHistGroup(search, pageSeq);
    //
    //            // 리턴 DTO 생성
    //            ResultListDTO<DeskingHistGroupVO> resultList = new ResultListDTO<DeskingHistGroupVO>();
    //            resultList.setList(returnValue);
    //            resultList.setTotalCnt(returnValue.size());
    //
    //            ResultDTO<ResultListDTO<DeskingHistGroupVO>> resultDTO = new ResultDTO<ResultListDTO<DeskingHistGroupVO>>(resultList);
    //            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    //        } catch (Exception e) {
    //            throw new Exception(messageByLocale.get("tps.desking.error.hist", request), e);
    //        }
    //    }
    //
    //    /**
    //     * 데스킹 히스토리 목록 중 특정 데이터셋의 기사목록(상세) 조회
    //     *
    //     * @param request    HTTP 요청
    //     * @param search     검색조건
    //     * @param datasetSeq 데이터셋아이디
    //     * @param principal  Principal
    //     * @return 결과(기사목록)
    //     * @throws Exception 에러처리
    //     */
    //    @GetMapping("/histories/{datasetSeq}")
    //    public ResponseEntity<?> getAllDeskingHistoriesDetail(HttpServletRequest request, @Valid @SearchParam DeskingHistSearchDTO search,
    //            @PathVariable("datasetSeq") Long datasetSeq, Principal principal)
    //            throws Exception {
    //
    //        search.setDatasetSeq(datasetSeq);
    //
    //        try {
    //            // 상세 데이터 조회(mybatis)
    //            List<DeskingHistVO> returnValue = deskingService.findDeskingHistDetail(search);
    //
    //            // 리턴 DTO 생성
    //            ResultListDTO<DeskingHistVO> resultList = new ResultListDTO<DeskingHistVO>();
    //            resultList.setList(returnValue);
    //            resultList.setTotalCnt(returnValue.size());
    //
    //            ResultDTO<ResultListDTO<DeskingHistVO>> resultDTO = new ResultDTO<ResultListDTO<DeskingHistVO>>(resultList);
    //            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    //        } catch (Exception e) {
    //            throw new Exception(messageByLocale.get("tps.desking.error.hist", request), e);
    //        }
    //    }
    //
    //    /**
    //     * 컴포넌트의 데스킹 히스토리 조회 (파라미터로 그룹 데이터, 상세 데이터 둘 다 처리)
    //     *
    //     * @param request    HTTP요청
    //     * @param datasetSeq 데이터셋 아이디
    //     * @param search     검색객체
    //     * @param detail     그룹 조회인지 상세 조회인지 구분하는 파라미터
    //     * @param principal  Principal
    //     * @return 결과
    //     * @throws NoDataException 데이터없음
    //     * @throws Exception       그외 에러
    //     */
    //    @GetMapping("/components/{componentWorkSeq}/contents/{datasetSeq}/histories")
    //    public ResponseEntity<?> getDeskingHistories(HttpServletRequest request, @PathVariable("datasetSeq") Long datasetSeq,
    //            @RequestParam(value = "detail", defaultValue = "N") String detail, @Valid @SearchParam DeskingHistSearchDTO search, Principal principal)
    //            throws NoDataException, Exception {
    //
    //        search.setDatasetSeq(datasetSeq);
    //
    //        try {
    //            if (detail.equals("Y")) {
    //                // 상세 데이터 조회(mybatis)
    //                List<DeskingHistVO> returnValue = deskingService.findDeskingHistDetail(search);
    //
    //                // 리턴 DTO 생성
    //                ResultListDTO<DeskingHistVO> resultList = new ResultListDTO<DeskingHistVO>();
    //                resultList.setList(returnValue);
    //                resultList.setTotalCnt(returnValue.size());
    //
    //                ResultDTO<ResultListDTO<DeskingHistVO>> resultDTO = new ResultDTO<ResultListDTO<DeskingHistVO>>(resultList);
    //                return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    //            } else {
    //                // 그룹 데이터 조회(mybatis)
    //                Long totalCount = deskingService.countByHistGroup(search);
    //                List<DeskingHistGroupVO> returnValue = deskingService.findDeskingHistGroup(search);
    //
    //                // 리턴 DTO 생성
    //                ResultListDTO<DeskingHistGroupVO> resultList = new ResultListDTO<DeskingHistGroupVO>();
    //                resultList.setList(returnValue);
    //                resultList.setTotalCnt(totalCount);
    //
    //                ResultDTO<ResultListDTO<DeskingHistGroupVO>> resultDTO = new ResultDTO<ResultListDTO<DeskingHistGroupVO>>(resultList);
    //                return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    //            }
    //        } catch (Exception e) {
    //            throw new Exception(messageByLocale.get("tps.desking.error.hist", request), e);
    //        }
    //    }
    //
    //    /**
    //     * 예약컴포넌트 목록 조회
    //     *
    //     * @param request
    //     * @param pageSeq
    //     * @return
    //     * @throws Exception
    //     */
    //    @GetMapping("/editions")
    //    public ResponseEntity<?> getEditionList(HttpServletRequest request, @Min(value = 0, message = "{tps.desking.error.invalid.pageSeq}") Long pageSeq)
    //            throws Exception {
    //
    //        try {
    //            List<EditionVO> returnValue = deskingService.getEditionList(pageSeq);
    //
    //            // 리턴값 설정
    //            ResultListDTO<EditionVO> resultListMessage = new ResultListDTO<EditionVO>();
    //            resultListMessage.setList(returnValue);
    //            resultListMessage.setTotalCnt(returnValue.size());
    //
    //            ResultDTO<ResultListDTO<EditionVO>> resultDto = new ResultDTO<ResultListDTO<EditionVO>>(resultListMessage);
    //
    //            return new ResponseEntity<>(resultDto, HttpStatus.OK);
    //        } catch (Exception e) {
    //            throw new Exception(messageByLocale.get("tps.desking.edition.error.select", request), e);
    //        }
    //    }
    //
    //    /* *
    //     * 히스토리를 편집기사 워크로 등록 (파일업로드 안됨)
    //     * @param request 요청
    //     * @param componentWorkSeq work컴포넌트순번
    //     * @param datasetSeq 데이타셋순번
    //     * @param search 검색조건(필수: datasetSeq, creator, createYmdt)
    //     * @param principal 작업자
    //     * @return work컴포넌트
    //     * @throws Exception
    //     */
    //    @PostMapping("/components/{componentWorkSeq}/contents/{datasetSeq}/histories")
    //    public ResponseEntity<?> postDeskingHistories(HttpServletRequest request, @PathVariable("componentWorkSeq") Long componentWorkSeq,
    //            @PathVariable("datasetSeq") @Min(value = 0, message = "{tps.dataset.error.invalid.datasetSeq}") Long datasetSeq,
    //            @Valid @SearchParam DeskingHistSearchDTO search, Principal principal)
    //            throws Exception {
    //
    //        try {
    //
    //            // 스냅샷 수정
    //            deskingService.updateComponentWorkSnapshot(componentWorkSeq, "N", null, principal.getName());
    //
    //            deskingService.importDeskingWorkHistory(search);
    //
    //            // work 컴포넌트 조회(편집기사,관련편집기사포함)
    //            DeskingComponentWorkVO workVO = deskingService.getComponentWork(componentWorkSeq);
    //
    //            // 리턴값 설정
    //            ResultDTO<DeskingComponentWorkVO> resultDto = new ResultDTO<DeskingComponentWorkVO>(workVO);
    //            return new ResponseEntity<>(resultDto, HttpStatus.OK);
    //        } catch (Exception e) {
    //            throw new Exception(messageByLocale.get("tps.desking.error.work.histories.move", request), e);
    //        }
    //    }
}
