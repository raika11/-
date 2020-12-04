package jmnet.moka.core.tps.mvc.sns.controller;

import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.sns.dto.ArticleSnsShareDTO;
import jmnet.moka.core.tps.mvc.sns.dto.ArticleSnsShareSearchDTO;
import jmnet.moka.core.tps.mvc.sns.entity.ArticleSnsShare;
import jmnet.moka.core.tps.mvc.sns.service.ArticleSnsShareService;
import jmnet.moka.core.tps.mvc.sns.vo.ArticleSnsShareItemVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.sns.controller
 * ClassName : ArticleSnsShareController
 * Created : 2020-12-04 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-04 11:15
 */
@RestController
@RequestMapping("/api/sns")
public class ArticleSnsShareController extends AbstractCommonController {

    @Autowired
    private ArticleSnsShareService articleSnsShareService;

    /**
     * SNS 공유 목록 조회
     *
     * @param search 검색 조건
     * @return 검색 결과
     */
    @ApiOperation(value = "SNS 메타 목록 조회")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "searchType", value = "검색조건<br>all:전체<br>artTitle:제목<br>totalId:기사ID", required = false, dataType = "String", paramType = "query"),
            @ApiImplicitParam(name = "keyword", value = "검색어", required = false, dataType = "String", paramType = "query"),
            @ApiImplicitParam(name = "page", value = "페이지수", required = false, dataType = "int", paramType = "query", defaultValue =
                    SearchDTO.DEFAULT_PAGE + ""),
            @ApiImplicitParam(name = "size", value = "페이지당 목록수", required = false, dataType = "int", paramType = "query", defaultValue =
                    SearchDTO.DEFAULT_SIZE + ""),
            @ApiImplicitParam(name = "useTotal", value = "페이징처리여부", required = false, dataType = "String", paramType = "query", defaultValue = MokaConstants.YES)})
    @GetMapping
    public ResponseEntity<?> getArticleSnsShareList(@SearchParam ArticleSnsShareSearchDTO search) {

        ResultListDTO<ArticleSnsShareDTO> resultListMessage = new ResultListDTO<>();

        // 조회
        Page<ArticleSnsShare> returnValue = articleSnsShareService.findAllArticleSnsShare(search);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(modelMapper.map(returnValue.getContent(), ArticleSnsShareDTO.TYPE));

        ResultDTO<ResultListDTO<ArticleSnsShareDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(true);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * SNS 공유 기사 목록 조회
     *
     * @param search 검색 조건
     * @return 검색 결과
     */
    @ApiOperation(value = "SNS 전송 기사 목록 조회(FB)")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "searchType", value = "검색조건<br>all:전체<br>artTitle:제목<br>totalId:기사ID", required = false, dataType = "String", paramType = "query"),
            @ApiImplicitParam(name = "keyword", value = "검색어", required = false, dataType = "String", paramType = "query"),
            @ApiImplicitParam(name = "page", value = "페이지수", required = false, dataType = "int", paramType = "query", defaultValue =
                    SearchDTO.DEFAULT_PAGE + ""),
            @ApiImplicitParam(name = "size", value = "페이지당 목록수", required = false, dataType = "int", paramType = "query", defaultValue =
                    SearchDTO.DEFAULT_SIZE + ""),
            @ApiImplicitParam(name = "useTotal", value = "페이징처리여부", required = false, dataType = "String", paramType = "query", defaultValue = MokaConstants.YES)})
    @GetMapping("/send-articles")
    public ResponseEntity<?> getArticleSnsShareSendList(@SearchParam ArticleSnsShareSearchDTO search) {

        ResultListDTO<ArticleSnsShareItemVO> resultListMessage = new ResultListDTO<>();

        // 조회
        Page<ArticleSnsShareItemVO> returnValue = articleSnsShareService.findAllArticleSnsShareItem(search);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(returnValue.getContent());

        ResultDTO<ResultListDTO<ArticleSnsShareItemVO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(true);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }
}
