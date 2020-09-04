package jmnet.moka.core.tps.mvc.code.controller;

import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.tps.mvc.code.dto.CodeSearchDTO;
import jmnet.moka.core.tps.mvc.code.service.CodeService;
import jmnet.moka.core.tps.mvc.code.vo.CodeVO;

@Controller
@Validated
@RequestMapping("/api/codes")
public class CodeRestController {
    // private static final Logger logger = LoggerFactory.getLogger(CodeRestController.class);

    @Autowired
    private CodeService codeService;

    @GetMapping("/searchCodes")
    public ResponseEntity<?> getSearchCodeId(HttpServletRequest request,
            @Valid @SearchParam CodeSearchDTO search) {

        // MyBatis 조회
        List<CodeVO> returnValue = codeService.findSearchCodes(search);

        ResultListDTO<CodeVO> resultList = new ResultListDTO<CodeVO>();
        resultList.setList(returnValue);
        resultList.setTotalCnt(returnValue.size());

        ResultDTO<ResultListDTO<CodeVO>> resultDTO =
                new ResultDTO<ResultListDTO<CodeVO>>(resultList);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    @GetMapping("/largeCodes")
    public ResponseEntity<?> getLargeCodes(HttpServletRequest request) {

        // MyBatis 조회
        List<CodeVO> returnValue = codeService.findLargeCodes(new CodeSearchDTO());

        ResultListDTO<CodeVO> resultList = new ResultListDTO<CodeVO>();
        resultList.setList(returnValue);
        resultList.setTotalCnt(returnValue.size());

        ResultDTO<ResultListDTO<CodeVO>> resultDTO =
                new ResultDTO<ResultListDTO<CodeVO>>(resultList);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    @GetMapping("/middleCodes")
    public ResponseEntity<?> getMiddleCodes(HttpServletRequest request,
            @Valid @SearchParam CodeSearchDTO search) {

        // MyBatis 조회
        List<CodeVO> returnValue = codeService.findMiddleCodes(search);

        ResultListDTO<CodeVO> resultList = new ResultListDTO<CodeVO>();
        resultList.setList(returnValue);
        resultList.setTotalCnt(returnValue.size());

        ResultDTO<ResultListDTO<CodeVO>> resultDTO =
                new ResultDTO<ResultListDTO<CodeVO>>(resultList);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    @GetMapping("/smallCodes")
    public ResponseEntity<?> getSmallCodes(HttpServletRequest request,
            @Valid @SearchParam CodeSearchDTO search) {

        // MyBatis 조회
        List<CodeVO> returnValue = codeService.findSmallCodes(search);

        ResultListDTO<CodeVO> resultList = new ResultListDTO<CodeVO>();
        resultList.setList(returnValue);
        resultList.setTotalCnt(returnValue.size());

        ResultDTO<ResultListDTO<CodeVO>> resultDTO =
                new ResultDTO<ResultListDTO<CodeVO>>(resultList);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }
}
