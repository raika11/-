package jmnet.moka.core.tps.mvc.newsletter.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.models.Response;
import java.io.IOException;
import java.util.Arrays;
import java.util.Calendar;
import java.util.LinkedList;
import java.util.List;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.Pattern;
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
import jmnet.moka.core.tps.mvc.newsletter.dto.NewsletterInfoHistDTO;
import jmnet.moka.core.tps.mvc.newsletter.dto.NewsletterSearchDTO;
import jmnet.moka.core.tps.mvc.newsletter.dto.NewsletterSendDTO;
import jmnet.moka.core.tps.mvc.newsletter.dto.NewsletterSendSimpleDTO;
import jmnet.moka.core.tps.mvc.newsletter.dto.NewsletterSimpleDTO;
import jmnet.moka.core.tps.mvc.newsletter.entity.NewsletterExcel;
import jmnet.moka.core.tps.mvc.newsletter.entity.NewsletterInfo;
import jmnet.moka.core.tps.mvc.newsletter.entity.NewsletterInfoHist;
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
 * @since 2021-04-19 ?????? 5:06
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/newsletter")
@Api(tags = {"???????????? API"})
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
     * ???????????? ???????????? ??????
     *
     * @param search ????????????
     * @return ?????? ??????
     */
    @ApiOperation(value = "???????????? ???????????? ??????")
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

        // ????????? ??????
        ResultListDTO<NewsletterSimpleDTO> resultListMessage = new ResultListDTO<>();
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(modelMapper.map(returnValue.getContent(), NewsletterSimpleDTO.TYPE));

        ResultDTO<ResultListDTO<NewsletterSimpleDTO>> resultDto = new ResultDTO<>(resultListMessage);
        tpsLogger.success(ActionType.SELECT);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ???????????? ???????????? ?????? ?????? ??????
     *
     * @param search ????????????
     * @param map
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "???????????? ???????????? ?????? ?????? ??????", response = Response.class)
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

        String[] columns =
                new String[] {"??????", "??????", "????????????", "???????????? ???", "?????? ?????????", "?????? ?????????", "??????/?????????", "??????", "????????? ???", "??????", "?????????", "?????????", "??????????????????", "A/B TEST"};

        map.addAttribute("title", "????????????_????????????_????????????");
        map.addAttribute("columnList", CollectionUtils.arrayToList(columns));
        //        map.addAttribute("resultList", new LinkedList<String>());
        map.addAttribute("resultList", result);
        excelView.setAttributesMap(map);

        return excelView;
    }


    @ApiOperation(value = "???????????? ??????")
    @GetMapping(value = "/{letterSeq}")
    public ResponseEntity<?> getNewsletterInfoByLetterSeq(@ApiParam(value = "?????????????????? ????????????", required = true) @PathVariable("letterSeq")
    @Min(value = 0, message = "{tps.common.error.min.seqNo}") Long letterSeq)
            throws NoDataException {
        // ??????
        NewsletterInfo newsletterInfo = newsletterService
                .findByLetterSeq(letterSeq)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        NewsletterInfoDTO newsletterInfoDTO = modelMapper.map(newsletterInfo, NewsletterInfoDTO.class);

        // ????????? ??????
        ResultDTO<NewsletterInfoDTO> resultDto = new ResultDTO<>(newsletterInfoDTO);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ???????????? ?????? ??????
     *
     * @param newsletterInfoDTO ???????????? ??????
     * @return
     * @throws InvalidDataException
     * @throws Exception
     */
    @ApiOperation(value = "???????????? ?????? ????????????")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> postNewsletterInfo(NewsletterInfoDTO newsletterInfoDTO)
            throws InvalidDataException, Exception {
        if (newsletterInfoDTO.getLetterSeq() != null) {
            throw new MokaException(msg("tps.common.error.duplicated.key"));
        }

        try {
            // ?????? ????????? ??????
            if (newsletterInfoDTO.getHeaderImgFile() != null) {
                newsletterInfoDTO.setHeaderImg(uploadImage(newsletterInfoDTO.getHeaderImgFile()));
            }
            // ???????????? ????????? ??????
            if (newsletterInfoDTO.getLetterImgFile() != null) {
                newsletterInfoDTO.setLetterImg(uploadImage(newsletterInfoDTO.getLetterImgFile()));
            }
            NewsletterInfo newsletterInfo = modelMapper.map(newsletterInfoDTO, NewsletterInfo.class);

            // ??????
            NewsletterInfo returnValue = newsletterService.insertNewsletterInfo(newsletterInfo);

            // ????????????
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

    /**
     * ???????????? ?????? ????????????
     *
     * @param newsletterInfoDTO ???????????? ??????
     * @return
     * @throws InvalidDataException
     * @throws Exception
     */
    @ApiOperation(value = "???????????? ?????? ????????????")
    @PostMapping(value = "/temp", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> postNewsletterInfoTemp(NewsletterInfoDTO newsletterInfoDTO)
            throws InvalidDataException, Exception {
        if (newsletterInfoDTO.getLetterSeq() != null) {
            throw new MokaException(msg("tps.common.error.duplicated.key"));
        }

        try {
            // ?????? ????????? ??????
            if (newsletterInfoDTO.getHeaderImgFile() != null) {
                newsletterInfoDTO.setHeaderImg(uploadImage(newsletterInfoDTO.getHeaderImgFile()));
            }
            // ???????????? ????????? ??????
            if (newsletterInfoDTO.getLetterImgFile() != null) {
                newsletterInfoDTO.setLetterImg(uploadImage(newsletterInfoDTO.getLetterImgFile()));
            }
            NewsletterInfo newsletterInfo = modelMapper.map(newsletterInfoDTO, NewsletterInfo.class);

            // ??????
            NewsletterInfo returnValue = newsletterService.insertNewsletterInfo(newsletterInfo
                    .toBuilder()
                    .status("P")
                    .build());

            // ????????????
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


    @ApiOperation(value = "???????????? ????????????")
    @PutMapping(value = "/{letterSeq}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> putNewsletterInfo(@ApiParam(value = "???????????? ?????? ????????????", required = true) @PathVariable("letterSeq") Long letterSeq,
            @Valid NewsletterInfoDTO newsletterInfoDTO)
            throws Exception {
        if (newsletterInfoDTO.getLetterSeq() == null) {
            throw new MokaException(msg("tps.common.error.no-data"));
        }

        // old
        NewsletterInfo old = newsletterService
                .findByLetterSeq(newsletterInfoDTO.getLetterSeq())
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        try {
            // ?????? ????????? ??????
            if (newsletterInfoDTO.getHeaderImgFile() != null) {
                if (McpString.isNotEmpty(old.getHeaderImg())) {
                    // ?????? ??????????????? ??????
                    deleteFile(old.getHeaderImg());
                }
                newsletterInfoDTO.setHeaderImg(uploadImage(newsletterInfoDTO.getHeaderImgFile()));
            }
            // ???????????? ????????? ??????
            if (newsletterInfoDTO.getLetterImgFile() != null) {
                if (McpString.isNotEmpty(old.getLetterImg())) {
                    // ?????? ???????????? ????????? ??????
                    deleteFile(old.getLetterImg());
                }
                newsletterInfoDTO.setLetterImg(uploadImage(newsletterInfoDTO.getLetterImgFile()));
            }
            NewsletterInfo newsletterInfo = modelMapper.map(newsletterInfoDTO, NewsletterInfo.class);
            // ??????
            NewsletterInfo returnValue = newsletterService.updateNewsletterInfo(newsletterInfo, newsletterInfoDTO.getModReason());

            // ????????????
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

    @ApiOperation(value = "???????????? ?????? ???????????? ??????")
    @PutMapping(value = "/temp/{letterSeq}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> putNewsletterInfoTemp(@ApiParam(value = "???????????? ?????? ????????????", required = true) @PathVariable("letterSeq") Long letterSeq,
            NewsletterInfoDTO newsletterInfoDTO)
            throws Exception {
        if (newsletterInfoDTO.getLetterSeq() == null) {
            throw new MokaException(msg("tps.common.error.no-data"));
        }
        // old
        NewsletterInfo old = newsletterService
                .findByLetterSeq(newsletterInfoDTO.getLetterSeq())
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        try {
            // ?????? ????????? ??????
            if (newsletterInfoDTO.getHeaderImgFile() != null) {
                if (McpString.isNotEmpty(old.getHeaderImg())) {
                    // ?????? ??????????????? ??????
                    deleteFile(old.getHeaderImg());
                }
                newsletterInfoDTO.setHeaderImg(uploadImage(newsletterInfoDTO.getHeaderImgFile()));
            }
            // ???????????? ????????? ??????
            if (newsletterInfoDTO.getLetterImgFile() != null) {
                if (McpString.isNotEmpty(old.getLetterImg())) {
                    // ?????? ???????????? ????????? ??????
                    deleteFile(old.getLetterImg());
                }
                newsletterInfoDTO.setLetterImg(uploadImage(newsletterInfoDTO.getLetterImgFile()));
            }
            NewsletterInfo newsletterInfo = modelMapper.map(newsletterInfoDTO, NewsletterInfo.class);
            // ??????
            NewsletterInfo returnValue = newsletterService.updateNewsletterInfo(newsletterInfo
                    .toBuilder()
                    .status("P")
                    .build(), newsletterInfoDTO.getModReason());

            // ????????????
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

    @ApiOperation(value = "???????????? ????????? ????????? ????????? ??????")
    @GetMapping(value = "/channelType/{channelType}")
    public ResponseEntity<?> getNewsletterInfoByLetterSeq(@ApiParam(value = "???????????? ????????? ????????? ????????? ??????", required = true) @PathVariable("channelType")
    @Pattern(regexp = "^(TOPIC)|(ISSUE)|(SERIES)|(JPOD)|(REPORTER)|(TREND)|(ARTICLE)|(STAR)|(DIJEST)$", message = "{tps.newsletter.error.pattern.channelType}") String channelType)
            throws NoDataException {
        // ??????
        List<Long> channelIds = newsletterService.findChannelIdByChannelType(channelType);

        // ????????? ??????
        ResultDTO<List<Long>> resultDto = new ResultDTO<>(channelIds);
        //
        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ???????????? ?????? ??????
     *
     * @param search ????????????
     * @return ?????? ??????
     */
    @ApiOperation(value = "???????????? ?????? ??????")
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

        // ????????? ??????
        ResultListDTO<NewsletterSendSimpleDTO> resultListMessage = new ResultListDTO<>();
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(modelMapper.map(returnValue.getContent(), NewsletterSendSimpleDTO.TYPE));

        ResultDTO<ResultListDTO<NewsletterSendSimpleDTO>> resultDto = new ResultDTO<>(resultListMessage);
        tpsLogger.success(ActionType.SELECT);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    @ApiOperation(value = "???????????? ?????? ??????")
    @GetMapping(value = "/newsletterSend/{sendSeq}")
    public ResponseEntity<?> getNewsletterSendByLetterSeq(@ApiParam(value = "?????? ????????????", required = true) @PathVariable("sendSeq")
    @Min(value = 0, message = "{tps.common.error.min.seqNo}") Long sendSeq)
            throws NoDataException {
        // ??????
        NewsletterSend newsletterSend = newsletterService
                .findNewsletterSendBySendSeq(sendSeq)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        NewsletterSendDTO newsletterSendDTO = modelMapper.map(newsletterSend, NewsletterSendDTO.class);

        // ????????? ??????
        ResultDTO<NewsletterSendDTO> resultDto = new ResultDTO<>(newsletterSendDTO);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ???????????? ?????? ?????? ?????? ??????
     *
     * @param search ????????????
     * @param map
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "???????????? ?????? ?????? ?????? ??????", response = Response.class)
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
                        .getLetterTypeName(), (destination, value) -> destination.setLetterTypeName(String.valueOf(value)));

        List<NewsletterSendSimpleDTO> result = modelMapper.map(returnValue.getContent(), NewsletterSendSimpleDTO.TYPE);

        String[] columns = new String[] {"??????", "???????????? ???", "??????", "?????????", "?????????", "?????????", "??????", "A/B Test"};

        map.addAttribute("title", "????????????_????????????_????????????");
        map.addAttribute("columnList", CollectionUtils.arrayToList(columns));
        map.addAttribute("resultList", result);
        excelView.setAttributesMap(map);

        return excelView;
    }

    /**
     * ???????????? ?????? (??????)??????
     *
     * @param newsletterSendDTO ???????????? ??????(??????)
     * @return
     * @throws InvalidDataException
     * @throws Exception
     */
    @ApiOperation(value = "???????????? ?????? (??????)??????")
    @PostMapping(value = "/newsletterSend", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> postNewsletterSend(@Valid NewsletterSendDTO newsletterSendDTO)
            throws InvalidDataException, Exception {
        if (newsletterSendDTO.getSendSeq() != null) {
            throw new MokaException(msg("tps.common.error.duplicated.key"));
        }

        // ?????? ????????? ??????
        if (newsletterSendDTO.getHeaderImgFile() != null) {
            newsletterSendDTO.setHeaderImg(uploadImage(newsletterSendDTO.getHeaderImgFile()));
        }
        NewsletterSend newsletterSend = modelMapper.map(newsletterSendDTO, NewsletterSend.class);
        Calendar nowPlus2Min = Calendar.getInstance();
        nowPlus2Min.add(Calendar.MINUTE, 2);
        if ("Y".equalsIgnoreCase(newsletterSendDTO.getImmediateYn())) {
            // ???????????? (A???)
            newsletterSend = newsletterSend
                    .toBuilder()
                    .sendDt(nowPlus2Min.getTime())
                    // ????????????
                    .sendStatus("P")
                    .build();

        } else if ("Y".equalsIgnoreCase(newsletterSendDTO.getImmediateYnB())) {
            // ???????????? (B???)
            newsletterSend = newsletterSend
                    .toBuilder()
                    .sendDtB(nowPlus2Min.getTime())
                    // ????????????
                    .sendStatus("P")
                    .build();
        }

        // ??????
        NewsletterSend returnValue = newsletterService.insertNewsletterSend(newsletterSend, parseExcelFile(newsletterSendDTO.getEmailExcelFile()));

        // ????????????
        NewsletterSendDTO dto = modelMapper.map(returnValue, NewsletterSendDTO.class);
        ResultDTO<NewsletterSendDTO> resultDto = new ResultDTO<NewsletterSendDTO>(dto, msg("tps.common.success.insert"));

        tpsLogger.success(ActionType.INSERT);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ???????????? ?????? (??????) ????????? ??????
     *
     * @param newsletterSendDTO ???????????? ??????(??????)
     * @return
     * @throws InvalidDataException
     * @throws Exception
     */
    @ApiOperation(value = "???????????? ?????? (??????) ????????? ??????")
    @PostMapping(value = "/newsletterSend/test", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<?> postNewsletterSendTest(@Valid NewsletterSendDTO newsletterSendDTO)
            throws InvalidDataException, Exception {
        if (newsletterSendDTO.getSendSeq() != null) {
            throw new MokaException(msg("tps.common.error.duplicated.key"));
        } else if (McpString.isNullOrEmpty(newsletterSendDTO.getTestEmails()) && newsletterSendDTO
                .getTestEmails()
                .split(";").length == 0) {
            throw new MokaException(msg("tps.newsletter.error.test-emails"));
        }

        Arrays
                .stream(newsletterSendDTO
                        .getTestEmails()
                        .split(";"))
                .forEach(to -> {
                    sendEms(newsletterSendDTO
                            .toBuilder()
                            .sendDt(McpDate.now())
                            .build(), to);
                });

        // ????????????
        ResultDTO resultDto = new ResultDTO(msg("{tps.newsletter.success.test.publish}"));
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * EMS ?????? ??????
     *
     * @param newsletterSendDTO
     * @param to
     */
    private void sendEms(NewsletterSendDTO newsletterSendDTO, String to) {
        emsService.send(EmsSendDTO
                .builder()
                .legacyid("NEWSLETTER_TEST_SEND_100")
                .mailtype("14")
                .email(to)
                //                            .name(to)
                .sendtime(newsletterSendDTO.getSendDt())
                .fromaddress("root@joongang.co.kr")
                .fromname("????????????")
                .title(newsletterSendDTO.getLetterTitle())
                .tag1("https://stibee.com/api/v1.0/emails/share/UqDS-Fbt5FH-_LgKj-mF3ZxYP1x4lw=="
                        /*newsletterSendDTO
                        .getLetterHtml()
                        .substring(0, Math.min(256, newsletterSendDTO
                                .getLetterHtml()
                                .length()))*/) // TODO: ???????????? url?
                .build());
    }

    /**
     * ???????????? ?????? (??????)??????
     *
     * @param newsletterSendDTO ???????????? ??????(??????)
     * @return
     * @throws InvalidDataException
     * @throws Exception
     */
    @ApiOperation(value = "???????????? ?????? (??????)??????")
    @PutMapping(value = "/newsletterSend/{sendSeq}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> putNewsletterSend(@ApiParam(value = "?????????????????? ????????????", required = true) @PathVariable("sendSeq") Long sendSeq,
            @Valid NewsletterSendDTO newsletterSendDTO)
            throws InvalidDataException, Exception {
        if (newsletterSendDTO.getSendSeq() == null) {
            throw new MokaException(msg("tps.common.error.no-data"));
        }
        // old
        NewsletterSend old = newsletterService
                .findNewsletterSendBySendSeq(newsletterSendDTO.getSendSeq())
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        // ?????? ????????? ??????
        if (newsletterSendDTO.getHeaderImgFile() != null) {
            if (McpString.isNotEmpty(old.getHeaderImg())) {
                // ?????? ??????????????? ??????
                deleteFile(old.getHeaderImg());
            }
            newsletterSendDTO.setHeaderImg(uploadImage(newsletterSendDTO.getHeaderImgFile()));
        }
        NewsletterSend newsletterSend = modelMapper.map(newsletterSendDTO, NewsletterSend.class);

        // ??????
        NewsletterSend returnValue = newsletterService.updateNewsletterSend(newsletterSend, parseExcelFile(newsletterSendDTO.getEmailExcelFile()));

        // ????????????
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

        // ?????? ????????? ?????? ?????? ??????
        tpsLogger.success(ActionType.UPLOAD, message);

        return imageUrl;
    }

    public boolean deleteFile(String imgUrl) {
        String saveFilePath = imgUrl.replaceAll(pdsUrl, "");
        String[] pathAndName = McpFile.getFilepathAndName(saveFilePath);
        return ftpHelper.delete(FtpHelper.PDS, pathAndName[0], pathAndName[1]);
    }


    @ApiOperation(value = "???????????? ?????? ???????????? ??????")
    @GetMapping(value = "/{letterSeq}/historys")
    public ResponseEntity<?> getNewsletterInfoHistoryByLetterSeq(@ApiParam(value = "?????????????????? ????????????", required = true) @PathVariable("letterSeq")
    @Min(value = 0, message = "{tps.common.error.min.seqNo}") Long letterSeq, @Valid @SearchParam NewsletterSearchDTO search)
            throws NoDataException {
        // ??????
        Page<NewsletterInfoHist> returnValue = newsletterService.findAllNewsletterInfoHistByLetterSeq(letterSeq, search);

        // ????????? ??????
        ResultListDTO<NewsletterInfoHistDTO> resultListMessage = new ResultListDTO<>();
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(modelMapper.map(returnValue.getContent(), NewsletterInfoHistDTO.TYPE));

        ResultDTO<ResultListDTO<NewsletterInfoHistDTO>> resultDto = new ResultDTO<>(resultListMessage);
        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    @ApiOperation(value = "???????????? ???????????? ????????????")
    @GetMapping(value = "/historys/{histSeq}")
    public ResponseEntity<?> getNewsletterInfoHistoryByhistSeq(@ApiParam(value = "???????????? ????????????", required = true) @PathVariable("histSeq")
    @Min(value = 0, message = "{tps.common.error.min.seqNo}") Long histSeq)
            throws NoDataException {
        // ??????
        List<NewsletterInfoHist> returnValue = newsletterService.findTop2ByLetterSeqAndHistSeq(histSeq);

        // ????????? ??????
        ResultListDTO<NewsletterInfoHistDTO> resultListMessage = new ResultListDTO<>();
        resultListMessage.setTotalCnt(returnValue.size());
        resultListMessage.setList(modelMapper.map(returnValue, NewsletterInfoHistDTO.TYPE));

        ResultDTO<ResultListDTO<NewsletterInfoHistDTO>> resultDto = new ResultDTO<>(resultListMessage);
        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * Email ?????? ?????? ?????? ??????
     *
     * @param emailExcelFile ????????? ?????? ??????
     * @return
     * @throws Exception
     */
    public List<NewsletterExcel> parseExcelFile(MultipartFile emailExcelFile)
            throws Exception {
        List<NewsletterExcel> list = new LinkedList<>();
        // excel ??????
        Workbook wb = WorkbookFactory.create(emailExcelFile.getInputStream());
        // Sheet ?????? for???
        for (int sheetIndex = 0; sheetIndex < wb.getNumberOfSheets(); sheetIndex++) {
            // ?????? Sheet ??????
            Sheet curSheet = wb.getSheetAt(sheetIndex);
            // row ??????
            for (int rowIndex = 0; rowIndex < curSheet.getPhysicalNumberOfRows(); rowIndex++) {
                // row 0??? ?????????????????? ????????? ??????
                if (rowIndex != 0) {
                    Row curRow = curSheet.getRow(rowIndex);
                    if (curRow != null) {
                        // email
                        Cell cellEmail = curRow.getCell(0);
                        String email = cellEmail.getStringCellValue();
                        if (McpString.isNullOrEmpty(email)) {
                            continue;
                        }
                        // ??????
                        Cell cellUserName = curRow.getCell(1);
                        String userName = cellUserName != null ? cellUserName.getStringCellValue() : null;
                        // ??????ID
                        Cell cellUserId = curRow.getCell(2);
                        String userId = cellUserId != null ? cellUserId.getStringCellValue() : null;
                        // ??????
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
