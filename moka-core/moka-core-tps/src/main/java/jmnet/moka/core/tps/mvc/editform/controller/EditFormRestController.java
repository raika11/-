package jmnet.moka.core.tps.mvc.editform.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.Size;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.common.utils.dto.ResultMapDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.exception.DuplicateIdException;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.common.util.Downloader;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.code.EditStatusCode;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.helper.EditFormHelper;
import jmnet.moka.core.tps.mvc.editform.dto.ChannelFormatDTO;
import jmnet.moka.core.tps.mvc.editform.dto.EditFormDTO;
import jmnet.moka.core.tps.mvc.editform.dto.EditFormImportDTO;
import jmnet.moka.core.tps.mvc.editform.dto.EditFormPartDTO;
import jmnet.moka.core.tps.mvc.editform.dto.EditFormPartHistDTO;
import jmnet.moka.core.tps.mvc.editform.dto.EditFormPartHistSearchDTO;
import jmnet.moka.core.tps.mvc.editform.dto.EditFormPartSearchDTO;
import jmnet.moka.core.tps.mvc.editform.dto.EditFormSearchDTO;
import jmnet.moka.core.tps.mvc.editform.dto.FieldGroupDTO;
import jmnet.moka.core.tps.mvc.editform.entity.EditForm;
import jmnet.moka.core.tps.mvc.editform.entity.EditFormPart;
import jmnet.moka.core.tps.mvc.editform.entity.EditFormPartHist;
import jmnet.moka.core.tps.mvc.editform.service.EditFormService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.web.wms.mvc.main.controller
 * ClassName : AppRestController
 * Created : 2020-10-26 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-26 09:14
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/edit-forms")
@Api(tags = {"????????? API"})
public class EditFormRestController extends AbstractCommonController {

    private final EditFormHelper editFormHelper;

    private final ObjectMapper objectMapper;

    private final static String DEFAULT_SITE = "joongang";

    private final EditFormService editFormService;

    private final CollectionType collectionType;

    /**
     * ?????????
     *
     * @param tpsLogger       tps logger
     * @param editFormHelper  legacy xml ????????? helper
     * @param objectMapper    objectMapper
     * @param modelMapper     modelMapper
     * @param editFormService editFormService
     * @param messageByLocale messageByLocale
     */
    public EditFormRestController(TpsLogger tpsLogger, EditFormHelper editFormHelper, ObjectMapper objectMapper, ModelMapper modelMapper,
            EditFormService editFormService, MessageByLocale messageByLocale) {
        this.tpsLogger = tpsLogger;
        this.editFormHelper = editFormHelper;
        this.objectMapper = objectMapper;
        this.modelMapper = modelMapper;
        this.editFormService = editFormService;
        this.messageByLocale = messageByLocale;
        collectionType = objectMapper
                .getTypeFactory()
                .constructCollectionType(List.class, FieldGroupDTO.class);
    }

    /**
     * ?????? ??? ?????? ??????
     *
     * @param search ?????? ??????
     * @return ?????? ??????
     */
    @ApiOperation(value = "Edit Form ????????? ??????")
    @GetMapping
    public ResponseEntity<?> getEditFormList(@SearchParam EditFormSearchDTO search) {

        ResultListDTO<EditFormDTO> resultListMessage = new ResultListDTO<>();

        // ??????
        if (McpString.isYes(search.getUseTotal())) {
            Page<EditForm> returnValue = editFormService.findAllEditForm(search);
            List<EditFormDTO> resultDTOs = modelMapper.map(returnValue.getContent(), EditFormDTO.TYPE);
            resultListMessage.setTotalCnt(returnValue.getTotalElements());
            resultListMessage.setList(resultDTOs);
        } else {
            List<EditForm> returnValue = editFormService.findAllEditForm();
            List<EditFormDTO> resultDTOs = modelMapper.map(returnValue, EditFormDTO.TYPE);
            resultListMessage.setList(resultDTOs);
        }

        ResultDTO<ResultListDTO<EditFormDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(true);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ?????? ??? Part ?????? ??????
     *
     * @param search ?????? ??????
     * @return ?????? ??????
     */
    @ApiOperation(value = "Edit Form Part ????????? ??????")
    @GetMapping("/parts")
    public ResponseEntity<?> getEditFormPartList(@SearchParam EditFormPartSearchDTO search) {

        ResultListDTO<EditFormPartDTO> resultListMessage = new ResultListDTO<>();

        // ??????
        Page<EditFormPart> returnValue = editFormService.findAllEditFormPart(search);
        List<EditFormPartDTO> resultDTOs = modelMapper.map(returnValue.getContent(), EditFormPartDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(resultDTOs);

        ResultDTO<ResultListDTO<EditFormPartDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(true);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }


    /**
     * ?????? ??? ??????
     *
     * @param formSeq ?????? ??? ????????????
     * @return ?????? ??? ??????
     * @throws NoDataException ????????? ?????? ?????? ??????
     */
    @ApiOperation(value = "Edit Form ????????? ??????")
    @GetMapping("/{formSeq}")
    public ResponseEntity<?> getEditForm(
            @ApiParam("??? ????????????") @PathVariable("formSeq") @Min(value = 0, message = "{tps.edit-form.error.min.formSeq}") Long formSeq)
            throws NoDataException {

        EditFormDTO editFormDTO = getEditFormAndFieldMarshalling(formSeq);
        ResultMapDTO resultMapDTO = new ResultMapDTO(HttpStatus.OK);
        resultMapDTO.addBodyAttribute("editForm", editFormDTO);
        return new ResponseEntity<>(resultMapDTO, HttpStatus.OK);
    }

    private EditFormDTO getEditFormAndFieldMarshalling(Long formSeq)
            throws NoDataException {
        EditForm editForm = editFormService
                .findEditFormBySeq(formSeq)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        EditFormDTO editFormDTO = modelMapper.map(editForm, EditFormDTO.class);
        if (editFormDTO.getEditFormParts() != null) {
            editFormDTO
                    .getEditFormParts()
                    .forEach(part -> {
                        try {
                            if (McpString.isNotEmpty(part.getFormData())) {
                                part.setFieldGroups(objectMapper.readValue(part.getFormData(), collectionType));
                                part.setFormData(null);
                            }
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    });
        }
        return editFormDTO;
    }


    /**
     * ?????? ??? ????????? ??????
     *
     * @param partSeq ????????? ????????????
     * @return ?????? ??? ????????? ??????
     * @throws NoDataException ????????? ?????? ?????? ??????
     * @throws IOException     json ?????? ??????
     */
    @ApiOperation(value = "Edit Form ????????? ??????")
    @GetMapping("/parts/{partSeq}")
    public ResponseEntity<?> getEditFormPart(
            @ApiParam("??? Part ????????????") @PathVariable("partSeq") @Min(value = 0, message = "{tps.edit-form.error.min.partSeq}") Long partSeq)
            throws NoDataException, IOException {

        EditFormPart editFormPart = editFormService
                .findEditFormPartBySeq(partSeq)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        EditFormPartDTO editFormPartExtDTO = modelMapper.map(editFormPart, EditFormPartDTO.class);

        editFormPartExtDTO.setFieldGroups(objectMapper.readValue(editFormPart.getFormData(), collectionType));
        editFormPartExtDTO.setFormData(null);

        ResultDTO<EditFormPartDTO> resultDTO = new ResultDTO<>(editFormPartExtDTO);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * ?????? ??? xml export
     *
     * @param formSeq ?????? ??? ????????????
     * @throws Exception ?????? ??????
     */
    @ApiOperation(value = "Edit Form ????????? ??????")
    @GetMapping("/{formSeq}/export")
    public void getEditFormXmlExport(HttpServletResponse response,
            @ApiParam("??? ????????????") @PathVariable("formSeq") @Min(value = 0, message = "{tps.edit-form.error.min.formSeq}") Long formSeq)
            throws Exception {

        EditForm editForm = editFormService
                .findEditFormBySeq(formSeq)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        EditFormDTO editFormDTO = modelMapper.map(editForm, EditFormDTO.class);

        if (editFormDTO.getEditFormParts() != null) {
            editFormDTO
                    .getEditFormParts()
                    .forEach(part -> {
                        try {
                            if (McpString.isNotEmpty(part.getFormData())) {
                                part.setFieldGroups(objectMapper.readValue(part.getFormData(), collectionType));
                                part.setFormData(null);
                            }
                        } catch (IOException ex) {
                            part.setFieldGroups(null);
                        }
                    });
        }

        String fileName = editFormDTO
                .getFormId()
                .endsWith(".xml") ? editFormDTO.getFormId() : editFormDTO.getFormId() + ".xml";
        //xml ?????? ????????????
        Downloader.download(response, MediaType.TEXT_XML_VALUE, fileName, editFormHelper.convertPartXml(editFormDTO));
    }

    /**
     * ?????? ??? Part xml export
     *
     * @param partSeq ????????? ????????????
     * @throws Exception ?????? ?????? ??????
     */
    @ApiOperation(value = "Edit Form ????????? ??????")
    @GetMapping("/parts/{partSeq}/export")
    public void getEditFormPartXmlExport(HttpServletResponse response,
            @ApiParam("??? Part ????????????") @PathVariable("partSeq") @Min(value = 0, message = "{tps.edit-form.error.min.partSeq}") Long partSeq)
            throws Exception {

        EditFormPart editFormPart = editFormService
                .findEditFormPartBySeq(partSeq)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        EditFormPartDTO editFormPartExtDTO = modelMapper.map(editFormPart, EditFormPartDTO.class);

        editFormPartExtDTO.setFieldGroups(objectMapper.readValue(editFormPart.getFormData(), collectionType));
        editFormPartExtDTO.setFormData(null);

        //xml ?????? ????????????
        Downloader.download(response, MediaType.TEXT_XML_VALUE, editFormPartExtDTO.getPartTitle() + ".xml",
                editFormHelper.convertPartXml(editFormPartExtDTO));
    }

    /**
     * ?????? ??? Part ?????? ?????? ??????
     *
     * @param partSeq ????????? ????????????
     * @return ?????? ??? ????????? ??????
     */
    @ApiOperation(value = "Edit Form ????????? ??????")
    @GetMapping("/parts/{partSeq}/historys")
    public ResponseEntity<?> getEditFormPartHistoryList(
            @ApiParam("??? Part ????????????") @PathVariable("partSeq") @Min(value = 0, message = "{tps.edit-form.error.min.partSeq}") Long partSeq,
            @SearchParam EditFormPartHistSearchDTO search) {

        ResultListDTO<EditFormPartHistDTO> resultListMessage = new ResultListDTO<>();

        search.setPartSeq(partSeq);

        Page<EditFormPartHist> editFormPartHistorys = editFormService.findAllEditFormPartHistory(search);

        List<EditFormPartHistDTO> resultDTOs = modelMapper.map(editFormPartHistorys.getContent(), EditFormPartHistDTO.TYPE);
        resultListMessage.setTotalCnt(editFormPartHistorys.getTotalElements());
        resultListMessage.setList(resultDTOs);

        ResultDTO<ResultListDTO<EditFormPartHistDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(true);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ?????? ??? Part ?????? ??????
     *
     * @param partSeq ????????? ????????????
     * @param seqNo   ?????? ??? Part ?????? ????????????
     * @return ?????? ??? ????????? ??????
     * @throws NoDataException ????????? ?????? ?????? ??????
     * @throws IOException     json ?????? ??????
     */
    @ApiOperation(value = "Edit Form ????????? ??????")
    @GetMapping("/parts/{partSeq}/historys/{seqNo}")
    public ResponseEntity<?> getEditFormPartHistory(
            @ApiParam("??? Part ????????????") @PathVariable("partSeq") @Min(value = 0, message = "{tps.edit-form.error.min.partSeq}") Long partSeq,
            @ApiParam("???????????? ????????????") @PathVariable("seqNo") @Min(value = 0, message = "{tps.edit-form.error.min.seqNo}") Long seqNo)
            throws NoDataException, IOException {

        EditFormPartHist editFormPartHist = editFormService
                .findEditFormPartHistoryBySeq(seqNo)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        EditFormPartHistDTO editFormPartExtDTO = modelMapper.map(editFormPartHist, EditFormPartHistDTO.class);

        editFormPartExtDTO.setFieldGroups(objectMapper.readValue(editFormPartHist.getFormData(), collectionType));
        editFormPartExtDTO.setFormData(null);

        ResultDTO<EditFormPartHistDTO> resultDTO = new ResultDTO<>(editFormPartExtDTO);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }



    /**
     * ?????? ?????? ????????? ???????????? Form part ??????
     *
     * @param partSeq ????????? ????????????
     * @return ?????? ??? ????????? ??????
     * @throws NoDataException ????????? ?????? ?????? ??????
     * @throws IOException     json ?????? ??????
     */
    @ApiOperation(value = "?????? ????????? ???????????? Form part ??????")
    @GetMapping("/parts/{partSeq}/historys/lastest-saved")
    public ResponseEntity<?> getEditFormPartLastSavedHistory(
            @ApiParam("??? Part ????????????") @PathVariable("partSeq") @Min(value = 0, message = "{tps.edit-form.error.min.partSeq}") Long partSeq)
            throws NoDataException, IOException {

        return getLastHistory(partSeq, EditStatusCode.SAVE, MokaConstants.NO);
    }

    /**
     * ?????? ?????? ????????? ???????????? Form part ??????
     *
     * @param partSeq ????????? ????????????
     * @return ?????? ??? ????????? ??????
     * @throws NoDataException ????????? ?????? ?????? ??????
     * @throws IOException     json ?????? ??????
     */
    @ApiOperation(value = "?????? ????????? ???????????? Form part ??????")
    @GetMapping("/parts/{partSeq}/historys/lastest-published")
    public ResponseEntity<?> getEditFormPartLastPublishedHistory(
            @PathVariable("partSeq") @Min(value = 0, message = "{tps.edit-form.error.min.partSeq}") Long partSeq)
            throws NoDataException, IOException {

        return getLastHistory(partSeq, EditStatusCode.PUBLISH, MokaConstants.YES);
    }

    /**
     * ????????? ?????? ?????? ??????
     *
     * @param partSeq    ???????????? ????????????
     * @param statusCode ??????
     * @return ResponseEntity
     * @throws NoDataException ????????? ?????? ????????????
     * @throws IOException     IO ????????????
     */
    public ResponseEntity<?> getLastHistory(Long partSeq, EditStatusCode statusCode, String approvalYn)
            throws NoDataException, IOException {
        EditFormPartHist editFormPartHist = editFormService
                .findEditFormPartLastHistory(EditFormPartHist
                        .builder()
                        .partSeq(partSeq)
                        .status(statusCode)
                        .approvalYn(approvalYn)
                        .build())
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        EditFormPartHistDTO editFormPartExtDTO = modelMapper.map(editFormPartHist, EditFormPartHistDTO.class);

        editFormPartExtDTO.setFieldGroups(objectMapper.readValue(editFormPartHist.getFormData(), collectionType));
        editFormPartExtDTO.setFormData(null);

        ResultDTO<EditFormPartHistDTO> resultDTO = new ResultDTO<>(editFormPartExtDTO);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * ?????? ??? Part ?????? ??????
     *
     * @param partSeq ????????? ????????????
     * @param seqNo   ?????? ??? Part ?????? ????????????
     * @throws NoDataException ????????? ?????? ?????? ??????
     * @throws IOException     json ?????? ??????
     */
    @ApiOperation(value = "Edit Form ????????? ??????")
    @GetMapping("/parts/{partSeq}/historys/{seqNo}/export")
    public void getEditFormPartHistoryExport(HttpServletResponse response,
            @ApiParam("??? Part ????????????") @PathVariable("partSeq") @Min(value = 0, message = "{tps.edit-form.error.min.partSeq}") Long partSeq,
            @ApiParam("?????? ?????? ????????????") @PathVariable("seqNo") @Min(value = 0, message = "{tps.edit-form.error.min.seqNo}") Long seqNo)
            throws Exception {

        EditFormPartHist editFormPartHist = editFormService
                .findEditFormPartHistoryBySeq(seqNo)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        EditFormPartHistDTO editFormPartExtDTO = modelMapper.map(editFormPartHist, EditFormPartHistDTO.class);

        editFormPartExtDTO.setFieldGroups(objectMapper.readValue(editFormPartHist.getFormData(), collectionType));
        editFormPartExtDTO.setFormData(null);

        //xml ?????? ????????????
        Downloader.download(response, MediaType.TEXT_XML_VALUE, editFormPartExtDTO
                .getEditFormPart()
                .getPartTitle() + "_" + editFormPartExtDTO.getSeqNo() + ".xml", editFormHelper.convertPartXml(editFormPartExtDTO));
    }


    /**
     * legacy xml??? ???????????? db??? ??????
     *
     * @return ?????? ??????
     * @throws MokaException ?????? ?????? ??????
     */
    @ApiOperation(value = "Edit form ????????? xml ?????? ???????????? DB??? ????????????.")
    @PostMapping(value = "/import-xml", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_UTF8_VALUE})
    public ResponseEntity<?> postEditFormXmlToDB(@Valid EditFormImportDTO editFormImport)
            throws MokaException {

        try {
            long formSeq;
            MultipartFile file = editFormImport.getFile();
            String xml = new String(file.getBytes());

            if (xml.contains("<channelFormat>")) { // legacy xml ?????????
                ChannelFormatDTO channelFormatDTO = editFormHelper.mapping(DEFAULT_SITE, file.getOriginalFilename(), file.getBytes());
                EditForm editForm = modelMapper.map(channelFormatDTO, EditForm.class);
                editForm.setEditFormParts(new HashSet<>());
                final EditForm newEditForm = editFormService.insertEditForm(editForm);
                channelFormatDTO
                        .getParts()
                        .forEach(partDTO -> {
                            EditFormPart editFormPart = modelMapper.map(partDTO, EditFormPart.class);
                            editFormPart.setFormSeq(newEditForm.getFormSeq());
                            try {
                                Date reserveDt = McpString.isNotEmpty(partDTO.getReserveDate())
                                        ? McpDate.date("yyyy/MM/dd HH:mm:ss", partDTO.getReserveDate())
                                        : null;
                                editFormPart.setFormData(objectMapper.writeValueAsString(partDTO.getFieldGroups()));
                                editForm
                                        .getEditFormParts()
                                        .add(editFormService.insertEditFormPart(editFormPart, partDTO.getStatus(), reserveDt));
                            } catch (Exception e) {
                                log.error(e.toString());
                            }
                        });
                formSeq = newEditForm.getFormSeq();
            } else if (xml.contains("<editForm>")) { // ???????????? ?????? ??? xml??? ?????????
                EditFormDTO editFormDTO = editFormHelper.getEditForm(xml);
                EditForm editForm = modelMapper.map(editFormDTO, EditForm.class);
                editForm.setEditFormParts(new HashSet<>());

                if (editFormImport.getFormSeq() == null || editFormImport.getFormSeq() == 0) {
                    editForm.setFormSeq(null);
                    EditForm newEditForm = editFormService.insertEditForm(editForm);
                    formSeq = newEditForm.getFormSeq();
                    editFormDTO
                            .getEditFormParts()
                            .forEach(partDTO -> {
                                try {
                                    EditFormPart editFormPart = modelMapper.map(partDTO, EditFormPart.class);
                                    editFormPart.setFormSeq(newEditForm.getFormSeq());
                                    editFormPart.setPartSeq(null);
                                    editFormPart.setFormData(objectMapper.writeValueAsString(partDTO.getFieldGroups()));
                                    editFormService.insertEditFormPart(editFormPart, EditStatusCode.SAVE, null);
                                } catch (Exception ex) {
                                    log.error(ex.toString());
                                }
                            });
                } else {
                    // ?????? ????????? ?????? ?????? ?????? ??????
                    editFormService
                            .findEditFormBySeq(editFormImport.getFormSeq())
                            .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));
                    editForm.setFormSeq(editFormImport.getFormSeq());
                    editFormService.updateEditForm(editForm);
                    formSeq = editFormImport.getFormSeq();
                    editFormDTO
                            .getEditFormParts()
                            .forEach(partDTO -> {
                                EditFormPart editFormPart = modelMapper.map(partDTO, EditFormPart.class);
                                editFormPart.setFormSeq(editForm.getFormSeq());
                                try {
                                    editFormPart.setFormData(objectMapper.writeValueAsString(partDTO.getFieldGroups()));
                                    editForm
                                            .getEditFormParts()
                                            .add(editFormService.insertEditFormPart(editFormPart, EditStatusCode.SAVE, null));
                                } catch (Exception e) {
                                    log.error(e.toString());
                                }
                            });
                }

            } else if (xml.contains("<part>")) { // ???????????? ?????? ??? Part xml??? ?????????
                // xml?????? form part ?????? ????????????
                EditFormPartDTO editFormPartDTO = editFormHelper.getEditFormPart(xml);
                EditFormPart editFormPart = modelMapper.map(editFormPartDTO, EditFormPart.class);

                if (editFormImport.getPartSeq() == null || editFormImport.getPartSeq() == 0) {
                    // part xml??? ???????????? part??? ????????? ???????????? ???????????? ?????? ???????????? ?????? ?????? ?????? ??????
                    throw new NoDataException(msg("tps.common.error.no-data"));
                }
                // ?????? ????????? ?????? ?????? ?????? ??????
                editFormService
                        .findEditFormPartBySeq(editFormImport.getPartSeq())
                        .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));
                formSeq = editFormImport.getFormSeq();
                // part xml ???????????? ????????? ???????????? ????????? ????????????
                editFormPart.setPartSeq(editFormImport.getPartSeq());
                editFormPart.setFormSeq(editFormImport.getFormSeq());
                editFormPart.setFormData(objectMapper.writeValueAsString(editFormPartDTO.getFieldGroups()));
                editFormService.updateEditFormPart(editFormPart, EditStatusCode.SAVE, null);

            } else {
                throw new MokaException(msg("tps.edit-form.error.xml-format"));
            }
            if (formSeq > 0) {
                ResultDTO<EditFormDTO> resultMapDTO = new ResultDTO<>(EditFormDTO
                        .builder()
                        .formSeq(formSeq)
                        .build(), msg("tps.edit-form.success.xml-import"));
                return new ResponseEntity<>(resultMapDTO, HttpStatus.OK);
            } else {
                ResultDTO<EditFormDTO> resultDTO = new ResultDTO<>(TpsConstants.HEADER_FILE_ERROR, msg("tps.edit-form.error.xml-import"));
                return new ResponseEntity<>(resultDTO, HttpStatus.OK);
            }



        } catch (Exception ex) {
            throw new MokaException(ex);
        }
    }

    /**
     * ?????? ??? ??????
     *
     * @param editFormDTO   ?????? ??? ??????
     * @param editFormParts ?????? ??? ????????? ??????
     * @return ?????? ??????
     * @throws MokaException ?????? ?????? ??????
     */
    @ApiOperation(value = "Edit form ??????")
    @PostMapping
    public ResponseEntity<?> postEditForm(@Valid EditFormDTO editFormDTO, @RequestBody List<@Valid EditFormPartDTO> editFormParts)
            throws MokaException {

        try {
            EditForm editForm = modelMapper.map(editFormDTO, EditForm.class);

            if (editFormService.isDuplicatedId(editForm)) {
                throw new DuplicateIdException(msg("tps.common.error.duplicated.id"));
            }
            Set<String> partIdSet = new HashSet<>();
            List<EditFormPartDTO> editFormPartDTOS = new ArrayList<>();
            EditForm newEditForm = editFormService.insertEditForm(editForm);
            if (editFormParts != null && editFormParts.size() > 0) {
                for (EditFormPartDTO editFormPartDTO : editFormParts) {
                    if (partIdSet.contains(editFormPartDTO.getPartId())) {
                        throw new DuplicateIdException(msg("tps.edit-form.error.duplicate.partId"));
                    }
                    partIdSet.add(editFormPartDTO.getPartId());
                }
                for (EditFormPartDTO editFormPartDTO : editFormParts) {
                    objectMapper.readValue(editFormPartDTO.getFormData(), collectionType);
                    EditFormPart editFormPart = modelMapper.map(editFormPartDTO, EditFormPart.class);
                    editFormPart.setFormSeq(newEditForm.getFormSeq());
                    editFormPart = editFormService.insertEditFormPart(editFormPart, editFormPartDTO.getStatus(), editFormPartDTO.getReserveDt());
                    editFormPartDTOS.add(modelMapper.map(editFormPart, EditFormPartDTO.class));
                }
            }


            ResultMapDTO resultMapDTO = new ResultMapDTO();
            resultMapDTO.addBodyAttribute("editForm", editFormDTO);
            resultMapDTO.addBodyAttribute("editFormParts", editFormPartDTOS);
            return new ResponseEntity<>(resultMapDTO, HttpStatus.OK);

        } catch (Exception ex) {
            throw new MokaException(ex);
        }
    }

    /**
     * ?????? ??? ????????? ??????
     *
     * @param editFormPartDTO ?????? ??? ????????? ??????
     * @return ?????? ??????
     * @throws MokaException ?????? ?????? ??????
     */
    @ApiOperation(value = "Edit form part ??????")
    @PostMapping("/parts")
    public ResponseEntity<?> postEditFormPart(@Valid EditFormPartDTO editFormPartDTO)
            throws MokaException {

        try {
            objectMapper.readValue(editFormPartDTO.getFormData(), collectionType);
            EditFormPart editFormPart = modelMapper.map(editFormPartDTO, EditFormPart.class);

            if (editFormService.isDuplicatedId(editFormPart)) {
                throw new DuplicateIdException(msg("tps.edit-form.error.duplicate.partId"));
            }
            editFormPart.setFormSeq(editFormPartDTO.getFormSeq());
            editFormPart = editFormService.insertEditFormPart(editFormPart, editFormPartDTO.getStatus(), editFormPartDTO.getReserveDt());

            ResultDTO<EditFormPartDTO> resultPartDTO = new ResultDTO<>(modelMapper.map(editFormPart, EditFormPartDTO.class));
            return new ResponseEntity<>(resultPartDTO, HttpStatus.OK);

        } catch (Exception ex) {
            throw new MokaException(ex);
        }
    }

    /**
     * ?????? ??? ??????
     *
     * @param formSeq       ?????? ??? ????????????
     * @param editFormDTO   ?????? ??? ??????
     * @param editFormParts ?????? ??? ????????? ??????
     * @return ?????? ??????
     * @throws MokaException ?????? ?????? ??????
     */
    @ApiOperation(value = "Edit form ??????")
    @PutMapping("/{formSeq}")
    public ResponseEntity<?> putEditForm(
            @ApiParam("??? ????????????") @PathVariable("formSeq") @Min(value = 0, message = "{tps.edit-form.error.min.formSeq}") Long formSeq,
            @Valid EditFormDTO editFormDTO, @RequestBody List<@Valid EditFormPartDTO> editFormParts)
            throws MokaException {

        try {
            EditForm editForm = modelMapper.map(editFormDTO, EditForm.class);

            EditForm orgEditForm = editFormService
                    .findEditFormBySeq(formSeq)
                    .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));
            if (editFormService.isDuplicatedId(editForm)) {
                throw new DuplicateIdException(msg("tps.common.error.duplicated.id"));
            }
            Set<String> partIdSet = new HashSet<>();
            List<EditFormPartDTO> editFormPartDTOS = new ArrayList<>();
            editForm.setFormSeq(orgEditForm.getFormSeq());
            editForm = editFormService.updateEditForm(editForm);

            if (editFormParts != null && editFormParts.size() > 0) {
                for (EditFormPartDTO editFormPartDTO : editFormParts) {
                    if (partIdSet.contains(editFormPartDTO.getPartId())) {
                        throw new DuplicateIdException(msg("tps.edit-form.error.duplicate.partId"));
                    }
                    partIdSet.add(editFormPartDTO.getPartId());
                }
                for (EditFormPartDTO editFormPartDTO : editFormParts) {
                    objectMapper.readValue(editFormPartDTO.getFormData(), collectionType);
                    final EditFormPart editFormPart = modelMapper.map(editFormPartDTO, EditFormPart.class);
                    editFormPart.setFormSeq(editForm.getFormSeq());

                    EditFormPart orgEditFormPart = editFormService
                            .findEditFormPart(editFormPart)
                            .orElse(null);

                    if (orgEditFormPart != null) {
                        editFormPart.setPartSeq(orgEditFormPart.getPartSeq());
                        editFormService.updateEditFormPart(editFormPart, editFormPartDTO.getStatus(), editFormPartDTO.getReserveDt());
                    } else {
                        editFormService.insertEditFormPart(editFormPart, editFormPartDTO.getStatus(), editFormPartDTO.getReserveDt());
                    }

                    editFormPartDTOS.add(modelMapper.map(editFormPart, EditFormPartDTO.class));
                }
            }

            ResultMapDTO resultMapDTO = new ResultMapDTO();
            resultMapDTO.addBodyAttribute("editForm", editFormDTO);
            resultMapDTO.addBodyAttribute("editFormParts", editFormPartDTOS);
            return new ResponseEntity<>(resultMapDTO, HttpStatus.OK);

        } catch (Exception ex) {
            throw new MokaException(ex);
        }
    }

    /**
     * ?????? ??? ????????? ??????
     *
     * @param partSeq         ????????? ????????????
     * @param editFormPartDTO ?????? ??? ????????? ??????
     * @return ?????? ??????
     * @throws MokaException ?????? ?????? ??????
     */
    @ApiOperation(value = "Edit form part ??????")
    @PutMapping("/parts/{partSeq}")
    public ResponseEntity<?> putEditFormPart(
            @ApiParam("??? Part ????????????") @PathVariable("partSeq") @Min(value = 0, message = "{tps.edit-form.error.min.partSeq}") Long partSeq,
            @Valid EditFormPartDTO editFormPartDTO)
            throws MokaException {

        try {
            objectMapper.readValue(editFormPartDTO.getFormData(), collectionType);
            EditFormPart editFormPart = modelMapper.map(editFormPartDTO, EditFormPart.class);

            EditFormPart oldEditFormPart = editFormService
                    .findEditFormPartBySeq(partSeq)
                    .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

            editFormPart.setFormSeq(oldEditFormPart.getFormSeq());
            editFormPart.setPartSeq(oldEditFormPart.getPartSeq());

            editFormPart = editFormService.updateEditFormPart(editFormPart, editFormPartDTO.getStatus(), editFormPartDTO.getReserveDt());

            ResultDTO<EditFormPartDTO> resultPartDTO = new ResultDTO<>(modelMapper.map(editFormPart, EditFormPartDTO.class));
            return new ResponseEntity<>(resultPartDTO, HttpStatus.OK);

        } catch (Exception ex) {
            throw new MokaException(ex);
        }
    }

    /**
     * ??????
     *
     * @param request ??????
     * @param formSeq ?????? ??? ???????????? (??????)
     * @return ??????????????????
     * @throws InvalidDataException ????????????????????????
     * @throws NoDataException      ?????? ??? ?????? ??????
     * @throws Exception            ??? ??? ????????????
     */
    @ApiOperation(value = "?????? ??? ??????")
    @DeleteMapping("/{formSeq}")
    public ResponseEntity<?> deleteEditForm(HttpServletRequest request,
            @ApiParam("??? ????????????") @PathVariable("formSeq") @Min(value = 0, message = "{tps.edit-form.error.min.formSeq}") Long formSeq)
            throws InvalidDataException, NoDataException, Exception {


        boolean success = false;
        String message;

        try {

            // ??????
            if (editFormService.deleteEditFormBySeq(formSeq) > 0) {
                success = true;
                message = msg("tps.edit-form.success.delete", request);
            } else {
                message = msg("tps.edit-form.error.delete", request);
            }

            if (success) {
                // ?????? ????????? ?????? ?????? ??????
                tpsLogger.success(message);
            } else {
                tpsLogger.fail(message);
            }

            // ????????????
            ResultDTO<Boolean> resultDTO = new ResultDTO<>(success);

            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE FORM] menuId: {} {}", formSeq, e.getMessage());
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(e);
            throw new Exception(msg("tps.edit-form.error.delete", request), e);
        }
    }

    /**
     * ??????
     *
     * @param request ??????
     * @return ??????????????????
     * @throws InvalidDataException ????????????????????????
     * @throws NoDataException      ?????? ??? ?????? ??????
     * @throws Exception            ??? ??? ????????????
     */
    @ApiOperation(value = "?????? ??? ??????")
    @DeleteMapping("/parts/{partSeq}")
    public ResponseEntity<?> deleteEditFormPart(HttpServletRequest request,
            @ApiParam("??? Part ????????????") @PathVariable("partSeq") @Min(value = 0, message = "{tps.edit-form.error.min.partSeq}") Long partSeq)
            throws InvalidDataException, NoDataException, Exception {


        boolean success = false;
        String message;

        try {

            // ??????
            if (editFormService.deleteEditFormPart(partSeq) > 0) {
                success = true;
                message = msg("tps.edit-form-part.success.delete", request);
            } else {
                message = msg("tps.edit-form-part.error.delete", request);
            }

            if (success) {
                // ?????? ????????? ?????? ?????? ??????
                tpsLogger.success(message);
            } else {
                tpsLogger.fail(message);
            }

            // ????????????
            ResultDTO<Boolean> resultDTO = new ResultDTO<>(success);

            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE FORM PART] menuId: {} {}", partSeq, e.getMessage());
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(e);
            throw new Exception(msg("tps.edit-form.error.delete", request), e);
        }
    }

    /**
     * ID ?????? ??????
     *
     * @param formId ?????? ??? ID (??????)
     * @return ????????????
     * @throws InvalidDataException ????????????????????????
     * @throws NoDataException      ?????? ??? ?????? ??????
     * @throws Exception            ??? ??? ????????????
     */
    @ApiOperation(value = "?????? ??? ??????")
    @GetMapping("/{formId}/exists")
    public ResponseEntity<?> getExistFormId(
            @ApiParam("??? ID") @PathVariable("formId") @Size(min = 1, max = 30, message = "{tps.edit-form.error.size.formId}") String formId)
            throws InvalidDataException, NoDataException, Exception {


        boolean exists = false;
        String message = "";

        try {

            // ??????
            if (editFormService.countEditFormById(formId) > 0) {
                exists = true;
                message = msg("tps.edit-form.error.duplicate.formId");
            }

            // ????????????
            ResultDTO<Boolean> resultDTO = new ResultDTO<>(exists, message);

            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO SELECT FORM] menuId: {} {}", formId, e.getMessage());
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(e);
            throw new Exception(msg("tps.edit-form.error.select", formId), e);
        }
    }

}
