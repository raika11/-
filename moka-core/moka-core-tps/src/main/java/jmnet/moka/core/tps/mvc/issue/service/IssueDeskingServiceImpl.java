/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.issue.service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.code.EditStatusCode;
import jmnet.moka.core.tps.common.util.ArticleEscapeUtil;
import jmnet.moka.core.tps.mvc.issue.dto.IssueDeskingComponentDTO;
import jmnet.moka.core.tps.mvc.issue.dto.IssueDeskingHistDTO;
import jmnet.moka.core.tps.mvc.issue.entity.IssueDesking;
import jmnet.moka.core.tps.mvc.issue.entity.IssueDeskingHist;
import jmnet.moka.core.tps.mvc.issue.entity.PackageMaster;
import jmnet.moka.core.tps.mvc.issue.mapper.IssueMapper;
import jmnet.moka.core.tps.mvc.issue.repository.IssueDeskingHistRepository;
import jmnet.moka.core.tps.mvc.issue.repository.IssueDeskingRepository;
import jmnet.moka.core.tps.mvc.issue.repository.PackageRepository;
import jmnet.moka.core.tps.mvc.issue.vo.IssueDeskingVO;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2021-04-13
 */
@Service
@Slf4j
public class IssueDeskingServiceImpl implements IssueDeskingService {

    private final IssueMapper issueMapper;

    private final IssueDeskingRepository issueDeskingRepository;

    private final IssueDeskingHistRepository issueDeskingHistRepository;

    private final ModelMapper modelMapper;

    private final PackageRepository packageRepository;

    @Value("${package.compYn}")
    private String packageCompYn;

    private final int AUTO_COMPONENT_NO = 2;

    public IssueDeskingServiceImpl(IssueMapper issueMapper, IssueDeskingRepository issueDeskingRepository,
            IssueDeskingHistRepository issueDeskingHistRepository, ModelMapper modelMapper, PackageRepository packageRepository) {
        this.issueMapper = issueMapper;
        this.issueDeskingRepository = issueDeskingRepository;
        this.issueDeskingHistRepository = issueDeskingHistRepository;
        this.modelMapper = modelMapper;
        this.packageRepository = packageRepository;
    }

    @Override
    public List<IssueDeskingComponentDTO> findAllIssueDesking(PackageMaster packageMaster) {
        Map<String, Object> param = new HashMap<>();
        param.put("pkgSeq", packageMaster.getPkgSeq());
        param.put("compNo", null);
        param.put("status", EditStatusCode.SAVE.getCode());
        List<List<Object>> listMap = issueMapper.findAllIssueDesking(param);

        List<IssueDeskingComponentDTO> returnList = null;
        if (listMap.get(0) != null) {
            returnList = modelMapper.map(listMap.get(0), IssueDeskingComponentDTO.TYPE);
        }
        resetComponentList(returnList, packageMaster);

        if (listMap.get(1) != null) {
            List<IssueDeskingVO> deskingList = modelMapper.map(listMap.get(1), IssueDeskingVO.TYPE);
            for (IssueDeskingVO desking : deskingList) {
                //1. 컴포넌트 찾기
                IssueDeskingComponentDTO componentDTO = returnList
                        .stream()
                        .filter(c -> c.getCompNo() == desking.getCompNo())
                        .findFirst()
                        .orElse(new IssueDeskingComponentDTO());

                //2. 컴포넌트에 편집정보 추가
                componentDTO.appendDesking(modelMapper.map(desking, IssueDeskingHistDTO.class));
            }
        }

        return returnList;
    }

    /**
     * 컴포넌트별로 compYn,compNo,pkgSeq를 패키지정보에서 읽어와서 없는 컴포넌트 추가
     *
     * @param issueDeskings 컴포넌트목록
     * @param packageMaster 패키지정보
     */
    private void resetComponentList(List<IssueDeskingComponentDTO> issueDeskings, PackageMaster packageMaster) {

        String pakcageCompYn = packageCompYn; //McpString.defaultValue(packageMaster.getCompYn(), packageCompYn);

        if (McpString.isNotEmpty(pakcageCompYn)) {
            for (int i = 0; i < pakcageCompYn.length(); i++) {
                String yn = String.valueOf(pakcageCompYn.charAt(i));
                int compNo = i + 1;
                IssueDeskingComponentDTO dto = IssueDeskingComponentDTO
                        .builder()
                        .viewYn(yn)
                        .compNo(compNo)
                        .pkgSeq(packageMaster.getPkgSeq())
                        .build();
                boolean isFind = issueDeskings
                        .stream()
                        .filter(d -> d.getCompNo() == (compNo))
                        .findFirst()
                        .isPresent();
                if (!isFind) {
                    issueDeskings.add(dto);
                }
            }
        }
    }

    @Override
    public IssueDeskingComponentDTO findIssueDeskingComponent(PackageMaster packageMaster, Integer compNo) {
        IssueDeskingComponentDTO dto = IssueDeskingComponentDTO
                .builder()
                .pkgSeq(packageMaster.getPkgSeq())
                .compNo(compNo)
                .viewYn(getCompYn(compNo, packageMaster.getCompYn()))
                .build();

        Map<String, Object> param = new HashMap<>();
        param.put("pkgSeq", packageMaster.getPkgSeq());
        param.put("compNo", compNo);
        param.put("status", EditStatusCode.SAVE.getCode());
        List<List<Object>> listMap = issueMapper.findAllIssueDesking(param);

        //컴포넌트
        if (listMap.get(0) != null && listMap
                .get(0)
                .size() > 0) {
            dto = modelMapper.map(listMap
                    .get(0)
                    .get(0), IssueDeskingComponentDTO.class);
        }

        //편집정보
        if (listMap.get(1) != null) {
            dto.setIssueDeskings(modelMapper.map(listMap.get(1), IssueDeskingHistDTO.TYPE));
        }

        return dto;
    }

    /**
     * 해당컴포넌트순번의 노출여부 조회
     *
     * @param compNo        컴포넌트순번
     * @param pakcageCompYn 노출여부
     * @return 노출여부
     */
    private String getCompYn(Integer compNo, String pakcageCompYn) {
        String retStr = MokaConstants.NO;
        if (compNo > 0) {
            if (McpString.isNotEmpty(pakcageCompYn)) {
                if (pakcageCompYn.length() <= compNo) {
                    retStr = String.valueOf(pakcageCompYn.charAt(compNo - 1));
                }
            } else {
                retStr = String.valueOf(packageCompYn.charAt(compNo - 1));
            }
        }
        return retStr;
    }

    @Override
    @Transactional
    public void save(PackageMaster packageMaster, IssueDeskingComponentDTO issueDeskingComponentDTO, String regId) {

        //편집기사가 없는경우, hist에 임시저장을 위한 빈데이타를 넣는다.
        //노출상태로 임시저장할 수 없다.(front에서 제어)
        //만약, 노출로 편집정보없이 임시저장할경우, hist에는 노출됐다는 정보를 기억할 수 없게된다.
        //       그래서, 현재는 편집정보가 없으면 무조건 가짜 편집정보를 넣도록 코딩함.
        if (issueDeskingComponentDTO.getIssueDeskings() == null || issueDeskingComponentDTO
                .getIssueDeskings()
                .size() <= 0) {
            IssueDeskingHistDTO dto = IssueDeskingHistDTO
                    .builder()
                    .pkgSeq(issueDeskingComponentDTO.getPkgSeq())
                    .compNo(issueDeskingComponentDTO.getCompNo())
                    .viewYn(issueDeskingComponentDTO.getViewYn())
                    .build();
            issueDeskingComponentDTO.appendDesking(dto);
        }

        // 히스토리등록
        this.insertDeskingHist(packageMaster, issueDeskingComponentDTO, regId, EditStatusCode.SAVE);
    }

    @Override
    @Transactional
    public void publish(PackageMaster packageMaster, Integer compNo, String regId) {

        IssueDeskingComponentDTO issueDeskingComponentDTO = findIssueDeskingComponent(packageMaster, compNo);

        // 히스토리등록
        this.insertDeskingHist(packageMaster, issueDeskingComponentDTO, regId, EditStatusCode.PUBLISH);

        // 등록
        this.insertDesking(packageMaster, issueDeskingComponentDTO);
    }

    @Override
    public void insertAutoComponentDeskingHist(PackageMaster packageMaster, String regId) {
        // 기존데이타삭제
        issueDeskingHistRepository.deleteByPackageMaster_PkgSeqAndCompNo(packageMaster.getPkgSeq(), AUTO_COMPONENT_NO);

        // 히스토리등록
        String viewYn = getCompYn(AUTO_COMPONENT_NO, packageMaster.getCompYn());
        IssueDeskingComponentDTO issueDeskingComponentDTO = IssueDeskingComponentDTO
                .builder()
                .pkgSeq(packageMaster.getPkgSeq())
                .compNo(AUTO_COMPONENT_NO)
                .viewYn(viewYn)
                .build();
        this.insertDeskingHist(packageMaster, issueDeskingComponentDTO, regId, EditStatusCode.SAVE);
        this.insertDeskingHist(packageMaster, issueDeskingComponentDTO, regId, EditStatusCode.PUBLISH);
    }

    @Override
    public void escapeHtml(IssueDeskingHistDTO dto) {
        if (McpString.isNotEmpty(dto.getTitle())) {
            dto.setTitle(ArticleEscapeUtil.htmlEscape(dto.getTitle()));
        }

        if (McpString.isNotEmpty(dto.getBodyHead())) {
            dto.setBodyHead(ArticleEscapeUtil.htmlEscape(dto.getBodyHead()));
        }
    }

    private void insertDesking(PackageMaster packageMaster, IssueDeskingComponentDTO issueDeskingComponentDTO) {
        // 기존 편집기사 삭제
        issueDeskingRepository.deleteByPackageMaster_PkgSeqAndCompNo(issueDeskingComponentDTO.getPkgSeq(), issueDeskingComponentDTO.getCompNo());

        // 새로운 편집기사 등록
        for (IssueDeskingHistDTO dto : issueDeskingComponentDTO.getIssueDeskings()) {
            IssueDesking desking = modelMapper.map(dto, IssueDesking.class);
            desking.setSeqNo(null);
            desking.setPackageMaster(packageMaster);
            issueDeskingRepository.save(desking);
        }

        // PackageMaster.compYn수정
        String compYn = McpString.defaultValue(packageCompYn, packageMaster.getCompYn());
        int compNo = issueDeskingComponentDTO.getCompNo();
        if (compYn.length() >= compNo) {
            // 정해진 컴포넌트번호중에서 노출여부 수정한 경우
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < compYn.length(); i++) {
                builder.append(String.valueOf(compYn.charAt(i)));
            }
            builder.replace(compNo - 1, compNo, issueDeskingComponentDTO.getViewYn());
            compYn = builder.toString();
        } else {
            // 정해진 컴포넌트번호에서 추가된 컴포넌트가 생긴경우는, 마지막에 붙인다.
            compYn = compYn + issueDeskingComponentDTO.getViewYn();
        }
        packageMaster.setCompYn(compYn);
        packageRepository.save(packageMaster);
    }

    private void insertDeskingHist(PackageMaster packageMaster, IssueDeskingComponentDTO issueDeskingComponentDTO, String regId,
            EditStatusCode status) {
        if (issueDeskingComponentDTO.getIssueDeskings() != null && issueDeskingComponentDTO
                .getIssueDeskings()
                .size() > 0) {
            Date today = new Date();   // 히스토리 등록시, 컴포넌트별 등록시간을 동일한 값으로 넣도록 한다.
            for (IssueDeskingHistDTO dto : issueDeskingComponentDTO.getIssueDeskings()) {
                IssueDeskingHist hist = modelMapper.map(dto, IssueDeskingHist.class);
                hist.setSeqNo(null);
                hist.setPackageMaster(packageMaster);
                hist.setStatus(status.getCode());
                if (regId != null) {
                    hist.setRegId(regId);
                }
                hist.setRegDt(today);
                issueDeskingHistRepository.save(hist);
            }
        }
    }

}
