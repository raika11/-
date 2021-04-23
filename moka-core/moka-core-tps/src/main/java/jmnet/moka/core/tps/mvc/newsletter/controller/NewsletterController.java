package jmnet.moka.core.tps.mvc.newsletter.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.models.Response;
import java.io.IOException;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import javax.validation.Valid;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpFile;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.UUIDGenerator;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.encrypt.MokaCrypt;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.ftp.FtpHelper;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.mail.mvc.dto.EmsSendDTO;
import jmnet.moka.core.mail.mvc.service.EmsService;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.helper.UploadFileHelper;
import jmnet.moka.core.tps.mvc.newsletter.dto.NewsletterInfoDTO;
import jmnet.moka.core.tps.mvc.newsletter.dto.NewsletterSearchDTO;
import jmnet.moka.core.tps.mvc.newsletter.dto.NewsletterSendDTO;
import jmnet.moka.core.tps.mvc.newsletter.dto.NewsletterSendSimpleDTO;
import jmnet.moka.core.tps.mvc.newsletter.dto.NewsletterSimpleDTO;
import jmnet.moka.core.tps.mvc.newsletter.entity.NewsletterExcel;
import jmnet.moka.core.tps.mvc.newsletter.entity.NewsletterInfo;
import jmnet.moka.core.tps.mvc.newsletter.entity.NewsletterSend;
import jmnet.moka.core.tps.mvc.newsletter.service.NewsletterService;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.ModelMap;
import org.springframework.util.CollectionUtils;
import org.springframework.validation.annotation.Validated;
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
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.newsletter.controller
 * ClassName : NewsletterController
 * Created : 2021-04-19 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-04-19 오후 5:06
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/newsletter")
@Api(tags = {"뉴스레터 API"})
public class NewsletterController extends AbstractCommonController {

    private final NewsletterService newsletterService;

    private final EmsService emsService;

    private final FtpHelper ftpHelper;

    private final UploadFileHelper uploadFileHelper;

    private final MokaCrypt mokaCrypt;

    @Value("${newsletter.image.save.filepath}")
    private String newsletterSaveFilepath;

    @Value("${pds.url}")
    private String pdsUrl;

    public NewsletterController(NewsletterService newsletterService, EmsService emsService, FtpHelper ftpHelper, UploadFileHelper uploadFileHelper,
            MokaCrypt mokaCrypt) {
        this.mokaCrypt = mokaCrypt;
        this.ftpHelper = ftpHelper;
        this.emsService = emsService;
        this.newsletterService = newsletterService;
        this.uploadFileHelper = uploadFileHelper;
    }

    /**
     * 뉴스레터 상품관리 조회
     *
     * @param search 조회조건
     * @return 검색 결과
     */
    @ApiOperation(value = "뉴스레터 상품관리 조회")
    @GetMapping
    public ResponseEntity<?> getNewsletterList(@Valid @SearchParam NewsletterSearchDTO search)
            throws Exception {
        Page<NewsletterInfo> returnValue = newsletterService.findAll(search);

        //        Converter<Set, Long> getSubscribeCount = ctx -> ctx.getSource() == null
        //                ? null
        //                : (long) ctx
        //                        .getSource()
        //                        .size();
        //        Converter<Set<NewsletterSend>, Date> getLastSendDt = ctx -> ctx.getSource() == null || ctx
        //                .getSource()
        //                .size() == 0
        //                ? null
        //                : ctx
        //                        .getSource()
        //                        .stream()
        //                        .map(NewsletterSend::getSendDt)
        //                        .max(Date::compareTo)
        //                        .get();

        //        ModelMapper countModelMapper = new ModelMapper();
        //        countModelMapper
        //        modelMapper.typeMap(NewsletterInfo.class, NewsletterProductDTO.class)
        //                   //                .addMappings(mapper -> mapper
        //                   //                        .using(getSubscribeCount)
        //                   //                        .map(NewsletterInfo::getNewsletterSubscribes, NewsletterProductDTO::setSubscribeCount))
        //                   .addMappings(mapping -> mapping
        //                           .using(getLastSendDt)
        //                           .map(NewsletterInfo::getNewsletterSends, NewsletterProductDTO::setLastSendDt));

        // 리턴값 설정
        ResultListDTO<NewsletterSimpleDTO> resultListMessage = new ResultListDTO<>();
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(modelMapper.map(returnValue.getContent(), NewsletterSimpleDTO.TYPE));

        ResultDTO<ResultListDTO<NewsletterSimpleDTO>> resultDto = new ResultDTO<>(resultListMessage);
        tpsLogger.success(ActionType.SELECT);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 뉴스레터 상품관리 조회 엑셀 출력
     *
     * @param search 조회조건
     * @param map
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "뉴스레터 상품관리 조회 엑셀 출력", response = Response.class)
    @GetMapping(value = "/excel", produces = {"application/vnd.ms-excel"})
    public SearchNewsletterInfoExcelView getExcel(@Valid @SearchParam NewsletterSearchDTO search, @ApiParam(hidden = true) ModelMap map)
            throws Exception {
        SearchNewsletterInfoExcelView excelView = new SearchNewsletterInfoExcelView();

        Page<NewsletterInfo> returnValue = newsletterService.findAll(search);
        //        Converter<Set<NewsletterSubscribe>, Long> getSubscribeCount = ctx -> ctx.getSource() == null
        //                ? null
        //                : (long) ctx
        //                        .getSource()
        //                        .size();
        //        Converter<Set<NewsletterSend>, Date> getLastSendDt = ctx -> ctx.getSource() == null || ctx
        //                .getSource()
        //                .size() == 0
        //                ? null
        //                : ctx
        //                        .getSource()
        //                        .stream()
        //                        .map(NewsletterSend::getSendDt)
        //                        .max(Date::compareTo)
        //                        .get();
        //
        //        //        ModelMapper countModelMapper = new ModelMapper();
        //        //        countModelMapper
        //        modelMapper.typeMap(NewsletterInfo.class, NewsletterProductDTO.class)
        //                   //                .addMappings(mapper -> mapper
        //                   //                        .using(getSubscribeCount)
        //                   //                        .map(NewsletterInfo::getNewsletterSubscribes, NewsletterProductDTO::setSubscribeCount))
        //                   .addMappings(mapping -> mapping
        //                           .using(getLastSendDt)
        //                           .map(NewsletterInfo::getNewsletterSends, NewsletterProductDTO::setLastSendDt));

        List<NewsletterSimpleDTO> result = modelMapper.map(returnValue.getContent(), NewsletterSimpleDTO.TYPE);

        String[] columns = new String[] {"방법", "유형", "뉴스레터 명", "발송 시작일", "최근 발송일", "일정/콘텐츠", "시간", "구독자 수", "상태", "등록일", "등록자", "A/B TEST"};

        map.addAttribute("title", "뉴스레터 상품관리");
        map.addAttribute("columnList", CollectionUtils.arrayToList(columns));
        //        map.addAttribute("resultList", new LinkedList<String>());
        map.addAttribute("resultList", result);
        excelView.setAttributesMap(map);

        return excelView;
    }


    @ApiOperation(value = "뉴스레터 상품")
    @GetMapping(value = "/{letterSeq}")
    public ResponseEntity<?> getNewsletterInfoByLetterSeq(@ApiParam(value = "뉴스레터상품 일련번호", required = true)
    @PathVariable("letterSeq") /* @Min(value = 0, message = "{tps.article.error.min.totalId}") */ Long letterSeq)
            throws NoDataException {
        // 조회
        NewsletterInfo newsletterInfo = newsletterService
                .findByletterSeq(letterSeq)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        NewsletterInfoDTO newsletterInfoDTO = modelMapper.map(newsletterInfo, NewsletterInfoDTO.class);

        // 리턴값 설정
        ResultDTO<NewsletterInfoDTO> resultDto = new ResultDTO<>(newsletterInfoDTO);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 뉴스레터 상품등록
     *
     * @param newsletterInfoDTO 뉴스레터 상품
     * @return
     * @throws InvalidDataException
     * @throws Exception
     */
    @ApiOperation(value = "뉴스레터 상품등록")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> postNewsletterInfo(@Valid NewsletterInfoDTO newsletterInfoDTO)
            throws InvalidDataException, Exception {
        if (newsletterInfoDTO.getLetterSeq() != null) {
            throw new MokaException(msg("tps.common.error.duplicated.key"));
        }

        try {
            // 상단 이미지 저장
            if (newsletterInfoDTO.getHeaderImgFile() != null) {
                newsletterInfoDTO.setHeaderImg(uploadImage(newsletterInfoDTO.getHeaderImgFile()));
            }
            NewsletterInfo newsletterInfo = modelMapper.map(newsletterInfoDTO, NewsletterInfo.class);

            // 등록
            NewsletterInfo returnValue = newsletterService.insertNewsletterInfo(newsletterInfo);

            // 결과리턴
            NewsletterInfoDTO dto = modelMapper.map(returnValue, NewsletterInfoDTO.class);
            ResultDTO<NewsletterInfoDTO> resultDto = new ResultDTO<NewsletterInfoDTO>(dto, msg("tps.common.success.insert"));

            tpsLogger.success(ActionType.INSERT);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO SAVE NEWSLETTER INFO]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO SAVE NEWSLETTER INFO]", e, true);
            throw new Exception(msg("tps.common.error.insert"), e);
        }
    }


    @ApiOperation(value = "뉴스레터 상품수정")
    @PutMapping(value = "/{letterSeq}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> putNewsletterInfo(@ApiParam(value = "패키지 일련번호", required = true) @PathVariable("letterSeq") Long letterSeq,
            @Valid NewsletterInfoDTO newsletterInfoDTO)
            throws Exception {
        if (newsletterInfoDTO.getLetterSeq() == null) {
            throw new MokaException(msg("tps.common.error.no-data"));
        }
        try {
            // 상단 이미지 저장
            newsletterInfoDTO.setHeaderImg(uploadImage(newsletterInfoDTO.getHeaderImgFile()));
            NewsletterInfo newsletterInfo = modelMapper.map(newsletterInfoDTO, NewsletterInfo.class);
            // 수정
            NewsletterInfo returnValue = newsletterService.updateNewsletterInfo(newsletterInfo);

            // 결과리턴
            NewsletterInfoDTO dto = modelMapper.map(returnValue, NewsletterInfoDTO.class);
            ResultDTO<NewsletterInfoDTO> resultDto = new ResultDTO<NewsletterInfoDTO>(dto, msg("tps.common.success.update"));

            tpsLogger.success(ActionType.UPDATE);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO SAVE NEWSLETTER INFO]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO SAVE NEWSLETTER INFO]", e, true);
            throw new Exception(msg("tps.common.error.update"), e);
        }
    }

    /**
     * 뉴스레터 발송 조회
     *
     * @param search 조회조건
     * @return 검색 결과
     */
    @ApiOperation(value = "뉴스레터 발송 조회")
    @GetMapping(value = "/newsletterSend")
    public ResponseEntity<?> getNewsletterSend(@Valid @SearchParam NewsletterSearchDTO search)
            throws Exception {
        Page<NewsletterSend> returnValue = newsletterService.findAllNewsletterSend(search);

        modelMapper
                .typeMap(NewsletterSend.class, NewsletterSendSimpleDTO.class)
                .addMapping(source -> source
                        .getNewsletterInfo()
                        .getLetterName(), (destination, value) -> destination.setLetterName(String.valueOf(value)))
                .addMapping(source -> source
                        .getNewsletterInfo()
                        .getLetterTypeName(), (destination, value) -> destination.setLetterTypeName(String.valueOf(value)));

        // 리턴값 설정
        ResultListDTO<NewsletterSendSimpleDTO> resultListMessage = new ResultListDTO<>();
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(modelMapper.map(returnValue.getContent(), NewsletterSendSimpleDTO.TYPE));

        ResultDTO<ResultListDTO<NewsletterSendSimpleDTO>> resultDto = new ResultDTO<>(resultListMessage);
        tpsLogger.success(ActionType.SELECT);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 뉴스레터 발송 조회 엑셀 출력
     *
     * @param search 조회조건
     * @param map
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "뉴스레터 발송 조회 엑셀 출력", response = Response.class)
    @GetMapping(value = "/newsletterSend/excel", produces = {"application/vnd.ms-excel"})
    public SearchNewsletterSendExcelView getNewsletterSendExcel(@Valid @SearchParam NewsletterSearchDTO search, @ApiParam(hidden = true) ModelMap map)
            throws Exception {
        SearchNewsletterSendExcelView excelView = new SearchNewsletterSendExcelView();

        Page<NewsletterSend> returnValue = newsletterService.findAllNewsletterSend(search);

        modelMapper
                .typeMap(NewsletterSend.class, NewsletterSendSimpleDTO.class)
                .addMapping(source -> source
                        .getNewsletterInfo()
                        .getLetterName(), (destination, value) -> destination.setLetterName(String.valueOf(value)))
                .addMapping(source -> source
                        .getNewsletterInfo()
                        .getLetterType(), (destination, value) -> destination.setLetterType(String.valueOf(value)));

        List<NewsletterSendSimpleDTO> result = modelMapper.map(returnValue.getContent(), NewsletterSendSimpleDTO.TYPE);

        String[] columns = new String[] {"유형", "뉴스레터 명", "제목", "발송일", "A/B Test"};

        map.addAttribute("title", "뉴스레터 상품관리");
        map.addAttribute("columnList", CollectionUtils.arrayToList(columns));
        map.addAttribute("resultList", result);
        excelView.setAttributesMap(map);

        return excelView;
    }

    /**
     * 뉴스레터 발송 (수동)등록
     *
     * @param newsletterSendDTO 뉴스레터 발송(수동)
     * @return
     * @throws InvalidDataException
     * @throws Exception
     */
    @ApiOperation(value = "뉴스레터 발송 (수동)등록")
    @PostMapping(value = "/newsletterSend", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> postNewsletterSend(@Valid NewsletterSendDTO newsletterSendDTO)
            throws InvalidDataException, Exception {
        if (newsletterSendDTO.getSendSeq() != null) {
            throw new MokaException(msg("tps.common.error.duplicated.key"));
        }

        NewsletterSend newsletterSend = modelMapper.map(newsletterSendDTO, NewsletterSend.class);

        // 등록
        NewsletterSend returnValue = newsletterService.insertNewsletterSend(newsletterSend, parseExcelFile(newsletterSendDTO.getEmailExcelFile()));

        // 결과리턴
        NewsletterSendDTO dto = modelMapper.map(returnValue, NewsletterSendDTO.class);
        ResultDTO<NewsletterSendDTO> resultDto = new ResultDTO<NewsletterSendDTO>(dto, msg("tps.common.success.insert"));

        tpsLogger.success(ActionType.INSERT);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 뉴스레터 발송 (수동) 테스트 발송
     *
     * @param newsletterSendDTO 뉴스레터 발송(수동)
     * @return
     * @throws InvalidDataException
     * @throws Exception
     */
    @ApiOperation(value = "뉴스레터 발송 (수동) 테스트 발송")
    @PostMapping(value = "/newsletterSend/test", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<?> postNewsletterSendTest(@Valid NewsletterSendDTO newsletterSendDTO)
            throws InvalidDataException, Exception {
        if (newsletterSendDTO.getSendSeq() != null) {
            throw new MokaException(msg("tps.common.error.duplicated.key"));
        } else if (McpString.isNotEmpty(newsletterSendDTO.getTestEmails()) && newsletterSendDTO
                .getTestEmails()
                .split(";").length > 0) {
            throw new MokaException(msg("tps.newsletter.error.test-emails"));
        }

        Arrays
                .stream(newsletterSendDTO
                        .getTestEmails()
                        .split(";"))
                .forEach(to -> {
                    EmsSendDTO test = emsService.send(EmsSendDTO
                            .builder()
                            .legacyid("newsletter_email_test") // TODO: 발송키값
                            .mailtype("01") // TODO: 메일타입
                            .email(to)
                            .name(to)
                            .sendtime(McpDate.now())
                            .fromaddress("noreply@joongang.co.kr") // TODO: 발송이메일
                            .fromname("중앙일보") // TODO: 발송자명
                            .title(newsletterSendDTO.getLetterTitle())
                            .tag1(newsletterSendDTO
                                    .getLetterHtml()
                                    .substring(0, Math.min(256, newsletterSendDTO
                                            .getLetterHtml()
                                            .length())))
                            .build());

                });

        // 결과리턴
        ResultDTO resultDto = new ResultDTO("TODO: ems send success");
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 뉴스레터 발송 (수동)수정
     *
     * @param newsletterSendDTO 뉴스레터 발송(수동)
     * @return
     * @throws InvalidDataException
     * @throws Exception
     */
    @ApiOperation(value = "뉴스레터 발송 (수동)수정")
    @PutMapping(value = "/newsletterSend/{seq}")
    public ResponseEntity<?> putNewsletterSend(@ApiParam(value = "뉴스레터발송 일련번호", required = true) @PathVariable("seq") Long seq,
            @RequestBody @Valid NewsletterSendDTO newsletterSendDTO)
            throws InvalidDataException, Exception {
        if (newsletterSendDTO.getLetterSeq() == null) {
            throw new MokaException(msg("tps.common.error.no-data"));
        }

        NewsletterSend newsletterSend = modelMapper.map(newsletterSendDTO, NewsletterSend.class);

        // 수정
        NewsletterSend returnValue = newsletterService.updateNewsletterSend(newsletterSend, null);

        // 결과리턴
        NewsletterSendDTO dto = modelMapper.map(returnValue, NewsletterSendDTO.class);
        ResultDTO<NewsletterSendDTO> resultDto = new ResultDTO<NewsletterSendDTO>(dto, msg("tps.common.success.update"));

        tpsLogger.success(ActionType.UPDATE);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    public String uploadImage(MultipartFile imgFile)
            throws InvalidDataException, IOException {

        String ext = McpFile.getExtension(imgFile.getOriginalFilename());
        String filename = UUIDGenerator.uuid() + "." + ext;
        String yearMonth = McpDate.dateStr(McpDate.now(), "yyyyMM/dd");
        String saveFilePath = String.format(newsletterSaveFilepath, yearMonth);
        String imageUrl = pdsUrl;
        String message = "";
        if (ftpHelper.upload(FtpHelper.PDS, filename, imgFile.getInputStream(), saveFilePath)) {
            imageUrl = pdsUrl + saveFilePath + "/" + filename;
        } else {
            message = msg("tps.newsletter.error.image-upload");
        }

        // 액션 로그에 성공 로그 출력
        tpsLogger.success(ActionType.UPLOAD, message);

        return imageUrl;
    }

    /**
     * Email 목록 엑셀 파일 파싱
     *
     * @param emailExcelFile 이메일 엑셀 파일
     * @return
     * @throws Exception
     */
    public List<NewsletterExcel> parseExcelFile(MultipartFile emailExcelFile)
            throws Exception {
        List<NewsletterExcel> list = new LinkedList<>();
        // excel 파싱
        Workbook wb = WorkbookFactory.create(emailExcelFile.getInputStream());
        // Sheet 탐색 for문
        for (int sheetIndex = 0; sheetIndex < wb.getNumberOfSheets(); sheetIndex++) {
            // 현재 Sheet 반환
            Sheet curSheet = wb.getSheetAt(sheetIndex);
            // row 탐색
            for (int rowIndex = 0; rowIndex < curSheet.getPhysicalNumberOfRows(); rowIndex++) {
                // row 0은 헤더정보이기 때문에 무시
                if (rowIndex != 0) {
                    Row curRow = curSheet.getRow(rowIndex);
                    if (curRow != null) {
                        // email
                        Cell cellEmail = curRow.getCell(0);
                        String email = cellEmail.getStringCellValue();
                        if (McpString.isNullOrEmpty(email)) {
                            continue;
                        }
                        // 이름
                        Cell cellUserName = curRow.getCell(1);
                        String userName = cellUserName != null ? cellUserName.getStringCellValue() : null;
                        // 회원ID
                        Cell cellUserId = curRow.getCell(2);
                        String userId = cellUserId != null ? cellUserId.getStringCellValue() : null;
                        // 추가
                        list.add(NewsletterExcel
                                .builder()
                                .email(mokaCrypt.encrypt(email))
                                .memId(userId)
                                .memNm(userName)
                                .build());
                    }
                }
            }
        }
        return list;
    }
}
