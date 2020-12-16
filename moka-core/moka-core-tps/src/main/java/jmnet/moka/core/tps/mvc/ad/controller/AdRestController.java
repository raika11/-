package jmnet.moka.core.tps.mvc.ad.controller;

import io.swagger.annotations.Api;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.tps.mvc.ad.dto.AdSearchDTO;
import jmnet.moka.core.tps.mvc.ad.service.AdService;
import jmnet.moka.core.tps.mvc.ad.vo.AdVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ads")
@Api(tags = {"광고 API"})
public class AdRestController {

    @Autowired
    private AdService adService;

    @GetMapping
    public ResponseEntity<?> getAds(HttpServletRequest request, @Valid @SearchParam AdSearchDTO search) {

        // 조회(mybatis)
        Long totalCount = adService.findListCount(search);
        List<AdVO> returnValue = adService.findList(search);

        ResultListDTO<AdVO> resultList = new ResultListDTO<AdVO>();
        resultList.setList(returnValue);
        resultList.setTotalCnt(totalCount);

        ResultDTO<ResultListDTO<AdVO>> resultDTO = new ResultDTO<ResultListDTO<AdVO>>(resultList);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);

    }
}
