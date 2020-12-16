package jmnet.moka.core.tps.mvc.jpod.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Size;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.jpod.dto.JpodChannelDTO;
import jmnet.moka.core.tps.mvc.jpod.dto.JpodChannelSearchDTO;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodChannel;
import jmnet.moka.core.tps.mvc.jpod.service.JpodChannelService;
import lombok.extern.slf4j.Slf4j;
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
import org.springframework.web.bind.annotation.RestController;

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
@Api(tags = {"J팟 API"})
public class JpodChannelController extends AbstractCommonController {

    private final JpodChannelService jpodChannelService;


    public JpodChannelController(JpodChannelService jpodChannelService) {
        this.jpodChannelService = jpodChannelService;
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
     * @param request 요청
     * @param chnlSeq JpodChannel아이디 (필수)
     * @return JpodChannel정보
     * @throws NoDataException JpodChannel 정보가 없음
     */
    @ApiOperation(value = "JpodChannel 조회")
    @GetMapping("/{chnlSeq}")
    public ResponseEntity<?> getJpodChannel(HttpServletRequest request,
            @PathVariable("chnlSeq") @Size(min = 1, max = 30, message = "{tps.jpodChannel.error.pattern.chnlSeq}") Long chnlSeq)
            throws NoDataException {

        String message = msg("tps.common.error.no-data");
        JpodChannel jpodChannel = jpodChannelService
                .findJpodChannelBySeq(chnlSeq)
                .orElseThrow(() -> new NoDataException(message));

        JpodChannelDTO dto = modelMapper.map(jpodChannel, JpodChannelDTO.class);


        tpsLogger.success(ActionType.SELECT);

        ResultDTO<JpodChannelDTO> resultDto = new ResultDTO<>(dto);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }


    /**
     * 등록
     *
     * @param request        요청
     * @param jpodChannelDTO 등록할 JpodChannel정보
     * @return 등록된 JpodChannel정보
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "JpodChannel 등록")
    @PostMapping
    public ResponseEntity<?> postJpodChannel(HttpServletRequest request, @Valid JpodChannelDTO jpodChannelDTO)
            throws InvalidDataException, Exception {

        // JpodChannelDTO -> JpodChannel 변환
        JpodChannel jpodChannel = modelMapper.map(jpodChannelDTO, JpodChannel.class);


        try {

            // insert
            JpodChannel returnValue = jpodChannelService.insertJpodChannel(jpodChannel);


            // 결과리턴
            JpodChannelDTO dto = modelMapper.map(returnValue, JpodChannelDTO.class);
            ResultDTO<JpodChannelDTO> resultDto = new ResultDTO<>(dto);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.INSERT);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT MEMBER]", e);
            // 액션 로그에 오류 내용 출력
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.jpodChannel.error.save"), e);
        }
    }

    /**
     * 수정
     *
     * @param request        요청
     * @param chnlSeq        JpodChannel아이디
     * @param jpodChannelDTO 수정할 JpodChannel정보
     * @return 수정된 JpodChannel정보
     * @throws Exception 그외 모든 에러
     */
    @ApiOperation(value = "JpodChannel 수정")
    @PutMapping("/{chnlSeq}")
    public ResponseEntity<?> putJpodChannel(HttpServletRequest request,
            @PathVariable("chnlSeq") @Size(min = 1, max = 30, message = "{tps.jpodChannel.error.pattern.chnlSeq}") String chnlSeq,
            @Valid JpodChannelDTO jpodChannelDTO)
            throws Exception {

        // JpodChannelDTO -> JpodChannel 변환
        String infoMessage = msg("tps.common.error.no-data");
        JpodChannel newJpodChannel = modelMapper.map(jpodChannelDTO, JpodChannel.class);

        // 오리진 데이터 조회
        JpodChannel orgJpodChannel = jpodChannelService
                .findJpodChannelBySeq(newJpodChannel.getChnlSeq())
                .orElseThrow(() -> new NoDataException(infoMessage));



        try {
            // update
            JpodChannel returnValue = jpodChannelService.updateJpodChannel(newJpodChannel);



            // 결과리턴
            JpodChannelDTO dto = modelMapper.map(returnValue, JpodChannelDTO.class);
            ResultDTO<JpodChannelDTO> resultDto = new ResultDTO<>(dto);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.UPDATE);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE MEMBER]", e);
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(ActionType.UPDATE, e);
            throw new Exception(msg("tps.jpodChannel.error.update"), e);
        }
    }

    /**
     * 삭제
     *
     * @param request 요청
     * @param chnlSeq 삭제 할 JpodChannel아이디 (필수)
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException      삭제 할 JpodChannel 없음
     * @throws Exception            그 외 에러처리
     */
    @ApiOperation(value = "JpodChannel 삭제")
    @DeleteMapping("/{chnlSeq}")
    public ResponseEntity<?> deleteJpodChannel(HttpServletRequest request,
            @PathVariable("chnlSeq") @Size(min = 1, max = 30, message = "{tps.jpodChannel.error.pattern.chnlSeq}") Long chnlSeq)
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
            ResultDTO<Boolean> resultDto = new ResultDTO<>(true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE MEMBER] chnlSeq: {} {}", chnlSeq, e.getMessage());
            // 액션 로그에 실패 로그 출력
            tpsLogger.error(ActionType.DELETE, e.toString());
            throw new Exception(msg("tps.jpodChannel.error.delete"), e);
        }
    }
}
