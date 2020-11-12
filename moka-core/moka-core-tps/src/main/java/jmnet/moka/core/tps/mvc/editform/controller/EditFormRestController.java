package jmnet.moka.core.tps.mvc.editform.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import io.swagger.annotations.ApiOperation;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.Size;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.common.utils.dto.ResultMapDTO;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.exception.DuplicateIdException;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.helper.EditFormHelper;
import jmnet.moka.core.tps.mvc.editform.dto.ChannelFormatDTO;
import jmnet.moka.core.tps.mvc.editform.dto.EditFormDTO;
import jmnet.moka.core.tps.mvc.editform.dto.EditFormPartDTO;
import jmnet.moka.core.tps.mvc.editform.dto.EditFormPartExtDTO;
import jmnet.moka.core.tps.mvc.editform.dto.EditFormSearchDTO;
import jmnet.moka.core.tps.mvc.editform.dto.FieldGroupDTO;
import jmnet.moka.core.tps.mvc.editform.entity.EditForm;
import jmnet.moka.core.tps.mvc.editform.entity.EditFormPart;
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
public class EditFormRestController {

    private final TpsLogger tpsLogger;

    private final EditFormHelper editFormHelper;

    private final ObjectMapper objectMapper;

    private final ModelMapper modelMapper;

    private final static String DEFAULT_SITE = "joongang";

    private final EditFormService editFormService;

    private final MessageByLocale messageByLocale;

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
     * 편집 폼 조회
     *
     * @param formSeq 편집 폼 일련번호
     * @return 편집 폼 정보
     * @throws NoDataException 데이터 없음 에러 처리
     */
    @ApiOperation(value = "Edit Form 데이터 조회")
    @GetMapping("/{formSeq}")
    public ResponseEntity<?> getEditForm(@PathVariable("formSeq") @Min(value = 0, message = "{tps.edit-form.error.min.formSeq}") Long formSeq)
            throws NoDataException {

        EditForm editForm = editFormService
                .findEditFormBySeq(formSeq)
                .orElseThrow(() -> new NoDataException(messageByLocale.get("tps.common.error.no-data")));

        EditFormDTO editFormDTO = modelMapper.map(editForm, EditFormDTO.class);
        List<EditFormPartExtDTO> editFormPartExtDTOS = new ArrayList<>();
        if (editForm.getEditFormParts() != null) {
            editForm
                    .getEditFormParts()
                    .forEach(item -> {
                        try {
                            EditFormPartExtDTO editFormPartExtDTO = modelMapper.map(item, EditFormPartExtDTO.class);
                            editFormPartExtDTO.setFieldGroups(objectMapper.readValue(item.getFormData(), collectionType));
                            editFormPartExtDTO.setFormData(null);
                            editFormPartExtDTOS.add(editFormPartExtDTO);
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    });
        }
        ResultMapDTO resultMapDTO = new ResultMapDTO(HttpStatus.OK);
        resultMapDTO.addBodyAttribute("editForm", editFormDTO);
        resultMapDTO.addBodyAttribute("editFormParts", editFormPartExtDTOS);
        return new ResponseEntity<>(resultMapDTO, HttpStatus.OK);
    }

    /**
     * 편집 폼 아이템 조회
     *
     * @param formSeq 편집 폼 일련번호
     * @param itemSeq 아이템 일련번호
     * @return 편집 폼 아이템 정보
     * @throws NoDataException 데이터 없음 에러 처리
     * @throws IOException     json 처리 오류
     */
    @ApiOperation(value = "Edit Form 데이터 조회")
    @GetMapping("/{formSeq}/items/{itemSeq}")
    public ResponseEntity<?> getEditFormPart(@PathVariable("formSeq") @Min(value = 0, message = "{tps.edit-form.error.min.formSeq}") Long formSeq,
            @PathVariable("itemSeq") @Min(value = 0, message = "{tps.edit-form.error.min.itemSeq}") Long itemSeq)
            throws NoDataException, IOException {

        EditFormPart editFormPart = editFormService
                .findEditFormPartBySeq(itemSeq)
                .orElseThrow(() -> new NoDataException(messageByLocale.get("tps.common.error.no-data")));

        EditFormPartExtDTO editFormPartExtDTO = modelMapper.map(editFormPart, EditFormPartExtDTO.class);

        editFormPartExtDTO.setFieldGroups(objectMapper.readValue(editFormPart.getFormData(), collectionType));
        editFormPartExtDTO.setFormData(null);

        ResultDTO<EditFormPartExtDTO> resultDTO = new ResultDTO<>(editFormPartExtDTO);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }
/*
    private ResponseEntity<?> getResponseEditFormDTO(String site, String formId, @RequestParam(value = "itemId", required = false) String itemId)
            throws MokaException {
        ResultDTO<?> resultDTO;

        EditForm editForm = EditForm
                .builder()
                .formId(formId)
                .build();
        if (McpString.isNotEmpty(itemId)) {
            PartDTO partDTO = editFormHelper.getPart(site, formId, itemId);
            editFormService.findEditForm(editForm);
            resultDTO = new ResultDTO<>(partDTO);
        } else {
            ChannelFormatDTO channelFormatDTO = editFormHelper.getChannelFormat(site, formId);
            editFormService.findEditForm(editForm);
            resultDTO = new ResultDTO<>(channelFormatDTO);
        }

        tpsLogger.success(ActionType.SELECT);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }
*/

    /**
     * legacy xml을 추출하여 db에 저장
     *
     * @param file xml파일
     * @return 저장 결과
     * @throws MokaException 공통 에러 처리
     */
    @ApiOperation(value = "Edit form 정보를 xml 에서 추출하여 DB에 저장한다.")
    @PostMapping(value = "/xml-to-db", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_UTF8_VALUE})
    public ResponseEntity<?> postEditFormXmlToDB(MultipartFile file)
            throws MokaException {

        try {
            //List<EditForm> editForms = new ArrayList<>();
            //if (files != null) {
            //  for (MultipartFile file : files) {
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

            //editForms.add(editFormService.insertEditForm(editForm));
            //  }
            //}

            //ResultDTO<List<EditFormDTO>> resultDTO = new ResultDTO<>(modelMapper.map(editForms, EditFormDTO.TYPE));
            ResultDTO<EditFormDTO> resultDTO = new ResultDTO<>(modelMapper.map(editForm, EditFormDTO.class));

            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

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
                throw new DuplicateIdException(messageByLocale.get("tps.common.error.duplicated.id"));
            }
            Set<String> itemIdSet = new HashSet<>();
            List<EditFormPartDTO> editFormPartDTOS = new ArrayList<>();
            EditForm newEditForm = editFormService.insertEditForm(editForm);
            if (editFormParts != null && editFormParts.size() > 0) {
                for (EditFormPartDTO editFormPartDTO : editFormParts) {
                    if (itemIdSet.contains(editFormPartDTO.getPartId())) {
                        throw new DuplicateIdException(messageByLocale.get("tps.edit-form.error.duplicate.itemId"));
                    }
                    itemIdSet.add(editFormPartDTO.getPartId());
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
     * @param formSeq         편집 폼 일련번호
     * @param editFormPartDTO 편집 폼 아이템 정보
     * @return 저장 결과
     * @throws MokaException 공통 에러 처리
     */
    @ApiOperation(value = "Edit form item 저장")
    @PostMapping("/{formSeq}/items")
    public ResponseEntity<?> postEditFormPart(@PathVariable("formSeq") @Min(value = 0, message = "{tps.edit-form.error.min.formSeq}") Long formSeq,
            @Valid EditFormPartDTO editFormPartDTO)
            throws MokaException {

        try {
            objectMapper.readValue(editFormPartDTO.getFormData(), collectionType);
            EditFormPart editFormPart = modelMapper.map(editFormPartDTO, EditFormPart.class);

            if (editFormService.isDuplicatedId(editFormPart)) {
                throw new DuplicateIdException(messageByLocale.get("tps.edit-form.error.duplicate.itemId"));
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
     * 편집 폼 아이템 수정
     *
     * @param formSeq       편집 폼 일련번호
     * @param editFormDTO   편집 폼 정보
     * @param editFormParts 편집 폼 아이템 목록
     * @return 저장 결과
     * @throws MokaException 공통 에러 처리
     */
    @ApiOperation(value = "Edit form part 수정")
    @PutMapping("/{formSeq}")
    public ResponseEntity<?> putEditForm(@PathVariable("formSeq") @Min(value = 0, message = "{tps.edit-form.error.min.formSeq}") Long formSeq,
            @Valid EditFormDTO editFormDTO, @RequestBody List<@Valid EditFormPartDTO> editFormParts)
            throws MokaException {

        try {
            EditForm editForm = modelMapper.map(editFormDTO, EditForm.class);

            EditForm orgEditForm = editFormService
                    .findEditFormBySeq(formSeq)
                    .orElseThrow(() -> new NoDataException(messageByLocale.get("tps.common.error.no-data")));
            if (editFormService.isDuplicatedId(editForm)) {
                throw new DuplicateIdException(messageByLocale.get("tps.common.error.duplicated.id"));
            }
            Set<String> itemIdSet = new HashSet<>();
            List<EditFormPartDTO> editFormPartDTOS = new ArrayList<>();
            editForm.setFormSeq(orgEditForm.getFormSeq());
            editForm = editFormService.updateEditForm(editForm);

            if (editFormParts != null && editFormParts.size() > 0) {
                for (EditFormPartDTO editFormPartDTO : editFormParts) {
                    if (itemIdSet.contains(editFormPartDTO.getPartId())) {
                        throw new DuplicateIdException(messageByLocale.get("tps.edit-form.error.duplicate.itemId"));
                    }
                    itemIdSet.add(editFormPartDTO.getPartId());
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
     * @param formSeq         편집 폼 일련번호
     * @param itemSeq         아이템 일련번호
     * @param editFormPartDTO 편집 폼 아이템 정보
     * @return 저장 결과
     * @throws MokaException 공통 에러 처리
     */
    @ApiOperation(value = "Edit form item 수정")
    @PostMapping("/{formSeq}/items/{itemSeq}")
    public ResponseEntity<?> putEditFormPart(@PathVariable("formSeq") @Min(value = 0, message = "{tps.edit-form.error.min.formSeq}") Long formSeq,
            @PathVariable("itemSeq") @Min(value = 0, message = "{tps.edit-form.error.min.itemSeq}") Long itemSeq,
            @Valid EditFormPartDTO editFormPartDTO)
            throws MokaException {

        try {
            objectMapper.readValue(editFormPartDTO.getFormData(), collectionType);
            EditFormPart editFormPart = modelMapper.map(editFormPartDTO, EditFormPart.class);

            editFormService
                    .findEditFormPart(editFormPart)
                    .orElseThrow(() -> new NoDataException(messageByLocale.get("tps.common.error.no-data")));

            editFormPart.setFormSeq(formSeq);
            editFormPart.setPartSeq(itemSeq);

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
            @PathVariable("formSeq") @Min(value = 0, message = "{tps.edit-form.error.min.menuSeq}") Long formSeq)
            throws InvalidDataException, NoDataException, Exception {


        boolean success = false;
        String message;

        try {

            // 삭제
            if (editFormService.deleteEditFormBySeq(formSeq) > 0) {
                success = true;
                message = messageByLocale.get("tps.edit-form.success.delete", request);
            } else {
                message = messageByLocale.get("tps.edit-form.error.delete", request);
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
            log.error("[FAIL TO DELETE MENU] menuId: {} {}", formSeq, e.getMessage());
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(e);
            throw new Exception(messageByLocale.get("tps.edit-form.error.delete", request), e);
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
    @DeleteMapping("/{formSeq}/items/{itemSeq}")
    public ResponseEntity<?> deleteEditFormPart(HttpServletRequest request,
            @PathVariable("formSeq") @Min(value = 0, message = "{tps.edit-form.error.min.formSeq}") Long formSeq,
            @PathVariable("itemSeq") @Min(value = 0, message = "{tps.edit-form.error.min.itemSeq}") Long itemSeq)
            throws InvalidDataException, NoDataException, Exception {


        boolean success = false;
        String message;

        try {

            // 삭제
            if (editFormService.deleteEditFormPart(formSeq, itemSeq) > 0) {
                success = true;
                message = messageByLocale.get("tps.edit-form-item.success.delete", request);
            } else {
                message = messageByLocale.get("tps.edit-form-item.error.delete", request);
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
            log.error("[FAIL TO DELETE MENU] menuId: {} {}", formSeq, e.getMessage());
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(e);
            throw new Exception(messageByLocale.get("tps.edit-form.error.delete", request), e);
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
            @PathVariable("formId") @Size(min = 1, max = 30, message = "{tps.edit-form.error.size.formId}") String formId)
            throws InvalidDataException, NoDataException, Exception {


        boolean exists = false;
        String message = "";

        try {

            // 삭제
            if (editFormService.countEditFormById(formId) > 0) {
                exists = true;
                message = messageByLocale.get("tps.edit-form.error.duplicate.formId");
            }

            // 결과리턴
            ResultDTO<Boolean> resultDTO = new ResultDTO<>(exists, message);

            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE MENU] menuId: {} {}", formId, e.getMessage());
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(e);
            throw new Exception(messageByLocale.get("tps.edit-form.error.select", formId), e);
        }
    }

}
