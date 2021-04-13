/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.issue.controller;

import com.twelvemonkeys.util.LinkedSet;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.Arrays;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;
import javax.validation.Valid;
import javax.validation.constraints.Size;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.issue.dto.PackageKeywordDTO;
import jmnet.moka.core.tps.mvc.issue.dto.PackageListDTO;
import jmnet.moka.core.tps.mvc.issue.dto.PackageListSearchDTO;
import jmnet.moka.core.tps.mvc.issue.dto.PackageMasterDTO;
import jmnet.moka.core.tps.mvc.issue.dto.PackageSearchDTO;
import jmnet.moka.core.tps.mvc.issue.entity.PackageList;
import jmnet.moka.core.tps.mvc.issue.entity.PackageMaster;
import jmnet.moka.core.tps.mvc.issue.service.PackageService;
import jmnet.moka.core.tps.mvc.issue.vo.PackageVO;
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
 * 이슈 API
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/issue")
@Api(tags = {"이슈 API"})
public class IssueRestController extends AbstractCommonController {

    private final PackageService packageService;

    public IssueRestController(PackageService packageService) {
        this.packageService = packageService;
    }

    /**
     * 패키지 목록 조회
     *
     * @param search 패키지 일련번호
     * @return 검색 결과
     */
    @ApiOperation(value = "패키지목록조회")
    @GetMapping
    public ResponseEntity<?> getPackageList(@Valid @SearchParam PackageSearchDTO search)
            throws Exception {

        try {
            List<PackageVO> returnValue = packageService.findAllPackage(search);

            // 리턴값 설정
            ResultListDTO<PackageVO> resultListMessage = new ResultListDTO<>();
            resultListMessage.setTotalCnt(search.getTotal());
            resultListMessage.setList(returnValue);

            ResultDTO<ResultListDTO<PackageVO>> resultDto = new ResultDTO<>(resultListMessage);
            tpsLogger.success(ActionType.SELECT);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO LOAD PACKAGE LIST]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD PACKAGE LIST]", e, true);
            throw new Exception(msg("tps.common.error.select"), e);
        }
    }

    /**
     * 패키지의 기사목록
     *
     * @return 검색 결과
     */
    @ApiOperation(value = "패키지의 기사목록조회")
    @GetMapping("/{pkgSeq}/list")
    public ResponseEntity<?> getPackageList(@ApiParam(value = "패키지 일련번호", required = true) @PathVariable("pkgSeq") Long pkgSeq,
            @Valid @SearchParam PackageListSearchDTO search)
            throws Exception {

        try {
            // 조회
            Page<PackageList> returnValue = packageService.findAllPackageList(search);

            // 리턴값 설정
            ResultListDTO<PackageListDTO> resultListMessage = new ResultListDTO<>();
            List<PackageListDTO> dtoList = modelMapper.map(returnValue.getContent(), PackageListDTO.TYPE);
            resultListMessage.setTotalCnt(returnValue.getTotalElements());
            resultListMessage.setList(dtoList);

            ResultDTO<ResultListDTO<PackageListDTO>> resultDto = new ResultDTO<>(resultListMessage);

            tpsLogger.success(ActionType.SELECT);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO LOAD PACKAGE ARTICLE LIST]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD PACKAGE ARTICLE LIST]", e, true);
            throw new Exception(msg("tps.common.error.select"), e);
        }
    }

    /**
     * 패키지 조회
     *
     * @param pkgSeq 패키지 일련번호
     * @return 검색 결과
     */
    @ApiOperation(value = "패키지 조회")
    @GetMapping("/{pkgSeq}")
    public ResponseEntity<?> getPackage(
            @ApiParam("패키지 일련번호") @PathVariable("pkgSeq") /* @Min(value = 0, message = "{tps.article.error.min.totalId}") */ Long pkgSeq)
            throws NoDataException {
        // 조회
        PackageMaster packageMaster = packageService
                .findByPkgSeq(pkgSeq)
                .orElseThrow(() -> new NoDataException("no-data"));

        PackageMasterDTO packageMasterDTO = modelMapper.map(packageMaster, PackageMasterDTO.class);

        // 리턴값 설정
        ResultDTO<PackageMasterDTO> resultDto = new ResultDTO<>(packageMasterDTO);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 패키지 조회 (화면기준)
     *
     * @param pkgSeq 패키지 일련번호
     * @return 검색 결과
     */
    @ApiOperation(value = "패키지 조회 (화면기준)")
    @GetMapping("/{pkgSeq}/group-by-ordno")
    public ResponseEntity<?> getPackageGroupByOrdno(
            @ApiParam("패키지 일련번호") @PathVariable("pkgSeq") /* @Min(value = 0, message = "{tps.article.error.min.totalId}") */ Long pkgSeq)
            throws NoDataException {
        // 조회
        PackageMaster packageMaster = packageService
                .findByPkgSeq(pkgSeq)
                .orElseThrow(() -> new NoDataException("no-data"));

        PackageMasterDTO packageMasterDTO = modelMapper.map(packageMaster, PackageMasterDTO.class);

        // transform
        packageMasterDTO = transformDataToViewDto(packageMasterDTO);

        // 리턴값 설정
        ResultDTO<PackageMasterDTO> resultDto = new ResultDTO<>(packageMasterDTO);

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
            throw new MokaException(msg("tps.common.error.duplicated.key"));
        }

        PackageMaster packageMaster = modelMapper.map(packageMasterDTO, PackageMaster.class);

        // 등록
        PackageMaster returnValue = packageService.insertPackage(packageMaster);

        // 결과리턴
        PackageMasterDTO dto = modelMapper.map(returnValue, PackageMasterDTO.class);
        ResultDTO<PackageMasterDTO> resultDto = new ResultDTO<>(dto, msg("tps.common.success.insert"));

        tpsLogger.success(ActionType.INSERT);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 패키지 등록 (화면기준)
     *
     * @param packageMasterDTO 등록할 패키지
     * @return 등록된 패키지
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "패키지 등록 (화면기준)")
    @PostMapping("/group-by-ordno")
    public ResponseEntity<?> postPackageGroupByOrdno(@RequestBody @Valid PackageMasterDTO packageMasterDTO)
            throws InvalidDataException, Exception {
        if (packageMasterDTO.getPkgSeq() != null) {
            throw new MokaException(msg("tps.common.error.duplicated.key"));
        }

        // transform
        packageMasterDTO = transformViewToDto(packageMasterDTO);

        PackageMaster packageMaster = modelMapper.map(packageMasterDTO, PackageMaster.class);

        // 등록
        PackageMaster returnValue = packageService.insertPackage(packageMaster);

        // 결과리턴
        PackageMasterDTO dto = modelMapper.map(returnValue, PackageMasterDTO.class);
        ResultDTO<PackageMasterDTO> resultDto = new ResultDTO<>(dto, msg("tps.common.success.insert"));

        tpsLogger.success(ActionType.INSERT);
        //        return new ResponseEntity<>(null, HttpStatus.OK);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
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
        if (packageMasterDTO.getPkgSeq() == null) {
            throw new MokaException(msg("tps.common.error.no-data"));
        }

        PackageMaster packageMaster = modelMapper.map(packageMasterDTO, PackageMaster.class);
        // 수정
        PackageMaster returnValue = packageService.updatePackage(packageMaster);

        // 결과리턴
        PackageMasterDTO dto = modelMapper.map(returnValue, PackageMasterDTO.class);
        ResultDTO<PackageMasterDTO> resultDto = new ResultDTO<>(dto, msg("tps.common.success.update"));

        tpsLogger.success(ActionType.UPDATE);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 패키지 종료
     *
     * @param pkgSeq 패키지 일련번호
     * @return 수정된 패키지
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "패키지 종료")
    @PutMapping("/{pkgSeq}/finish")
    public ResponseEntity<?> putPackageFinish(@ApiParam(value = "패키지 일련번호", required = true) @PathVariable("pkgSeq") Long pkgSeq)
            throws InvalidDataException, Exception {

        PackageMaster packageMaster = packageService
                .findByPkgSeq(pkgSeq)
                .orElseThrow(() -> new NoDataException(msg("")));
        packageMaster.setUsedYn("N");
        // 수정
        PackageMaster returnValue = packageService.updatePackageMaster(packageMaster);

        // 결과리턴
        PackageMasterDTO dto = modelMapper.map(returnValue, PackageMasterDTO.class);
        ResultDTO<PackageMasterDTO> resultDto = new ResultDTO<>(dto, msg("tps.common.success.update"));

        tpsLogger.success(ActionType.UPDATE);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 패키지 수정 (화면기준)
     *
     * @param packageMasterDTO 수정할 패키지
     * @return 수정된 패키지
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "패키지 수정 (화면기준)")
    @PutMapping("/{pkgSeq}/group-by-ordno")
    public ResponseEntity<?> putPackageGroupByOrdno(@ApiParam(value = "패키지 일련번호", required = true) @PathVariable("pkgSeq") Long pkgSeq,
            @RequestBody @Valid PackageMasterDTO packageMasterDTO)
            throws InvalidDataException, Exception {
        if (packageMasterDTO.getPkgSeq() == null) {
            throw new MokaException(msg("tps.common.error.notnull.seq"));
        }

        // transform
        packageMasterDTO = transformViewToDto(packageMasterDTO);

        PackageMaster packageMaster = modelMapper.map(packageMasterDTO, PackageMaster.class);
        // 수정
        PackageMaster returnValue = packageService.updatePackage(packageMaster);

        // 결과리턴
        PackageMasterDTO dto = modelMapper.map(returnValue, PackageMasterDTO.class);
        ResultDTO<PackageMasterDTO> resultDto = new ResultDTO<>(dto, msg("tps.common.success.update"));

        tpsLogger.success(ActionType.UPDATE);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 패키지 타이틀 중복 체크
     *
     * @param pkgTitle 패키지 타이틀
     * @return 중복 여부
     */
    @ApiOperation(value = "패키지 타이틀 중복 여부")
    @GetMapping("/{pkgTitle}/exists")
    public ResponseEntity<?> duplicatePkgTitle(
            @ApiParam("패키지 타이틀") @PathVariable("pkgTitle") @Size(min = 1, max = 100, message = "{tps.issue.error.length.pkgTitle}") String pkgTitle) {

        boolean duplicated = packageService
                .findByPkgTitle(pkgTitle)
                .isPresent();
        ResultDTO<Boolean> resultDTO = new ResultDTO<>(duplicated);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 화면표시용 데이터로 transform - ordno 기준으로 검색카테고리 분리해서 저장
     *
     * @param dataDto 디비 엔티티 맵핑된 데이터
     * @return 화면 표시용 데이터
     */
    public PackageMasterDTO transformDataToViewDto(PackageMasterDTO dataDto) {
        Set<PackageKeywordDTO> keywords = dataDto
                .getPackageKeywords()
                .stream()
                .filter(keyword -> !keyword
                        .getCatDiv()
                        .contains("C"))
                .collect(Collectors.groupingBy(PackageKeywordDTO::getOrdno))
                .values()
                .stream()
                .map(group -> group
                        .stream()
                        .sorted(Comparator.comparingLong(PackageKeywordDTO::getKwdOrd))
                        .reduce(PackageKeywordDTO
                                .builder()
                                .keyword("")
                                .schCondi("")
                                .build(), (stored, newDto) -> newDto
                                .toBuilder()
                                .pkgSeq(dataDto.getPkgSeq())
                                .keyword(stored.getKeyword() + "," + newDto.getKeyword())
                                .schCondi(stored.getSchCondi() + "," + newDto.getSchCondi())
                                .build()))
                .peek(keyword -> {
                    Set<String> keywordSet = new LinkedSet<>();
                    Set<String> schCondiSet = new LinkedSet<>();
                    Arrays
                            .stream(keyword
                                    .getKeyword()
                                    .split(","))
                            .filter(kwd -> kwd.length() > 0 && !kwd.contains("null"))
                            .forEach(keywordSet::add);
                    Arrays
                            .stream(keyword
                                    .getSchCondi()
                                    .replace("null", "")
                                    .split(","))
                            .filter(condi -> condi.length() > 0 && !condi.contains("null"))
                            .forEach(schCondiSet::add);
                    keyword.setKeyword(String.join(",", keywordSet));
                    keyword.setSchCondi(String.join(",", schCondiSet));
                })
                .collect(Collectors.toSet());
        // 카테고리
        dataDto.setCatList(dataDto
                .getPackageKeywords()
                .stream()
                .filter(keyword -> keyword
                        .getCatDiv()
                        .contains("C"))
                .sorted(Comparator.comparingLong(PackageKeywordDTO::getKwdOrd))
                .map(keyword -> String.valueOf(keyword.getRepMaster()))
                .collect(Collectors.joining(",")));
        dataDto.setPackageKeywords(keywords
                .stream()
                .sorted(Comparator.comparing(PackageKeywordDTO::getOrdno))
                .collect(Collectors.toCollection(LinkedHashSet::new)));
        return dataDto;
    }

    /**
     * 검색조건 c(T,K) * 키워드 c(keyword1, keyword2) + 카테고리 c(xxxx,xxxx) 데이터 파싱
     *
     * @param viewDto 화면 표시용 데이터 디비 엔티티 맵핑된 데이터
     * @return 디비 엔티티 맵핑된 데이터
     */
    public PackageMasterDTO transformViewToDto(PackageMasterDTO viewDto) {
        Set<PackageKeywordDTO> keywords = new LinkedHashSet<>();
        //        Integer categoryOrderNumber = viewDto
        //                .getPackageKeywords()
        //                .size();
        //        viewDto
        //                .getPackageKeywords()
        //                .stream()
        //                .forEach(keyword -> {
        //                    AtomicLong kwdOrd = new AtomicLong();
        //                    Arrays
        //                            .stream(keyword
        //                                    .getKeyword()
        //                                    .split(","))
        //                            .forEach(kwd -> {
        //                                keywords.add(keyword
        //                                        .toBuilder()
        //                                        .schCondi(null)
        //                                        .keyword(kwd)
        //                                        .kwdOrd(kwdOrd.incrementAndGet())
        //                                        .build());
        //                            });
        //                });
        // 검색 조건있는경우 (하나는 있어야 된다고함)
        viewDto
                .getPackageKeywords()
                .stream()
                .filter(keyword -> Optional
                        .ofNullable(keyword.getSchCondi())
                        .isPresent())
                .forEach(keyword -> Arrays
                        .stream(keyword
                                .getSchCondi()
                                .split(","))
                        .forEach(schCondi -> {
                            AtomicLong kwdOrd = new AtomicLong();
                            Arrays
                                    .stream(keyword
                                            .getKeyword()
                                            .split(","))
                                    .forEach(kwd -> keywords.add(keyword
                                            .toBuilder()
                                            .schCondi(schCondi)
                                            .keyword(kwd)
                                            .kwdOrd(kwdOrd.incrementAndGet())
                                            .build()));
                        }));
        // 카테고리
        if (viewDto.getCatList() != null && viewDto
                .getCatList()
                .length() > 0) {
            AtomicLong kwdOrd = new AtomicLong();
            Arrays
                    .stream(viewDto
                            .getCatList()
                            .split(","))
                    .forEach((category) -> keywords.add(PackageKeywordDTO
                            .builder()
                            .catDiv("C")
                            //                                .keyword(category)
                            .repMaster(Long.parseLong(category))
                            .kwdOrd(kwdOrd.incrementAndGet())
                            .ordno(0L)
                            .build()));
        }
        return viewDto
                .toBuilder()
                .catList(viewDto
                        .getCatList()
                        .substring(0, Math.min(29, viewDto
                                .getCatList()
                                .length())))
                .packageKeywords(keywords)
                .build();
    }
    

}
