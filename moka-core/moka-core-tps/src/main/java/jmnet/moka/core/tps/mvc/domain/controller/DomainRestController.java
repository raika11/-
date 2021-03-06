package jmnet.moka.core.tps.mvc.domain.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.common.utils.dto.ResultMapDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.helper.ApiCodeHelper;
import jmnet.moka.core.tps.helper.PurgeHelper;
import jmnet.moka.core.tps.mvc.codemgt.entity.CodeMgt;
import jmnet.moka.core.tps.mvc.codemgt.service.CodeMgtService;
import jmnet.moka.core.tps.mvc.domain.dto.DomainDTO;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import jmnet.moka.core.tps.mvc.domain.service.DomainService;
import jmnet.moka.core.tps.mvc.relation.service.RelationService;
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
 * ?????????
 * 2020. 1. 8. ssc ????????????
 * RequestMapping ?????? ??????
 * RESTful ????????? ???????????? ???????????? ?????? ?????? ????????? ????????? ?????? '-' ??????
 * ????????? ?????? ??????
 * ?????? ?????? : get{Target}List, HttpMethod = GET
 * ?????? : get{Target}, HttpMethod = GET
 * ??????  : post{Target}, HttpMethod = POST
 * ??????  : put{Target}, HttpMethod = PUT
 * ??????  : delete{Target}, HttpMethod = DELETE
 * </pre>
 *
 * @author ssc
 * @since 2020. 1. 8. ?????? 2:09:06
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/domains")
@Api(tags = {"????????? API"})
public class DomainRestController extends AbstractCommonController {

    private final DomainService domainService;

    private final CodeMgtService codeMgtService;

    private final RelationService relationService;

    private final ApiCodeHelper apiCodeHelper;

    private final PurgeHelper purgeHelper;

    public DomainRestController(DomainService domainService, CodeMgtService codeMgtService, RelationService relationService,
            ApiCodeHelper apiCodeHelper, PurgeHelper purgeHelper) {
        this.domainService = domainService;
        this.codeMgtService = codeMgtService;
        this.relationService = relationService;
        this.apiCodeHelper = apiCodeHelper;
        this.purgeHelper = purgeHelper;
    }

    /**
     * ?????????????????????
     *
     * @param search ????????????
     * @return ???????????????
     */
    @ApiOperation(value = "????????? ?????? ??????")
    @GetMapping
    public ResponseEntity<?> getDomainList(@SearchParam SearchDTO search) {

        // ??????
        Page<Domain> returnValue = domainService.findAllDomain(search);

        // ????????? ??????
        ResultListDTO<DomainDTO> resultListMessage = new ResultListDTO<>();
        List<DomainDTO> domainDtoList = modelMapper.map(returnValue.getContent(), DomainDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(domainDtoList);

        ResultDTO<ResultListDTO<DomainDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ??????????????? ??????
     *
     * @param domainId ?????????????????? (??????)
     * @return ???????????????
     * @throws NoDataException ????????? ????????? ??????
     */
    @ApiOperation(value = "????????? ??????")
    @GetMapping("/{domainId}")
    public ResponseEntity<?> getDomain(@ApiParam("????????? ID(??????)") @PathVariable("domainId")
    @Pattern(regexp = "[0-9]{4}$", message = "{tps.domain.error.pattern.domainId}") String domainId)
            throws NoDataException {

        String message = msg("tps.domain.error.no-data");
        Domain domain = domainService
                .findDomainById(domainId)
                .orElseThrow(() -> new NoDataException(message));

        DomainDTO dto = modelMapper.map(domain, DomainDTO.class);

        // apiHost, apiPath -> apiCodeId
        List<CodeMgt> codeMgts = codeMgtService.findUseList(TpsConstants.DATAAPI);
        String apiCodeId = apiCodeHelper.getDataApiCode(codeMgts, dto.getApiHost(), dto.getApiPath());
        if (apiCodeId != null) {
            dto.setApiCodeId(apiCodeId);
        }

        tpsLogger.success(ActionType.SELECT, true);

        ResultDTO<DomainDTO> resultDto = new ResultDTO<>(dto);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ????????? ?????? ????????? ??????
     *
     * @param domainId ??????????????????
     * @return ?????? ??????
     */
    @ApiOperation(value = "?????? ????????? ?????? ??????")
    @GetMapping("/{domainId}/exists")
    public ResponseEntity<?> duplicateCheckId(@ApiParam("????????? ID(??????)") @PathVariable("domainId")
    @Pattern(regexp = "[0-9]{4}$", message = "{tps.domain.error.pattern.domainId}") String domainId) {

        boolean duplicated = domainService.isDuplicatedId(domainId);
        ResultDTO<Boolean> resultDTO = new ResultDTO<>(duplicated);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * ??????
     *
     * @param request   ??????
     * @param domainDTO ????????? ???????????????
     * @return ????????? ???????????????
     * @throws InvalidDataException ????????? ????????? ??????
     * @throws Exception            ????????????
     */
    @ApiOperation(value = "????????? ??????")
    @PostMapping
    public ResponseEntity<?> postDomain(@ApiParam(hidden = true) HttpServletRequest request, @Valid DomainDTO domainDTO)
            throws InvalidDataException, Exception {

        // DomainDTO -> Domain ??????
        Domain domain = modelMapper.map(domainDTO, Domain.class);

        setHostAndPath(domain, domainDTO);

        try {
            // insert
            Domain returnValue = domainService.insertDomain(domain);
            purgeHelper.purgeTmsDomain(request);

            // ????????????
            DomainDTO dto = modelMapper.map(returnValue, DomainDTO.class);
            ResultDTO<DomainDTO> resultDto = new ResultDTO<>(dto);

            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.success(ActionType.INSERT);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT DOMAIN]", e);
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.domain.error.save", request), e);
        }
    }

    /**
     * ??????
     *
     * @param request   ??????
     * @param domainId  ??????????????????
     * @param domainDTO ????????? ???????????????
     * @return ????????? ???????????????
     * @throws Exception ?????? ?????? ??????
     */
    @ApiOperation(value = "????????? ??????")
    @PutMapping("/{domainId}")
    public ResponseEntity<?> putDomain(@ApiParam(hidden = true) HttpServletRequest request, @ApiParam("????????? ID(??????)") @PathVariable("domainId")
    @Pattern(regexp = "[0-9]{4}$", message = "{tps.domain.error.pattern.domainId}") String domainId, @Valid DomainDTO domainDTO)
            throws Exception {

        // DomainDTO -> Domain ??????
        String infoMessage = msg("tps.domain.error.no-data", request);
        Domain newDomain = modelMapper.map(domainDTO, Domain.class);

        // ????????? ????????? ??????
        domainService
                .findDomainById(newDomain.getDomainId())
                .orElseThrow(() -> new NoDataException(infoMessage));

        setHostAndPath(newDomain, domainDTO);

        try {
            // update
            Domain returnValue = domainService.updateDomain(newDomain);
            purgeHelper.purgeTmsDomain(request);

            // ????????????
            DomainDTO dto = modelMapper.map(returnValue, DomainDTO.class);
            ResultDTO<DomainDTO> resultDto = new ResultDTO<>(dto, msg("tps.common.success.update"));

            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.success(ActionType.UPDATE);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE DOMAIN]", e);
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(ActionType.UPDATE, e);
            throw new Exception(msg("tps.domain.error.save", request), e);
        }
    }

    /**
     * ?????????????????? ????????? ????????????
     *
     * @param request  HTTP??????
     * @param domainId ?????????ID
     * @return ??????????????? ?????? ??????
     * @throws NoDataException ??????????????? ????????????
     */
    @ApiOperation(value = "???????????? ??????????????? ?????? ?????? ??????")
    @GetMapping("/{domainId}/has-relations")
    public ResponseEntity<?> hasRelations(@ApiParam(hidden = true) HttpServletRequest request, @ApiParam("????????? ID(??????)") @PathVariable("domainId")
    @Pattern(regexp = "[0-9]{4}$", message = "{tps.domain.error.pattern.domainId}") String domainId)
            throws NoDataException {

        String message = msg("tps.domain.error.no-data", request);
        domainService
                .findDomainById(domainId)
                .orElseThrow(() -> new NoDataException(message));

        // ?????? ????????? ??????
        String related = relationService.isRelatedDomain(domainId);

        String msg = "";
        if (MokaConstants.ITEM_TEMPLATE.equals(related)) {
            msg = msg("tps.domain.error.delete.exist-related.tp");
        }
        if (MokaConstants.ITEM_COMPONENT.equals(related)) {
            msg = msg("tps.domain.error.delete.exist-related.cp");
        }
        if (MokaConstants.ITEM_CONTAINER.equals(related)) {
            msg = msg("tps.domain.error.delete.exist-related.ct");
        }
        if (MokaConstants.ITEM_PAGE.equals(related)) {
            msg = msg("tps.domain.error.delete.exist-related.pg");
        }
        if (MokaConstants.ITEM_ARTICLE_PAGE.equals(related)) {
            msg = msg("tps.domain.error.delete.exist-related.ap");
        }
        if (MokaConstants.ITEM_AD.equals(related)) {
            msg = msg("tps.domain.error.delete.exist-related.ad");
        }
        if (MokaConstants.ITEM_RESERVED.equals(related)) {
            msg = msg("tps.domain.error.delete.exist-related.rs");
        }

        ResultMapDTO resultMapDTO = new ResultMapDTO(HttpStatus.OK, message);
        resultMapDTO.addBodyAttribute("related", McpString.isNotEmpty(related));
        resultMapDTO.addBodyAttribute("message", msg);
        return new ResponseEntity<>(resultMapDTO, HttpStatus.OK);
    }

    /**
     * ??????
     *
     * @param request  ??????
     * @param domainId ?????? ??? ?????????????????? (??????)
     * @return ??????????????????
     * @throws InvalidDataException ????????????????????????
     * @throws NoDataException      ?????? ??? ????????? ??????
     * @throws Exception            ??? ??? ????????????
     */
    @ApiOperation(value = "????????? ??????")
    @DeleteMapping("/{domainId}")
    public ResponseEntity<?> deleteDomain(@ApiParam(hidden = true) HttpServletRequest request, @ApiParam("????????? ID(??????)") @PathVariable("domainId")
    @Pattern(regexp = "[0-9]{4}$", message = "{tps.domain.error.pattern.domainId}") String domainId)
            throws InvalidDataException, NoDataException, Exception {


        // ????????? ????????? ??????
        String noContentMessage = msg("tps.domain.error.no-data", request);
        Domain domain = domainService
                .findDomainById(domainId)
                .orElseThrow(() -> new NoDataException(noContentMessage));

        // ?????? ????????? ??????
        try {
            String related = relationService.isRelatedDomain(domainId);
            if (McpString.isNotEmpty(related)) {
                // ?????? ????????? ?????? ?????? ??????
                tpsLogger.fail(ActionType.DELETE, msg("tps.domain.error.delete.exist-related", request));
                throw new Exception(msg("tps.domain.error.delete.exist-related", request));
            }
        } catch (Exception ex) {
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.fail(ActionType.DELETE, ex.toString());
            throw new Exception(msg("tps.domain.error.select.related", request));
        }

        try {
            // ??????
            domainService.deleteDomain(domain);
            purgeHelper.purgeTmsDomain(request);

            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.success(ActionType.DELETE);

            // ????????????
            ResultDTO<Boolean> resultDto = new ResultDTO<>(true, msg("tps.common.success.delete"));
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE DOMAIN] domainId: {} {}", domainId, e.getMessage());
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(ActionType.DELETE, e.toString());
            throw new Exception(msg("tps.domain.error.delete", request), e);
        }
    }



    private void setHostAndPath(Domain domain, DomainDTO domainDTO)
            throws InvalidDataException {
        if (!McpString.isNullOrEmpty(domainDTO.getApiCodeId())) {
            // apiCodeId -> apiHost, apiPath
            Map<String, String> apiInfo = apiCodeHelper.getDataApi(codeMgtService.findUseList(TpsConstants.DATAAPI), domainDTO.getApiCodeId());

            domain.setApiHost(apiInfo.get(TpsConstants.API_HOST));
            domain.setApiPath(apiInfo.get(TpsConstants.API_PATH));
        }
    }


    //    /**
    //     * ????????? ?????? ??? TMS??? ???????????? ?????????????????? ????????????
    //     */
    //    private void loadCommandDomain() {
    ////        Map<String, Object> paramMap = new HashMap<String, Object>();
    ////        String targetUrl = String.join("/", tmsHost, TpsConstants.COMMAND_DOMAIN);
    ////        paramMap.put("load", "Y");
    ////        
    ////        try {
    ////            HttpProxy httpProxy = (HttpProxy) applicationContext.getBean(HttpProxyConfiguration.HTTP_PROXY);
    ////            String response = httpProxy.getString(targetUrl, paramMap, false);
    ////            
    ////            ResultDTO<?> resultDTO = ResourceMapper.getDefaultObjectMapper().readValue(response,
    ////                    new TypeReference<ResultDTO<?>>() {});
    ////            ResultHeaderDTO resultHeader = resultDTO.getHeader();
    ////            
    ////            if (!resultHeader.isSuccess()) {
    ////                logger.error("[FAIL TO LOAD TMS API] {}, {}", targetUrl, resultHeader.getMessage());
    ////            }
    ////            
    ////        } catch (Exception e) {
    ////            logger.error("[FAIL TO LOAD TMS API] {}", targetUrl, e);
    ////        }
    //        
    //    }
}
