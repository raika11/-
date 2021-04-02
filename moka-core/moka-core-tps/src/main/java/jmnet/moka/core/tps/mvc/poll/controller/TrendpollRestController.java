package jmnet.moka.core.tps.mvc.poll.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.models.Response;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpFile;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.UUIDGenerator;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.common.utils.dto.ResultMapDTO;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.ftp.FtpHelper;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.util.ImageUtil;
import jmnet.moka.core.tps.mvc.poll.code.PollCode.PollStatCode;
import jmnet.moka.core.tps.mvc.poll.code.PollCode.PollStatusCode;
import jmnet.moka.core.tps.mvc.poll.dto.TrendpollDTO;
import jmnet.moka.core.tps.mvc.poll.dto.TrendpollDetailDTO;
import jmnet.moka.core.tps.mvc.poll.dto.TrendpollItemDTO;
import jmnet.moka.core.tps.mvc.poll.dto.TrendpollSearchDTO;
import jmnet.moka.core.tps.mvc.poll.dto.TrendpollStatSearchDTO;
import jmnet.moka.core.tps.mvc.poll.entity.Trendpoll;
import jmnet.moka.core.tps.mvc.poll.entity.TrendpollDetail;
import jmnet.moka.core.tps.mvc.poll.service.TrendpollService;
import jmnet.moka.core.tps.mvc.poll.vo.TrendpollCntVO;
import jmnet.moka.core.tps.mvc.poll.vo.TrendpollStatVO;
import jmnet.moka.core.tps.mvc.poll.vo.TrendpollVoteVO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.ModelMap;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.poll.controller
 * ClassName : TrendpollRestController
 * Created : 2021-01-13 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-13 09:42
 */
@RestController
@RequestMapping("/api/polls")
@Api(tags = {"투표 API"})
public class TrendpollRestController extends AbstractCommonController {

    @Value("${poll.image.save.filepath}")
    private String pollImageSavepath;

    @Value("${image.url}")
    private String imageDomain;

    private final ModelMapper modelMapper;

    private final TrendpollService trendpollService;

    private final FtpHelper ftpHelper;

    public TrendpollRestController(ModelMapper modelMapper, TrendpollService trendpollService, FtpHelper ftpHelper) {
        this.modelMapper = modelMapper;
        this.trendpollService = trendpollService;
        this.ftpHelper = ftpHelper;
    }


    /**
     * 목록조회
     *
     * @param search 검색조건
     * @return 목록
     */
    @ApiOperation(value = "투표 목록 조회")
    @GetMapping
    public ResponseEntity<?> getTrendpollList(@SearchParam TrendpollSearchDTO search) {

        ResultListDTO<TrendpollDTO> resultListMessage = new ResultListDTO<>();

        Page<Trendpoll> trendpolls = trendpollService.findAllTrendpoll(search);
        resultListMessage.setList(modelMapper.map(trendpolls.getContent(), TrendpollDTO.TYPE));
        resultListMessage.setTotalCnt(trendpolls.getTotalElements());

        tpsLogger.success(ActionType.SELECT);

        ResultDTO<ResultListDTO<TrendpollDTO>> resultDto = new ResultDTO<>(resultListMessage);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 목록조회
     *
     * @param pollSeq 투표일련번호
     * @return 투표정보
     */
    @ApiOperation(value = "투표 정보 조회")
    @GetMapping("/{pollSeq}")
    public ResponseEntity<?> getTrendpoll(
            @ApiParam("투표 일련번호") @PathVariable("pollSeq") @Min(value = 0, message = "{tps.poll.error.pattern.pollSeq}") Long pollSeq)
            throws NoDataException {

        TrendpollDetail trendpoll = trendpollService
                .findTrendpollDetailBySeq(pollSeq)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        tpsLogger.success(ActionType.SELECT);

        ResultDTO<TrendpollDetailDTO> resultDto = new ResultDTO<>(modelMapper.map(trendpoll, TrendpollDetailDTO.class));

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 등록
     *
     * @param trendpollSaveDTO 등록할 정보
     * @return 등록된 정보
     */
    @ApiOperation(value = "투표 등록")
    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_UTF8_VALUE})
    public ResponseEntity<?> postTrendpoll(@Valid TrendpollDetailDTO trendpollSaveDTO)
            throws InvalidDataException, Exception {

        List<String> fileUploadMessages = saveUploadImage(trendpollSaveDTO);

        TrendpollDetail trendpoll = modelMapper.map(trendpollSaveDTO, TrendpollDetail.class);
        trendpoll = trendpollService.insertTrendpoll(trendpoll);

        StringBuilder resultMessage = new StringBuilder(msg("tps.common.success.insert"));

        if (fileUploadMessages.size() > 0) {
            resultMessage.append(McpString.toCommaDelimitedString(fileUploadMessages.toArray(new String[0])));
        }

        ResultDTO<TrendpollDetailDTO> resultDto = new ResultDTO<>(modelMapper.map(trendpoll, TrendpollDetailDTO.class), resultMessage.toString());

        tpsLogger.success(ActionType.INSERT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 투표 정보 수정
     *
     * @param trendpollSaveDTO 투표 정보
     * @param pollSeq          투표 일련번호
     * @return 등록된 정보
     */
    @ApiOperation(value = "투표 수정")
    @PutMapping("/{pollSeq}")
    public ResponseEntity<?> putTrendpoll(
            @ApiParam("투표 일련번호") @PathVariable("pollSeq") @Min(value = 1, message = "{tps.poll.error.pattern.pollSeq}") Long pollSeq,
            @Valid TrendpollDetailDTO trendpollSaveDTO)
            throws NoDataException, InvalidDataException, Exception {

        trendpollService
                .findTrendpollBySeq(pollSeq)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        List<String> fileUploadMessages = saveUploadImage(trendpollSaveDTO);

        TrendpollDetail trendpoll = modelMapper.map(trendpollSaveDTO, TrendpollDetail.class);
        trendpoll.setPollSeq(pollSeq);
        trendpoll = trendpollService.updateTrendpoll(trendpoll);

        tpsLogger.success(ActionType.UPDATE);

        StringBuilder resultMessage = new StringBuilder(msg("tps.common.success.update"));

        if (fileUploadMessages.size() > 0) {
            resultMessage.append(McpString.toCommaDelimitedString(fileUploadMessages.toArray(new String[0])));
        }

        ResultDTO<TrendpollDetailDTO> resultDto = new ResultDTO<>(modelMapper.map(trendpoll, TrendpollDetailDTO.class), resultMessage.toString());

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 투표 상태 변경
     *
     * @param pollSeq 투표 일련번호
     * @return 성공여부
     */
    @ApiOperation(value = "투표 정보 삭제/복원")
    @PutMapping("/{pollSeq}/used")
    public ResponseEntity<?> putTrendpollUsedYn(
            @ApiParam("투표 일련번호") @PathVariable("pollSeq") @Min(value = 1, message = "{tps.poll.error.pattern.pollSeq}") Long pollSeq,
            @ApiParam("사용여부") @NotNull(message = "{tps.poll.error.notnull.status}") @RequestParam(value = "status") PollStatusCode status)
            throws NoDataException {

        trendpollService
                .findTrendpollBySeq(pollSeq)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        long result = trendpollService.updateTrendpollStatus(pollSeq, status);

        tpsLogger.success(ActionType.UPDATE);

        ResultDTO<TrendpollDTO> resultDto = new ResultDTO<>(modelMapper.map(result, TrendpollDTO.class), msg("tps.common.success.update"));

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 투표 현황 목록 조회
     *
     * @param search 검색조건
     * @return 목록
     */
    @ApiOperation(value = "투표 현황 목록 조회")
    @GetMapping("/{pollSeq}/stats")
    public ResponseEntity<?> getTrendpollStatMap(
            @ApiParam("투표 일련번호") @PathVariable("pollSeq") @Min(value = 1, message = "{tps.poll.error.pattern.pollSeq}") Long pollSeq,
            @SearchParam TrendpollStatSearchDTO search) {

        ResultMapDTO resultMapDTO = new ResultMapDTO(HttpStatus.OK);

        List<List<TrendpollCntVO>> trendpollsCnt = trendpollService.findAllTrendpollVoteCnt(search);
        resultMapDTO.addBodyAttribute(PollStatCode.A.getCode() + "_CNT",
                trendpollsCnt != null && trendpollsCnt.size() > 0 ? trendpollsCnt.get(0) : null);
        resultMapDTO.addBodyAttribute(PollStatCode.D.getCode() + "_CNT",
                trendpollsCnt != null && trendpollsCnt.size() > 1 ? trendpollsCnt.get(1) : null);
        resultMapDTO.addBodyAttribute(PollStatCode.T.getCode() + "_CNT",
                trendpollsCnt != null && trendpollsCnt.size() > 2 ? trendpollsCnt.get(2) : null);

        List<List<TrendpollStatVO>> trendpolls = trendpollService.findAllTrendpollVoteStat(search);


        resultMapDTO.addBodyAttribute(PollStatCode.A.getCode() + "_STAT", trendpolls != null && trendpolls.size() > 0 ? trendpolls.get(0) : null);
        resultMapDTO.addBodyAttribute(PollStatCode.D.getCode() + "_STAT", trendpolls != null && trendpolls.size() > 1 ? trendpolls.get(1) : null);
        resultMapDTO.addBodyAttribute(PollStatCode.T.getCode() + "_STAT", trendpolls != null && trendpolls.size() > 2 ? trendpolls.get(2) : null);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultMapDTO, HttpStatus.OK);
    }

    @ApiOperation(value = "투표 목록 엑셀 다운로드", response = Response.class)
    @GetMapping(value = "/{pollSeq}/excel", produces = {"application/vnd.ms-excel"})
    public TrendpollExcelView getExcel(
            @ApiParam("투표 일련번호") @PathVariable("pollSeq") @Min(value = 1, message = "{tps.poll.error.pattern.pollSeq}") Long pollSeq,
            @ApiParam(hidden = true) ModelMap map) {

        TrendpollExcelView excelView = new TrendpollExcelView();
        //        // 최종 페이지
        //        int totalPages;
        //        int size = 200;
        //        // 현재 페이지
        //        AtomicInteger currentPage = new AtomicInteger(0);
        //
        //
        //        Page<TrendpollVote> list = trendpollService.findAllTrendpollVote(pollSeq, PageRequest.of(currentPage.getAndAdd(1), size));
        //
        //        totalPages = list.getTotalPages();
        //
        //        List<TrendpollVote> resultList = new ArrayList<>();
        //        if (totalPages > 0) {
        //            resultList.addAll(list.getContent());
        //            while (currentPage.get() < totalPages) {
        //                list = trendpollService.findAllTrendpollVote(pollSeq, PageRequest.of(currentPage.getAndAdd(1), size));
        //                resultList.addAll(list.getContent());
        //            }
        //        }

        List<TrendpollVoteVO> resultList = trendpollService.findAllByPollSeq(pollSeq);

        String[] columns = new String[] {"선택 항목", "디바이스 구분", "등록일시", "등록IP주소", "로그인SITE", "회원ID", "PC_ID"};

        map.addAttribute("title", "투표 통계");
        map.addAttribute("columnList", CollectionUtils.arrayToList(columns));
        map.addAttribute("resultList", resultList);
        excelView.setAttributesMap(map);

        return excelView;
    }

    /**
     * 본문에 첨부되는 이미지 업로드
     *
     * @return 등록된 게시판정보
     */
    private List<String> saveUploadImage(TrendpollDetailDTO trendpollDetailDTO)
            throws InvalidDataException, IOException {

        List<String> uploadMessages = new ArrayList<>();


        List<TrendpollItemDTO> pollItems = trendpollDetailDTO.getPollItems();
        if (pollItems != null && pollItems.size() > 0) {
            for (TrendpollItemDTO trendpollItemDTO : pollItems) {
                if (trendpollItemDTO.getImgFile() != null) {
                    if (!ImageUtil.isImage(trendpollItemDTO.getImgFile())) {
                        uploadMessages.add(msg("tps.quiz.error.file-ext", trendpollItemDTO
                                .getImgFile()
                                .getOriginalFilename()));
                    }

                    String ext = McpFile.getExtension(trendpollItemDTO
                            .getImgFile()
                            .getOriginalFilename());
                    String filename = UUIDGenerator.uuid() + "." + ext;
                    String yearMonth = McpDate.dateStr(McpDate.now(), "yyyy/MM/dd");
                    String saveFilePath = String.format(pollImageSavepath, yearMonth);
                    String imageUrl = imageDomain;

                    if (ftpHelper.upload(FtpHelper.IMAGES, filename, trendpollItemDTO
                            .getImgFile()
                            .getInputStream(), saveFilePath)) {
                        imageUrl = imageUrl + saveFilePath + "/" + filename;
                        trendpollItemDTO.setImgUrl(imageUrl);
                    } else {
                        uploadMessages.add(msg("tps.quiz-question.error.upload", filename));
                    }
                }
            }
        }

        // 액션 로그에 성공 로그 출력
        tpsLogger.success(ActionType.UPLOAD);

        return uploadMessages;
    }
}
