package jmnet.moka.core.tps.mvc.newsletter.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.models.Response;
import java.util.List;
import javax.validation.Valid;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.helper.UploadFileHelper;
import jmnet.moka.core.tps.mvc.newsletter.dto.NewsletterInfoDTO;
import jmnet.moka.core.tps.mvc.newsletter.dto.NewsletterProductDTO;
import jmnet.moka.core.tps.mvc.newsletter.dto.NewsletterSearchDTO;
import jmnet.moka.core.tps.mvc.newsletter.dto.NewsletterSendDTO;
import jmnet.moka.core.tps.mvc.newsletter.entity.NewsletterInfo;
import jmnet.moka.core.tps.mvc.newsletter.entity.NewsletterSend;
import jmnet.moka.core.tps.mvc.newsletter.service.NewsletterService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
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

    //    private final FtpHelper ftpHelper;

    private final UploadFileHelper uploadFileHelper;

    public NewsletterController(NewsletterService newsletterService, UploadFileHelper uploadFileHelper) {
        this.newsletterService = newsletterService;
        //        this.ftpHelper = ftpHelper;
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
        //                .typeMap(NewsletterInfo.class, NewsletterProductDTO.class)
        //                .addMappings(mapper -> mapper
        //                        .using(getSubscribeCount)
        //                        .map(NewsletterInfo::getNewsletterSubscribes, NewsletterProductDTO::setSubscribeCount))
        //                .addMappings(mapping -> mapping
        //                        .using(getLastSendDt)
        //                        .map(NewsletterInfo::getNewsletterSends, NewsletterProductDTO::setLastSendDt));

        // 리턴값 설정
        ResultListDTO<NewsletterProductDTO> resultListMessage = new ResultListDTO<>();
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(modelMapper.map(returnValue.getContent(), NewsletterProductDTO.TYPE));

        ResultDTO<ResultListDTO<NewsletterProductDTO>> resultDto = new ResultDTO<>(resultListMessage);
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
    @ApiOperation(value = "뉴스레터 상품관리 조회", response = Response.class)
    @GetMapping(value = "/excel", produces = {"application/vnd.ms-excel"})
    public SearchNewsletterExcelView getExcel(@Valid @SearchParam NewsletterSearchDTO search, @ApiParam(hidden = true) ModelMap map)
            throws Exception {
        SearchNewsletterExcelView excelView = new SearchNewsletterExcelView();

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

        //        ModelMapper countModelMapper = new ModelMapper();
        //        countModelMapper
        //                .typeMap(NewsletterInfo.class, NewsletterProductDTO.class)
        //                .addMappings(mapper -> mapper
        //                        .using(getSubscribeCount)
        //                        .map(NewsletterInfo::getNewsletterSubscribes, NewsletterProductDTO::setSubscribeCount))
        //                .addMappings(mapping -> mapping
        //                        .using(getLastSendDt)
        //                        .map(NewsletterInfo::getNewsletterSends, NewsletterProductDTO::setLastSendDt));

        List<NewsletterProductDTO> result = modelMapper.map(returnValue.getContent(), NewsletterProductDTO.TYPE);

        String[] columns = new String[] {"방법", "유형", "뉴스레터 명", "방송 시작일", "최근 방송일", "일정/콘텐츠", "시간", "구독자 수", "상태", "등록일", "등록자", "A/B TEST"};

        map.addAttribute("title", "뉴스레터 상품관리");
        map.addAttribute("columnList", CollectionUtils.arrayToList(columns));
        //        map.addAttribute("resultList", new LinkedList<String>());
        map.addAttribute("resultList", result);
        excelView.setAttributesMap(map);

        return excelView;
    }


    @ApiOperation(value = "뉴스레터 상품등록")
    @GetMapping(value = "/{letterSeq}")
    public ResponseEntity<?> getNewsletterInfoByLetterSeq(
            @ApiParam("뉴스레터상품 일련번호") @PathVariable("letterSeq") /* @Min(value = 0, message = "{tps.article.error.min.totalId}") */ Long letterSeq)
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
    @PostMapping
    public ResponseEntity<?> postNewsletterInfo(@RequestBody @Valid NewsletterInfoDTO newsletterInfoDTO)
            throws InvalidDataException, Exception {
        if (newsletterInfoDTO.getLetterSeq() != null) {
            throw new MokaException(msg("tps.common.error.duplicated.key"));
        }

        NewsletterInfo newsletterInfo = modelMapper.map(newsletterInfoDTO, NewsletterInfo.class);

        // 등록
        NewsletterInfo returnValue = newsletterService.insertNewsletterInfo(newsletterInfo);

        // 결과리턴
        NewsletterInfoDTO dto = modelMapper.map(returnValue, NewsletterInfoDTO.class);
        ResultDTO<NewsletterInfoDTO> resultDto = new ResultDTO<NewsletterInfoDTO>(dto, msg("tps.common.success.insert"));

        tpsLogger.success(ActionType.INSERT);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }


    @ApiOperation(value = "뉴스레터 상품수정")
    @PutMapping("/{letterSeq}")
    public ResponseEntity<?> putNewsletterInfo(@ApiParam(value = "패키지 일련번호", required = true) @PathVariable("letterSeq") Long letterSeq,
            @RequestBody @Valid NewsletterInfoDTO newsletterInfoDTO)
            throws Exception {
        if (newsletterInfoDTO.getLetterSeq() == null) {
            throw new MokaException(msg("tps.common.error.no-data"));
        }

        NewsletterInfo newsletterInfo = modelMapper.map(newsletterInfoDTO, NewsletterInfo.class);
        // 수정
        NewsletterInfo returnValue = newsletterService.updateNewsletterInfo(newsletterInfo);

        // 결과리턴
        NewsletterInfoDTO dto = modelMapper.map(returnValue, NewsletterInfoDTO.class);
        ResultDTO<NewsletterInfoDTO> resultDto = new ResultDTO<NewsletterInfoDTO>(dto, msg("tps.common.success.update"));

        tpsLogger.success(ActionType.UPDATE);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
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
    @PostMapping(value = "/newsletterSend")
    public ResponseEntity<?> postNewsletterSend(@RequestBody @Valid NewsletterSendDTO newsletterSendDTO)
            throws InvalidDataException, Exception {
        if (newsletterSendDTO.getLetterSeq() != null) {
            throw new MokaException(msg("tps.common.error.duplicated.key"));
        }

        NewsletterSend newsletterSend = modelMapper.map(newsletterSendDTO, NewsletterSend.class);

        // 등록
        NewsletterSend returnValue = newsletterService.insertNewsletterSend(newsletterSend);

        // 결과리턴
        NewsletterSendDTO dto = modelMapper.map(returnValue, NewsletterSendDTO.class);
        ResultDTO<NewsletterSendDTO> resultDto = new ResultDTO<NewsletterSendDTO>(dto, msg("tps.common.success.insert"));

        tpsLogger.success(ActionType.INSERT);
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
        NewsletterSend returnValue = newsletterService.updateNewsletterSend(newsletterSend);

        // 결과리턴
        NewsletterSendDTO dto = modelMapper.map(returnValue, NewsletterSendDTO.class);
        ResultDTO<NewsletterSendDTO> resultDto = new ResultDTO<NewsletterSendDTO>(dto, msg("tps.common.success.update"));

        tpsLogger.success(ActionType.UPDATE);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }
}
