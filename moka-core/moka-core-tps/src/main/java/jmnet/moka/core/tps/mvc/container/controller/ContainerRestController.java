package jmnet.moka.core.tps.mvc.container.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.dto.InvalidDataDTO;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.template.helper.TemplateParserHelper;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.helper.PurgeHelper;
import jmnet.moka.core.tps.mvc.container.dto.ContainerDTO;
import jmnet.moka.core.tps.mvc.container.dto.ContainerSearchDTO;
import jmnet.moka.core.tps.mvc.container.entity.Container;
import jmnet.moka.core.tps.mvc.container.service.ContainerService;
import jmnet.moka.core.tps.mvc.container.vo.ContainerVO;
import jmnet.moka.core.tps.mvc.page.vo.PageVO;
import jmnet.moka.core.tps.mvc.relation.dto.RelationSearchDTO;
import jmnet.moka.core.tps.mvc.relation.service.RelationService;
import lombok.extern.slf4j.Slf4j;
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
@Api(tags = {"컨테이너 API"})
public class ContainerRestController extends AbstractCommonController {

    private final ContainerService containerService;

    private final RelationService relationService;

    private final PurgeHelper purgeHelper;

    public ContainerRestController(ContainerService containerService, RelationService relationService, PurgeHelper purgeHelper) {
        this.containerService = containerService;
        this.relationService = relationService;
        this.purgeHelper = purgeHelper;
    }

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
     * @param containerSeq 컨테이너아이디 (필수)
     * @return 컨테이너정보
     * @throws NoDataException      컨테이너 정보가 없음
     * @throws InvalidDataException 컨테이너 아이디 형식오류
     * @throws Exception            기타예외
     */
    @ApiOperation(value = "컨테이너 상세조회")
    @GetMapping("/{containerSeq}")
    public ResponseEntity<?> getContainer(@ApiParam("컨테이너 일련번호(필수)") @PathVariable("containerSeq")
    @Min(value = 0, message = "{tps.container.error.min.containerSeq}") Long containerSeq)
            throws NoDataException, InvalidDataException, Exception {

        // 데이타유효성검사.
        validData(containerSeq, null, ActionType.SELECT);

        Container container = containerService
                .findContainerBySeq(containerSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
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
     * @param containerSeq 컨테이너 순번. 0이면 등록일때 유효성 검사
     * @param containerDTO 컨테이너정보
     * @throws InvalidDataException 데이타유효성예외
     * @throws Exception            기타예외
     */
    private void validData(Long containerSeq, ContainerDTO containerDTO, ActionType actionType)
            throws InvalidDataException, Exception {

        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (containerDTO != null) {
            // url id와 json의 id가 동일한지 검사
            if (containerSeq > 0 && !containerSeq.equals(containerDTO.getContainerSeq())) {
                String message = msg("tps.common.error.no-data");
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
            String validMessage = msg("tps.common.error.invalidContent");
            throw new InvalidDataException(invalidList, validMessage);
        }
    }


    /**
     * 컨테이너 등록
     *
     * @param containerDTO 등록할 컨테이너정보
     * @return 등록된 컨테이너정보
     * @throws Exception
     */
    @ApiOperation(value = "컨테이너 등록")
    @PostMapping
    public ResponseEntity<?> postContainer(@Valid ContainerDTO containerDTO)
            throws Exception {

        // 데이타유효성검사.
        validData((long) 0, containerDTO, ActionType.INSERT);

        Container container = modelMapper.map(containerDTO, Container.class);
        try {
            // 등록
            Container returnValue = containerService.insertContainer(container);

            // 결과리턴
            ContainerDTO dto = modelMapper.map(returnValue, ContainerDTO.class);

            String message = msg("tps.common.success.insert");
            ResultDTO<ContainerDTO> resultDto = new ResultDTO<ContainerDTO>(dto, message);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO INSERT CONTAINER]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO INSERT CONTAINER]", e, true);
            throw new Exception(msg("tps.common.error.insert"), e);
        }

    }

    /**
     * 컨테이너 수정
     *
     * @param containerSeq 컨테이너번호
     * @param containerDTO 수정할 컨테이너정보
     * @return 수정된 컨테이너정보
     * @throws InvalidDataException 데이타 유효성오류
     * @throws NoDataException      데이타 없음
     * @throws Exception            기타예외
     */
    @ApiOperation(value = "컨테이너 수정")
    @PutMapping("/{containerSeq}")
    public ResponseEntity<?> putContainer(@ApiParam("컨테이너 일련번호") @PathVariable("containerSeq")
    @Min(value = 0, message = "{tps.container.error.min.containerSeq}") Long containerSeq, @Valid ContainerDTO containerDTO)
            throws InvalidDataException, NoDataException, Exception {

        // 데이타유효성검사.
        validData(containerSeq, containerDTO, ActionType.UPDATE);

        // 수정
        Container newContainer = modelMapper.map(containerDTO, Container.class);
        Container orgContainer = containerService
                .findContainerBySeq(containerSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.container.error.no-data");
                    tpsLogger.fail(ActionType.UPDATE, message, true);
                    return new NoDataException(message);
                });

        try {
            Container returnValue = containerService.updateContainer(newContainer);

            // 결과리턴
            ContainerDTO dto = modelMapper.map(returnValue, ContainerDTO.class);

            // purge 날림!!!! 성공실패여부는 리턴하지 않는다.
            purge(dto);

            String message = msg("tps.common.success.update");
            ResultDTO<ContainerDTO> resultDto = new ResultDTO<ContainerDTO>(dto, message);
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE CONTAINER] seq: {} {}", containerDTO.getContainerSeq(), e.getMessage());
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE CONTAINER]", e, true);
            throw new Exception(msg("tps.common.error.update"), e);
        }
    }

    /**
     * 컨테이너 삭제
     *
     * @param containerSeq 삭제 할컨테이너순번 (필수)
     * @param principal    로그인 사용자 세션
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException      컨테이너정보 없음 오류
     * @throws Exception            기타예외
     */
    @ApiOperation(value = "컨테이너 삭제")
    @DeleteMapping("/{containerSeq}")
    public ResponseEntity<?> deleteContainer(@ApiParam("컨테이너 일련번호") @PathVariable("containerSeq")
    @Min(value = 0, message = "{tps.container.error.min.containerSeq}") Long containerSeq, Principal principal)
            throws InvalidDataException, NoDataException, Exception {

        // 아이디체크
        validData(containerSeq, null, ActionType.DELETE);

        // 데이타 확인
        Container container = containerService
                .findContainerBySeq(containerSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.DELETE, message, true);
                    return new NoDataException(message);
                });


        // 관련 데이터 확인
        if (relationService.hasRelations(containerSeq, MokaConstants.ITEM_CONTAINER)) {
            String relMessage = msg("tps.common.error.delete.related");
            tpsLogger.fail(ActionType.DELETE, relMessage, true);
            throw new Exception(relMessage);
        }

        try {
            ContainerDTO dto = modelMapper.map(container, ContainerDTO.class);

            // 삭제
            containerService.deleteContainer(container, principal.getName());

            // purge 날림!!!! 성공실패여부는 리턴하지 않는다.
            purge(dto);

            // 결과리턴
            String message = msg("tps.common.success.delete");
            ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(true, message);
            tpsLogger.success(ActionType.DELETE, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE CONTAINER] seq: {} {}", containerSeq, e.getMessage());
            tpsLogger.error(ActionType.DELETE, "[FAIL TO DELETE CONTAINER]", e, true);
            throw new Exception(msg("tps.common.error.delete"), e);
        }

    }

    /**
     * 관련 아이템 존재여부
     *
     * @param containerSeq 컨테이너 아이디
     * @return 관련 아이템 존재 여부
     * @throws Exception 예외
     */
    @ApiOperation(value = "관련 아이템 존재여부")
    @GetMapping("/{containerSeq}/has-relations")
    public ResponseEntity<?> hasRelationList(@ApiParam("컨테이너 일련번호") @PathVariable("containerSeq")
    @Min(value = 0, message = "{tps.container.error.min.containerSeq}") Long containerSeq)
            throws Exception {

        // 컨테이너 확인
        containerService
                .findContainerBySeq(containerSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.SELECT, message, true);
                    return new NoDataException(message);
                });

        try {
            Boolean chkRels = relationService.hasRelations(containerSeq, MokaConstants.ITEM_CONTAINER);
            String message = "";
            if (chkRels) {
                message = msg("tps.common.success.has-relations");
            }
            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(chkRels, message);
            tpsLogger.success(ActionType.SELECT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[CONTAINER RELATION EXISTENCE CHECK FAILED] seq: {} {}", containerSeq, e.getMessage());
            tpsLogger.error(ActionType.DELETE, "[CONTAINER RELATION EXISTENCE CHECK FAILED]", e, true);
            throw new Exception(msg("tps.common.error.has-relation"), e);
        }
    }

    /**
     * tms서버의 컨테이너정보를 갱신한다. 해당 컨테이너와 관련된 fileYn=Y인 페이지도 갱신한다.
     *
     * @param returnValDTO 컨테이너정보
     * @return 갱신오류메세지
     * @throws DataLoadException
     * @throws TemplateMergeException
     * @throws TemplateParseException
     * @throws NoDataException
     */
    private String purge(ContainerDTO returnValDTO)
            throws DataLoadException, TemplateMergeException, TemplateParseException, NoDataException {
        // 1. 컨테이너 tms purge
        String returnValue = "";
        String retTemplate = purgeHelper.tmsPurge(Collections.singletonList(returnValDTO.toContainerItem()));
        if (McpString.isNotEmpty(retTemplate)) {
            log.error("[FAIL TO PURGE CONTAINER] seq: {} {}", returnValDTO.getContainerSeq(), retTemplate);
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO PURGE CONTAINER]", true);
            returnValue = String.join("\r\n", retTemplate);
        }

        // 2. fileYn=Y인 관련페이지 tms pageUpdate
        RelationSearchDTO search = RelationSearchDTO
                .builder()
                .domainId(returnValDTO
                        .getDomain()
                        .getDomainId())
                .fileYn(MokaConstants.YES)
                .relSeq(returnValDTO.getContainerSeq())
                .relSeqType(MokaConstants.ITEM_CONTAINER)
                .relType(MokaConstants.ITEM_PAGE)
                .build();
        List<PageVO> pageList = relationService.findAllPage(search);
        String retPage = purgeHelper.tmsPageUpdate(pageList);
        if (McpString.isNotEmpty(retPage)) {
            log.error("[FAIL TO PAGE UPATE] containerSeq: {} {}", returnValDTO.getContainerSeq(), retPage);
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO PAGE UPATE]", true);
            returnValue = String.join("\r\n", retPage);
        }

        return returnValue;
    }

}
