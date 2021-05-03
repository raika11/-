package jmnet.moka.core.tps.mvc.articlePackage.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import javax.validation.Valid;
import javax.validation.constraints.Min;
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
import lombok.extern.slf4j.Slf4j;
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
 * @since 2021-05-03 오후 3:45
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/articlePackage")
@Api(tags = {"기사패키지 API"})
public class ArticlePackageRestController extends AbstractCommonController {

    private final ArticlePackageService articlePackageService;

    public ArticlePackageRestController(ArticlePackageService articlePackageService) {
        this.articlePackageService = articlePackageService;
    }

    /**
     * 기사패키지목록 조회
     *
     * @param search 조회조건
     * @return 검색 결과
     */
    @ApiOperation(value = "기사패키지목록 조회")
    @GetMapping
    public ResponseEntity<?> getArticlePackageList(@Valid @SearchParam ArticlePackageSearchDTO search)
            throws Exception {
        Page<ArticlePackage> returnValue = articlePackageService.findAll(search);

        //        Converter<Set, Long> getSubscribeCount = ctx -> ctx.getSource() == null
        //                ? null
        //                : (long) ctx
        //                        .getSource()
        //                        .size();
        //        Converter<Set<NewsletterSend>, Date> getLastSendDt = ctx -> ctx.getSource() == null || ctx
        //                .getSource()
        //                .size() == 0
        //                ? null
        //                : ctx
        //                        .getSource()
        //                        .stream()
        //                        .map(NewsletterSend::getSendDt)
        //                        .max(Date::compareTo)
        //                        .get();

        //        ModelMapper countModelMapper = new ModelMapper();
        //        countModelMapper
        //        modelMapper.typeMap(NewsletterInfo.class, NewsletterProductDTO.class)
        //                   //                .addMappings(mapper -> mapper
        //                   //                        .using(getSubscribeCount)
        //                   //                        .map(NewsletterInfo::getNewsletterSubscribes, NewsletterProductDTO::setSubscribeCount))
        //                   .addMappings(mapping -> mapping
        //                           .using(getLastSendDt)
        //                           .map(NewsletterInfo::getNewsletterSends, NewsletterProductDTO::setLastSendDt));

        // 리턴값 설정
        ResultListDTO<ArticlePackageSimpleDTO> resultListMessage = new ResultListDTO<>();
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(modelMapper.map(returnValue.getContent(), ArticlePackageSimpleDTO.TYPE));

        ResultDTO<ResultListDTO<ArticlePackageSimpleDTO>> resultDto = new ResultDTO<>(resultListMessage);
        tpsLogger.success(ActionType.SELECT);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    @ApiOperation(value = "기사패키지 상세조회")
    @GetMapping(value = "/{pkgSeq}")
    public ResponseEntity<?> getArticlePackageByPkgSeq(@ApiParam(value = "기사패키지 일련번호", required = true) @PathVariable("pkgSeq")
    @Min(value = 0, message = "{tps.common.error.min.seqNo}") Long pkgSeq)
            throws NoDataException {
        // 조회
        ArticlePackage articlePackage = articlePackageService
                .findByPkgSeq(pkgSeq)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        ArticlePackageDTO articlePackageDTO = modelMapper.map(articlePackage, ArticlePackageDTO.class);

        // 리턴값 설정
        ResultDTO<ArticlePackageDTO> resultDto = new ResultDTO<>(articlePackageDTO);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 기사패키지 등록
     *
     * @param articlePackageDTO 기사패키지
     * @return
     * @throws InvalidDataException
     * @throws Exception
     */
    @ApiOperation(value = "기사패키지 등록")
    @PostMapping
    public ResponseEntity<?> postArticlePackage(@RequestBody @Valid ArticlePackageDTO articlePackageDTO)
            throws InvalidDataException, Exception {
        if (articlePackageDTO.getPkgSeq() != null) {
            throw new MokaException(msg("tps.common.error.duplicated.key"));
        }

        try {

            ArticlePackage articlePackage = modelMapper.map(articlePackageDTO, ArticlePackage.class);

            // 등록
            ArticlePackage returnValue = articlePackageService.insertArticlePackage(articlePackage);

            // 결과리턴
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
     * 기사패키지 수정
     *
     * @param articlePackageDTO 기사 패키지
     * @return 수정된 패키지
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "기사패키지 수정")
    @PutMapping("/{pkgSeq}")
    public ResponseEntity<?> putArticlePackage(@ApiParam(value = "기사패키지 일련번호", required = true) @PathVariable("pkgSeq") Long pkgSeq,
            @RequestBody @Valid ArticlePackageDTO articlePackageDTO)
            throws InvalidDataException, Exception {
        if (articlePackageDTO.getPkgSeq() == null) {
            throw new MokaException(msg("tps.common.error.no-data"));
        }

        ArticlePackage articlePackage = modelMapper.map(articlePackageDTO, ArticlePackage.class);

        // 수정
        ArticlePackage returnValue = articlePackageService.updateArticlePackage(articlePackage);

        // 결과리턴
        ArticlePackageDTO dto = modelMapper.map(returnValue, ArticlePackageDTO.class);
        ResultDTO<ArticlePackageDTO> resultDto = new ResultDTO<>(dto, msg("tps.common.success.update"));

        tpsLogger.success(ActionType.UPDATE);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }
}
