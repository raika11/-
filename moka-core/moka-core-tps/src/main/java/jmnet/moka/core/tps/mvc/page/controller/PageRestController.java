package jmnet.moka.core.tps.mvc.page.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.common.utils.dto.ResultMapDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.dto.InvalidDataDTO;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.template.helper.TemplateParserHelper;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.helper.PurgeHelper;
import jmnet.moka.core.tps.mvc.component.service.ComponentService;
import jmnet.moka.core.tps.mvc.container.service.ContainerService;
import jmnet.moka.core.tps.mvc.page.dto.PageDTO;
import jmnet.moka.core.tps.mvc.page.dto.PageNode;
import jmnet.moka.core.tps.mvc.page.dto.PageSearchDTO;
import jmnet.moka.core.tps.mvc.page.dto.ParentPageDTO;
import jmnet.moka.core.tps.mvc.page.entity.Page;
import jmnet.moka.core.tps.mvc.page.service.PageService;
import jmnet.moka.core.tps.mvc.page.vo.PageVO;
import jmnet.moka.core.tps.mvc.template.service.TemplateService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * ????????? API
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/pages")
@Api(tags = {"????????? API"})
public class PageRestController extends AbstractCommonController {

    private final PageService pageService;

    final TemplateService templateService;

    final ComponentService componentService;

    final ContainerService containerService;

    @Value("${tps.page.servicename.excludes}")
    private String[] serviceNameExcludes;

    private final PurgeHelper purgeHelper;

    public PageRestController(PageService pageService, TemplateService templateService, ComponentService componentService,
            ContainerService containerService, PurgeHelper purgeHelper) {
        this.pageService = pageService;
        this.templateService = templateService;
        this.componentService = componentService;
        this.containerService = containerService;
        this.purgeHelper = purgeHelper;
    }

    /**
     * ????????? ????????????(?????????)
     *
     * @param search ????????????(?????????????????????, ???????????? ???????????? ?????????????????? ?????????.)
     * @return ????????? ?????? ??????(PageNode)
     */
    @ApiOperation(value = "?????????????????????(?????????)")
    @GetMapping("/tree")
    public ResponseEntity<?> getPageTree(@Valid @SearchParam PageSearchDTO search) {

        List<Long> findPageList = new ArrayList<>();
        PageNode pageNode = pageService.makeTree(search, findPageList);

        ResultMapDTO resultMapDTO = new ResultMapDTO(HttpStatus.OK);
        resultMapDTO.addBodyAttribute("tree", pageNode);
        resultMapDTO.addBodyAttribute("findPage", findPageList);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultMapDTO, HttpStatus.OK);
    }

    /**
     * ????????? ????????????
     *
     * @param pageSeq ?????????????????? (??????)
     * @return ???????????????
     * @throws NoDataException      ???????????????
     * @throws InvalidDataException ????????????????????????
     * @throws Exception            ????????????
     */
    @ApiOperation(value = "????????? ????????????")
    @GetMapping("/{pageSeq}")
    public ResponseEntity<?> getPage(
            @ApiParam("?????????SEQ(??????)") @PathVariable("pageSeq") @Min(value = 0, message = "{tps.page.error.min.pageSeq}") Long pageSeq)
            throws NoDataException, InvalidDataException, Exception {

        // ????????????????????????.
        validData(pageSeq, null, ActionType.SELECT);

        Page page = pageService
                .findPageBySeq(pageSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        PageDTO dto = modelMapper.map(page, PageDTO.class);
        if (page.getParent() != null) {
            ParentPageDTO parentDto = modelMapper.map(page.getParent(), ParentPageDTO.class);
            dto.setParent(parentDto);
        }
        ResultDTO<PageDTO> resultDto = new ResultDTO<PageDTO>(dto);
        tpsLogger.success(true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ??????????????? ????????? ??????
     *
     * @param pageSeq    ????????? ??????. 0?????? ???????????? ????????? ??????
     * @param pageDTO    ???????????????
     * @param actionType ????????????
     * @throws InvalidDataException ???????????????
     * @throws Exception            ????????????
     */
    private void validData(Long pageSeq, PageDTO pageDTO, ActionType actionType)
            throws InvalidDataException, Exception {

        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (pageDTO != null) {
            // url id??? json??? id??? ???????????? ??????
            if (pageSeq > 0 && !pageSeq.equals(pageDTO.getPageSeq())) {
                String message = msg("tps.common.error.no-data");
                invalidList.add(new InvalidDataDTO("matchId", message));
                tpsLogger.fail(actionType, message, true);
            }

            // command?????? ????????????
            if (Arrays
                    .asList(serviceNameExcludes)
                    .contains(pageDTO.getPageServiceName())) {
                String message = msg("tps.page.error.invalid.pageServiceName");
                invalidList.add(new InvalidDataDTO("pageServiceName", message));
                tpsLogger.fail(actionType, message, true);
            }

            // PageUrl ????????????
            List<Page> pageList = pageService.findPageByPageUrl(pageDTO.getPageUrl(), pageDTO
                    .getDomain()
                    .getDomainId());
            if (pageList.size() > 0) {
                for (Page page : pageList) {
                    if (!page
                            .getPageSeq()
                            .equals(pageDTO.getPageSeq())) {
                        String message = msg("tps.page.error.duplicate.pageServiceName");
                        invalidList.add(new InvalidDataDTO("pageServiceName", message));
                        tpsLogger.fail(actionType, message, true);
                    }
                }
            }

            // ????????????
            try {
                TemplateParserHelper.checkSyntax(pageDTO.getPageBody());
            } catch (TemplateParseException e) {
                String message = e.getMessage();
                String extra = Integer.toString(e.getLineNumber());
                invalidList.add(new InvalidDataDTO("pageBody", message, extra));
                tpsLogger.fail(actionType, message, true);
            } catch (Exception e) {
                String message = e.getMessage();
                invalidList.add(new InvalidDataDTO("pageBody", message));
                tpsLogger.fail(actionType, message, true);
            }

            if (invalidList.size() > 0) {
                String validMessage = msg("tps.common.error.invalidContent");
                throw new InvalidDataException(invalidList, validMessage);
            }
        }


    }

    /**
     * ????????? ??????
     *
     * @param pageDTO ????????? ???????????????
     * @return ????????? ???????????????
     * @throws InvalidDataException ????????? ????????? ??????
     * @throws Exception            ????????????
     */
    @ApiOperation(value = "????????? ??????")
    @PostMapping(headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> postPage(@ApiParam("???????????????") @RequestBody @Valid PageDTO pageDTO)
            throws InvalidDataException, Exception {

        if (McpString.isEmpty(pageDTO.getPageBody())) {
            pageDTO.setPageBody("");
        }

        // ????????????????????????.
        validData((long) 0, pageDTO, ActionType.INSERT);


        Page page = modelMapper.map(pageDTO, Page.class);

        try {
            // ??????
            Page returnValue = pageService.insertPage(page);

            // ????????????
            PageDTO dto = modelMapper.map(returnValue, PageDTO.class);
            if (returnValue.getParent() != null) {
                ParentPageDTO parentDto = modelMapper.map(returnValue.getParent(), ParentPageDTO.class);
                dto.setParent(parentDto);
            }

            // purge ??????!!  ????????????????????? ???????????? ?????????.
            purge(dto);

            String message = msg("tps.common.success.insert");
            ResultDTO<PageDTO> resultDto = new ResultDTO<PageDTO>(dto, message);
            tpsLogger.success(ActionType.INSERT, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO INSERT PAGE]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO INSERT PAGE]", e, true);
            throw new Exception(msg("tps.common.error.insert"), e);
        }

    }

    /**
     * ????????? ??????
     *
     * @param pageSeq ???????????????
     * @param pageDTO ????????? ???????????????
     * @return ????????? ???????????????
     * @throws InvalidDataException ????????? ???????????????
     * @throws NoDataException      ????????? ??????
     * @throws Exception            ????????????
     */
    @ApiOperation(value = "????????? ??????")
    @PutMapping(value = "/{pageSeq}", headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> putPage(
            @ApiParam("?????????SEQ(??????)") @PathVariable("pageSeq") @Min(value = 0, message = "{tps.page.error.min.pageSeq}") Long pageSeq,
            @ApiParam("???????????????") @RequestBody @Valid PageDTO pageDTO)
            throws InvalidDataException, NoDataException, Exception {

        // ????????????????????????.
        validData(pageSeq, pageDTO, ActionType.UPDATE);

        // ??????
        Page newPage = modelMapper.map(pageDTO, Page.class);
        pageService
                .findPageBySeq(pageSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.UPDATE, message, true);
                    return new NoDataException(message);
                });

        try {
            Page returnValue = pageService.updatePage(newPage);

            // ????????????
            PageDTO dto = modelMapper.map(returnValue, PageDTO.class);
            if (returnValue.getParent() != null) {
                ParentPageDTO parentDto = modelMapper.map(returnValue.getParent(), ParentPageDTO.class);
                dto.setParent(parentDto);
            }

            // purge ??????!!  ????????????????????? ???????????? ?????????.
            purge(dto);

            String message = msg("tps.common.success.update");
            ResultDTO<PageDTO> resultDto = new ResultDTO<PageDTO>(dto, message);
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE PAGE] seq: {} {}", pageSeq, e.getMessage());
            tpsLogger.error(ActionType.UPDATE, "[FAIL TO UPDATE PAGE]", e, true);
            throw new Exception(msg("tps.common.error.update"), e);
        }
    }

    /**
     * ????????? ??????
     *
     * @param pageSeq   ?????? ??? ??????????????? (??????)
     * @param principal ????????? ????????? ??????
     * @return ??????????????????
     * @throws InvalidDataException ????????????????????????
     * @throws NoDataException      ??????????????? ?????? ??????
     * @throws Exception            ????????????
     */
    @ApiOperation(value = "????????? ??????")
    @DeleteMapping("/{pageSeq}")
    public ResponseEntity<?> deletePage(
            @ApiParam("?????????SEQ(??????)") @PathVariable("pageSeq") @Min(value = 0, message = "{tps.page.error.min.pageSeq}") Long pageSeq,
            @ApiParam(hidden = true) Principal principal)
            throws InvalidDataException, NoDataException, Exception {

        // 1.1 ???????????????
        //validData(pageSeq, null, ActionType.DELETE);

        // 1.2. ????????? ???????????? ??????
        Page page = pageService
                .findPageBySeq(pageSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(ActionType.DELETE, message, true);
                    return new NoDataException(message);
                });

        try {
            PageDTO dto = modelMapper.map(page, PageDTO.class);

            // 2. ??????
            pageService.deletePage(page, principal.getName());

            // purge ??????!!  ????????????????????? ???????????? ?????????.
            purge(dto);

            // 3. ????????????
            String message = msg("tps.common.success.delete");
            ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(true, message);
            tpsLogger.success(ActionType.DELETE, true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE PAGE] seq: {} {}", pageSeq, e.getMessage());
            tpsLogger.error(ActionType.DELETE, "[FAIL TO DELETE PAGE]", e, true);
            throw new Exception(msg("tps.common.error.delete"), e);
        }
    }

    /**
     * ???????????? ?????????URL ???????????? ??????
     *
     * @param pageUrl  ????????? ????????? URL
     * @param domainId ??????????????????
     * @param pageSeq  ???????????? 0 ?????? ??? ??????, ?????? ???????????? ???????????? ???????????? URL??? ?????????.
     * @return URL????????????
     */
    @ApiOperation(value = "????????? ?????????URL ???????????? ??????")
    @GetMapping("/isPageUrl")
    public ResponseEntity<?> getIsPageUrl(@ApiParam("????????? URL(??????)") @RequestParam(name = "pageUrl")
    @Pattern(regexp = MokaConstants.PAGE_SERVICE_URL_PATTERN, message = "{tps.page.error.pattern.pageUrl}") String pageUrl,
            @ApiParam("?????????ID(??????)") @RequestParam(name = "domainId")
            @Pattern(regexp = "[0-9]{4}$", message = "{tps.domain.error.pattern.domainId}") String domainId,
            @ApiParam("????????? ????????????(??????)") @RequestParam(name = "pageSeq", defaultValue = "0")
            @Min(value = 0, message = "{tps.page.error.min.pageSeq}") Long pageSeq) {

        List<Page> pageList = pageService.findPageByPageUrl(pageUrl, domainId);

        Boolean ret = false;
        if (pageList.size() > 0) {
            for (Page page : pageList) {
                if (page
                        .getPageSeq()
                        .equals(pageSeq)) {
                    ret = true;
                }
            }
        }

        String message = "";
        if (ret) {
            msg("tps.page.error.duplicate.pageServiceName");
        }
        ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(ret, message);
        tpsLogger.success(ActionType.SELECT, true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ????????? ????????????(?????????)
     *
     * @param search ????????????
     * @return ????????? ??????(PageDTO)
     * @throws NoDataException ????????? ????????? ??????
     */
    @ApiOperation(value = "????????? ????????????(?????????)")
    @GetMapping
    public ResponseEntity<?> getPagList(@Valid @SearchParam PageSearchDTO search) {
        // ??????????????? ??????
        Pageable pageable = search.getPageable();

        // ??????
        org.springframework.data.domain.Page<Page> returnValue = pageService.findAllPage(search, pageable);

        // ????????? ??????
        ResultListDTO<PageDTO> resultListMessage = new ResultListDTO<PageDTO>();
        List<PageDTO> pageDtoList = modelMapper.map(returnValue.getContent(), PageDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(pageDtoList);

        ResultDTO<ResultListDTO<PageDTO>> resultDto = new ResultDTO<ResultListDTO<PageDTO>>(resultListMessage);
        tpsLogger.success(ActionType.SELECT, true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * tms????????? ?????????????????? ????????????. fileYn=Y??? pageUpdate, N?????? purge
     *
     * @param returnValDTO ???????????????
     * @return ?????????????????????
     * @throws DataLoadException
     * @throws TemplateMergeException
     * @throws TemplateParseException
     * @throws NoDataException
     */
    private String purge(PageDTO returnValDTO)
            throws DataLoadException, TemplateMergeException, TemplateParseException, NoDataException {

        String returnValue = "";

        // fileYn=Y??? pageUpdate, N?????? purge
        if (returnValDTO
                .getFileYn()
                .equals(MokaConstants.YES)) {
            PageVO vo = modelMapper.map(returnValDTO, PageVO.class);
            String retPage = purgeHelper.tmsPageUpdate(Collections.singletonList(vo));
            if (McpString.isNotEmpty(retPage)) {
                log.error("[FAIL TO PAGE UPATE] pageSeq: {} {}", returnValDTO.getPageSeq(), retPage);
                tpsLogger.error(ActionType.UPDATE, "[FAIL TO PAGE UPATE]", true);
                returnValue = String.join("\r\n", retPage);
            }
        } else {
            String retTemplate = purgeHelper.tmsPurge(Collections.singletonList(returnValDTO.toPageItem()));
            if (McpString.isNotEmpty(retTemplate)) {
                log.error("[FAIL TO PURGE PAGE] pageSeq: {} {}", returnValDTO.getPageSeq(), retTemplate);
                tpsLogger.error(ActionType.UPDATE, "[FAIL TO PURGE PAGE]", true);
                returnValue = String.join("\r\n", retTemplate);
            }
        }

        return returnValue;
    }

    /**
     * ????????? ??????
     *
     * @param pageSeq ????????? ???????????????
     * @return
     * @throws InvalidDataException ????????? ????????? ??????
     * @throws Exception            ????????????
     */
    @ApiOperation(value = "?????????????????? ?????????")
    @PostMapping("/{pageSeq}/viewcp")
    public ResponseEntity<?> postPage(
            @ApiParam("?????????SEQ(??????)") @PathVariable("pageSeq") @Min(value = 0, message = "{tps.page.error.min.pageSeq}") Long pageSeq)
            throws InvalidDataException, Exception {

        Page page = pageService
                .findPageBySeq(pageSeq)
                .orElseThrow(() -> {
                    String message = msg("tps.common.error.no-data");
                    tpsLogger.fail(message, true);
                    return new NoDataException(message);
                });

        try {
            // ??????
            pageService.updateViewComponent(page);

            // ????????????
            PageDTO dto = modelMapper.map(page, PageDTO.class);
            if (page.getParent() != null) {
                ParentPageDTO parentDto = modelMapper.map(page.getParent(), ParentPageDTO.class);
                dto.setParent(parentDto);
            }

            // purge ??????!!  ????????????????????? ???????????? ?????????.
            purge(dto);

            String message = msg("tps.page.success.view-component");
            ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(true, message);
            tpsLogger.success(ActionType.UPDATE, true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO UPDATE COMPONENT IN PAGE]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO UPDATE COMPONENT IN PAGE]", e, true);
            throw new Exception(msg("tps.page.error.view-component"), e);
        }

    }
    
}
