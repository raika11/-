package jmnet.moka.core.tps.mvc.jpod.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.io.IOException;
import java.lang.reflect.Type;
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
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.ftp.FtpHelper;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.util.ImageUtil;
import jmnet.moka.core.tps.mvc.jpod.dto.JpodChannelDTO;
import jmnet.moka.core.tps.mvc.jpod.dto.JpodChannelDetailDTO;
import jmnet.moka.core.tps.mvc.jpod.dto.JpodChannelSearchDTO;
import jmnet.moka.core.tps.mvc.jpod.dto.JpodKeywordDTO;
import jmnet.moka.core.tps.mvc.jpod.dto.JpodMemberDTO;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodChannel;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodKeyword;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodMember;
import jmnet.moka.core.tps.mvc.jpod.service.JpodChannelService;
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
 * ClassName : JpodChannelController
 * Created : 2020-11-09 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-09 14:10
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/jpods")
@Api(tags = {"J팟 채널 API"})
public class JpodChannelRestController extends AbstractCommonController {

    private final JpodChannelService jpodChannelService;

    private final FtpHelper ftpHelper;

    @Value("${jpod-channel.image.save.filepath}")
    private String jpodChannelImageSavepath;

    @Value("${pds.url}")
    private String pdsUrl;


    public JpodChannelRestController(JpodChannelService jpodChannelService, FtpHelper ftpHelper) {
        this.jpodChannelService = jpodChannelService;
        this.ftpHelper = ftpHelper;
    }

    /**
     * Jpod 채널목록조회
     *
     * @param search 검색조건
     * @return Jpod 채널목록
     */
    @ApiOperation(value = "Jpod 채널 목록 조회")
    @GetMapping
    public ResponseEntity<?> getChannelList(@SearchParam JpodChannelSearchDTO search) {

        ResultListDTO<JpodChannelDTO> resultListMessage = new ResultListDTO<>();

        // 조회
        Page<JpodChannel> returnValue = jpodChannelService.findAllJpodChannel(search);

        // 리턴값 설정
        List<JpodChannelDTO> channelDtoList = modelMapper.map(returnValue.getContent(), JpodChannelDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(channelDtoList);

        ResultDTO<ResultListDTO<JpodChannelDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * JpodChannel정보 조회
     *
     * @param chnlSeq JpodChannel아이디 (필수)
     * @return JpodChannel정보
     * @throws NoDataException JpodChannel 정보가 없음
     */
    @ApiOperation(value = "JpodChannel 조회")
    @GetMapping("/{chnlSeq}")
    public ResponseEntity<?> getJpodChannel(
            @ApiParam("채널 일련번호") @PathVariable("chnlSeq") @Min(value = 0, message = "{tps.jpod-channel.error.min.chnlSeq}") Long chnlSeq)
            throws NoDataException {

        String message = msg("tps.common.error.no-data");
        JpodChannel jpodChannel = jpodChannelService
                .findJpodChannelBySeq(chnlSeq)
                .orElseThrow(() -> new NoDataException(message));

        JpodChannelDetailDTO dto = modelMapper.map(jpodChannel, JpodChannelDetailDTO.class);

        dto.setKeywords(modelMapper.map(jpodChannelService.findAllJpodChannelKeyword(chnlSeq), JpodKeywordDTO.TYPE));
        dto.setMembers(modelMapper.map(jpodChannelService.findAllJpodChannelMember(chnlSeq), JpodMemberDTO.TYPE));

        dto.setEpisodeStat(jpodChannelService.findEpisodeStat(chnlSeq));

        tpsLogger.success(ActionType.SELECT);

        ResultDTO<JpodChannelDetailDTO> resultDto = new ResultDTO<>(dto);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }


    /**
     * 등록
     *
     * @param jpodChannelDTO 등록할 JpodChannel정보
     * @return 등록된 JpodChannel정보
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "JpodChannel 등록")
    @PostMapping
    public ResponseEntity<?> postJpodChannel(@Valid JpodChannelDetailDTO jpodChannelDTO,
            @RequestParam(value = "chnlImgFile", required = false) MultipartFile chnlImgFile,
            @RequestParam(value = "chnlThumbFile", required = false) MultipartFile chnlThumbFile,
            @RequestParam(value = "chnlImgMobFile", required = false) MultipartFile chnlImgMobFile)
            throws InvalidDataException, Exception {

        // JpodChannelDTO -> JpodChannel 변환
        JpodChannel jpodChannel = modelMapper.map(jpodChannelDTO, JpodChannel.class);

        try {
            Type membersType = new TypeReference<List<JpodMember>>() {
            }.getType();
            Type keywordsType = new TypeReference<List<JpodKeyword>>() {
            }.getType();
            List<JpodMember> members = modelMapper.map(jpodChannelDTO.getMembers(), membersType);
            List<JpodKeyword> keywords = modelMapper.map(jpodChannelDTO.getKeywords(), keywordsType);

            // insert
            jpodChannel = uploadImage(jpodChannel, chnlImgFile, chnlThumbFile, chnlImgMobFile);
            JpodChannel returnValue = jpodChannelService.insertJpodChannel(jpodChannel, keywords, members);


            // 결과리턴
            JpodChannelDTO dto = modelMapper.map(returnValue, JpodChannelDTO.class);
            ResultDTO<JpodChannelDTO> resultDto = new ResultDTO<>(dto, msg("tps.jpod-channel.success.save"));

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
     * @param chnlSeq        JpodChannel아이디
     * @param jpodChannelDTO 수정할 JpodChannel정보
     * @return 수정된 JpodChannel정보
     * @throws Exception 그외 모든 에러
     */
    @ApiOperation(value = "JpodChannel 수정")
    @PutMapping("/{chnlSeq}")
    public ResponseEntity<?> putJpodChannel(
            @ApiParam("채널 일련번호") @PathVariable("chnlSeq") @Min(value = 0, message = "{tps.jpod-channel.error.min.chnlSeq}") String chnlSeq,
            @Valid JpodChannelDetailDTO jpodChannelDTO, @RequestParam(value = "chnlImgFile", required = false) MultipartFile chnlImgFile,
            @RequestParam(value = "chnlThumbFile", required = false) MultipartFile chnlThumbFile,
            @RequestParam(value = "chnlImgMobFile", required = false) MultipartFile chnlImgMobFile)
            throws Exception {

        // JpodChannelDTO -> JpodChannel 변환
        String infoMessage = msg("tps.common.error.no-data");
        JpodChannel newJpodChannel = modelMapper.map(jpodChannelDTO, JpodChannel.class);

        // 오리진 데이터 조회
        jpodChannelService
                .findJpodChannelBySeq(newJpodChannel.getChnlSeq())
                .orElseThrow(() -> new NoDataException(infoMessage));

        try {
            Type membersType = new TypeReference<List<JpodMember>>() {
            }.getType();
            Type keywordsType = new TypeReference<List<JpodKeyword>>() {
            }.getType();
            List<JpodMember> members = modelMapper.map(jpodChannelDTO.getMembers(), membersType);
            List<JpodKeyword> keywords = modelMapper.map(jpodChannelDTO.getKeywords(), keywordsType);
            // update
            newJpodChannel = uploadImage(newJpodChannel, chnlImgFile, chnlThumbFile, chnlImgMobFile);
            JpodChannel returnValue = jpodChannelService.updateJpodChannel(newJpodChannel, keywords, members);

            // 결과리턴
            JpodChannelDTO dto = modelMapper.map(returnValue, JpodChannelDTO.class);
            ResultDTO<JpodChannelDTO> resultDto = new ResultDTO<>(dto, msg("tps.jpod-channel.success.save"));

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
     * @param chnlSeq 삭제 할 JpodChannel아이디 (필수)
     * @param usedYn  사용 여부
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException      삭제 할 JpodChannel 없음
     * @throws Exception            그 외 에러처리
     */
    @ApiOperation(value = "JpodChannel 사용여부 수정")
    @PutMapping("/{chnlSeq}/used")
    public ResponseEntity<?> putJpodChannelUsedYn(
            @ApiParam("채널 일련번호") @PathVariable("chnlSeq") @Min(value = 0, message = "{tps.jpod-channel.error.min.chnlSeq}") Long chnlSeq,
            @ApiParam("사용여부") @Pattern(regexp = "[Y|N]$", message = "{tps.common.error.pattern.usedYn}")
            @RequestParam(value = "usedYn", defaultValue = MokaConstants.YES) String usedYn)
            throws InvalidDataException, NoDataException, Exception {


        // JpodChannel 데이터 조회
        String noContentMessage = msg("tps.common.error.no-data");
        JpodChannel jpodChannel = jpodChannelService
                .findJpodChannelBySeq(chnlSeq)
                .orElseThrow(() -> new NoDataException(noContentMessage));



        try {
            // usedYn 수정
            jpodChannel.setUsedYn(usedYn);
            jpodChannelService.updateJpodChannelUsedYn(jpodChannel);

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
     * @param chnlSeq 삭제 할 JpodChannel아이디 (필수)
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException      삭제 할 JpodChannel 없음
     * @throws Exception            그 외 에러처리
     */
    @ApiOperation(value = "JpodChannel 삭제")
    @DeleteMapping("/{chnlSeq}")
    public ResponseEntity<?> deleteJpodChannel(
            @ApiParam("채널 일련번호") @PathVariable("chnlSeq") @Min(value = 0, message = "{tps.jpod-channel.error.min.chnlSeq}") Long chnlSeq)
            throws InvalidDataException, NoDataException, Exception {


        // JpodChannel 데이터 조회
        String noContentMessage = msg("tps.common.error.no-data");
        JpodChannel jpodChannel = jpodChannelService
                .findJpodChannelBySeq(chnlSeq)
                .orElseThrow(() -> new NoDataException(noContentMessage));

        try {
            // 삭제
            jpodChannelService.deleteJpodChannel(jpodChannel);

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
     * 채널 이미지 업로드
     *
     * @param jpodChannel    jpod 채널 정보
     * @param chnlImgFile    채널 이미지
     * @param chnlThumbFile  채널 썸내일
     * @param chnlImgMobFile 채널 모바일 이미지
     * @return JpodChannel
     * @throws InvalidDataException 데이터 오류 처리
     * @throws IOException          파일 오류 처리
     */
    public JpodChannel uploadImage(JpodChannel jpodChannel, MultipartFile chnlImgFile, MultipartFile chnlThumbFile, MultipartFile chnlImgMobFile)
            throws InvalidDataException, IOException {

        // 커버 이미지 업로드
        if (chnlImgFile != null) {
            if (McpString.isNotEmpty(jpodChannel.getChnlImg())) {
                deleteFile(jpodChannel.getChnlImg());
            }
            jpodChannel.setChnlImg(uploadImage(chnlImgFile));
        }

        // 모바일 이미지 업로드
        if (chnlImgMobFile != null) {
            if (McpString.isNotEmpty(jpodChannel.getChnlImgMob())) {
                deleteFile(jpodChannel.getChnlImgMob());
            }
            jpodChannel.setChnlImgMob(uploadImage(chnlImgMobFile));
        }

        // 썸내일 업로드
        if (chnlThumbFile != null) {
            if (McpString.isNotEmpty(jpodChannel.getChnlThumb())) {
                deleteFile(jpodChannel.getChnlThumb());
            }
            jpodChannel.setChnlThumb(uploadImage(chnlThumbFile));
        }

        return jpodChannel;
    }

    public String uploadImage(MultipartFile imgFile)
            throws InvalidDataException, IOException {

        if (!ImageUtil.isImage(imgFile)) {
            throw new InvalidDataException(msg("tps.jpod-channel.error.file-ext", imgFile.getOriginalFilename()));
        }

        String ext = McpFile.getExtension(imgFile.getOriginalFilename());
        String filename = UUIDGenerator.uuid() + "." + ext;
        String yearMonth = McpDate.dateStr(McpDate.now(), "yyyyMM/dd");
        String saveFilePath = String.format(jpodChannelImageSavepath, yearMonth);
        String imageUrl = pdsUrl;
        String message = "";
        if (ftpHelper.upload(FtpHelper.PDS, filename, imgFile.getInputStream(), saveFilePath)) {
            imageUrl = pdsUrl + saveFilePath + "/" + filename;
        } else {
            message = msg("tps.jpod-channel.error.upload");
        }

        // 액션 로그에 성공 로그 출력
        tpsLogger.success(ActionType.UPLOAD, message);

        return imageUrl;
    }

    public boolean deleteFile(String imgUrl) {

        String saveFilePath = imgUrl.replaceAll(pdsUrl, "");

        String[] pathAndName = McpFile.getFilepathAndName(saveFilePath);

        return ftpHelper.delete(FtpHelper.PDS, pathAndName[0], pathAndName[1]);
    }

}
