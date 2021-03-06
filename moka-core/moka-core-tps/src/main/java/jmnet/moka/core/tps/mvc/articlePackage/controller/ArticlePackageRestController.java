package jmnet.moka.core.tps.mvc.articlePackage.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.Date;
import java.util.Set;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.Size;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.articlePackage.dto.ArticlePackageDTO;
import jmnet.moka.core.tps.mvc.articlePackage.dto.ArticlePackageSearchDTO;
import jmnet.moka.core.tps.mvc.articlePackage.dto.ArticlePackageSimpleDTO;
import jmnet.moka.core.tps.mvc.articlePackage.entity.ArticlePackage;
import jmnet.moka.core.tps.mvc.articlePackage.service.ArticlePackageService;
import jmnet.moka.core.tps.mvc.newsletter.entity.NewsletterInfo;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.Converter;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.articlePackage.controller
 * ClassName : ArticlePackageRestController
 * Created : 2021-05-03 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-05-03 ?????? 3:45
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/articlePackage")
@Api(tags = {"??????????????? API"})
public class ArticlePackageRestController extends AbstractCommonController {

    private final ArticlePackageService articlePackageService;

    public ArticlePackageRestController(ArticlePackageService articlePackageService) {
        this.articlePackageService = articlePackageService;
    }

    /**
     * ????????????????????? ??????
     *
     * @param search ????????????
     * @return ?????? ??????
     */
    @ApiOperation(value = "????????????????????? ??????")
    @GetMapping
    public ResponseEntity<?> getArticlePackageList(@Valid @SearchParam ArticlePackageSearchDTO search)
            throws Exception {
        Page<ArticlePackage> returnValue = articlePackageService.findAll(search);

        Converter<NewsletterInfo, String> newsletterYn = ctx -> ctx.getSource() == null ? "N" : "Y";
        modelMapper
                .typeMap(ArticlePackage.class, ArticlePackageSimpleDTO.class)
                .addMappings(mapping -> mapping
                        .using(newsletterYn)
                        .map(ArticlePackage::getNewsletterInfo, (destination, value) -> destination.setNewsletterYn(value != null ? "Y" : "N")));

        // ????????? ??????
        ResultListDTO<ArticlePackageSimpleDTO> resultListMessage = new ResultListDTO<>();
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(modelMapper.map(returnValue.getContent(), ArticlePackageSimpleDTO.TYPE));

        ResultDTO<ResultListDTO<ArticlePackageSimpleDTO>> resultDto = new ResultDTO<>(resultListMessage);
        tpsLogger.success(ActionType.SELECT);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    @ApiOperation(value = "??????????????? ????????????")
    @GetMapping(value = "/{pkgSeq}")
    public ResponseEntity<?> getArticlePackageByPkgSeq(@ApiParam(value = "??????????????? ????????????", required = true) @PathVariable("pkgSeq")
    @Min(value = 0, message = "{tps.common.error.min.seqNo}") Long pkgSeq)
            throws NoDataException {
        // ??????
        ArticlePackage articlePackage = articlePackageService
                .findByPkgSeq(pkgSeq)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        ArticlePackageDTO articlePackageDTO = modelMapper.map(articlePackage, ArticlePackageDTO.class);

        // ????????? ??????
        ResultDTO<ArticlePackageDTO> resultDto = new ResultDTO<>(articlePackageDTO);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ??????????????? ??????
     *
     * @param articlePackageDTO ???????????????
     * @return
     * @throws InvalidDataException
     * @throws Exception
     */
    @ApiOperation(value = "??????????????? ??????")
    @PostMapping
    public ResponseEntity<?> postArticlePackage(@RequestBody @Valid ArticlePackageDTO articlePackageDTO)
            throws InvalidDataException, Exception {
        if (articlePackageDTO.getPkgSeq() != null) {
            throw new MokaException(msg("tps.common.error.duplicated.key"));
        }

        try {

            ArticlePackage articlePackage = modelMapper.map(articlePackageDTO, ArticlePackage.class);

            // ??????
            ArticlePackage returnValue = articlePackageService.insertArticlePackage(articlePackage);

            // ????????????
            ArticlePackageDTO dto = modelMapper.map(returnValue, ArticlePackageDTO.class);
            ResultDTO<ArticlePackageDTO> resultDto = new ResultDTO<>(dto, msg("tps.common.success.insert"));

            tpsLogger.success(ActionType.INSERT);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO SAVE ARTICLE PACKAGE]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO SAVE ARTICLE PACKAGE]", e, true);
            throw new Exception(msg("tps.common.error.insert"), e);
        }
    }

    /**
     * ??????????????? ??????
     *
     * @param articlePackageDTO ?????? ?????????
     * @return ????????? ?????????
     * @throws InvalidDataException ????????? ????????? ??????
     * @throws Exception            ????????????
     */
    @ApiOperation(value = "??????????????? ??????")
    @PutMapping("/{pkgSeq}")
    public ResponseEntity<?> putArticlePackage(@ApiParam(value = "??????????????? ????????????", required = true) @PathVariable("pkgSeq") Long pkgSeq,
            @RequestBody @Valid ArticlePackageDTO articlePackageDTO)
            throws InvalidDataException, Exception {
        if (articlePackageDTO.getPkgSeq() == null) {
            throw new MokaException(msg("tps.common.error.no-data"));
        }

        ArticlePackage articlePackage = modelMapper.map(articlePackageDTO, ArticlePackage.class);

        // ??????
        ArticlePackage returnValue = articlePackageService.updateArticlePackage(articlePackage);

        // ????????????
        ArticlePackageDTO dto = modelMapper.map(returnValue, ArticlePackageDTO.class);
        ResultDTO<ArticlePackageDTO> resultDto = new ResultDTO<>(dto, msg("tps.common.success.update"));

        tpsLogger.success(ActionType.UPDATE);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ??????????????? ??????
     *
     * @return ????????? ?????????
     * @throws InvalidDataException ????????? ????????? ??????
     * @throws Exception            ????????????
     */
    @ApiOperation(value = "??????????????? ??????")
    @PutMapping("/{pkgSeq}/done")
    public ResponseEntity<?> putArticlePackage(@ApiParam(value = "??????????????? ????????????", required = true) @PathVariable("pkgSeq") Long pkgSeq)
            throws InvalidDataException, Exception {

        ArticlePackage articlePackage = articlePackageService
                .findByPkgSeq(pkgSeq)
                .orElseThrow(() -> new MokaException(msg("tps.common.error.no-data")));
        
        // ??????
        ArticlePackage returnValue = articlePackageService.updateArticlePackage(articlePackage
                .toBuilder()
                .endDt(new Date())
                .usedYn("E")
                .build());

        // ????????????
        ArticlePackageDTO dto = modelMapper.map(returnValue, ArticlePackageDTO.class);
        ResultDTO<ArticlePackageDTO> resultDto = new ResultDTO<>(dto, msg("tps.common.success.update"));

        tpsLogger.success(ActionType.UPDATE);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ??????????????? ????????? ?????? ??????
     *
     * @param pkgTitle ????????? ?????????
     * @return ?????? ??????
     */
    @ApiOperation(value = "????????? ????????? ?????? ??????")
    @GetMapping("/{pkgTitle}/exists")
    public ResponseEntity<?> duplicatePkgTitle(@ApiParam(value = "????????? ?????????", required = true) @PathVariable("pkgTitle")
    @Size(min = 1, max = 100, message = "{tps.issue.error.length.pkgTitle}") String pkgTitle) {

        boolean duplicated = articlePackageService
                .findByPkgTitle(pkgTitle)
                .isPresent();
        ResultDTO<Boolean> resultDTO = new ResultDTO<>(duplicated);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * ??????????????? ?????????????????? ??????
     *
     * @return ?????? ??????
     */
    @ApiOperation(value = "??????????????? ?????????????????? ??????")
    @GetMapping("/pkgTitle")
    public ResponseEntity<?> getPkgTitleList() {
        ResultDTO<Set<String>> resultDTO = new ResultDTO<>(articlePackageService.findAllPkgTitle());
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }
}
