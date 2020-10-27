package jmnet.moka.core.tps.mvc.container.controller;

import io.swagger.annotations.ApiOperation;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.common.template.helper.TemplateParserHelper;
import jmnet.moka.core.tps.common.dto.HistDTO;
import jmnet.moka.core.tps.common.dto.HistSearchDTO;
import jmnet.moka.core.tps.common.dto.InvalidDataDTO;
import jmnet.moka.core.tps.common.dto.RelSearchDTO;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.helper.PurgeHelper;
import jmnet.moka.core.tps.helper.RelationHelper;
import jmnet.moka.core.tps.mvc.container.dto.ContainerDTO;
import jmnet.moka.core.tps.mvc.container.dto.ContainerSearchDTO;
import jmnet.moka.core.tps.mvc.container.entity.Container;
import jmnet.moka.core.tps.mvc.container.entity.ContainerHist;
import jmnet.moka.core.tps.mvc.container.service.ContainerService;
import jmnet.moka.core.tps.mvc.container.vo.ContainerVO;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 컨테이너 API
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/containers")
public class ContainerRestController {

    @Autowired
    private ContainerService containerService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private MessageByLocale messageByLocale;

    @Autowired
    private RelationHelper relationHelper;

    @Autowired
    private PurgeHelper purgeHelper;

    @Autowired
    private TpsLogger tpsLogger;

    /**
     * 컨테이너 목록조회
     *
     * @param search 검색조건
     * @return 컨테이너목록
     */
    @ApiOperation(value = "컨테이너 목록조회")
    @GetMapping
    public ResponseEntity<?> getContainerList(@Valid @SearchParam ContainerSearchDTO search) {

        // 조회(mybatis)
        List<ContainerVO> returnValue = containerService.findAllContainer(search);

        // 리턴값 설정
        ResultListDTO<ContainerVO> resultList = new ResultListDTO<ContainerVO>();
        resultList.setList(returnValue);
        resultList.setTotalCnt(search.getTotal());

        ResultDTO<ResultListDTO<ContainerVO>> resultDTO = new ResultDTO<ResultListDTO<ContainerVO>>(resultList);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 컨테이너 상세조회
     *
     * @param request      요청
     * @param containerSeq 컨테이너아이디 (필수)
     * @return 컨테이너정보
     * @throws NoDataException      컨테이너 정보가 없음
     * @throws InvalidDataException 컨테이너 아이디 형식오류
     * @throws Exception            기타예외
     */
    @ApiOperation(value = "컨테이너 상세조회")
    @GetMapping("/{containerSeq}")
    public ResponseEntity<?> getContainer(HttpServletRequest request,
            @PathVariable("containerSeq") @Min(value = 0, message = "{tps.container.error.min.containerSeq}") Long containerSeq)
            throws NoDataException, InvalidDataException, Exception {

        // 데이타유효성검사.
        validData(request, containerSeq, null, ActionType.SELECT);

        Container container = containerService.findContainerBySeq(containerSeq)
                                              .orElseThrow(() -> {
                                                  String message = messageByLocale.get("tps.common.error.no-data", request);
                                                  tpsLogger.fail(message, true);
                                                  return new NoDataException(message);
                                              });

        ContainerDTO dto = modelMapper.map(container, ContainerDTO.class);

        ResultDTO<ContainerDTO> resultDto = new ResultDTO<ContainerDTO>(dto);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 컨테이너정보 유효성 검사
     *
     * @param request      요청
     * @param containerSeq 컨테이너 순번. 0이면 등록일때 유효성 검사
     * @param containerDTO 컨테이너정보
     * @throws InvalidDataException 데이타유효성예외
     * @throws Exception            기타예외
     */
    private void validData(HttpServletRequest request, Long containerSeq, ContainerDTO containerDTO, ActionType actionType)
            throws InvalidDataException, Exception {

        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (containerDTO != null) {
            // url id와 json의 id가 동일한지 검사
            if (containerSeq > 0 && !containerSeq.equals(containerDTO.getContainerSeq())) {
                String message = messageByLocale.get("tps.common.error.no-data", request);
                invalidList.add(new InvalidDataDTO("matchId", message));
                tpsLogger.fail(actionType, message, true);
            }

            // 문법검사
            try {
                TemplateParserHelper.checkSyntax(containerDTO.getContainerBody());
            } catch (TemplateParseException e) {
                String message = e.getMessage();
                String extra = Integer.toString(e.getLineNumber());
                invalidList.add(new InvalidDataDTO("containerBody", message, extra));
                tpsLogger.fail(actionType, message, true);
            } catch (Exception e) {
                String message = e.getMessage();
                invalidList.add(new InvalidDataDTO("templateBody", message));
                tpsLogger.fail(actionType, message, true);
            }

        }

        if (invalidList.size() > 0) {
            String validMessage = messageByLocale.get("tps.common.error.invalidContent", request);
            throw new InvalidDataException(invalidList, validMessage);
        }
    }


    /**
     * 컨테이너 등록
     *
     * @param request      요청
     * @param containerDTO 등록할 컨테이너정보
     * @return 등록된 컨테이너정보
     * @throws Exception
     */
    @ApiOperation(value = "컨테이너 등록")
    @PostMapping
    public ResponseEntity<?> postContainer(HttpServletRequest request, @Valid ContainerDTO containerDTO)
            throws Exception {

        // 데이타유효성검사.
        validData(request, (long) 0, containerDTO, ActionType.INSERT);

        Container container = modelMapper.map(containerDTO, Container.class);
        try {
            // 등록
            Container returnValue = containerService.insertContainer(container);

            // 결과리턴
            ContainerDTO dto = modelMapper.map(returnValue, ContainerDTO.class);

            String message = messageByLocale.get("tps.common.success.insert", request);
            ResultDTO<ContainerDTO> resultDto = new ResultDTO<ContainerDTO>(dto, message);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO INSERT CONTAINER]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO INSERT CONTAINER]", e, true);
            throw new Exception(messageByLocale.get("tps.container.error.save", request), e);
        }

    }

    /**
     * 컨테이너 수정
     *
     * @param request      요청
     * @param containerSeq 컨테이너번호
     * @param containerDTO 수정할 컨테이너정보
     * @return 수정된 컨테이너정보
     * @throws InvalidDataException 데이타 유효성오류
     * @throws NoDataException      데이타 없음
     * @throws Exception            기타예외
     */
    @ApiOperation(value = "컨테이너 수정")
    @PutMapping("/{containerSeq}")
    public ResponseEntity<?> putContainer(HttpServletRequest request,
            @PathVariable("containerSeq") @Min(value = 0, message = "{tps.container.error.min.containerSeq}") Long containerSeq,
            @Valid ContainerDTO containerDTO)
            throws InvalidDataException, NoDataException, Exception {

        // 데이타유효성검사.
        validData(request, containerSeq, containerDTO, ActionType.UPDATE);

        // 수정
        Container newContainer = modelMapper.map(containerDTO, Container.class);
        Container orgContainer = containerService.findContainerBySeq(containerSeq)
                                                 .orElseThrow(() -> {
                                                     String message = messageByLocale.get("tps.container.error.no-data", request);
                                                     tpsLogger.fail(ActionType.UPDATE, message, true);
                                                     return new NoDataException(message);
                                                 });

        try {
            Container returnValue = containerService.updateContainer(newContainer);

            // 페이지 퍼지. 성공실패여부는 리턴하지 않는다.
            purgeHelper.purgeTms(request, returnValue.getDomain()
                                                     .getDomainId(), MokaConstants.ITEM_CONTAINER, returnValue.getContainerSeq());

            // 결과리턴
            ContainerDTO dto = modelMapper.map(returnValue, ContainerDTO.class);

            String message = messageByLocale.get("tps.common.success.update", request);
            ResultDTO<ContainerDTO> resultDto = new ResultDTO<ContainerDTO>(dto, message);
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE CONTAINER] seq: {}) {}", containerDTO.getContainerSeq(), e.getMessage());
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE CONTAINER]", e, true);
            throw new Exception(messageByLocale.get("tps.container.error.save", request), e);
        }
    }

    /**
     * 컨테이너 삭제
     *
     * @param request      요청
     * @param containerSeq 삭제 할컨테이너순번 (필수)
     * @param principal    로그인 사용자 세션
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException      컨테이너정보 없음 오류
     * @throws Exception            기타예외
     */
    @ApiOperation(value = "컨테이너 삭제")
    @DeleteMapping("/{containerSeq}")
    public ResponseEntity<?> deleteContainer(HttpServletRequest request,
            @PathVariable("containerSeq") @Min(value = 0, message = "{tps.container.error.min.containerSeq}") Long containerSeq, Principal principal)
            throws InvalidDataException, NoDataException, Exception {

        // 아이디체크
        validData(request, containerSeq, null, ActionType.DELETE);

        // 데이타 확인
        Container container = containerService.findContainerBySeq(containerSeq)
                                              .orElseThrow(() -> {
                                                  String message = messageByLocale.get("tps.container.error.no-data", request);
                                                  tpsLogger.fail(ActionType.DELETE, message, true);
                                                  return new NoDataException(message);
                                              });


        // 관련 데이터 확인
        if (relationHelper.hasRelations(containerSeq, MokaConstants.ITEM_CONTAINER)) {
            String relMessage = messageByLocale.get("tps.container.error.delete.related", request);
            tpsLogger.fail(ActionType.DELETE, relMessage, true);
            throw new Exception(relMessage);
        }

        try {
            // 삭제
            containerService.deleteContainer(container, principal.getName());

            // 결과리턴
            String message = messageByLocale.get("tps.common.success.delete", request);
            ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(true, message);
            tpsLogger.success(ActionType.DELETE, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE CONTAINER] seq: {}) {}", containerSeq, e.getMessage());
            tpsLogger.error(ActionType.DELETE, "[FAIL TO DELETE CONTAINER]", e, true);
            throw new Exception(messageByLocale.get("tps.container.error.delete", request), e);
        }

    }

    /**
     * 컨테이너 히스토리 목록조회
     *
     * @param request      요청
     * @param containerSeq 컨테이너순번
     * @param search       검색조건
     * @return 히스토리 목록
     */
    @ApiOperation(value = "컨테이너 히스토리 목록조회")
    @GetMapping("/{containerSeq}/histories")
    public ResponseEntity<?> getHistoryList(HttpServletRequest request,
            @PathVariable("containerSeq") @Min(value = 0, message = "{tps.container.error.min.containerSeq}") Long containerSeq,
            @Valid @SearchParam HistSearchDTO search) {

        search.setSeq(containerSeq);

        // 조회
        org.springframework.data.domain.Page<ContainerHist> histList = containerService.findAllContainerHist(search, search.getPageable());

        // entity -> DTO
        List<HistDTO> histDTOList = histList.stream()
                                            .map(this::convertToHistDto)
                                            .collect(Collectors.toList());

        // 리턴 DTO 생성
        ResultListDTO<HistDTO> resultList = new ResultListDTO<HistDTO>();
        resultList.setTotalCnt(histList.getTotalElements());
        resultList.setList(histDTOList);

        ResultDTO<ResultListDTO<HistDTO>> resultDTO = new ResultDTO<ResultListDTO<HistDTO>>(resultList);
        tpsLogger.success(ActionType.SELECT, true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 컨테이너 히스토리 상세조회
     *
     * @param request HTTP 요청
     * @param histSeq 순번
     * @return 페이지 히스토리
     * @throws NoDataException 데이터없음
     */
    @ApiOperation(value = "컨테이너 히스토리 상세조회")
    @GetMapping("/{containerSeq}/histories/{histSeq}")
    public ResponseEntity<?> getHistory(HttpServletRequest request,
            @PathVariable("histSeq") @Min(value = 0, message = "{tps.containerhist.error.min.seq}") Long histSeq)
            throws NoDataException {

        // 템플릿 히스토리 조회
        ContainerHist history = containerService.findContainerHistBySeq(histSeq)
                                                .orElseThrow(() -> {
                                                    String message = messageByLocale.get("tps.containerhist.error.no-data", request);
                                                    tpsLogger.fail(ActionType.SELECT, message, true);
                                                    return new NoDataException(message);
                                                });
        ContainerHist historyDTO = modelMapper.map(history, ContainerHist.class);

        ResultDTO<HistDTO> resultDTO = new ResultDTO<HistDTO>(convertToHistDto(historyDTO));
        tpsLogger.success(ActionType.SELECT, true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * Container History Entity -> History DTO 변환
     *
     * @param hist history정보
     * @return historyDTO
     */
    private HistDTO convertToHistDto(ContainerHist hist) {
        HistDTO histDTO = modelMapper.map(hist, HistDTO.class);
        histDTO.setBody(hist.getContainerBody());
        histDTO.setRegDt(hist.getRegDt());
        histDTO.setRegId(hist.getRegId());
        return histDTO;
    }

    /**
     * 관련 아이템 목록조회
     *
     * @param request      요청
     * @param containerSeq 컨테이너순번
     * @param search       컨테이너의 관련아이템(페이지,본문) 검색 조건
     * @return 관련아이템(페이지, 본문) 목록
     * @throws Exception 예외
     */
    @ApiOperation(value = "관련 아이템 목록조회")
    @GetMapping("/{containerSeq}/relations")
    public ResponseEntity<?> getRelationList(HttpServletRequest request,
            @PathVariable("containerSeq") @Min(value = 0, message = "{tps.container.error.min.containerSeq}") Long containerSeq,
            @Valid @SearchParam RelSearchDTO search)
            throws Exception {

        search.setRelSeq(containerSeq);
        search.setRelSeqType(MokaConstants.ITEM_CONTAINER);

        // 컨테이너 확인
        containerService.findContainerBySeq(containerSeq)
                        .orElseThrow(() -> {
                            String message = messageByLocale.get("tps.container.error.no-data", request);
                            tpsLogger.fail(ActionType.SELECT, message, true);
                            return new NoDataException(message);
                        });

        ResponseEntity<?> response = relationHelper.findRelations(search);
        tpsLogger.success(ActionType.SELECT, true);
        return response;
    }

    /**
     * 관련 아이템 존재여부
     *
     * @param request      HTTP요청
     * @param containerSeq 컨테이너 아이디
     * @return 관련 아이템 존재 여부
     * @throws Exception 예외
     */
    @ApiOperation(value = "관련 아이템 존재여부")
    @GetMapping("/{containerSeq}/has-relations")
    public ResponseEntity<?> hasRelationList(HttpServletRequest request,
            @PathVariable("containerSeq") @Min(value = 0, message = "{tps.container.error.min.containerSeq}") Long containerSeq)
            throws Exception {

        // 컨테이너 확인
        containerService.findContainerBySeq(containerSeq)
                        .orElseThrow(() -> {
                            String message = messageByLocale.get("tps.container.error.no-data", request);
                            tpsLogger.fail(ActionType.SELECT, message, true);
                            return new NoDataException(message);
                        });

        try {
            Boolean chkRels = relationHelper.hasRelations(containerSeq, MokaConstants.ITEM_TEMPLATE);

            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(chkRels);
            tpsLogger.success(ActionType.SELECT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[CONTAINER RELATION EXISTENCE CHECK FAILED] seq: {}) {}", containerSeq, e.getMessage());
            tpsLogger.error(ActionType.DELETE, "[CONTAINER RELATION EXISTENCE CHECK FAILEDE]", e, true);
            throw new Exception(messageByLocale.get("tps.container.error.hasRelation", request), e);
        }
    }

}
