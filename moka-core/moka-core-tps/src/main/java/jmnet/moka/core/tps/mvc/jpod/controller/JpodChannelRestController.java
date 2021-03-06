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
@Api(tags = {"J??? ?????? API"})
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
     * Jpod ??????????????????
     *
     * @param search ????????????
     * @return Jpod ????????????
     */
    @ApiOperation(value = "Jpod ?????? ?????? ??????")
    @GetMapping
    public ResponseEntity<?> getChannelList(@SearchParam JpodChannelSearchDTO search) {

        ResultListDTO<JpodChannelDTO> resultListMessage = new ResultListDTO<>();

        // ??????
        Page<JpodChannel> returnValue = jpodChannelService.findAllJpodChannel(search);

        // ????????? ??????
        List<JpodChannelDTO> channelDtoList = modelMapper.map(returnValue.getContent(), JpodChannelDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(channelDtoList);

        ResultDTO<ResultListDTO<JpodChannelDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * JpodChannel?????? ??????
     *
     * @param chnlSeq JpodChannel????????? (??????)
     * @return JpodChannel??????
     * @throws NoDataException JpodChannel ????????? ??????
     */
    @ApiOperation(value = "JpodChannel ??????")
    @GetMapping("/{chnlSeq}")
    public ResponseEntity<?> getJpodChannel(
            @ApiParam("?????? ????????????") @PathVariable("chnlSeq") @Min(value = 0, message = "{tps.jpod-channel.error.min.chnlSeq}") Long chnlSeq)
            throws NoDataException {

        String message = msg("tps.common.error.no-data");
        JpodChannel jpodChannel = jpodChannelService
                .findJpodChannelBySeq(chnlSeq)
                .orElseThrow(() -> new NoDataException(message));

        JpodChannelDetailDTO dto = modelMapper.map(jpodChannel, JpodChannelDetailDTO.class);

        dto.setKeywords(modelMapper.map(jpodChannelService.findAllJpodChannelKeyword(chnlSeq), JpodKeywordDTO.TYPE));
        dto.setMembers(modelMapper.map(jpodChannelService.findAllJpodChannelMember(chnlSeq), JpodMemberDTO.TYPE));

        dto.setEpisodeStat(jpodChannelService.findEpisodeStat(chnlSeq, 0));

        tpsLogger.success(ActionType.SELECT);

        ResultDTO<JpodChannelDetailDTO> resultDto = new ResultDTO<>(dto);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * JpodChannel?????? ?????? - podty ??????????????? ??????
     *
     * @param podtyChnlSrl podty ??????????????? ?????? (??????)
     * @return JpodChannel??????
     * @throws NoDataException JpodChannel ????????? ??????
     */
    @ApiOperation(value = "JpodChannel ??????")
    @GetMapping("/{podtyChnlSrl}/by-podty-seq")
    public ResponseEntity<?> getJpodChannel(@ApiParam("podty????????????") @PathVariable("podtyChnlSrl")
    @Min(value = 0, message = "{tps.jpod-episode.error.min.seasonNo}") Integer podtyChnlSrl,
            @RequestParam(value = "seasonNo", required = false, defaultValue = "0") Integer seasonNo)
            throws NoDataException {

        String message = msg("tps.common.error.no-data");
        JpodChannel jpodChannel = jpodChannelService
                .findJpodChannelByPodtyChnlSrl(podtyChnlSrl)
                .orElseThrow(() -> new NoDataException(message));



        JpodChannelDetailDTO dto = modelMapper.map(jpodChannel, JpodChannelDetailDTO.class);

        if (seasonNo > 0) {
            dto.setEpisodeStat(jpodChannelService.findEpisodeStat(dto.getChnlSeq(), seasonNo));
        }

        tpsLogger.success(ActionType.SELECT);

        ResultDTO<JpodChannelDetailDTO> resultDto = new ResultDTO<>(dto);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }


    /**
     * ??????
     *
     * @param jpodChannelDTO ????????? JpodChannel??????
     * @return ????????? JpodChannel??????
     * @throws InvalidDataException ????????? ????????? ??????
     * @throws Exception            ????????????
     */
    @ApiOperation(value = "JpodChannel ??????")
    @PostMapping
    public ResponseEntity<?> postJpodChannel(@Valid JpodChannelDetailDTO jpodChannelDTO,
            @RequestParam(value = "chnlImgFile", required = false) MultipartFile chnlImgFile,
            @RequestParam(value = "chnlThumbFile", required = false) MultipartFile chnlThumbFile,
            @RequestParam(value = "chnlImgMobFile", required = false) MultipartFile chnlImgMobFile)
            throws InvalidDataException, Exception {

        // JpodChannelDTO -> JpodChannel ??????
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


            // ????????????
            JpodChannelDTO dto = modelMapper.map(returnValue, JpodChannelDTO.class);
            ResultDTO<JpodChannelDTO> resultDto = new ResultDTO<>(dto, msg("tps.jpod-channel.success.save"));

            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.success(ActionType.INSERT);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT JPOD_CHANNEL]", e);
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.jpod-channel.error.save"), e);
        }
    }

    /**
     * ??????
     *
     * @param chnlSeq        JpodChannel?????????
     * @param jpodChannelDTO ????????? JpodChannel??????
     * @return ????????? JpodChannel??????
     * @throws Exception ?????? ?????? ??????
     */
    @ApiOperation(value = "JpodChannel ??????")
    @PutMapping("/{chnlSeq}")
    public ResponseEntity<?> putJpodChannel(
            @ApiParam("?????? ????????????") @PathVariable("chnlSeq") @Min(value = 0, message = "{tps.jpod-channel.error.min.chnlSeq}") String chnlSeq,
            @Valid JpodChannelDetailDTO jpodChannelDTO, @RequestParam(value = "chnlImgFile", required = false) MultipartFile chnlImgFile,
            @RequestParam(value = "chnlThumbFile", required = false) MultipartFile chnlThumbFile,
            @RequestParam(value = "chnlImgMobFile", required = false) MultipartFile chnlImgMobFile)
            throws Exception {

        // JpodChannelDTO -> JpodChannel ??????
        String infoMessage = msg("tps.common.error.no-data");
        JpodChannel newJpodChannel = modelMapper.map(jpodChannelDTO, JpodChannel.class);

        // ????????? ????????? ??????
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

            // ????????????
            JpodChannelDTO dto = modelMapper.map(returnValue, JpodChannelDTO.class);
            ResultDTO<JpodChannelDTO> resultDto = new ResultDTO<>(dto, msg("tps.jpod-channel.success.save"));

            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.success(ActionType.UPDATE);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE JPOD_CHANNEL]", e);
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(ActionType.UPDATE, e);
            throw new Exception(msg("tps.jpod-channel.error.save"), e);
        }
    }

    /**
     * ??????
     *
     * @param chnlSeq ?????? ??? JpodChannel????????? (??????)
     * @param usedYn  ?????? ??????
     * @return ??????????????????
     * @throws InvalidDataException ????????????????????????
     * @throws NoDataException      ?????? ??? JpodChannel ??????
     * @throws Exception            ??? ??? ????????????
     */
    @ApiOperation(value = "JpodChannel ???????????? ??????")
    @PutMapping("/{chnlSeq}/used")
    public ResponseEntity<?> putJpodChannelUsedYn(
            @ApiParam("?????? ????????????") @PathVariable("chnlSeq") @Min(value = 0, message = "{tps.jpod-channel.error.min.chnlSeq}") Long chnlSeq,
            @ApiParam("????????????") @Pattern(regexp = "[Y|N]$", message = "{tps.common.error.pattern.usedYn}")
            @RequestParam(value = "usedYn", defaultValue = MokaConstants.YES) String usedYn)
            throws InvalidDataException, NoDataException, Exception {


        // JpodChannel ????????? ??????
        String noContentMessage = msg("tps.common.error.no-data");
        JpodChannel jpodChannel = jpodChannelService
                .findJpodChannelBySeq(chnlSeq)
                .orElseThrow(() -> new NoDataException(noContentMessage));



        try {
            // usedYn ??????
            jpodChannel.setUsedYn(usedYn);
            jpodChannelService.updateJpodChannelUsedYn(jpodChannel);

            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.success(ActionType.UPDATE);

            // ????????????
            ResultDTO<Boolean> resultDto = new ResultDTO<>(true, msg("tps.jpod-channel.success.save"));
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE JPOD_CHANNEL] chnlSeq: {} {}", chnlSeq, e.getMessage());
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(ActionType.UPDATE, e.toString());
            throw new Exception(msg("tps.jpod-channel.error.save"), e);
        }
    }

    /**
     * ??????
     *
     * @param chnlSeq ?????? ??? JpodChannel????????? (??????)
     * @return ??????????????????
     * @throws InvalidDataException ????????????????????????
     * @throws NoDataException      ?????? ??? JpodChannel ??????
     * @throws Exception            ??? ??? ????????????
     */
    @ApiOperation(value = "JpodChannel ??????")
    @DeleteMapping("/{chnlSeq}")
    public ResponseEntity<?> deleteJpodChannel(
            @ApiParam("?????? ????????????") @PathVariable("chnlSeq") @Min(value = 0, message = "{tps.jpod-channel.error.min.chnlSeq}") Long chnlSeq)
            throws InvalidDataException, NoDataException, Exception {


        // JpodChannel ????????? ??????
        String noContentMessage = msg("tps.common.error.no-data");
        JpodChannel jpodChannel = jpodChannelService
                .findJpodChannelBySeq(chnlSeq)
                .orElseThrow(() -> new NoDataException(noContentMessage));

        try {
            // ??????
            jpodChannelService.deleteJpodChannel(jpodChannel);

            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.success(ActionType.DELETE);

            // ????????????
            ResultDTO<Boolean> resultDto = new ResultDTO<>(true, msg("tps.jpod-channel.delete.save"));
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE JPOD_CHANNEL] chnlSeq: {} {}", chnlSeq, e.getMessage());
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(ActionType.DELETE, e.toString());
            throw new Exception(msg("tps.jpod-channel.error.delete"), e);
        }
    }


    /**
     * ?????? ????????? ?????????
     *
     * @param jpodChannel    jpod ?????? ??????
     * @param chnlImgFile    ?????? ?????????
     * @param chnlThumbFile  ?????? ?????????
     * @param chnlImgMobFile ?????? ????????? ?????????
     * @return JpodChannel
     * @throws InvalidDataException ????????? ?????? ??????
     * @throws IOException          ?????? ?????? ??????
     */
    public JpodChannel uploadImage(JpodChannel jpodChannel, MultipartFile chnlImgFile, MultipartFile chnlThumbFile, MultipartFile chnlImgMobFile)
            throws InvalidDataException, IOException {

        // ?????? ????????? ?????????
        if (chnlImgFile != null) {
            if (McpString.isNotEmpty(jpodChannel.getChnlImg())) {
                deleteFile(jpodChannel.getChnlImg());
            }
            jpodChannel.setChnlImg(uploadImage(chnlImgFile));
        }

        // ????????? ????????? ?????????
        if (chnlImgMobFile != null) {
            if (McpString.isNotEmpty(jpodChannel.getChnlImgMob())) {
                deleteFile(jpodChannel.getChnlImgMob());
            }
            jpodChannel.setChnlImgMob(uploadImage(chnlImgMobFile));
        }

        // ????????? ?????????
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

        // ?????? ????????? ?????? ?????? ??????
        tpsLogger.success(ActionType.UPLOAD, message);

        return imageUrl;
    }

    public boolean deleteFile(String imgUrl) {

        String saveFilePath = imgUrl.replaceAll(pdsUrl, "");

        String[] pathAndName = McpFile.getFilepathAndName(saveFilePath);

        return ftpHelper.delete(FtpHelper.PDS, pathAndName[0], pathAndName[1]);
    }

}
