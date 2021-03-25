package jmnet.moka.core.tps.mvc.pkg.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.List;
import javax.validation.Valid;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.pkg.dto.PackageMasterDTO;
import jmnet.moka.core.tps.mvc.pkg.dto.PackageSearchDTO;
import jmnet.moka.core.tps.mvc.pkg.entity.PackageMaster;
import jmnet.moka.core.tps.mvc.pkg.service.PackageService;
import jmnet.moka.core.tps.mvc.pkg.vo.PackageSimpleVO;
import lombok.extern.slf4j.Slf4j;
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
 * Package : jmnet.moka.core.tps.mvc.packagae.controller
 * ClassName : PackageRestController
 * Created : 2021-03-19
 * </pre>
 *
 * @author stsoon
 * @since 2021-03-19 오전 11:38
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/packages")
@Api(tags = {"패키지 API"})
public class PackageRestController extends AbstractCommonController {

    private final PackageService packageService;

    // test
    private ObjectMapper objectMapper;

    public PackageRestController(PackageService packageService, ObjectMapper objectMapper) {
        this.packageService = packageService;
        this.objectMapper = objectMapper;
    }

    /**
     * 패키지 목록 조회
     *
     * @param search 검색 조건
     * @return 검색 결과
     */
    @ApiOperation(value = "패키지 데이터 조회")
    @GetMapping
    public ResponseEntity<?> getPackageList(@SearchParam PackageSearchDTO search) {

        log.debug("request search query params : {}", search);

        ResultListDTO<PackageSimpleVO> resultListMessage = new ResultListDTO<>();

        // 조회
        List<PackageSimpleVO> returnValue = packageService.findAllPackage(search);

        // 리턴값 설정
        resultListMessage.setTotalCnt(search.getTotal());
        resultListMessage.setList(returnValue);

        ResultDTO<ResultListDTO<PackageSimpleVO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 패키지 등록
     *
     * @param packageMasterDTO 등록할 패키지
     * @return 등록된 패키지
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "패키지 등록")
    @PostMapping
    public ResponseEntity<?> postPackage(@RequestBody @Valid PackageMasterDTO packageMasterDTO)
            throws InvalidDataException, Exception {
        if (packageMasterDTO.getPkgSeq() != null) {
            throw new MokaException("A new package cannot already hava an pkgSeq.");
        }

        // log
        log.debug("request packageMasterDTO : {}", objectMapper
                .writerWithDefaultPrettyPrinter()
                .writeValueAsString(packageMasterDTO));

        PackageMaster packageMaster = modelMapper.map(packageMasterDTO, PackageMaster.class);

        // 등록
        PackageMaster returnValue = packageService.insertPackage(packageMaster);

        return new ResponseEntity<>(packageMaster, HttpStatus.OK);
    }

    /**
     * 패키지 수정
     *
     * @param packageMasterDTO 수정할 패키지
     * @return 수정된 패키지
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "패키지 수정")
    @PutMapping("/{pkgSeq}")
    public ResponseEntity<?> putPackage(@ApiParam(value = "패키지 일련번호", required = true) @PathVariable("pkgSeq") Long pkgSeq,
            @RequestBody @Valid PackageMasterDTO packageMasterDTO)
            throws InvalidDataException, Exception {

        log.debug("request packageMasterDTO : {}", objectMapper
                .writerWithDefaultPrettyPrinter()
                .writeValueAsString(packageMasterDTO));

        return null;
    }

    /**
     * 패키지 타이틀 중복 체크
     *
     * @param pkgTitle 패키지 타이틀
     * @return 중복 여부
     */
    @ApiOperation(value = "패키지 타이틀 중복 여부")
    @GetMapping("/{pkgTitle}/exists")
    public ResponseEntity<?> duplicatePkgTitle(@ApiParam("패키지 타이틀")
    @PathVariable("pkgTitle") /* @Size(min = 1, max = 3, message = "{tps.group.error.pattern.groupCd}") */ String pkgTitle) {
        log.debug("request pkgTitle : {}", pkgTitle);

        boolean duplicated = packageService
                .findByPkgTitle(pkgTitle)
                .isPresent();
        ResultDTO<Boolean> resultDTO = new ResultDTO<>(duplicated);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }
}
