package jmnet.moka.core.tps.mvc.jpod.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.io.IOException;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
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
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.ftp.FtpHelper;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.util.ImageUtil;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.jpod.dto.JpodEpisodeDTO;
import jmnet.moka.core.tps.mvc.jpod.dto.JpodEpisodeSearchDTO;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodEpisode;
import jmnet.moka.core.tps.mvc.jpod.service.JpodEpisodeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.jpod.controller
 * ClassName : JpodEpisodeController
 * Created : 2020-11-09 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-09 14:10
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/jpod")
@Api(tags = {"J팟 에피소드 API"})
public class JpodEpisodeRestController extends AbstractCommonController {

    private final JpodEpisodeService jpodEpisodeService;

    private final FtpHelper ftpHelper;

    @Value("${jpod-channel.image.save.filepath}")
    private String jpodEpisodeImageSavepath;

    @Value("${pds.url}")
    private String pdsUrl;


    public JpodEpisodeRestController(JpodEpisodeService jpodEpisodeService, FtpHelper ftpHelper) {
        this.jpodEpisodeService = jpodEpisodeService;
        this.ftpHelper = ftpHelper;
    }

    /**
     * Jpod 에피소드목록조회
     *
     * @param search 검색조건
     * @return Jpod 에피소드목록
     */
    @ApiOperation(value = "Jpod 에피소드 목록 조회")
    @GetMapping("/episodes")
    public ResponseEntity<?> getEpisodeList(
            @ApiParam("채널 일련번호") @PathVariable("chnlSeq") @Min(value = 0, message = "{tps.jpod-channel.error.min.chnlSeq}") Long chnlSeq,
            @SearchParam JpodEpisodeSearchDTO search) {

        ResultListDTO<JpodEpisodeDTO> resultListMessage = new ResultListDTO<>();

        // 조회
        Page<JpodEpisode> returnValue = jpodEpisodeService.findAllJpodEpisode(search);

        // 리턴값 설정
        List<JpodEpisodeDTO> channelDtoList = modelMapper.map(returnValue.getContent(), JpodEpisodeDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(channelDtoList);

        ResultDTO<ResultListDTO<JpodEpisodeDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * JpodEpisode정보 조회
     *
     * @param request 요청
     * @param chnlSeq JpodEpisode아이디 (필수)
     * @return JpodEpisode정보
     * @throws NoDataException JpodEpisode 정보가 없음
     */
    @ApiOperation(value = "JpodEpisode 조회")
    @GetMapping("/{chnlSeq}/episodes/{epsdSeq}")
    public ResponseEntity<?> getJpodEpisode(HttpServletRequest request,
            @ApiParam("채널 일련번호") @PathVariable("chnlSeq") @Min(value = 0, message = "{tps.jpod-channel.error.min.chnlSeq}") Long chnlSeq,
            @ApiParam("에피소드 일련번호") @PathVariable("epsdSeq") @Min(value = 0, message = "{tps.jpod-channel.error.min.epsdSeq}") Long epsdSeq)
            throws NoDataException {

        String message = msg("tps.common.error.no-data");
        JpodEpisode jpodEpisode = jpodEpisodeService
                .findJpodEpisodeById(chnlSeq)
                .orElseThrow(() -> new NoDataException(message));

        JpodEpisodeDTO dto = modelMapper.map(jpodEpisode, JpodEpisodeDTO.class);

        tpsLogger.success(ActionType.SELECT);

        ResultDTO<JpodEpisodeDTO> resultDto = new ResultDTO<>(dto);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }


    /**
     * 등록
     *
     * @param chnlSeq        요청
     * @param jpodEpisodeDTO 등록할 JpodEpisode정보
     * @return 등록된 JpodEpisode정보
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "JpodEpisode 등록")
    @PostMapping("/{chnlSeq}/episodes")
    public ResponseEntity<?> postJpodEpisode(
            @ApiParam("채널 일련번호") @PathVariable("chnlSeq") @Min(value = 0, message = "{tps.jpod-channel.error.min.chnlSeq}") Long chnlSeq,
            @Valid JpodEpisodeDTO jpodEpisodeDTO, @RequestParam(value = "shrImgFile", required = false) MultipartFile shrImgFile,
            @RequestParam(value = "katalkImgFile", required = false) MultipartFile katalkImgFile)
            throws InvalidDataException, Exception {

        // JpodEpisodeDTO -> JpodEpisode 변환
        JpodEpisode jpodEpisode = modelMapper.map(jpodEpisodeDTO, JpodEpisode.class);

        try {

            // insert
            jpodEpisode = uploadImage(jpodEpisode, shrImgFile, katalkImgFile);
            JpodEpisode returnValue = jpodEpisodeService.insertJpodEpisode(jpodEpisode);


            // 결과리턴
            JpodEpisodeDTO dto = modelMapper.map(returnValue, JpodEpisodeDTO.class);
            ResultDTO<JpodEpisodeDTO> resultDto = new ResultDTO<>(dto, msg("tps.jpod-channel.success.save"));

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.INSERT);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT JPOD_CHANNEL]", e);
            // 액션 로그에 오류 내용 출력
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.jpod-channel.error.save"), e);
        }
    }

    /**
     * 수정
     *
     * @param request        요청
     * @param chnlSeq        JpodEpisode아이디
     * @param jpodEpisodeDTO 수정할 JpodEpisode정보
     * @return 수정된 JpodEpisode정보
     * @throws Exception 그외 모든 에러
     */
    @ApiOperation(value = "JpodEpisode 수정")
    @PutMapping(("/{chnlSeq}/episodes/{epsdSeq}"))
    public ResponseEntity<?> putJpodEpisode(HttpServletRequest request,
            @ApiParam("에피소드 일련번호") @PathVariable("chnlSeq") @Min(value = 0, message = "{tps.jpod-channel.error.min.chnlSeq}") String chnlSeq,
            @Valid JpodEpisodeDTO jpodEpisodeDTO, @RequestParam(value = "shrImgFile", required = false) MultipartFile shrImgFile,
            @RequestParam(value = "katalkImgFile", required = false) MultipartFile katalkImgFile)
            throws Exception {

        // JpodEpisodeDTO -> JpodEpisode 변환
        String infoMessage = msg("tps.common.error.no-data");
        JpodEpisode newJpodEpisode = modelMapper.map(jpodEpisodeDTO, JpodEpisode.class);

        // 오리진 데이터 조회
        JpodEpisode orgJpodEpisode = jpodEpisodeService
                .findJpodEpisodeById(newJpodEpisode.getChnlSeq())
                .orElseThrow(() -> new NoDataException(infoMessage));

        try {
            // update
            newJpodEpisode = uploadImage(newJpodEpisode, shrImgFile, katalkImgFile);
            JpodEpisode returnValue = jpodEpisodeService.updateJpodEpisode(newJpodEpisode);

            // 결과리턴
            JpodEpisodeDTO dto = modelMapper.map(returnValue, JpodEpisodeDTO.class);
            ResultDTO<JpodEpisodeDTO> resultDto = new ResultDTO<>(dto, msg("tps.jpod-channel.success.save"));

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.UPDATE);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE JPOD_CHANNEL]", e);
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(ActionType.UPDATE, e);
            throw new Exception(msg("tps.jpod-channel.error.save"), e);
        }
    }

    /**
     * 삭제
     *
     * @param request 요청
     * @param chnlSeq 삭제 할 JpodEpisode아이디 (필수)
     * @param usedYn  사용 여부
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException      삭제 할 JpodEpisode 없음
     * @throws Exception            그 외 에러처리
     */
    @ApiOperation(value = "JpodEpisode 사용여부 수정")
    @PutMapping("/{chnlSeq}/episodes/{epsdSeq}/used")
    public ResponseEntity<?> putJpodEpisodeUsedYn(HttpServletRequest request,
            @ApiParam("에피소드 일련번호") @PathVariable("chnlSeq") @Min(value = 0, message = "{tps.jpod-channel.error.min.chnlSeq}") Long chnlSeq,
            @ApiParam("사용여부") @Pattern(regexp = "[Y|N]{1}$", message = "{tps.common.error.pattern.usedYn}")
            @RequestParam(value = "usedYn", defaultValue = MokaConstants.YES) String usedYn)
            throws InvalidDataException, NoDataException, Exception {


        // JpodEpisode 데이터 조회
        String noContentMessage = msg("tps.common.error.no-data");
        JpodEpisode jpodEpisode = jpodEpisodeService
                .findJpodEpisodeById(chnlSeq)
                .orElseThrow(() -> new NoDataException(noContentMessage));



        try {
            // usedYn 수정
            jpodEpisode.setUsedYn(usedYn);
            jpodEpisodeService.updateJpodEpisode(jpodEpisode);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.UPDATE);

            // 결과리턴
            ResultDTO<Boolean> resultDto = new ResultDTO<>(true, msg("tps.jpod-channel.success.save"));
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE JPOD_CHANNEL] chnlSeq: {} {}", chnlSeq, e.getMessage());
            // 액션 로그에 실패 로그 출력
            tpsLogger.error(ActionType.UPDATE, e.toString());
            throw new Exception(msg("tps.jpod-channel.error.save"), e);
        }
    }

    /**
     * 삭제
     *
     * @param request 요청
     * @param chnlSeq 삭제 할 JpodEpisode아이디 (필수)
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException      삭제 할 JpodEpisode 없음
     * @throws Exception            그 외 에러처리
     */
    @ApiOperation(value = "JpodEpisode 삭제")
    @DeleteMapping("/{chnlSeq}/episodes/{epsdSeq}")
    public ResponseEntity<?> deleteJpodEpisode(HttpServletRequest request,
            @ApiParam("에피소드 일련번호") @PathVariable("chnlSeq") @Min(value = 0, message = "{tps.jpod-channel.error.min.chnlSeq}") Long chnlSeq)
            throws InvalidDataException, NoDataException, Exception {


        // JpodEpisode 데이터 조회
        String noContentMessage = msg("tps.common.error.no-data");
        JpodEpisode jpodEpisode = jpodEpisodeService
                .findJpodEpisodeById(chnlSeq)
                .orElseThrow(() -> new NoDataException(noContentMessage));

        try {
            // 삭제
            jpodEpisodeService.deleteJpodEpisode(jpodEpisode);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.DELETE);

            // 결과리턴
            ResultDTO<Boolean> resultDto = new ResultDTO<>(true, msg("tps.jpod-channel.delete.save"));
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE JPOD_CHANNEL] chnlSeq: {} {}", chnlSeq, e.getMessage());
            // 액션 로그에 실패 로그 출력
            tpsLogger.error(ActionType.DELETE, e.toString());
            throw new Exception(msg("tps.jpod-channel.error.delete"), e);
        }
    }


    /**
     * 에피소드 이미지 업로드
     *
     * @param jpodEpisode   jpod 에피소드 정보
     * @param shrImgFile    공유 이미지 파일
     * @param katalkImgFile 카카오 이미지 파일
     * @return JpodEpisode
     * @throws InvalidDataException 데이터 오류 처리
     * @throws IOException          파일 오류 처리
     */
    public JpodEpisode uploadImage(JpodEpisode jpodEpisode, MultipartFile shrImgFile, MultipartFile katalkImgFile)
            throws InvalidDataException, IOException {

        // 커버 이미지 업로드
        if (shrImgFile != null) {
            if (McpString.isNotEmpty(jpodEpisode.getShrImg())) {
                deleteFile(jpodEpisode.getShrImg());
            }
            jpodEpisode.setShrImg(uploadImage(shrImgFile));
        }

        // 카카오 이미지 업로드
        if (katalkImgFile != null) {
            if (McpString.isNotEmpty(jpodEpisode.getKatalkImg())) {
                deleteFile(jpodEpisode.getKatalkImg());
            }
            jpodEpisode.setKatalkImg(uploadImage(katalkImgFile));
        }



        return jpodEpisode;
    }

    public String uploadImage(MultipartFile imgFile)
            throws InvalidDataException, IOException {

        if (!ImageUtil.isImage(imgFile)) {
            throw new InvalidDataException(msg("tps.common.error.file-ext", imgFile.getOriginalFilename()));
        }

        String ext = McpFile.getExtension(imgFile.getOriginalFilename());
        String filename = UUIDGenerator.uuid() + "." + ext;
        String yearMonth = McpDate.dateStr(McpDate.now(), "yyyyMM/dd");
        String saveFilePath = String.format(jpodEpisodeImageSavepath, yearMonth);
        String imageUrl = pdsUrl;
        String message = "";
        if (ftpHelper.upload(FtpHelper.PDS, filename, imgFile.getInputStream(), saveFilePath)) {
            imageUrl = pdsUrl + saveFilePath + "/" + filename;
        } else {
            message = msg("tps.jpod-channel.error.upload");
        }

        // 액션 로그에 성공 로그 출력
        tpsLogger.success(ActionType.UPLOAD);

        return imageUrl;
    }

    public boolean deleteFile(String imgUrl)
            throws InvalidDataException, IOException {

        String saveFilePath = imgUrl.replaceAll(pdsUrl, "");

        String[] pathAndName = McpFile.getFilepathAndName(saveFilePath);

        return ftpHelper.delete(FtpHelper.PDS, pathAndName[0], pathAndName[1]);
    }

}
