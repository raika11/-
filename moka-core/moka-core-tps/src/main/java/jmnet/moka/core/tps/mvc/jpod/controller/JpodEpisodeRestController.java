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
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.ftp.FtpHelper;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.util.ArticleEscapeUtil;
import jmnet.moka.core.tps.common.util.ImageUtil;
import jmnet.moka.core.tps.mvc.jpod.dto.JpodEpisodeDTO;
import jmnet.moka.core.tps.mvc.jpod.dto.JpodEpisodeDetailDTO;
import jmnet.moka.core.tps.mvc.jpod.dto.JpodEpisodeSearchDTO;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodEpisode;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodEpisodeDetail;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodEpisodeRelArt;
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
@Api(tags = {"J??? ???????????? API"})
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
     * Jpod ????????????????????????
     *
     * @param search ????????????
     * @return Jpod ??????????????????
     */
    @ApiOperation(value = "Jpod ???????????? ?????? ??????")
    @GetMapping("/episodes")
    public ResponseEntity<?> getEpisodeList(@SearchParam JpodEpisodeSearchDTO search) {

        ResultListDTO<JpodEpisodeDTO> resultListMessage = new ResultListDTO<>();

        // ??????
        Page<JpodEpisode> returnValue = jpodEpisodeService.findAllJpodEpisode(search);

        // ????????? ??????
        List<JpodEpisodeDTO> channelDtoList = modelMapper.map(returnValue.getContent(), JpodEpisodeDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(channelDtoList);

        ResultDTO<ResultListDTO<JpodEpisodeDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * JpodEpisode?????? ??????
     *
     * @param request ??????
     * @param chnlSeq JpodEpisode????????? (??????)
     * @return JpodEpisode??????
     * @throws NoDataException JpodEpisode ????????? ??????
     */
    @ApiOperation(value = "JpodEpisode ??????")
    @GetMapping("/{chnlSeq}/episodes/{epsdSeq}")
    public ResponseEntity<?> getJpodEpisode(HttpServletRequest request,
            @ApiParam("?????? ????????????") @PathVariable("chnlSeq") @Min(value = 0, message = "{tps.jpod-channel.error.min.chnlSeq}") Long chnlSeq,
            @ApiParam("???????????? ????????????") @PathVariable("epsdSeq") @Min(value = 0, message = "{tps.jpod-channel.error.min.epsdSeq}") Long epsdSeq)
            throws NoDataException {

        String message = msg("tps.common.error.no-data");
        JpodEpisodeDetail jpodEpisode = jpodEpisodeService
                .findJpodEpisodeDetailById(epsdSeq)
                .orElseThrow(() -> new NoDataException(message));

        JpodEpisodeDetailDTO dto = modelMapper.map(jpodEpisode, JpodEpisodeDetailDTO.class);



        tpsLogger.success(ActionType.SELECT);

        ResultDTO<JpodEpisodeDetailDTO> resultDto = new ResultDTO<>(dto);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }


    /**
     * ??????
     *
     * @param chnlSeq        ??????
     * @param jpodEpisodeDTO ????????? JpodEpisode??????
     * @return ????????? JpodEpisode??????
     * @throws InvalidDataException ????????? ????????? ??????
     * @throws Exception            ????????????
     */
    @ApiOperation(value = "JpodEpisode ??????")
    @PostMapping("/{chnlSeq}/episodes")
    public ResponseEntity<?> postJpodEpisode(
            @ApiParam("?????? ????????????") @PathVariable("chnlSeq") @Min(value = 0, message = "{tps.jpod-channel.error.min.chnlSeq}") Long chnlSeq,
            @Valid JpodEpisodeDetailDTO jpodEpisodeDTO, @RequestParam(value = "shrImgFile", required = false) MultipartFile shrImgFile,
            @RequestParam(value = "katalkImgFile", required = false) MultipartFile katalkImgFile)
            throws InvalidDataException, Exception {

        // JpodEpisodeDTO -> JpodEpisode ??????
        JpodEpisodeDetail jpodEpisode = modelMapper.map(jpodEpisodeDTO, JpodEpisodeDetail.class);

        try {

            // insert
            jpodEpisode = uploadImage(jpodEpisode, shrImgFile, katalkImgFile);

            JpodEpisodeDetail returnValue = jpodEpisodeService.insertJpodEpisode(jpodEpisode);


            // ????????????
            JpodEpisodeDetailDTO dto = modelMapper.map(returnValue, JpodEpisodeDetailDTO.class);
            ResultDTO<JpodEpisodeDetailDTO> resultDto = new ResultDTO<>(dto, msg("tps.jpod-channel.success.save"));

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
     * @param request        ??????
     * @param chnlSeq        JpodEpisode?????????
     * @param jpodEpisodeDTO ????????? JpodEpisode??????
     * @return ????????? JpodEpisode??????
     * @throws Exception ?????? ?????? ??????
     */
    @ApiOperation(value = "JpodEpisode ??????")
    @PutMapping(("/{chnlSeq}/episodes/{epsdSeq}"))
    public ResponseEntity<?> putJpodEpisode(HttpServletRequest request,
            @ApiParam("?????? ????????????") @PathVariable("chnlSeq") @Min(value = 0, message = "{tps.jpod-channel.error.min.chnlSeq}") Long chnlSeq,
            @ApiParam("???????????? ????????????") @PathVariable("epsdSeq") @Min(value = 0, message = "{tps.jpod-channel.error.min.epsdSeq}") Long epsdSeq,
            @Valid JpodEpisodeDetailDTO jpodEpisodeDTO, @RequestParam(value = "shrImgFile", required = false) MultipartFile shrImgFile,
            @RequestParam(value = "katalkImgFile", required = false) MultipartFile katalkImgFile)
            throws Exception {

        // JpodEpisodeDTO -> JpodEpisode ??????
        String infoMessage = msg("tps.common.error.no-data");
        JpodEpisodeDetail newJpodEpisode = modelMapper.map(jpodEpisodeDTO, JpodEpisodeDetail.class);

        // ????????? ????????? ??????
        JpodEpisode orgJpodEpisode = jpodEpisodeService
                .findJpodEpisodeById(epsdSeq)
                .orElseThrow(() -> new NoDataException(infoMessage));

        try {
            // update
            newJpodEpisode = uploadImage(newJpodEpisode, shrImgFile, katalkImgFile);
            JpodEpisodeDetail returnValue = jpodEpisodeService.updateJpodEpisode(newJpodEpisode);

            // ????????????
            JpodEpisodeDetailDTO dto = modelMapper.map(returnValue, JpodEpisodeDetailDTO.class);
            ResultDTO<JpodEpisodeDetailDTO> resultDto = new ResultDTO<>(dto, msg("tps.jpod-channel.success.save"));

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
     * @param request ??????
     * @param chnlSeq ?????? ??? JpodEpisode????????? (??????)
     * @param usedYn  ?????? ??????
     * @return ??????????????????
     * @throws InvalidDataException ????????????????????????
     * @throws NoDataException      ?????? ??? JpodEpisode ??????
     * @throws Exception            ??? ??? ????????????
     */
    @ApiOperation(value = "JpodEpisode ???????????? ??????")
    @PutMapping("/{chnlSeq}/episodes/{epsdSeq}/used")
    public ResponseEntity<?> putJpodEpisodeUsedYn(HttpServletRequest request,
            @ApiParam("?????? ????????????") @PathVariable("chnlSeq") @Min(value = 0, message = "{tps.jpod-channel.error.min.chnlSeq}") Long chnlSeq,
            @ApiParam("???????????? ????????????") @PathVariable("epsdSeq") @Min(value = 0, message = "{tps.jpod-channel.error.min.epsdSeq}") Long epsdSeq,
            @ApiParam("????????????") @Pattern(regexp = "[Y|N]{1}$", message = "{tps.common.error.pattern.usedYn}")
            @RequestParam(value = "usedYn", defaultValue = MokaConstants.YES) String usedYn)
            throws InvalidDataException, NoDataException, Exception {


        // JpodEpisode ????????? ??????
        String noContentMessage = msg("tps.common.error.no-data");
        JpodEpisode jpodEpisode = jpodEpisodeService
                .findJpodEpisodeById(chnlSeq)
                .orElseThrow(() -> new NoDataException(noContentMessage));



        try {
            // usedYn ??????
            jpodEpisode.setUsedYn(usedYn);
            jpodEpisodeService.updateJpodEpisodeUseYn(epsdSeq, usedYn);

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
     * @param request ??????
     * @param chnlSeq ?????? ??? JpodEpisode????????? (??????)
     * @return ??????????????????
     * @throws InvalidDataException ????????????????????????
     * @throws NoDataException      ?????? ??? JpodEpisode ??????
     * @throws Exception            ??? ??? ????????????
     */
    @ApiOperation(value = "JpodEpisode ??????")
    @DeleteMapping("/{chnlSeq}/episodes/{epsdSeq}")
    public ResponseEntity<?> deleteJpodEpisode(HttpServletRequest request,
            @ApiParam("???????????? ????????????") @PathVariable("chnlSeq") @Min(value = 0, message = "{tps.jpod-channel.error.min.chnlSeq}") Long chnlSeq,
            @ApiParam("???????????? ????????????") @PathVariable("epsdSeq") @Min(value = 0, message = "{tps.jpod-channel.error.min.epsdSeq}") Long epsdSeq)
            throws InvalidDataException, NoDataException, Exception {


        // JpodEpisode ????????? ??????
        String noContentMessage = msg("tps.common.error.no-data");
        JpodEpisode jpodEpisode = jpodEpisodeService
                .findJpodEpisodeById(epsdSeq)
                .orElseThrow(() -> new NoDataException(noContentMessage));

        try {
            // ??????
            jpodEpisodeService.deleteJpodEpisode(jpodEpisode);

            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.success(ActionType.DELETE);

            // ????????????
            ResultDTO<Boolean> resultDto = new ResultDTO<>(true, msg("tps.jpod-episode.success.delete"));
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE JPOD_CHANNEL] chnlSeq: {} {}", chnlSeq, e.getMessage());
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(ActionType.DELETE, e.toString());
            throw new Exception(msg("tps.jpod-channel.error.delete"), e);
        }
    }


    /**
     * ???????????? ????????? ?????????
     *
     * @param jpodEpisode   jpod ???????????? ??????
     * @param shrImgFile    ?????? ????????? ??????
     * @param katalkImgFile ????????? ????????? ??????
     * @return JpodEpisode
     * @throws InvalidDataException ????????? ?????? ??????
     * @throws IOException          ?????? ?????? ??????
     */
    public JpodEpisodeDetail uploadImage(JpodEpisodeDetail jpodEpisode, MultipartFile shrImgFile, MultipartFile katalkImgFile)
            throws InvalidDataException, IOException {

        // ?????? ????????? ?????????
        if (shrImgFile != null) {
            if (McpString.isNotEmpty(jpodEpisode.getShrImg())) {
                deleteFile(jpodEpisode.getShrImg());
            }
            jpodEpisode.setShrImg(uploadImage(shrImgFile));
        }

        // ????????? ????????? ?????????
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

        // ?????? ????????? ?????? ?????? ??????
        tpsLogger.success(ActionType.UPLOAD);

        return imageUrl;
    }

    public boolean deleteFile(String imgUrl)
            throws InvalidDataException, IOException {

        String saveFilePath = imgUrl.replaceAll(pdsUrl, "");

        String[] pathAndName = McpFile.getFilepathAndName(saveFilePath);

        return ftpHelper.delete(FtpHelper.PDS, pathAndName[0], pathAndName[1]);
    }

    private void articleEscapeHtml(JpodEpisodeDetail jpodEpisode) {
        if (jpodEpisode.getArticles() != null && jpodEpisode
                .getArticles()
                .size() > 0) {
            for (JpodEpisodeRelArt art : jpodEpisode.getArticles()) {
                if (McpString.isNotEmpty(art.getRelTitle())) {
                    art.setRelTitle(ArticleEscapeUtil.htmlEscape(art.getRelTitle()));
                }
            }
        }
    }

}
