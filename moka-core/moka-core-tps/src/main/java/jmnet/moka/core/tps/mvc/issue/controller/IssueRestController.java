/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.issue.controller;

import com.twelvemonkeys.util.LinkedSet;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.io.IOException;
import java.security.Principal;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;
import javax.validation.Valid;
import javax.validation.constraints.Size;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpFile;
import jmnet.moka.common.utils.UUIDGenerator;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.ftp.FtpHelper;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.code.EditStatusCode;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.helper.UploadFileHelper;
import jmnet.moka.core.tps.mvc.issue.dto.IssueDeskingHistCompDTO;
import jmnet.moka.core.tps.mvc.issue.dto.IssueDeskingHistDTO;
import jmnet.moka.core.tps.mvc.issue.dto.IssueDeskingHistGroupSearchDTO;
import jmnet.moka.core.tps.mvc.issue.dto.PackageKeywordDTO;
import jmnet.moka.core.tps.mvc.issue.dto.PackageListDTO;
import jmnet.moka.core.tps.mvc.issue.dto.PackageListSearchDTO;
import jmnet.moka.core.tps.mvc.issue.dto.PackageMasterDTO;
import jmnet.moka.core.tps.mvc.issue.dto.PackageSearchDTO;
import jmnet.moka.core.tps.mvc.issue.entity.PackageList;
import jmnet.moka.core.tps.mvc.issue.entity.PackageMaster;
import jmnet.moka.core.tps.mvc.issue.service.IssueDeskingService;
import jmnet.moka.core.tps.mvc.issue.service.PackageService;
import jmnet.moka.core.tps.mvc.issue.vo.IssueDeskingHistGroupVO;
import jmnet.moka.core.tps.mvc.issue.vo.PackageVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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

    private final IssueDeskingService issueDeskingService;

    private final FtpHelper ftpHelper;

    private final UploadFileHelper uploadFileHelper;

    @Value("${package.image.save.filepath}")
    private String packageSaveFilepath;

    @Value("${pds.url}")
    private String pdsUrl;


    public IssueRestController(PackageService packageService, IssueDeskingService issueDeskingService, FtpHelper ftpHelper,
            UploadFileHelper uploadFileHelper) {
        this.packageService = packageService;
        this.issueDeskingService = issueDeskingService;
        this.ftpHelper = ftpHelper;
        this.uploadFileHelper = uploadFileHelper;
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
    public ResponseEntity<?> getPackage(@ApiParam(value = "패키지 일련번호", required = true)
    @PathVariable("pkgSeq") /* @Min(value = 0, message = "{tps.article.error.min.totalId}") */ Long pkgSeq)
            throws NoDataException {
        // 조회
        PackageMaster packageMaster = packageService
                .findByPkgSeq(pkgSeq)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

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
    public ResponseEntity<?> getPackageGroupByOrdno(@ApiParam(value = "패키지 일련번호", required = true)
    @PathVariable("pkgSeq") /* @Min(value = 0, message = "{tps.article.error.min.totalId}") */ Long pkgSeq)
            throws NoDataException {
        // 조회
        PackageMaster packageMaster = packageService
                .findByPkgSeq(pkgSeq)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

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
    public ResponseEntity<?> postPackage(@RequestBody @Valid PackageMasterDTO packageMasterDTO, @ApiParam(hidden = true) Principal principal)
            throws InvalidDataException, Exception {
        if (packageMasterDTO.getPkgSeq() != null) {
            throw new MokaException(msg("tps.common.error.duplicated.key"));
        }

        PackageMaster packageMaster = modelMapper.map(packageMasterDTO, PackageMaster.class);

        // 등록
        PackageMaster returnValue = packageService.insertPackage(packageMaster);

        // 확장형일경우, 자동컴포넌트에 편집정보추가
        issueDeskingService.insertAutoComponentDeskingHist(returnValue, principal.getName());

        // 등록후 패키지 기사 묶기
        packageService.updatePackageTotalId(returnValue.getPkgSeq());

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
    public ResponseEntity<?> postPackageGroupByOrdno(@RequestBody @Valid PackageMasterDTO packageMasterDTO,
            @ApiParam(hidden = true) Principal principal)
            throws InvalidDataException, Exception {
        if (packageMasterDTO.getPkgSeq() != null) {
            throw new MokaException(msg("tps.common.error.duplicated.key"));
        }

        // transform
        packageMasterDTO = transformViewToDto(packageMasterDTO);

        PackageMaster packageMaster = modelMapper.map(packageMasterDTO, PackageMaster.class);

        // 등록
        PackageMaster returnValue = packageService.insertPackage(packageMaster);

        // 확장형일경우, 자동컴포넌트에 편집정보추가
        issueDeskingService.insertAutoComponentDeskingHist(returnValue, principal.getName());

        // 등록후 패키지 기사 묶기
        packageService.updatePackageTotalId(returnValue.getPkgSeq());

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
            @RequestBody @Valid PackageMasterDTO packageMasterDTO, @ApiParam(hidden = true) Principal principal)
            throws InvalidDataException, Exception {
        if (packageMasterDTO.getPkgSeq() == null) {
            throw new MokaException(msg("tps.common.error.no-data"));
        }

        PackageMaster packageMaster = modelMapper.map(packageMasterDTO, PackageMaster.class);
        // 수정
        PackageMaster returnValue = packageService.updatePackage(packageMaster);

        // 확장형일경우, 자동컴포넌트에 편집정보추가
        issueDeskingService.insertAutoComponentDeskingHist(returnValue, principal.getName());

        // 수정후 패키지 기사 묶기
        packageService.updatePackageTotalId(returnValue.getPkgSeq());

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
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));
        // 종료 플레그 E
        packageMaster.setUsedYn("E");
        // 수정
        PackageMaster returnValue = packageService.updatePackageMaster(packageMaster);
        // 수정후 패키지 기사 묶기
        packageService.updatePackageTotalId(returnValue.getPkgSeq());

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
            @RequestBody @Valid PackageMasterDTO packageMasterDTO, @ApiParam(hidden = true) Principal principal)
            throws InvalidDataException, Exception {
        if (packageMasterDTO.getPkgSeq() == null) {
            throw new MokaException(msg("tps.common.error.notnull.seq"));
        }

        // transform
        packageMasterDTO = transformViewToDto(packageMasterDTO);

        PackageMaster packageMaster = modelMapper.map(packageMasterDTO, PackageMaster.class);
        // 수정
        PackageMaster returnValue = packageService.updatePackage(packageMaster);

        // 확장형일경우, 자동컴포넌트에 편집정보추가
        issueDeskingService.insertAutoComponentDeskingHist(returnValue, principal.getName());

        // 수정후 패키지 기사 묶기
        packageService.updatePackageTotalId(returnValue.getPkgSeq());

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
    public ResponseEntity<?> duplicatePkgTitle(@ApiParam(value = "패키지 타이틀", required = true) @PathVariable("pkgTitle")
    @Size(min = 1, max = 100, message = "{tps.issue.error.length.pkgTitle}") String pkgTitle) {

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
                .filter(keyword -> !keyword
                        .getCatDiv()
                        .contains("P"))
                .collect(Collectors.groupingBy(PackageKeywordDTO::getOrdNo))
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
        // 추천패키지
        dataDto.setRecommPkg(dataDto
                .getPackageKeywords()
                .stream()
                .filter(keyword -> keyword
                        .getCatDiv()
                        .contains("P"))
                .sorted(Comparator.comparingLong(PackageKeywordDTO::getKwdOrd))
                .map(keyword -> String.valueOf(keyword.getRepMaster()))
                .collect(Collectors.joining(",")));
        dataDto.setPackageKeywords(keywords
                .stream()
                .sorted(Comparator.comparing(PackageKeywordDTO::getOrdNo))
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
                                            .kwdCnt(Long.valueOf(keyword
                                                    .getKeyword()
                                                    .split(",").length))
                                            .kwdOrd(kwdOrd.incrementAndGet())
                                            .build()));
                        }));
        keywords
                .stream()
                .max(Comparator.comparingLong(PackageKeywordDTO::getOrdNo))
                .ifPresent(maxOrdNoDto -> {
                    AtomicLong ord = new AtomicLong();
                    // 카테고리
                    if (viewDto.getCatList() != null && viewDto
                            .getCatList()
                            .length() > 0) {
                        AtomicLong kwdOrd = new AtomicLong();
                        final Long plus = ord.incrementAndGet();
                        Arrays
                                .stream(viewDto
                                        .getCatList()
                                        .split(","))
                                .forEach((category) -> keywords.add(PackageKeywordDTO
                                        .builder()
                                        .catDiv("C")
                                        .repMaster(Long.parseLong(category))
                                        .kwdOrd(kwdOrd.incrementAndGet())
                                        .kwdCnt(Long.valueOf(viewDto
                                                .getCatList()
                                                .split(",").length))
                                        .ordNo(maxOrdNoDto.getOrdNo() + plus)
                                        .build()));
                    }
                    // 추천패키지
                    if (viewDto.getRecommPkg() != null && viewDto
                            .getRecommPkg()
                            .length() > 0) {
                        AtomicLong kwdOrd = new AtomicLong();
                        final Long plus = ord.incrementAndGet();
                        Arrays
                                .stream(viewDto
                                        .getRecommPkg()
                                        .split(","))
                                .forEach((recommPkg) -> keywords.add(PackageKeywordDTO
                                        .builder()
                                        .catDiv("P")
                                        .repMaster(Long.parseLong(recommPkg))
                                        .kwdOrd(kwdOrd.incrementAndGet())
                                        .ordNo(maxOrdNoDto.getOrdNo() + plus)
                                        .build()));
                    }
                });

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


    /**
     * 패키지의 편집목록조회
     *
     * @param pkgSeq 패키지순번
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "패키지의 편집목록조회")
    @GetMapping("/{pkgSeq}/desking")
    public ResponseEntity<?> getDeskingList(@ApiParam(value = "패키지 일련번호", required = true) @PathVariable("pkgSeq") Long pkgSeq)
            throws Exception {
        PackageMaster packageMaster = packageService
                .findByPkgSeq(pkgSeq)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        try {
            List<IssueDeskingHistCompDTO> returnValue = issueDeskingService.findAllIssueDeskingHist(packageMaster);

            // 리턴값 설정
            ResultListDTO<IssueDeskingHistCompDTO> resultListMessage = new ResultListDTO<>();
            resultListMessage.setTotalCnt(returnValue.size());
            resultListMessage.setList(returnValue);

            ResultDTO<ResultListDTO<IssueDeskingHistCompDTO>> resultDto = new ResultDTO<>(resultListMessage);
            tpsLogger.success(ActionType.SELECT);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO LOAD PACKAGE DESKING LIST]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD PACKAGE DESKING LIST]", e, true);
            throw new Exception(msg("tps.common.error.select"), e);
        }
    }

    /**
     * 편집기사 임시저장
     *
     * @param pkgSeq                  패키지 일련번호
     * @param compNo                  컴포넌트순번
     * @param issueDeskingHistCompDTO 컴포넌트정보
     * @param principal               작업자정보
     * @return
     * @throws InvalidDataException 예외
     * @throws Exception            오류
     */
    @ApiOperation(value = "편집기사 임시저장")
    @PostMapping(value = "/{pkgSeq}/desking/{compNo}/save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> postSaveIssueDesking(@ApiParam(value = "패키지 일련번호", required = true) @PathVariable("pkgSeq") Long pkgSeq,
            @ApiParam(value = "컴포넌트순번", required = true) @PathVariable("compNo") Integer compNo,
            @Valid IssueDeskingHistCompDTO issueDeskingHistCompDTO, @ApiParam(hidden = true) Principal principal)
            throws InvalidDataException, Exception {
        PackageMaster packageMaster = packageService
                .findByPkgSeq(issueDeskingHistCompDTO.getPkgSeq())
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));
        try {
            if (issueDeskingHistCompDTO.getIssueDeskings() != null && issueDeskingHistCompDTO
                    .getIssueDeskings()
                    .size() > 0) {
                // escape
                issueDeskingHistCompDTO
                        .getIssueDeskings()
                        .stream()
                        .forEach((dto -> issueDeskingService.escapeHtml(dto)));

                // 썸네일 파일 저장
                uploadThumbfile(issueDeskingHistCompDTO.getIssueDeskings());
            }

            // 등록
            issueDeskingService.save(packageMaster, issueDeskingHistCompDTO, principal.getName());
            IssueDeskingHistCompDTO returnValue = issueDeskingService.findIssueDeskingHistBySaveComponent(packageMaster, compNo);

            // 결과리턴
            IssueDeskingHistCompDTO dto = modelMapper.map(returnValue, IssueDeskingHistCompDTO.class);
            ResultDTO<IssueDeskingHistCompDTO> resultDto = new ResultDTO<>(dto, msg("tps.issue.success.save"));

            tpsLogger.success(ActionType.INSERT);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO SAVE ISSUE DESKING]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO SAVE ISSUE DESKING]", e, true);
            throw new Exception(msg("tps.issue.error.save"), e);
        }
    }

    /**
     * 이미지업로드
     *
     * @param issueDeskings 이슈편집기사목록
     * @throws InvalidDataException 예외
     * @throws IOException          파일읽기오류
     */
    private void uploadThumbfile(List<IssueDeskingHistDTO> issueDeskings)
            throws InvalidDataException, IOException {
        for (IssueDeskingHistDTO dto : issueDeskings) {
            if (dto.getThumbFile() != null) {
                MultipartFile mfile = dto.getThumbFile();
                int[] imgInfo = uploadFileHelper.getImgFileSize(mfile);

                // 썸네일 정보 셋팅
                dto.setThumbFileName(uploadImage(mfile));
                dto.setThumbSize((int) mfile.getSize());
                dto.setThumbWidth(imgInfo[0]);
                dto.setThumbHeight(imgInfo[1]);
            }
        }
    }

    /**
     * 이미지업로드
     *
     * @param imgFile 이미지파일
     * @return
     * @throws InvalidDataException 예외
     * @throws IOException          오류
     */
    public String uploadImage(MultipartFile imgFile)
            throws InvalidDataException, IOException {

        String ext = McpFile.getExtension(imgFile.getOriginalFilename());
        String filename = UUIDGenerator.uuid() + "." + ext;
        String yearMonth = McpDate.dateStr(McpDate.now(), "yyyyMM/dd");
        String saveFilePath = String.format(packageSaveFilepath, yearMonth);
        String imageUrl = pdsUrl;
        String message = "";
        if (ftpHelper.upload(FtpHelper.PDS, filename, imgFile.getInputStream(), saveFilePath)) {
            imageUrl = pdsUrl + saveFilePath + "/" + filename;
        } else {
            message = msg("tps.issue.error.insert.image-upload");
        }

        // 액션 로그에 성공 로그 출력
        tpsLogger.success(ActionType.UPLOAD, message);

        return imageUrl;
    }

    /**
     * 편집기사 전송
     *
     * @param pkgSeq    패키지 일련번호
     * @param compNo    컴포넌트순번
     * @param principal 작업자정보
     * @return
     * @throws Exception 오류
     */
    @ApiOperation(value = "편집기사 전송")
    @PostMapping("/{pkgSeq}/desking/{compNo}/publish")
    public ResponseEntity<?> postPublishIssueDesking(@ApiParam(value = "패키지 일련번호", required = true) @PathVariable("pkgSeq") Long pkgSeq,
            @ApiParam(value = "컴포넌트순번", required = true) @PathVariable("compNo") Integer compNo, @ApiParam(hidden = true) Principal principal)
            throws Exception {
        PackageMaster packageMaster = packageService
                .findByPkgSeq(pkgSeq)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));
        try {
            // 등록
            issueDeskingService.publish(packageMaster, compNo, principal.getName());

            IssueDeskingHistCompDTO returnValue = issueDeskingService.findIssueDeskingHistBySaveComponent(packageMaster, compNo);

            // 결과리턴
            IssueDeskingHistCompDTO dto = modelMapper.map(returnValue, IssueDeskingHistCompDTO.class);
            ResultDTO<IssueDeskingHistCompDTO> resultDto = new ResultDTO<>(dto, msg("tps.issue.success.publish"));

            tpsLogger.success(ActionType.INSERT);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO PUBLISH ISSUE DESKING]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO PUBLISH ISSUE DESKING]", e, true);
            throw new Exception(msg("tps.issue.error.publish"), e);
        }
    }

    /**
     * 편집기사 예약
     *
     * @param pkgSeq    패키지 일련번호
     * @param compNo    컴포넌트순번
     * @param reserveDt 예약시간
     * @param principal 작업자정보
     * @return
     * @throws Exception 오류
     */
    @ApiOperation(value = "편집기사 예약")
    @PostMapping("/{pkgSeq}/desking/{compNo}/reserve")
    public ResponseEntity<?> postReserveIssueDesking(@ApiParam(value = "패키지 일련번호", required = true) @PathVariable("pkgSeq") Long pkgSeq,
            @ApiParam(value = "컴포넌트순번", required = true) @PathVariable("compNo") Integer compNo,
            @ApiParam(value = "예약시간", required = true) @RequestParam("reserveDt") Date reserveDt, @ApiParam(hidden = true) Principal principal)
            throws Exception {
        PackageMaster packageMaster = packageService
                .findByPkgSeq(pkgSeq)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));
        try {
            // 예약
            issueDeskingService.reserve(packageMaster, compNo, principal.getName(), reserveDt);

            IssueDeskingHistCompDTO returnValue = issueDeskingService.findIssueDeskingHistBySaveComponent(packageMaster, compNo);

            // 결과리턴
            IssueDeskingHistCompDTO dto = modelMapper.map(returnValue, IssueDeskingHistCompDTO.class);
            ResultDTO<IssueDeskingHistCompDTO> resultDto = new ResultDTO<>(dto, msg("tps.issue.success.reserve"));

            tpsLogger.success(ActionType.INSERT);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO RESERVE ISSUE DESKING]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO RESERVE ISSUE DESKING]", e, true);
            throw new Exception(msg("tps.issue.error.reserve"), e);
        }
    }

    /**
     * 편집기사 예약 삭제
     *
     * @param pkgSeq    패키지 일련번호
     * @param compNo    컴포넌트순번
     * @param principal 작업자정보
     * @return
     * @throws Exception 오류
     */
    @ApiOperation(value = "편집기사 예약 삭제")
    @DeleteMapping("/{pkgSeq}/desking/{compNo}/reserve")
    public ResponseEntity<?> deleteReserveIssueDesking(@ApiParam(value = "패키지 일련번호", required = true) @PathVariable("pkgSeq") Long pkgSeq,
            @ApiParam(value = "컴포넌트순번", required = true) @PathVariable("compNo") Integer compNo, @ApiParam(hidden = true) Principal principal)
            throws Exception {
        PackageMaster packageMaster = packageService
                .findByPkgSeq(pkgSeq)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));
        try {
            // 예약삭제
            issueDeskingService.deleteReserve(packageMaster, compNo);

            IssueDeskingHistCompDTO returnValue = issueDeskingService.findIssueDeskingHistBySaveComponent(packageMaster, compNo);

            // 결과리턴
            IssueDeskingHistCompDTO dto = modelMapper.map(returnValue, IssueDeskingHistCompDTO.class);
            ResultDTO<IssueDeskingHistCompDTO> resultDto = new ResultDTO<>(dto, msg("tps.issue.success.delete-reserve"));

            tpsLogger.success(ActionType.INSERT);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO RESERVE ISSUE DESKING]", e);
            tpsLogger.error(ActionType.INSERT, "[FAIL TO RESERVE ISSUE DESKING]", e, true);
            throw new Exception(msg("tps.issue.error.delete-reserve"), e);
        }
    }

    @ApiOperation(value = "히스토리 조회(컴포넌트별)")
    @GetMapping("/{pkgSeq}/desking/{compNo}/histories")
    public ResponseEntity<?> getComponentHistoryList(@ApiParam(value = "패키지 일련번호", required = true) @PathVariable("pkgSeq") Long pkgSeq,
            @ApiParam(value = "컴포넌트순번", required = true) @PathVariable("compNo") Integer compNo,
            @Valid @SearchParam IssueDeskingHistGroupSearchDTO search)
            throws NoDataException, Exception {

        PackageMaster packageMaster = packageService
                .findByPkgSeq(pkgSeq)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        search.setPkgSeq(pkgSeq);
        search.setCompNo(compNo);

        try {
            // 그룹 데이터 조회(mybatis)
            List<IssueDeskingHistGroupVO> returnValue = issueDeskingService.findIssueDeskingHistGroupByComp(search);

            // 리턴 DTO 생성
            ResultListDTO<IssueDeskingHistGroupVO> resultList = new ResultListDTO<IssueDeskingHistGroupVO>();
            resultList.setList(returnValue);
            resultList.setTotalCnt(search.getTotal());

            ResultDTO<ResultListDTO<IssueDeskingHistGroupVO>> resultDTO = new ResultDTO<ResultListDTO<IssueDeskingHistGroupVO>>(resultList);
            tpsLogger.success(true);
            return new ResponseEntity<>(resultDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO LOAD ISSUE DESKING HIST ]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD ISSUE  DESKING HIST]", e, true);
            throw new Exception(msg("tps.issue.error.hist"), e);
        }
    }

    @ApiOperation(value = "히스토리 상세조회")
    @GetMapping("/{pkgSeq}/desking/{compNo}/histories/{regDt}")
    public ResponseEntity<?> getComponentHistory(@ApiParam(value = "패키지 일련번호", required = true) @PathVariable("pkgSeq") Long pkgSeq,
            @ApiParam(value = "컴포넌트순번", required = true) @PathVariable("compNo") Integer compNo,
            @ApiParam(value = "작업일자", required = true) @PathVariable("regDt") Date regDt,
            @ApiParam(value = "작업상태", defaultValue = "SAVE", required = true) @RequestParam("status") EditStatusCode status,
            @ApiParam(value = "승인여부", defaultValue = "N", required = true) @RequestParam("approvalYn") String approvalYn)
            throws NoDataException, Exception {

        PackageMaster packageMaster = packageService
                .findByPkgSeq(pkgSeq)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        IssueDeskingHistGroupSearchDTO search = IssueDeskingHistGroupSearchDTO
                .builder()
                .pkgSeq(pkgSeq)
                .compNo(compNo)
                .searchDt(regDt)
                .status(status)
                .approvalYn(approvalYn)
                .build();
        try {
            // 편집기사 목록 조회(mybatis)
            IssueDeskingHistCompDTO returnValue = issueDeskingService.findIssueDeskingHistByGroup(packageMaster, search);

            // 결과리턴
            IssueDeskingHistCompDTO dto = modelMapper.map(returnValue, IssueDeskingHistCompDTO.class);
            ResultDTO<IssueDeskingHistCompDTO> resultDto = new ResultDTO<>(dto);

            tpsLogger.success(ActionType.SELECT);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("[FAIL TO LOAD ISSUE DESKING HIST DETAIL]", e);
            tpsLogger.error(ActionType.SELECT, "[FAIL TO LOAD ISSUE  DESKING HIST DETAIL]", e, true);
            throw new Exception(msg("tps.issue.error.hist"), e);
        }
    }
}
