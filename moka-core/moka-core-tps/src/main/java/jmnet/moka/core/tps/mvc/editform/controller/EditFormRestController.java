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
@Api(tags = {"편집폼 API"})
public class EditFormRestController extends AbstractCommonController {

    private final EditFormHelper editFormHelper;

    private final ObjectMapper objectMapper;

    private final static String DEFAULT_SITE = "joongang";

    private final EditFormService editFormService;

    private final CollectionType collectionType;

    /**
     * 생성자
     *
     * @param tpsLogger       tps logger
     * @param editFormHelper  legacy xml 처리용 helper
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
     * 편집 폼 목록 조회
     *
     * @param search 검색 조건
     * @return 검색 결과
     */
    @ApiOperation(value = "Edit Form 데이터 조회")
    @GetMapping
    public ResponseEntity<?> getEditFormList(@SearchParam EditFormSearchDTO search) {

        ResultListDTO<EditFormDTO> resultListMessage = new ResultListDTO<>();

        // 조회
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
     * 편집 폼 Part 목록 조회
     *
     * @param search 검색 조건
     * @return 검색 결과
     */
    @ApiOperation(value = "Edit Form Part 데이터 조회")
    @GetMapping("/parts")
    public ResponseEntity<?> getEditFormPartList(@SearchParam EditFormPartSearchDTO search) {

        ResultListDTO<EditFormPartDTO> resultListMessage = new ResultListDTO<>();

        // 조회
        Page<EditFormPart> returnValue = editFormService.findAllEditFormPart(search);
        List<EditFormPartDTO> resultDTOs = modelMapper.map(returnValue.getContent(), EditFormPartDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(resultDTOs);

        ResultDTO<ResultListDTO<EditFormPartDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(true);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }


    /**
     * 편집 폼 조회
     *
     * @param formSeq 편집 폼 일련번호
     * @return 편집 폼 정보
     * @throws NoDataException 데이터 없음 에러 처리
     */
    @ApiOperation(value = "Edit Form 데이터 조회")
    @GetMapping("/{formSeq}")
    public ResponseEntity<?> getEditForm(
            @ApiParam("폼 일련번호") @PathVariable("formSeq") @Min(value = 0, message = "{tps.edit-form.error.min.formSeq}") Long formSeq)
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
     * 편집 폼 아이템 조회
     *
     * @param partSeq 아이템 일련번호
     * @return 편집 폼 아이템 정보
     * @throws NoDataException 데이터 없음 에러 처리
     * @throws IOException     json 처리 오류
     */
    @ApiOperation(value = "Edit Form 데이터 조회")
    @GetMapping("/parts/{partSeq}")
    public ResponseEntity<?> getEditFormPart(
            @ApiParam("폼 Part 일련번호") @PathVariable("partSeq") @Min(value = 0, message = "{tps.edit-form.error.min.partSeq}") Long partSeq)
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
     * 편집 폼 xml export
     *
     * @param formSeq 편집 폼 일련번호
     * @throws Exception 오류 처리
     */
    @ApiOperation(value = "Edit Form 데이터 조회")
    @GetMapping("/{formSeq}/export")
    public void getEditFormXmlExport(HttpServletResponse response,
            @ApiParam("폼 일련번호") @PathVariable("formSeq") @Min(value = 0, message = "{tps.edit-form.error.min.formSeq}") Long formSeq)
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
        //xml 파일 다운로드
        Downloader.download(response, MediaType.TEXT_XML_VALUE, fileName, editFormHelper.convertPartXml(editFormDTO));
    }

    /**
     * 편집 폼 Part xml export
     *
     * @param partSeq 아이템 일련번호
     * @throws Exception 에러 처리 오류
     */
    @ApiOperation(value = "Edit Form 데이터 조회")
    @GetMapping("/parts/{partSeq}/export")
    public void getEditFormPartXmlExport(HttpServletResponse response,
            @ApiParam("폼 Part 일련번호") @PathVariable("partSeq") @Min(value = 0, message = "{tps.edit-form.error.min.partSeq}") Long partSeq)
            throws Exception {

        EditFormPart editFormPart = editFormService
                .findEditFormPartBySeq(partSeq)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        EditFormPartDTO editFormPartExtDTO = modelMapper.map(editFormPart, EditFormPartDTO.class);

        editFormPartExtDTO.setFieldGroups(objectMapper.readValue(editFormPart.getFormData(), collectionType));
        editFormPartExtDTO.setFormData(null);

        //xml 파일 다운로드
        Downloader.download(response, MediaType.TEXT_XML_VALUE, editFormPartExtDTO.getPartTitle() + ".xml",
                editFormHelper.convertPartXml(editFormPartExtDTO));
    }

    /**
     * 편집 폼 Part 이력 목록 조회
     *
     * @param partSeq 아이템 일련번호
     * @return 편집 폼 아이템 정보
     */
    @ApiOperation(value = "Edit Form 데이터 조회")
    @GetMapping("/parts/{partSeq}/historys")
    public ResponseEntity<?> getEditFormPartHistoryList(
            @ApiParam("폼 Part 일련번호") @PathVariable("partSeq") @Min(value = 0, message = "{tps.edit-form.error.min.partSeq}") Long partSeq,
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
     * 편집 폼 Part 이력 조회
     *
     * @param partSeq 아이템 일련번호
     * @param seqNo   편집 폼 Part 이력 일련번호
     * @return 편집 폼 아이템 정보
     * @throws NoDataException 데이터 없음 에러 처리
     * @throws IOException     json 처리 오류
     */
    @ApiOperation(value = "Edit Form 데이터 조회")
    @GetMapping("/parts/{partSeq}/historys/{seqNo}")
    public ResponseEntity<?> getEditFormPartHistory(
            @ApiParam("폼 Part 일련번호") @PathVariable("partSeq") @Min(value = 0, message = "{tps.edit-form.error.min.partSeq}") Long partSeq,
            @ApiParam("편집이력 일련번호") @PathVariable("seqNo") @Min(value = 0, message = "{tps.edit-form.error.min.seqNo}") Long seqNo)
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
     * 폼의 가장 마지막 임시저장 Form part 정보
     *
     * @param partSeq 아이템 일련번호
     * @return 편집 폼 아이템 정보
     * @throws NoDataException 데이터 없음 에러 처리
     * @throws IOException     json 처리 오류
     */
    @ApiOperation(value = "가장 마지막 임시저장 Form part 정보")
    @GetMapping("/parts/{partSeq}/historys/lastest-saved")
    public ResponseEntity<?> getEditFormPartLastSavedHistory(
            @ApiParam("폼 Part 일련번호") @PathVariable("partSeq") @Min(value = 0, message = "{tps.edit-form.error.min.partSeq}") Long partSeq)
            throws NoDataException, IOException {

        return getLastHistory(partSeq, EditStatusCode.SAVE, MokaConstants.NO);
    }

    /**
     * 폼의 가장 마지막 퍼블리시 Form part 정보
     *
     * @param partSeq 아이템 일련번호
     * @return 편집 폼 아이템 정보
     * @throws NoDataException 데이터 없음 에러 처리
     * @throws IOException     json 처리 오류
     */
    @ApiOperation(value = "가장 마지막 퍼블리시 Form part 정보")
    @GetMapping("/parts/{partSeq}/historys/lastest-published")
    public ResponseEntity<?> getEditFormPartLastPublishedHistory(
            @PathVariable("partSeq") @Min(value = 0, message = "{tps.edit-form.error.min.partSeq}") Long partSeq)
            throws NoDataException, IOException {

        return getLastHistory(partSeq, EditStatusCode.PUBLISH, MokaConstants.YES);
    }

    /**
     * 마지막 편집 이력 조회
     *
     * @param partSeq    편집이력 일련번호
     * @param statusCode 상태
     * @return ResponseEntity
     * @throws NoDataException 데이터 없음 에러처리
     * @throws IOException     IO 에러처리
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
     * 편집 폼 Part 이력 조회
     *
     * @param partSeq 아이템 일련번호
     * @param seqNo   편집 폼 Part 이력 일련번호
     * @throws NoDataException 데이터 없음 에러 처리
     * @throws IOException     json 처리 오류
     */
    @ApiOperation(value = "Edit Form 데이터 조회")
    @GetMapping("/parts/{partSeq}/historys/{seqNo}/export")
    public void getEditFormPartHistoryExport(HttpServletResponse response,
            @ApiParam("폼 Part 일련번호") @PathVariable("partSeq") @Min(value = 0, message = "{tps.edit-form.error.min.partSeq}") Long partSeq,
            @ApiParam("편집 이력 일련번호") @PathVariable("seqNo") @Min(value = 0, message = "{tps.edit-form.error.min.seqNo}") Long seqNo)
            throws Exception {

        EditFormPartHist editFormPartHist = editFormService
                .findEditFormPartHistoryBySeq(seqNo)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        EditFormPartHistDTO editFormPartExtDTO = modelMapper.map(editFormPartHist, EditFormPartHistDTO.class);

        editFormPartExtDTO.setFieldGroups(objectMapper.readValue(editFormPartHist.getFormData(), collectionType));
        editFormPartExtDTO.setFormData(null);

        //xml 파일 다운로드
        Downloader.download(response, MediaType.TEXT_XML_VALUE, editFormPartExtDTO
                .getEditFormPart()
                .getPartTitle() + "_" + editFormPartExtDTO.getSeqNo() + ".xml", editFormHelper.convertPartXml(editFormPartExtDTO));
    }


    /**
     * legacy xml을 추출하여 db에 저장
     *
     * @return 저장 결과
     * @throws MokaException 공통 에러 처리
     */
    @ApiOperation(value = "Edit form 정보를 xml 에서 추출하여 DB에 저장한다.")
    @PostMapping(value = "/import-xml", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_UTF8_VALUE})
    public ResponseEntity<?> postEditFormXmlToDB(@Valid EditFormImportDTO editFormImport)
            throws MokaException {

        try {
            long formSeq;
            MultipartFile file = editFormImport.getFile();
            String xml = new String(file.getBytes());

            if (xml.contains("<channelFormat>")) { // legacy xml 업로드
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
            } else if (xml.contains("<editForm>")) { // 내려받은 편집 폼 xml을 업로드
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
                    // 기존 데이터 없을 경우 에러 처리
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

            } else if (xml.contains("<part>")) { // 내려받은 편집 폼 Part xml을 업로드
                // xml에서 form part 정보 불러오기
                EditFormPartDTO editFormPartDTO = editFormHelper.getEditFormPart(xml);
                EditFormPart editFormPart = modelMapper.map(editFormPartDTO, EditFormPart.class);

                if (editFormImport.getPartSeq() == null || editFormImport.getPartSeq() == 0) {
                    // part xml은 존재하는 part를 정보를 수정하는 것이므로 기존 데이터가 없을 경우 에러 처리
                    throw new NoDataException(msg("tps.common.error.no-data"));
                }
                // 기존 데이터 없을 경우 에러 처리
                editFormService
                        .findEditFormPartBySeq(editFormImport.getPartSeq())
                        .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));
                formSeq = editFormImport.getFormSeq();
                // part xml 업로드는 무조건 임시저장 상태로 업데이트
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
     * 편집 폼 등록
     *
     * @param editFormDTO   편집 폼 정보
     * @param editFormParts 편집 폼 아이템 목록
     * @return 저장 결과
     * @throws MokaException 공통 에러 처리
     */
    @ApiOperation(value = "Edit form 저장")
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
     * 편집 폼 아이템 저장
     *
     * @param editFormPartDTO 편집 폼 아이템 정보
     * @return 저장 결과
     * @throws MokaException 공통 에러 처리
     */
    @ApiOperation(value = "Edit form part 저장")
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
     * 편집 폼 수정
     *
     * @param formSeq       편집 폼 일련번호
     * @param editFormDTO   편집 폼 정보
     * @param editFormParts 편집 폼 아이템 목록
     * @return 저장 결과
     * @throws MokaException 공통 에러 처리
     */
    @ApiOperation(value = "Edit form 수정")
    @PutMapping("/{formSeq}")
    public ResponseEntity<?> putEditForm(
            @ApiParam("폼 일련번호") @PathVariable("formSeq") @Min(value = 0, message = "{tps.edit-form.error.min.formSeq}") Long formSeq,
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
     * 편집 폼 아이템 수정
     *
     * @param partSeq         아이템 일련번호
     * @param editFormPartDTO 편집 폼 아이템 정보
     * @return 저장 결과
     * @throws MokaException 공통 에러 처리
     */
    @ApiOperation(value = "Edit form part 수정")
    @PutMapping("/parts/{partSeq}")
    public ResponseEntity<?> putEditFormPart(
            @ApiParam("폼 Part 일련번호") @PathVariable("partSeq") @Min(value = 0, message = "{tps.edit-form.error.min.partSeq}") Long partSeq,
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
     * 삭제
     *
     * @param request 요청
     * @param formSeq 편집 폼 일련번호 (필수)
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException      삭제 할 메뉴 없음
     * @throws Exception            그 외 에러처리
     */
    @ApiOperation(value = "편집 폼 삭제")
    @DeleteMapping("/{formSeq}")
    public ResponseEntity<?> deleteEditForm(HttpServletRequest request,
            @ApiParam("폼 일련번호") @PathVariable("formSeq") @Min(value = 0, message = "{tps.edit-form.error.min.formSeq}") Long formSeq)
            throws InvalidDataException, NoDataException, Exception {


        boolean success = false;
        String message;

        try {

            // 삭제
            if (editFormService.deleteEditFormBySeq(formSeq) > 0) {
                success = true;
                message = msg("tps.edit-form.success.delete", request);
            } else {
                message = msg("tps.edit-form.error.delete", request);
            }

            if (success) {
                // 액션 로그에 성공 로그 출력
                tpsLogger.success(message);
            } else {
                tpsLogger.fail(message);
            }

            // 결과리턴
            ResultDTO<Boolean> resultDTO = new ResultDTO<>(success);

            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE FORM] menuId: {} {}", formSeq, e.getMessage());
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(e);
            throw new Exception(msg("tps.edit-form.error.delete", request), e);
        }
    }

    /**
     * 삭제
     *
     * @param request 요청
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException      삭제 할 메뉴 없음
     * @throws Exception            그 외 에러처리
     */
    @ApiOperation(value = "편집 폼 삭제")
    @DeleteMapping("/parts/{partSeq}")
    public ResponseEntity<?> deleteEditFormPart(HttpServletRequest request,
            @ApiParam("폼 Part 일련번호") @PathVariable("partSeq") @Min(value = 0, message = "{tps.edit-form.error.min.partSeq}") Long partSeq)
            throws InvalidDataException, NoDataException, Exception {


        boolean success = false;
        String message;

        try {

            // 삭제
            if (editFormService.deleteEditFormPart(partSeq) > 0) {
                success = true;
                message = msg("tps.edit-form-part.success.delete", request);
            } else {
                message = msg("tps.edit-form-part.error.delete", request);
            }

            if (success) {
                // 액션 로그에 성공 로그 출력
                tpsLogger.success(message);
            } else {
                tpsLogger.fail(message);
            }

            // 결과리턴
            ResultDTO<Boolean> resultDTO = new ResultDTO<>(success);

            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE FORM PART] menuId: {} {}", partSeq, e.getMessage());
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(e);
            throw new Exception(msg("tps.edit-form.error.delete", request), e);
        }
    }

    /**
     * ID 존재 여부
     *
     * @param formId 편집 폼 ID (필수)
     * @return 존재여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException      삭제 할 메뉴 없음
     * @throws Exception            그 외 에러처리
     */
    @ApiOperation(value = "편집 폼 삭제")
    @GetMapping("/{formId}/exists")
    public ResponseEntity<?> getExistFormId(
            @ApiParam("폼 ID") @PathVariable("formId") @Size(min = 1, max = 30, message = "{tps.edit-form.error.size.formId}") String formId)
            throws InvalidDataException, NoDataException, Exception {


        boolean exists = false;
        String message = "";

        try {

            // 삭제
            if (editFormService.countEditFormById(formId) > 0) {
                exists = true;
                message = msg("tps.edit-form.error.duplicate.formId");
            }

            // 결과리턴
            ResultDTO<Boolean> resultDTO = new ResultDTO<>(exists, message);

            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO SELECT FORM] menuId: {} {}", formId, e.getMessage());
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(e);
            throw new Exception(msg("tps.edit-form.error.select", formId), e);
        }
    }

}
