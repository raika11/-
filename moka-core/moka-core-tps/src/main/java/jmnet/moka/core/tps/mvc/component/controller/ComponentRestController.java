package jmnet.moka.core.tps.mvc.component.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import jmnet.moka.common.data.support.SearchDTO;
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
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.code.EditStatusCode;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.dto.HistPublishDTO;
import jmnet.moka.core.tps.common.dto.ValidList;
import jmnet.moka.core.tps.helper.PurgeHelper;
import jmnet.moka.core.tps.mvc.component.dto.ComponentDTO;
import jmnet.moka.core.tps.mvc.component.dto.ComponentHistDTO;
import jmnet.moka.core.tps.mvc.component.dto.ComponentSearchDTO;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.component.entity.ComponentHist;
import jmnet.moka.core.tps.mvc.component.service.ComponentHistService;
import jmnet.moka.core.tps.mvc.component.service.ComponentService;
import jmnet.moka.core.tps.mvc.component.vo.ComponentVO;
import jmnet.moka.core.tps.mvc.dataset.dto.DatasetDTO;
import jmnet.moka.core.tps.mvc.dataset.entity.Dataset;
import jmnet.moka.core.tps.mvc.page.vo.PageVO;
import jmnet.moka.core.tps.mvc.relation.dto.RelationSearchDTO;
import jmnet.moka.core.tps.mvc.relation.service.RelationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * ???????????? API
 */
@Controller
@Validated
@Slf4j
@RequestMapping("/api/components")
@Api(tags = {"???????????? API"})
public class ComponentRestController extends AbstractCommonController {

    private final ComponentService componentService;

    private final ComponentHistService componentHistService;

    private final RelationService relationService;

    private final PurgeHelper purgeHelper;

    @Autowired
    public ComponentRestController(ComponentService componentService, ComponentHistService componentHistService, RelationService relationService,
            PurgeHelper purgeHelper) {
        this.componentService = componentService;
        this.componentHistService = componentHistService;
        this.relationService = relationService;
        this.purgeHelper = purgeHelper;
    }

    /**
     * ???????????? ????????????
     *
     * @param search ?????? ??????
     * @return ???????????? ??????
     */
    @ApiOperation(value = "???????????? ????????????")
    @GetMapping
    public ResponseEntity<?> getComponentList(@Valid @SearchParam ComponentSearchDTO search) {

        // ??????(mybatis)
        List<ComponentVO> returnValue = componentService.findAllComponent(search);

        ResultListDTO<ComponentVO> resultList = new ResultListDTO<ComponentVO>();
        resultList.setList(returnValue);
        resultList.setTotalCnt(search.getTotal());

        ResultDTO<ResultListDTO<ComponentVO>> resultDTO = new ResultDTO<ResultListDTO<ComponentVO>>(resultList);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * ???????????? ????????????
     *
     * @param componentSeq ?????????????????????
     * @return ????????????
     * @throws Exception ??????
     */
    @ApiOperation(value = "???????????? ????????????")
    @GetMapping("/{componentSeq}")
    public ResponseEntity<?> getComponent(@ApiParam("???????????? ????????????(??????)") @PathVariable("componentSeq")
    @Min(value = 0, message = "{tps.component.error.min.componentSeq}") Long componentSeq)
            throws Exception {

        Component component = componentService
                .findComponentBySeq(componentSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        ComponentDTO componentDTO = modelMapper.map(component, ComponentDTO.class);

        try {
            componentDTO = this.setPrevDataset(componentDTO);

            ResultDTO<ComponentDTO> resultDTO = new ResultDTO<ComponentDTO>(componentDTO);
            tpsLogger.success(true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO SELECT COMPONENT]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO SELECT COMPONENT]", e, true);
            throw new Exception(msg("tps.component.error.select"), e);
        }
    }

    /**
     * ???????????? ??????
     *
     * @param componentDTO ????????????DTO
     * @return ????????? ????????????
     * @throws InvalidDataException ???????????? ???????????? ??????
     * @throws NoDataException      ????????? ??????
     * @throws Exception            ?????? ?????? ??????
     */
    @ApiOperation(value = "???????????? ??????")
    @PostMapping
    public ResponseEntity<?> postComponent(@ApiParam("???????????? ??????") @RequestBody @Valid ComponentDTO componentDTO)
            throws InvalidDataException, NoDataException, Exception {

        // ????????? ????????? ??????
        validData(componentDTO, ActionType.INSERT);

        //        if (componentDTO.getDataset() != null && componentDTO
        //                .getDataset()
        //                .getDatasetSeq() == null) {
        //            componentDTO.setDataset(null);
        //        }
        //
        //        if (componentDTO.getEditFormPart() != null && componentDTO
        //                .getEditFormPart()
        //                .getPartSeq() == null) {
        //            componentDTO.setEditFormPart(null);
        //        }

        Component component = modelMapper.map(componentDTO, Component.class);

        try {
            //????????????
            HistPublishDTO histSaveDTO = HistPublishDTO
                    .builder()
                    .status(EditStatusCode.SAVE)
                    .approvalYn(MokaConstants.NO)
                    .build();
            Component returnVal = componentService.insertComponent(component, histSaveDTO);

            //??????
            HistPublishDTO histPublishDTO = HistPublishDTO
                    .builder()
                    .status(EditStatusCode.PUBLISH)
                    .approvalYn(MokaConstants.YES)
                    .build();
            componentHistService.insertComponentHist(component, histPublishDTO);

            ComponentDTO returnValDTO = modelMapper.map(returnVal, ComponentDTO.class);
            returnValDTO = this.setPrevDataset(returnValDTO);

            String message = msg("tps.common.success.insert");
            ResultDTO<ComponentDTO> resultDTO = new ResultDTO<ComponentDTO>(returnValDTO, message);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT COMPONENT]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO INSERT COMPONENT]", e, true);
            throw new Exception(msg("tps.common.error.insert"), e);
        }
    }

    /**
     * ???????????? ??????????????? ????????? ????????????
     *
     * @param validList ???????????? ??????
     * @return ????????? ????????????
     * @throws InvalidDataException ???????????? ???????????? ??????
     * @throws Exception            ??????
     */
    @ApiOperation(value = "???????????? ????????????")
    @PostMapping("/all")
    public ResponseEntity<?> postAllComponent(@ApiParam("???????????? ??????") @Valid @RequestBody ValidList<ComponentDTO> validList)
            throws InvalidDataException, Exception {

        // ???????????? ?????? ?????????
        List<ComponentDTO> componentDTOs = validList.getList();

        // ????????? ????????? ??????
        for (ComponentDTO componentDTO : componentDTOs) {
            validData(componentDTO, ActionType.INSERT);
            //            if (componentDTO.getDataset() != null && componentDTO
            //                    .getDataset()
            //                    .getDatasetSeq() == null) {
            //                componentDTO.setDataset(null);
            //            }
            //
            //            if (componentDTO.getEditFormPart() != null && componentDTO
            //                    .getEditFormPart()
            //                    .getPartSeq() == null) {
            //                componentDTO.setEditFormPart(null);
            //            }
        }

        List<Component> components = modelMapper.map(componentDTOs, Component.TYPE);

        try {
            List<Component> returnVal = new ArrayList<>();
            for (Component component : components) {
                //????????????
                HistPublishDTO histSaveDTO = HistPublishDTO
                        .builder()
                        .status(EditStatusCode.SAVE)
                        .approvalYn(MokaConstants.NO)
                        .build();
                returnVal.add(componentService.insertComponent(component, histSaveDTO));

                //??????
                HistPublishDTO histPublishDTO = HistPublishDTO
                        .builder()
                        .status(EditStatusCode.PUBLISH)
                        .approvalYn(MokaConstants.YES)
                        .build();
                componentHistService.insertComponentHist(component, histPublishDTO);
            }
            List<ComponentDTO> returnValDTO = modelMapper.map(returnVal, ComponentDTO.TYPE);

            // ?????? DTO ??????
            ResultListDTO<ComponentDTO> resultList = new ResultListDTO<ComponentDTO>();
            resultList.setList(returnValDTO);
            resultList.setTotalCnt(returnValDTO.size());

            String message = msg("tps.common.success.insert");
            ResultDTO<ResultListDTO<ComponentDTO>> resultDTO = new ResultDTO<ResultListDTO<ComponentDTO>>(resultList, message);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT COMPONENT]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO INSERT COMPONENT]", e, true);
            throw new Exception(msg("tps.common.error.insert"), e);
        }
    }

    /**
     * ???????????? ??????
     *
     * @param componentSeq ?????????????????????
     * @param componentDTO ????????? ????????????DTO
     * @return ????????? ????????????DTO
     * @throws NoDataException      ???????????????
     * @throws InvalidDataException ???????????? ???????????? ??????
     * @throws Exception            ????????? ??????
     */
    @ApiOperation(value = "???????????? ??????")
    @PutMapping("/{componentSeq}")
    public ResponseEntity<?> putComponent(@ApiParam("???????????? ????????????(??????)") @PathVariable("componentSeq")
    @Min(value = 0, message = "{tps.component.error.min.componentSeq}") Long componentSeq,
            @ApiParam("???????????? ??????") @Valid @RequestBody ComponentDTO componentDTO)
            throws NoDataException, InvalidDataException, Exception {

        // ????????? ????????? ??????
        validData(componentDTO, ActionType.UPDATE);

        // ?????? ????????? ??????
        Component orgComponent = componentService
                .findComponentBySeq(componentSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.UPDATE, message, true);
                    return new NoDataException(message);
                });


        try {
            // ????????????
            Component newComponent = modelMapper.map(componentDTO, Component.class);

            // ????????????
            HistPublishDTO histSaveDTO = HistPublishDTO
                    .builder()
                    .status(EditStatusCode.SAVE)
                    .approvalYn(MokaConstants.NO)
                    .build();
            ComponentHist componentHist = componentHistService.insertComponentHist(newComponent, histSaveDTO);

            // ??????
            HistPublishDTO histPublishDTO = HistPublishDTO
                    .builder()
                    .status(EditStatusCode.PUBLISH)
                    .approvalYn(MokaConstants.YES)
                    .build();
            Component returnVal = componentService.updateComponent(newComponent, orgComponent, histPublishDTO);

            ComponentDTO returnValDTO = modelMapper.map(returnVal, ComponentDTO.class);
            returnValDTO = this.setPrevDataset(returnValDTO);

            // purge ??????!!!!  ????????????????????? ???????????? ?????????.
            purge(returnValDTO);

            // ??????
            String message = msg("tps.common.success.update");
            ResultDTO<ComponentDTO> resultDTO = new ResultDTO<ComponentDTO>(returnValDTO, message);
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE COMPONENT] seq: {} {}", componentDTO.getComponentSeq(), e.getMessage());
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE COMPONENT]", e, true);
            throw new Exception(msg("tps.common.error.update"), e);
        }
    }

    /**
     * ???????????? ??????
     *
     * @param componentSeq  ????????????SEQ
     * @param componentName ???????????????
     * @return ????????? ????????????
     * @throws InvalidDataException ??????????????? ????????????
     * @throws Exception            ?????? ??????
     */
    @ApiOperation(value = "???????????? ??????")
    @PostMapping("/{componentSeq}/copy")
    public ResponseEntity<?> copyComponent(@ApiParam("???????????? ????????????(??????)") @PathVariable("componentSeq")
    @Min(value = 0, message = "{tps.component.error.min.componentSeq}") Long componentSeq, @ApiParam("???????????????") String componentName)
            throws InvalidDataException, Exception {

        // ??????
        Component component = componentService
                .findComponentBySeq(componentSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.component.error.no-data");
                    tpsLogger.fail(ActionType.INSERT, message, true);
                    return new NoDataException(message);
                });

        ComponentDTO componentDTO = modelMapper.map(component, ComponentDTO.class);
        // ????????? ?????????????????? ??? ??????????????? ??????????????? null??? ?????????
        if (componentDTO
                .getDataType()
                .equals(TpsConstants.DATATYPE_DESK)) {
            componentDTO.setDataset(null);
        }
        componentDTO.setComponentSeq(null);
        componentDTO.setComponentName(componentName);

        return this.postComponent(componentDTO);
    }

    /**
     * ?????????????????? ?????????????????? ??????/????????? ?????? ???????????? ??????????????? ????????? ????????? (??????????????? ???????????? ?????????)
     *
     * @param componentDTO ????????????DTO
     * @return ????????????DTO
     */
    private ComponentDTO setPrevDataset(ComponentDTO componentDTO) {
        Long componentSeq = componentDTO.getComponentSeq();

        // ?????????????????? ????????? ???????????? ????????? ??????
        try {
            List<ComponentHist> deskHistory = componentHistService.findLastHist(componentSeq, TpsConstants.DATATYPE_DESK);
            if (deskHistory.size() > 0) {
                Dataset deskDataset = deskHistory
                        .get(0)
                        .getDataset();
                if (deskDataset != null) {
                    componentDTO.setPrevDeskDataset(modelMapper.map(deskDataset, DatasetDTO.class));
                }
            }
        } catch (Exception e) {
            log.error("[COMPONENT HISTORY LOAD FAIL] seq: {} {}", componentDTO.getComponentSeq(), e.getMessage());
        }

        // ?????????????????? ?????? ???????????? ????????? ??????
        try {
            List<ComponentHist> autoHistory = componentHistService.findLastHist(componentSeq, TpsConstants.DATATYPE_AUTO);
            if (autoHistory.size() > 0) {
                Dataset autoDataset = autoHistory
                        .get(0)
                        .getDataset();
                if (autoDataset != null) {
                    componentDTO.setPrevAutoDataset(modelMapper.map(autoDataset, DatasetDTO.class));
                }
            }
        } catch (Exception e) {
            log.error("[COMPONENT HISTORY LOAD FAIL] seq: {} {}", componentDTO.getComponentSeq(), e.getMessage());
        }

        return componentDTO;
    }

    /**
     * ???????????? ??????
     *
     * @param componentSeq ?????????????????????
     * @return ?????? ??????
     * @throws NoDataException ???????????????
     * @throws Exception       ??????????????? ????????? ?????? ?????????
     */
    @ApiOperation(value = "???????????? ??????")
    @DeleteMapping("/{componentSeq}")
    public ResponseEntity<?> deleteComponent(@ApiParam("???????????? ????????????(??????)") @PathVariable("componentSeq")
    @Min(value = 0, message = "{tps.component.error.min.componentSeq}") Long componentSeq)
            throws NoDataException, Exception {

        // ????????? ??????
        Component component = componentService
                .findComponentBySeq(componentSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.DELETE, message, true);
                    return new NoDataException(message);
                });

        // ??????????????? ??????
        Boolean hasRels = relationService.hasRelations(componentSeq, MokaConstants.ITEM_COMPONENT);
        if (hasRels) {
            String relMessage = msg("tps.common.error.delete.related");
            tpsLogger.fail(ActionType.DELETE, relMessage, true);
            throw new Exception(relMessage);
        }

        try {
            ComponentDTO returnValDTO = modelMapper.map(component, ComponentDTO.class);

            // ???????????? ??????
            componentService.deleteComponent(component);

            // purge ??????!!!!
            purge(returnValDTO);

            String message = msg("tps.common.success.delete");
            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, message);
            tpsLogger.success(ActionType.DELETE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE COMPONENT] seq: {} {}", componentSeq, e.getMessage());
            tpsLogger.error(ActionType.DELETE, "[FAIL TO DELETE COMPONENT]", e, true);
            throw new Exception(msg("tps.common.error.delete"), e);
        }
    }

    /**
     * ???????????? ???????????? ????????????
     *
     * @param search       ????????????
     * @param componentSeq ????????????SEQ
     * @return ???????????? ??????
     */
    @ApiOperation(value = "???????????? ???????????? ????????????")
    @GetMapping("/{componentSeq}/histories")
    public ResponseEntity<?> getHistoryList(@Valid @SearchParam SearchDTO search, @ApiParam("???????????? ????????????(??????)") @PathVariable("componentSeq")
    @Min(value = 0, message = "{tps.component.error.min.componentSeq}") Long componentSeq) {

        // ??????????????? ?????? (order by seq desc)
        List<String> sort = new ArrayList<String>();
        sort.add("seq,desc");
        search.setSort(sort);
        Pageable pageable = search.getPageable();

        // ???????????? ?????? ??????
        Page<ComponentHist> returnVal = componentHistService.findAllComponentHist(componentSeq, pageable);

        // entity -> DTO
        List<ComponentHistDTO> returnValDTO = modelMapper.map(returnVal.getContent(), ComponentHistDTO.TYPE);

        // ?????? DTO ??????
        ResultListDTO<ComponentHistDTO> resultList = new ResultListDTO<ComponentHistDTO>();
        resultList.setList(returnValDTO);
        resultList.setTotalCnt(returnValDTO.size());

        ResultDTO<ResultListDTO<ComponentHistDTO>> resultDTO = new ResultDTO<ResultListDTO<ComponentHistDTO>>(resultList);
        tpsLogger.success(ActionType.SELECT, true);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * ?????? ????????? ????????????
     *
     * @param componentSeq ????????????SEQ
     * @return ?????? ????????? ?????? ??????
     * @throws NoDataException ???????????????
     */
    @ApiOperation(value = "?????? ????????? ????????????")
    @GetMapping("/{componentSeq}/has-relations")
    public ResponseEntity<?> hasRelationList(@ApiParam("???????????? ????????????(??????)") @PathVariable("componentSeq")
    @Min(value = 0, message = "{tps.component.error.min.componentSeq}") Long componentSeq)
            throws Exception {

        // ???????????? ??????
        componentService
                .findComponentBySeq(componentSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.SELECT, message, true);
                    return new NoDataException(message);
                });

        try {
            Boolean chkRels = relationService.hasRelations(componentSeq, MokaConstants.ITEM_COMPONENT);

            String message = "";
            if (chkRels) {
                message = msg("tps.common.success.has-relations");
            }
            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(chkRels, message);
            tpsLogger.success(ActionType.SELECT, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[COMPONENT RELATION EXISTENCE CHECK FAILED] seq: {} {}", componentSeq, e.getMessage());
            tpsLogger.error(ActionType.DELETE, "[COMPONENT RELATION EXISTENCE CHECK FAILEDE]", e, true);
            throw new Exception(msg("tps.common.error.has-relation"), e);
        }
    }

    /**
     * ???????????? ????????? ????????? ??????
     *
     * @param component  ??????????????????
     * @param actionType ????????????(INSERT OR UPDATE)
     * @return
     */
    private void validData(ComponentDTO component, ActionType actionType)
            throws InvalidDataException {
        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (component != null) {
            // dataType??? AUTO ??? ?????? ????????? dataseq??? ??????
            if (component
                    .getDataType()
                    .equals("AUTO")) {
                if (component.getDataset() == null) {
                    String message = msg("tps.dataset.error.notnull.datasetSeq");
                    invalidList.add(new InvalidDataDTO("dataset", message));
                    tpsLogger.fail(actionType, message, true);
                }
            }

            if (component.getDataset() != null && component
                    .getDataset()
                    .getDatasetSeq() == null) {
                component.setDataset(null);
            }

            if (component.getEditFormPart() != null && component
                    .getEditFormPart()
                    .getPartSeq() == null) {
                component.setEditFormPart(null);
            }

        }

        if (invalidList.size() > 0) {
            String validMessage = msg("tps.common.error.invalidContent");
            throw new InvalidDataException(invalidList, validMessage);
        }
    }

    /**
     * tms????????? ????????????????????? ????????????. ?????? ??????????????? ????????? fileYn=Y??? ???????????? ????????????.
     *
     * @param returnValDTO ??????????????????
     * @return ?????????????????????
     * @throws DataLoadException
     * @throws TemplateMergeException
     * @throws TemplateParseException
     * @throws NoDataException
     */
    private String purge(ComponentDTO returnValDTO)
            throws DataLoadException, TemplateMergeException, TemplateParseException, NoDataException {
        // 1. ???????????? tms purge
        String returnValue = "";
        String retTemplate = purgeHelper.tmsPurge(Collections.singletonList(returnValDTO.toComponentItem()));
        if (McpString.isNotEmpty(retTemplate)) {
            log.error("[FAIL TO PURGE COMPONENT] seq: {} {}", returnValDTO.getComponentSeq(), retTemplate);
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO PURGE COMPONENT]", true);
            returnValue = String.join("\r\n", retTemplate);
        }

        // 2. fileYn=Y??? ??????????????? tms pageUpdate
        RelationSearchDTO search = RelationSearchDTO
                .builder()
                .domainId(returnValDTO
                        .getDomain()
                        .getDomainId())
                .fileYn(MokaConstants.YES)
                .relSeq(returnValDTO.getComponentSeq())
                .relSeqType(MokaConstants.ITEM_COMPONENT)
                .relType(MokaConstants.ITEM_PAGE)
                .build();
        search.setSize(9999);
        List<PageVO> pageList = relationService.findAllPage(search);
        String retPage = purgeHelper.tmsPageUpdate(pageList);
        if (McpString.isNotEmpty(retPage)) {
            log.error("[FAIL TO PAGE UPATE] componentSeq: {} {}", returnValDTO.getComponentSeq(), retPage);
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO PAGE UPATE]", true);
            returnValue = String.join("\r\n", retPage);
        }

        return returnValue;
    }

}
