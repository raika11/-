package jmnet.moka.core.tps.mvc.article.controller;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.article.dto.ArticleSearchDTO;
import jmnet.moka.core.tps.mvc.article.service.ArticleService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
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
@RequestMapping("/api/contents/articles")
public class ArticleRestController {

    @Autowired
    private ArticleService articleService;

    @Autowired
    private MessageByLocale messageByLocale;

    @Autowired
    private ModelMapper modelMapper;

    @GetMapping
    public ResponseEntity<?> getArticleList(HttpServletRequest request, @Valid @SearchParam ArticleSearchDTO search) {

        //        // 조회(mybatis)
        //        Long totalCount = articleService.findListCount(search);
        //        List<ArticleVO> returnValue = articleService.findList(search);
        //
        //        ResultListDTO<ArticleVO> resultList = new ResultListDTO<ArticleVO>();
        //        resultList.setList(returnValue);
        //        resultList.setTotalCnt(totalCount);
        //
        //        ResultDTO<ResultListDTO<ArticleVO>> resultDTO =
        //                new ResultDTO<ResultListDTO<ArticleVO>>(resultList);
        //        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        return null;
    }

    @GetMapping("/{contentsId}")
    public ResponseEntity<?> getArticle(HttpServletRequest request, @PathVariable("contentsId") String contentsId)
            throws NoDataException {

        //        String message = messageByLocale.get("tps.contents.article.error.noContent", request);
        //
        //        // 조회
        //        Article article = articleService.findByContentsId(contentsId)
        //                .orElseThrow(() -> new NoDataException(message));
        //
        //        ResultDTO<ArticleDTO> resutlDTO =
        //                new ResultDTO<ArticleDTO>(modelMapper.map(article, ArticleDTO.class));
        //        return new ResponseEntity<>(resutlDTO, HttpStatus.OK);
        return null;
    }
}
