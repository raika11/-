package jmnet.moka.core.tps.mvc.container.controller;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Min;

import jmnet.moka.core.common.MokaConstants;
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
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.common.template.helper.TemplateParserHelper;
import jmnet.moka.core.tps.common.dto.HistDTO;
import jmnet.moka.core.tps.common.dto.HistSearchDTO;
import jmnet.moka.core.tps.common.dto.InvalidDataDTO;
import jmnet.moka.core.tps.common.dto.RelSearchDTO;
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

    /**
     * 컨테이너목록조회
     * 
     * @param request 요청
     * @param search 검색조건
     * @return 컨테이너목록
     */
    @GetMapping
    public ResponseEntity<?> getContainerList(HttpServletRequest request,
            @Valid @SearchParam ContainerSearchDTO search) {

        // 조회(mybatis)
    	Long totalCount = containerService.findListCount(search);
        List<ContainerVO> returnValue = containerService.findList(search);

        // 리턴값 설정
        ResultListDTO<ContainerVO> resultListMessage = new ResultListDTO<ContainerVO>();
        resultListMessage.setList(returnValue);
        resultListMessage.setTotalCnt(totalCount);

        ResultDTO<ResultListDTO<ContainerVO>> resultDto =
                new ResultDTO<ResultListDTO<ContainerVO>>(resultListMessage);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 컨테이너정보 조회
     * 
     * @param request 요청
     * @param containerSeq 컨테이너아이디 (필수)
     * @return 컨테이너정보
     * @throws NoDataException 컨테이너 정보가 없음
     * @throws InvalidDataException 컨테이너 아이디 형식오류
     * @throws Exception 기타예외
     */
    @GetMapping("/{containerSeq}")
    public ResponseEntity<?> getContainer(HttpServletRequest request,
            @PathVariable("containerSeq") @Min(value = 0,
                    message = "{tps.container.error.invalid.containerSeq}") Long containerSeq)
            throws NoDataException, InvalidDataException, Exception {

        // 데이타유효성검사.
        validData(request, containerSeq, null);

        String message = messageByLocale.get("tps.container.error.noContent", request);
        Container container = containerService.findByContainerSeq(containerSeq)
                .orElseThrow(() -> new NoDataException(message));

        ContainerDTO dto = modelMapper.map(container, ContainerDTO.class);
        ResultDTO<ContainerDTO> resultDto = new ResultDTO<ContainerDTO>(dto);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 컨테이너정보 유효성 검사
     * 
     * @param request 요청
     * @param containerSeq 컨테이너 순번. 0이면 등록일때 유효성 검사
     * @param containerDTO 컨테이너정보
     * @throws InvalidDataException 데이타유효성예외
     * @throws Exception 기타예외
     */
    private void validData(HttpServletRequest request, Long containerSeq, ContainerDTO containerDTO)
            throws InvalidDataException, Exception {

        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (containerDTO != null) {
            // url id와 json의 id가 동일한지 검사
            if (containerSeq > 0 && !containerSeq.equals(containerDTO.getContainerSeq())) {
                String message = messageByLocale.get("tps.common.error.invalid.matchId", request);
                invalidList.add(new InvalidDataDTO("matchId", message));
            }

            // 문법검사
            try {
                TemplateParserHelper.checkSyntax(containerDTO.getContainerBody());
            } catch (TemplateParseException e) {
                String message = e.getMessage();
                String extra = Integer.toString(e.getLineNumber());
                invalidList.add(new InvalidDataDTO("containerBody", message, extra));
            } catch (Exception e) {
                throw e;
            }

        }

        if (invalidList.size() > 0) {
            String validMessage =
                    messageByLocale.get("tps.container.error.invalidContent", request);
            throw new InvalidDataException(invalidList, validMessage);
        }
    }


    /**
     * 컨테이너등록
     * 
     * @param request 요청
     * @param containerDTO 등록할 컨테이너정보
     * @param principal 로그인사용자 세션
     * @return 등록된 컨테이너정보
     * @throws Exception
     */
    @PostMapping
    public ResponseEntity<?> postContainer(HttpServletRequest request,
            @Valid ContainerDTO containerDTO, Principal principal) throws Exception {

        // 데이타유효성검사.
        validData(request, (long) 0, containerDTO);

        // 등록
        Container container = modelMapper.map(containerDTO, Container.class);
        container.setRegId(principal.getName());
        Container returnValue = containerService.insertContainer(container);

        // 결과리턴
        ContainerDTO dto = modelMapper.map(returnValue, ContainerDTO.class);
        ResultDTO<ContainerDTO> resultDto = new ResultDTO<ContainerDTO>(dto);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 컨테이너수정
     * 
     * @param request 요청
     * @param containerSeq 컨테이너번호
     * @param containerDTO 수정할 컨테이너정보
     * @param principal 로그인 사용자 세션
     * @return 수정된 컨테이너정보
     * @throws InvalidDataException 데이타 유효성오류
     * @throws NoDataException 데이타 없음
     * @throws Exception 기타예외
     */
    @PutMapping("/{containerSeq}")
    public ResponseEntity<?> putContainer(HttpServletRequest request,
            @PathVariable("containerSeq") @Min(value = 0,
                    message = "{tps.container.error.invalid.containerSeq}") Long containerSeq,
            @Valid ContainerDTO containerDTO, Principal principal)
            throws InvalidDataException, NoDataException, Exception {

        // 데이타유효성검사.
        validData(request, containerSeq, containerDTO);

        // 수정
        String infoMessage = messageByLocale.get("tps.container.error.noContent", request);
        Container newContainer = modelMapper.map(containerDTO, Container.class);
        Container orgContainer = containerService.findByContainerSeq(containerSeq)
                .orElseThrow(() -> new NoDataException(infoMessage));

        newContainer.setRegDt(orgContainer.getRegDt());
        newContainer.setRegId(orgContainer.getRegId());
        newContainer.setModDt(McpDate.now());
        newContainer.setModId(principal.getName());
        Container returnValue = containerService.updateContainer(newContainer);

        // 페이지 퍼지. 성공실패여부는 리턴하지 않는다.
        purgeHelper.purgeTms(request, returnValue.getDomain().getDomainId(),
                MokaConstants.ITEM_CONTAINER, returnValue.getContainerSeq());

        // 결과리턴
        ContainerDTO dto = modelMapper.map(returnValue, ContainerDTO.class);

        ResultDTO<ContainerDTO> resultDto = new ResultDTO<ContainerDTO>(dto);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);

    }

    /**
     * 컨테이너삭제
     * 
     * @param request 요청
     * @param containerSeq 삭제 할컨테이너순번 (필수)
     * @param principal 로그인 사용자 세션
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException 컨테이너정보 없음 오류
     * @throws Exception 기타예외
     */
    @DeleteMapping("/{containerSeq}")
    public ResponseEntity<?> deleteContainer(HttpServletRequest request,
            @PathVariable("containerSeq") @Min(value = 0,
                    message = "{tps.container.error.invalid.containerSeq}") Long containerSeq,
            Principal principal) throws InvalidDataException, NoDataException, Exception {

        // 1.1 아이디체크
        validData(request, containerSeq, null);

        // 1.2. 데이타 존재여부 검사
        String noContentMessage = messageByLocale.get("tps.container.error.noContent", request);
        Container container = containerService.findByContainerSeq(containerSeq)
                .orElseThrow(() -> new NoDataException(noContentMessage));


        // 연관 데이터 확인
        if (relationHelper.hasRelations(containerSeq, MokaConstants.ITEM_CONTAINER)) {
            List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

            String message =
                    messageByLocale.get("tps.container.error.delete.hasRelations", request);
            invalidList.add(new InvalidDataDTO("relations", message));

            String validMessage =
                    messageByLocale.get("tps.container.error.invalidContent", request);
            throw new InvalidDataException(invalidList, validMessage);
        }

        // 2. 삭제
        containerService.deleteContainer(container, principal.getName());

        // 3. 결과리턴
        ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);

    }

    /**
     * 히스토리 목록 조회
     * 
     * @param request 요청
     * @param containerSeq 컨테이너순번
     * @param search 검색조건
     * @return 히스토리 목록
     */
    @GetMapping("/{containerSeq}/histories")
    public ResponseEntity<?> getHistoryList(HttpServletRequest request,
            @PathVariable("containerSeq") @Min(value = 0,
                    message = "{tps.container.error.invalid.containerSeq}") Long containerSeq,
            @Valid @SearchParam HistSearchDTO search) {

        search.setSeq(containerSeq);

        // 조회
        org.springframework.data.domain.Page<ContainerHist> histList =
                containerService.findHistoryList(search, search.getPageable());

        // entity -> DTO
        List<HistDTO> histDTOList =
                histList.stream().map(this::convertToHistDto).collect(Collectors.toList());

        ResultListDTO<HistDTO> resultList = new ResultListDTO<HistDTO>();
        resultList.setTotalCnt(histList.getTotalElements());
        resultList.setList(histDTOList);

        ResultDTO<ResultListDTO<HistDTO>> resultDTO =
                new ResultDTO<ResultListDTO<HistDTO>>(resultList);
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
     * 관련아이템 목록조회
     * 
     * @param request 요청
     * @param containerSeq 컨테이너순번
     * @param search 컨테이너의 관련아이템(페이지,본문) 검색 조건
     * @return 관련아이템(페이지,본문) 목록
     * @throws NoDataException 등록된 페이지 없음
     * @throws InvalidDataException 검색조건이 유효하지 않은 오류
     */
    @GetMapping("/{containerSeq}/relations")
    public ResponseEntity<?> getRelationList(HttpServletRequest request,
            @PathVariable("containerSeq") @Min(value = 0,
                    message = "{tps.container.error.invalid.containerSeq}") Long containerSeq,
            @Valid @SearchParam RelSearchDTO search) throws NoDataException, InvalidDataException {

        search.setRelSeq(containerSeq);
        search.setRelSeqType(MokaConstants.ITEM_CONTAINER);

        return relationHelper.findRelations(search);
    }
    
    /**
     * <pre>
     * 관련 아이템이 있는지 확인한다
     * </pre>
     * 
     * @param request HTTP요청
     * @param containerSeq 컨테이너 아이디
     * @return 관련 아이템 존재 여부
     * @throws NoDataException 데이터없음
     */
    @GetMapping("/{seq}/hasRelations")
    public ResponseEntity<?> hasRelations(HttpServletRequest request,
            @PathVariable("seq") @Min(value = 0,
                    message = "{tps.dataset.error.invalid.containerSeq}") Long containerSeq)
            throws NoDataException {

        // 데이타 존재여부 검사
    	containerService.findByContainerSeq(containerSeq).orElseThrow(() -> new NoDataException(
                messageByLocale.get("tps.dataset.error.noContent", request)));

        Boolean chkRels = relationHelper.hasRelations(containerSeq, MokaConstants.ITEM_CONTAINER);
        ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(chkRels);

        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

}
