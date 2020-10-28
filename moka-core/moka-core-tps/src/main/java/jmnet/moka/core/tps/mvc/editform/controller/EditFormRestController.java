package jmnet.moka.core.tps.mvc.editform.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.annotations.ApiOperation;
import java.io.IOException;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.helper.EditFormHelper;
import jmnet.moka.core.tps.mvc.editform.dto.EditFormDTO;
import jmnet.moka.core.tps.mvc.editform.dto.PartDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

    private final static String DEFAULT_SITE = "joongang";

    public EditFormRestController(TpsLogger tpsLogger, EditFormHelper editFormHelper, ObjectMapper objectMapper) {
        this.tpsLogger = tpsLogger;
        this.editFormHelper = editFormHelper;
        this.objectMapper = objectMapper;
    }

    @ApiOperation(value = "Dynamic Form 데이터 조회")
    @GetMapping("/{channelId}")
    public ResponseEntity<?> getEditForm(@PathVariable("channelId") String channelId, @RequestParam(value = "partId", required = false) String partId)
            throws MokaException {

        return getResponseEditFormDTO(DEFAULT_SITE, channelId, partId);
    }

    @ApiOperation(value = "Dynamic Form 저장")
    @PostMapping("/{channelId}/parts/{partId}")
    public ResponseEntity<?> postEditFormPart(@PathVariable("channelId") String channelId, @PathVariable("partId") String partId,
            @RequestParam("partJson") String partJson)
            throws MokaException {

        try {
            // objectMapper로 json 파싱이 정상적으로 이루어지는지 체크
            objectMapper.readValue(partJson, PartDTO.class);

            return new ResponseEntity<>(partJson, HttpStatus.OK);

        } catch (IOException ex) {
            throw new MokaException(ex);
        }
    }

    @ApiOperation(value = "Dynamic Form 데이터 조회")
    @GetMapping("/dynamic-form/{site}/{channelId}")
    public ResponseEntity<?> getEditForm(@PathVariable("site") String site, @PathVariable("channelId") String channelId,
            @RequestParam(value = "partId", required = false) String partId)
            throws MokaException {

        return getResponseEditFormDTO(site, channelId, partId);
    }

    private ResponseEntity<?> getResponseEditFormDTO(String site, String channelId, @RequestParam(value = "partId", required = false) String partId)
            throws MokaException {
        ResultDTO<?> resultDTO;

        if (McpString.isNotEmpty(partId)) {
            PartDTO partDTO = editFormHelper.getPart(site, channelId, partId);
            resultDTO = new ResultDTO<>(partDTO);
        } else {
            EditFormDTO editFormDTO = editFormHelper.getChannelFormat(site, channelId);
            resultDTO = new ResultDTO<>(editFormDTO);
        }

        tpsLogger.success(ActionType.SELECT);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

}
