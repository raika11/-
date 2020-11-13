package jmnet.moka.core.tps.mvc.article.controller;

import io.swagger.annotations.ApiOperation;
import java.util.Arrays;
import java.util.List;
import javax.validation.Valid;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.article.dto.ArticleBasicDTO;
import jmnet.moka.core.tps.mvc.article.dto.ArticleSearchDTO;
import jmnet.moka.core.tps.mvc.article.dto.ArticleSourceDTO;
import jmnet.moka.core.tps.mvc.article.entity.ArticleBasic;
import jmnet.moka.core.tps.mvc.article.entity.ArticleSource;
import jmnet.moka.core.tps.mvc.article.service.ArticleService;
import jmnet.moka.core.tps.mvc.article.vo.ArticleBasicVO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Article Rest Controller
 *
 * @author jeon0525
 */
@RestController
@Validated
@RequestMapping("/api/articles")
public class ArticleRestController {

    @Autowired
    private ArticleService articleService;

    @Autowired
    private MessageByLocale messageByLocale;

    @Value("${tps.desking.article.source.list}")
    private String[] deskingSourceList;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private TpsLogger tpsLogger;

    /**
     * 기사목록조회
     *
     * @param search 검색조건
     * @return 기사목록
     */
    @ApiOperation(value = "기사 목록조회")
    @GetMapping
    public ResponseEntity<?> getArticleList(@Valid @SearchParam ArticleSearchDTO search) {

        //분류코드 검색설정
        if (search.getMasterCode() != null && McpString.isNotEmpty(search.getMasterCode())) {
            String masterCode = search.getMasterCode();

            if (masterCode.length() > 2 && masterCode.substring(2)
                                                     .equals("00000")) {
                // 대분류검색
                search.setMasterCode(masterCode.substring(0, 1));
            } else if (masterCode.length() > 4 && masterCode.substring(4)
                                                            .equals("000")) {
                // 중분류검색
                search.setMasterCode(masterCode.substring(0, 1));
            }
        }

        // 편집기사 기본매체조건 추가
        if (deskingSourceList.length > 0) {
            String paramSList = Arrays.stream(deskingSourceList)
                                      .reduce((a, b) -> a + "," + b)
                                      .get();
            search.setDeskingSourceList(paramSList);
        }

        // 조회(mybatis)
        List<ArticleBasicVO> returnValue = articleService.findAllArticleBasic(search);

        // 리턴값 설정
        ResultListDTO<ArticleBasicVO> resultListMessage = new ResultListDTO<>();
        resultListMessage.setTotalCnt(search.getTotal());
        resultListMessage.setList(returnValue);

        ResultDTO<ResultListDTO<ArticleBasicVO>> resultDto = new ResultDTO<>(resultListMessage);
        tpsLogger.success(ActionType.SELECT);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    @ApiOperation(value = "기사 상세조회")
    @GetMapping("/{totalId}")
    public ResponseEntity<?> getArticle(@PathVariable("totalId") Long totalId)
            throws NoDataException {

        ArticleBasic articleBasic = articleService.findArticleBasicById(totalId)
                                                  .orElseThrow(() -> {
                                                      String message = messageByLocale.get("tps.common.error.no-data");
                                                      tpsLogger.fail(message, true);
                                                      return new NoDataException(message);
                                                  });

        ArticleBasicDTO dto = modelMapper.map(articleBasic, ArticleBasicDTO.class);
        ResultDTO<ArticleBasicDTO> resultDto = new ResultDTO<>(dto);
        tpsLogger.success(ActionType.SELECT);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    @ApiOperation(value = "매체 목록조회")
    @GetMapping("/sources")
    public ResponseEntity<?> getSourceList() {

        // 조회
        List<ArticleSource> returnValue = articleService.findAllArticleSource(deskingSourceList);

        // 리턴값 설정
        ResultListDTO<ArticleSourceDTO> resultListMessage = new ResultListDTO<>();
        List<ArticleSourceDTO> dtoList = modelMapper.map(returnValue, ArticleSourceDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.size());
        resultListMessage.setList(dtoList);

        ResultDTO<ResultListDTO<ArticleSourceDTO>> resultDto = new ResultDTO<>(resultListMessage);
        tpsLogger.success(ActionType.SELECT);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }
}
