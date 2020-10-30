package jmnet.moka.core.tps.mvc.merge;

import io.swagger.annotations.ApiOperation;
import java.security.Principal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.common.template.helper.TemplateParserHelper;
import jmnet.moka.core.tms.merge.MokaPreviewTemplateMerger;
import jmnet.moka.core.tms.merge.item.ComponentItem;
import jmnet.moka.core.tms.merge.item.DomainItem;
import jmnet.moka.core.tms.merge.item.PageItem;
import jmnet.moka.core.tps.common.dto.InvalidDataDTO;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.component.mapper.ComponentWorkMapper;
import jmnet.moka.core.tps.mvc.component.vo.DeskingComponentWorkVO;
import jmnet.moka.core.tps.mvc.domain.dto.DomainDTO;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import jmnet.moka.core.tps.mvc.domain.service.DomainService;
import jmnet.moka.core.tps.mvc.page.dto.PageDTO;
import jmnet.moka.core.tps.mvc.page.entity.Page;
import jmnet.moka.core.tps.mvc.page.service.PageService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.GenericApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Validated
@Slf4j
@RequestMapping("/api/merge")
public class MergeRestController {

    @Autowired
    private GenericApplicationContext appContext;

    @Autowired
    private DomainService domainService;

    @Autowired
    private PageService pageService;

    @Autowired
    private ComponentWorkMapper componentWorkMapper;

    @Autowired
    private MessageByLocale messageByLocale;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private TpsLogger tpsLogger;

    /**
     * tems 문법검사
     *
     * @param request 요청
     * @param content tems소스
     * @return 랜더링된 결과
     * @throws Exception 예외
     */
    @ApiOperation(value = "tems 문법검사")
    @PostMapping(value = "/syntax")
    public ResponseEntity<?> postSyntax(HttpServletRequest request, String content)
            throws Exception {
        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        try {
            TemplateParserHelper.checkSyntax(content);
        } catch (TemplateParseException e) {
            String message = e.getMessage();
            String extra = Integer.toString(e.getLineNumber());
            invalidList.add(new InvalidDataDTO("content", message, extra));
            tpsLogger.fail(ActionType.SELECT, message, true);
            String validMessage = messageByLocale.get("tps.merge.error.syntax", request);
            throw new InvalidDataException(invalidList, validMessage);
        } catch (Exception e) {
            String message = e.getMessage();
            invalidList.add(new InvalidDataDTO("content", message));
            tpsLogger.fail(ActionType.SELECT, message, true);
            String validMessage = messageByLocale.get("tps.merge.error.syntax", request);
            throw new InvalidDataException(invalidList, validMessage);
        }

        ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(true);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    // HTML 검사시 merge
    @ApiOperation(value = "HTML ")
    @PostMapping(value = "/previewPG", headers = {"content-type=application/json"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> postPreviewPG(HttpServletRequest request, @RequestBody @Valid PageDTO pageDto)
            throws Exception {
        ResultDTO<?> resultDto = null;
        // 도메인
        String message = messageByLocale.get("tps.domain.error.no-data", request);
        Domain domainInfo = domainService.findDomainById(pageDto.getDomain()
                                                                .getDomainId())
                                         .orElseThrow(() -> new NoDataException(message));

        DomainDTO domainDto = modelMapper.map(domainInfo, DomainDTO.class);

        DomainItem domainItem = domainDto.toDomainItem();

        try {
            // merger
            // MspPreviewTemplateMerger dtm =
            // appContext.getBean(MspPreviewTemplateMerger.class, domainItem);
            MokaPreviewTemplateMerger dtm = (MokaPreviewTemplateMerger) appContext.getBean("previewTemplateMerger", domainItem);

            PageItem pageItem = pageDto.toPageItem();
            DateTimeFormatter df = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
            pageItem.put(ItemConstants.ITEM_MODIFIED, LocalDateTime.now()
                                                                   .format(df));

            // 랜더링
            StringBuilder sb = dtm.merge(pageItem, null, true);

            String content = sb.toString();
            resultDto = new ResultDTO<String>(HttpStatus.OK, content);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Fail to Merge : %s", pageDto.getPageUrl(), e);
            throw new Exception(messageByLocale.get("tps.common.error.merge", request), e);
        }
    }

    // 컴포넌트 미리보기
    @GetMapping(value = "/previewCP")
    public ResponseEntity<?> getPreviewCP(HttpServletRequest request, Long pageSeq, Long componentWorkSeq, Principal principal, String resourceYn)
            throws Exception {
        ResultDTO<?> resultDto = null;

        DateTimeFormatter df = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

        try {
            // 페이지
            String messagePG = messageByLocale.get("tps.page.error.noContent", request);
            Page pageInfo = pageService.findPageBySeq(pageSeq)
                                       .orElseThrow(() -> new NoDataException(messagePG));
            PageDTO pageDto = modelMapper.map(pageInfo, PageDTO.class);
            PageItem pageItem = pageDto.toPageItem();
            pageItem.put(ItemConstants.ITEM_MODIFIED, LocalDateTime.now()
                                                                   .format(df));

            // 도메인
            String messageDM = messageByLocale.get("tps.domain.error.no-data", request);
            Domain domainInfo = domainService.findDomainById(pageDto.getDomain()
                                                                    .getDomainId())
                                             .orElseThrow(() -> new NoDataException(messageDM));
            DomainDTO domainDto = modelMapper.map(domainInfo, DomainDTO.class);
            DomainItem domainItem = domainDto.toDomainItem();

            // 컴포넌트 : work 컴포넌트정보를 모두 보내지는 않는다.
            String messageCP = messageByLocale.get("tps.common.error.no-data", request);
            DeskingComponentWorkVO componentVO = componentWorkMapper.findComponentsWorkBySeq(componentWorkSeq);
            if (componentVO == null) {
                throw new NoDataException(messageCP);
            }
            ComponentItem componentItem = componentVO.toComponentItem();
            componentItem.put(ItemConstants.ITEM_MODIFIED, LocalDateTime.now()
                                                                        .format(df));

            List<String> componentIdList = new ArrayList<String>(1);
            componentIdList.add(componentVO.getComponentSeq()
                                           .toString());
            MokaPreviewTemplateMerger dtm =
                    (MokaPreviewTemplateMerger) appContext.getBean("previewWorkTemplateMerger", domainItem, principal.getName(),
                                                                   componentVO.getEditionSeq(), componentIdList);

            // 랜더링
            StringBuilder sb = dtm.merge(pageItem, componentItem, false, resourceYn.equals("Y"), false, false);

            String content = sb.toString();
            resultDto = new ResultDTO<String>(HttpStatus.OK, content);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            throw new Exception(messageByLocale.get("tps.common.error.merge", request), e);
        }
    }
}
