/**
 * msp-tps ScreenServiceImpl.java 2020. 5. 13. 오후 1:34:20 ssc
 */
package jmnet.moka.core.tps.mvc.desking.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.persistence.EntityManager;
import javax.transaction.Transactional;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpFile;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.code.EditStatusCode;
import jmnet.moka.core.tps.common.dto.HistPublishDTO;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.helper.UploadFileHelper;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.component.entity.ComponentHist;
import jmnet.moka.core.tps.mvc.component.service.ComponentHistService;
import jmnet.moka.core.tps.mvc.component.service.ComponentService;
import jmnet.moka.core.tps.mvc.dataset.entity.Dataset;
import jmnet.moka.core.tps.mvc.desking.dto.DeskingWorkDTO;
import jmnet.moka.core.tps.mvc.desking.dto.DeskingWorkSearchDTO;
import jmnet.moka.core.tps.mvc.desking.entity.ComponentWork;
import jmnet.moka.core.tps.mvc.desking.entity.Desking;
import jmnet.moka.core.tps.mvc.desking.entity.DeskingHist;
import jmnet.moka.core.tps.mvc.desking.entity.DeskingWork;
import jmnet.moka.core.tps.mvc.desking.mapper.ComponentWorkMapper;
import jmnet.moka.core.tps.mvc.desking.mapper.DeskingWorkMapper;
import jmnet.moka.core.tps.mvc.desking.repository.DeskingHistRepository;
import jmnet.moka.core.tps.mvc.desking.repository.DeskingRepository;
import jmnet.moka.core.tps.mvc.desking.repository.DeskingWorkRepository;
import jmnet.moka.core.tps.mvc.desking.vo.ComponentWorkVO;
import jmnet.moka.core.tps.mvc.desking.vo.DeskingWorkVO;
import jmnet.moka.core.tps.mvc.template.entity.Template;
import jmnet.moka.core.tps.mvc.template.service.TemplateService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * <pre>
 *
 * 2020. 5. 13. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 5. 13. 오후 1:34:20
 */
@Service
@Slf4j
public class DeskingServiceImpl implements DeskingService {
    @Autowired
    private DeskingRepository deskingRepository;

    @Autowired
    private DeskingHistRepository deskingHistRepository;

    @Autowired
    private DeskingWorkRepository deskingWorkRepository;

    @Autowired
    private ComponentWorkMapper componentWorkMapper;

    @Autowired
    private DeskingWorkMapper deskingWorkMapper;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private ComponentService componentService;

    @Autowired
    private ComponentHistService componentHistService;

    @Autowired
    private ComponentWorkService componentWorkService;

    @Autowired
    private TemplateService templateService;

    @Autowired
    private MessageByLocale messageByLocale;

    @Autowired
    private UploadFileHelper uploadFileHelper;

    private final EntityManager entityManager;

    @Value("${tps.desking.image.path}")
    private String deskingImagePath;

    @Autowired
    public DeskingServiceImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public boolean usedByDatasetSeq(Long datasetSeq) {
        //        Long deskingCnt = deskingRepository.countByDataset_DatasetSeq(datasetSeq);
        //        Long deskingHistCnt = deskingHistRepository.countByDataset_DatasetSeq(datasetSeq);
        //        Long deskingWorkCnt = deskingWorkRepository.countByDatasetSeq(datasetSeq);
        //
        //        Long cnt = deskingCnt + deskingHistCnt + deskingWorkCnt;
        //        return cnt > 0 ? true : false;
        return false;
    }

    public List<ComponentWorkVO> findAllComponentWork(DeskingWorkSearchDTO search) {

        // 1. 기존의 작업용 데이타(componentWork,deskingWork) 삭제
        // 2. 편집영역의 수동컴포넌트를 작업자용 컴포넌트로 일괄 등록
        // 3. 편집영역의 편집기사를 작업자용 편집기사로 일괄
        // 4. 조회
        List<List<Object>> listMap = componentWorkMapper.findAllComponentWork(search);

        // 컴포넌트에 관련기사정보 연결
        if (search.getReturnValue()
                  .intValue() > 0) {

            List<ComponentWorkVO> componentList = modelMapper.map(listMap.get(0), ComponentWorkVO.TYPE);
            List<DeskingWorkVO> deskingAllList = modelMapper.map(listMap.get(1), DeskingWorkVO.TYPE);

            if (componentList.size() > 0) {
                for (int i = 0; i < componentList.size(); i++) {
                    Long datasetSeq = componentList.get(i)
                                                   .getDatasetSeq();
                    Long componentSeq = componentList.get(i)
                                                     .getComponentSeq();
                    List<DeskingWorkVO> deskingList = deskingAllList.stream()
                                                                    .filter(d -> d.getDatasetSeq()
                                                                                  .equals(datasetSeq))
                                                                    .sorted((prev, next) -> {
                                                                        //정렬순서: contentOrd asc, relOrd asc
                                                                        if (prev.getContentOrd()
                                                                                .equals(next.getContentOrd())) {
                                                                            return (int) (long) (prev.getRelOrd() - next.getRelOrd());
                                                                        } else {
                                                                            return prev.getContentOrd() - next.getContentOrd();
                                                                        }
                                                                    })
                                                                    .collect(Collectors.toList());

                    // 편집기사에 관련기사정보 세팅(rel,relSeqs)
                    deskingList = updateRelArticle(deskingList);

                    // 편집기사에 componentSeq세팅
                    deskingList.stream()
                               .forEach(desking -> desking.setComponentSeq(componentSeq));

                    // 컴포넌트에 편집기사 연결
                    componentList.get(i)
                                 .setDeskingWorks(deskingList);
                }
            }

            return componentList;
        } else {
            return null;
        }
    }

    /**
     * 관련기사 정보 (rel,relSeqs) 및 컴포넌트SEQ(componentSeq) 세팅
     *
     * @param deskingList 관련기사목록
     * @return 관련기사 정보 세팅한(rel,relSeqs) 기사목록
     */
    private List<DeskingWorkVO> updateRelArticle(List<DeskingWorkVO> deskingList) {
        for (int idx = 0; idx < deskingList.size(); idx++) {
            if (deskingList.get(idx)
                           .getParentTotalId() != null && deskingList.get(idx)
                                                                     .getParentTotalId() > 0) {

                // 관련기사여부 설정
                deskingList.get(idx)
                           .setRel(true);
            } else {
                // 자식목록 설정
                Long parentTotalId = deskingList.get(idx)
                                                .getTotalId();
                List<Long> relSeqs = deskingList.stream()
                                                .filter(d -> d.getParentTotalId() == parentTotalId)
                                                .sorted(Comparator.comparingInt(DeskingWorkVO::getRelOrd))
                                                .map(DeskingWorkVO::getSeq)
                                                .collect(Collectors.toList());
                if (relSeqs.size() > 0) {
                    deskingList.get(idx)
                               .setRelSeqs(relSeqs);
                }
            }
        }
        return deskingList;
    }

    @Override
    public ComponentWorkVO findComponentWorkBySeq(Long seq, boolean includeDesking) {

        // 컴포넌트Work 조회(mybatis)
        ComponentWorkVO componentWorkVO = componentWorkMapper.findComponentWorkBySeq(seq);

        // 편집기사Work 조회(JPQL)
        if (componentWorkVO != null && includeDesking) {
            List<DeskingWorkVO> deskingVOList = this.findAllDeskingWork(componentWorkVO.getDatasetSeq(), componentWorkVO.getRegId());

            // 편집기사에 관련기사정보 세팅(rel,relSeqs)
            deskingVOList = updateRelArticle(deskingVOList);

            // 편집기사에 componentSeq세팅
            deskingVOList.stream()
                         .forEach(desking -> desking.setComponentSeq(componentWorkVO.getComponentSeq()));

            // 컴포넌트에 편집기사 연결
            componentWorkVO.setDeskingWorks(deskingVOList);
        }

        return componentWorkVO;
    }

    @Override
    public List<DeskingWorkVO> findAllDeskingWork(Long datasetSeq, String regId) {
        DeskingWorkSearchDTO search = DeskingWorkSearchDTO.builder()
                                                          .datasetSeq(datasetSeq)
                                                          .regId(regId)
                                                          .build();
        List<DeskingWork> deskingList = deskingWorkRepository.findAllDeskingWork(search);
        List<DeskingWorkVO> deskingVOList = modelMapper.map(deskingList, DeskingWorkVO.TYPE);

        // 편집기사에 관련기사정보 세팅 (rel,relSeqs)
        deskingVOList = updateRelArticle(deskingVOList);

        return deskingVOList;
    }

    @Override
    @Transactional
    public void save(ComponentWorkVO componentWorkVO, String regId)
            throws Exception {

        HistPublishDTO histPublishDTO = HistPublishDTO.builder()
                                                      .status(EditStatusCode.SAVE)
                                                      .approvalYn(MokaConstants.NO)
                                                      .build();

        // 컴포넌트 히스토리 추가
        ComponentHist componentHist = this.insertComponentHist(componentWorkVO, regId, histPublishDTO);

        // 편집기사 히스토리 추가
        insertDeskingHist(componentHist, componentWorkVO.getDeskingWorks(), regId);
    }


    @Override
    @Transactional
    public void publish(ComponentWorkVO componentWorkVO, String regId)
            throws Exception {

        HistPublishDTO histPublishDTO = HistPublishDTO.builder()
                                                      .status(EditStatusCode.PUBLISH)
                                                      .approvalYn(MokaConstants.YES)
                                                      .build();

        // 컴포넌트 수정
        Component component = updateComponent(componentWorkVO, regId, histPublishDTO);

        // 편집기사 등록
        updateDesking(component, componentWorkVO.getDeskingWorks(), regId, histPublishDTO);

    }

    @Override
    @Transactional
    public void reserve(ComponentWorkVO componentWorkVO, String regId, Date reserveDt)
            throws Exception {

        HistPublishDTO histPublishDTO = HistPublishDTO.builder()
                                                      .status(EditStatusCode.PUBLISH)
                                                      .approvalYn(MokaConstants.NO)
                                                      .reserveDt(reserveDt)
                                                      .build();

        // 컴포넌트 히스토리 추가
        ComponentHist componentHist = this.insertComponentHist(componentWorkVO, regId, histPublishDTO);

        // 편집기사 히스토리 추가
        insertDeskingHist(componentHist, componentWorkVO.getDeskingWorks(), regId);

    }

    @Override
    public ComponentHist insertComponentHist(ComponentWorkVO workVO, String regId, HistPublishDTO histPublishDTO)
            throws Exception {
        String messageC = messageByLocale.get("tps.common.error.no-data");
        Component component = componentService.findComponentBySeq(workVO.getComponentSeq())
                                              .orElseThrow(() -> new NoDataException(messageC));

        String messageT = messageByLocale.get("tps.common.error.no-data");
        Template template = templateService.findTemplateBySeq(workVO.getTemplateSeq())
                                           .orElseThrow(() -> new NoDataException(messageT));

        component.setSnapshotYn(workVO.getSnapshotYn());
        component.setSnapshotBody(workVO.getSnapshotBody());
        component.setTemplate(template);
        component.setPerPageCount(workVO.getPerPageCount());
        component.setViewYn(workVO.getViewYn());
        component.setZone(workVO.getZone());
        component.setMatchZone(workVO.getMatchZone());
        component.setModDt(McpDate.now());
        component.setModId(regId);

        ComponentHist componentHist = componentHistService.insertComponentHist(component, histPublishDTO);
        log.debug("[COMPONENT HISTORY INSERT] seq: {}", component.getComponentSeq());

        return componentHist;

    }

    @Override
    public Component updateComponent(ComponentWorkVO workVO, String regId, HistPublishDTO histPublishDTO)
            throws Exception {
        String messageC = messageByLocale.get("tps.common.error.no-data");
        Component component = componentService.findComponentBySeq(workVO.getComponentSeq())
                                              .orElseThrow(() -> new NoDataException(messageC));

        String messageT = messageByLocale.get("tps.common.error.no-data");
        Template template = templateService.findTemplateBySeq(workVO.getTemplateSeq())
                                           .orElseThrow(() -> new NoDataException(messageT));

        component.setSnapshotYn(workVO.getSnapshotYn());
        component.setSnapshotBody(workVO.getSnapshotBody());
        component.setTemplate(template);
        component.setPerPageCount(workVO.getPerPageCount());
        component.setViewYn(workVO.getViewYn());
        component.setZone(workVO.getZone());
        component.setMatchZone(workVO.getMatchZone());
        component.setModDt(McpDate.now());
        component.setModId(regId);

        return componentService.updateComponent(component, histPublishDTO);

    }

    @Override
    @Transactional
    public void insertDeskingHist(ComponentHist componentHist, List<DeskingWorkVO> deskingWorkList, String regId) {

        Long datasetSeq = componentHist.getDataset()
                                       .getDatasetSeq();
        Dataset dataset = componentHist.getDataset();
        Date sendDt = McpDate.now();   // 전송시간

        // 편집기사 히스토리 등록
        for (DeskingWorkVO deskingVO : deskingWorkList) {

            deskingVO.setDatasetSeq(datasetSeq);    // 데이타셋순번이 매칭이 안된 데이타가 있을경우 고려해서 세팅

            DeskingHist deskingHist = modelMapper.map(deskingVO, DeskingHist.class);
            deskingHist.setComponentHistSeq(componentHist.getSeq());    // 컴포넌트 히스토리와 연결
            deskingHist.setDeskingSeq(deskingVO.getDeskingSeq() == null
                                              ? deskingVO.getSeq()
                                              : deskingVO.getDeskingSeq());  // desking.deskingSeq = desking_work.seq로 설정?
            deskingHist.setDatasetSeq(dataset.getDatasetSeq());
            deskingHist.setRegDt(sendDt); // 전송시간
            deskingHist.setDeskingDt(deskingVO.getRegDt()); // 작업자의 편집시간.
            // wms_desking_work.create_ymdt ==
            // wms_desking.desking_ymdt
            deskingHist.setRegId(regId);  // 전송자
            deskingHist.setStatus(componentHist.getStatus());
            deskingHist.setApprovalYn(componentHist.getApprovalYn());
            deskingHist.setReserveDt(componentHist.getReserveDt());

            deskingHistRepository.save(deskingHist);
        }
    }

    @Override
    @Transactional
    public void updateDesking(Component component, List<DeskingWorkVO> deskingWorkList, String regId, HistPublishDTO histPublishDTO) {
        Long datasetSeq = component.getDataset()
                                   .getDatasetSeq();
        Dataset dataset = component.getDataset();
        Date sendDt = McpDate.now();   // 전송시간

        // 1. 기존 편집기사 삭제
        deskingRepository.deleteByDatasetSeq(datasetSeq);

        for (DeskingWorkVO deskingVO : deskingWorkList) {

            deskingVO.setDatasetSeq(datasetSeq);    // 데이타셋순번이 매칭이 안된 데이타가 있을경우 고려해서 세팅

            //2. 편집기사 등록
            Desking desking = modelMapper.map(deskingVO, Desking.class);
            desking.setDatasetSeq(dataset.getDatasetSeq());
            desking.setRegDt(sendDt); // 전송시간
            desking.setDeskingDt(deskingVO.getRegDt()); // 작업자의 편집시간.
            // wms_desking_work.create_ymdt ==
            // wms_desking.desking_ymdt
            desking.setRegId(regId);  // 전송자
            desking.setDeskingSeq(null); // 편집기사추가를 위해 null세팅

            Desking saveDesking = deskingRepository.save(desking);

            //3. 편집기사 히스토리등록
            DeskingHist deskingHist = modelMapper.map(deskingVO, DeskingHist.class);
            deskingHist.setComponentHistSeq(histPublishDTO.getSeq());    // 컴포넌트 히스토리와 연결
            deskingHist.setDatasetSeq(dataset.getDatasetSeq());
            deskingHist.setRegDt(sendDt); // 전송시간
            deskingHist.setDeskingDt(deskingVO.getRegDt()); // 작업자의 편집시간.
            // wms_desking_work.create_ymdt ==
            // wms_desking.desking_ymdt
            deskingHist.setRegId(regId);  // 전송자
            deskingHist.setDeskingSeq(saveDesking.getDeskingSeq()); // 편집기사Seq로 세팅
            deskingHist.setStatus(histPublishDTO.getStatus());
            deskingHist.setApprovalYn(histPublishDTO.getApprovalYn());
            deskingHist.setReserveDt(histPublishDTO.getReserveDt());

            deskingHistRepository.save(deskingHist);
        }
    }

    @Override
    public ComponentWork updateComponentWork(ComponentWorkVO workVO, String regId)
            throws Exception {
        return componentWorkService.updateComponentWork(workVO);
    }

    @Override
    public ComponentWork updateComponentWorkSnapshot(Long componentWorkSeq, String snapshotYn, String snapshotBody, String regId)
            throws NoDataException, Exception {
        return componentWorkService.updateComponentWorkSnapshot(componentWorkSeq, snapshotYn, snapshotBody, regId);
    }

    //    @Override
    //    @Transactional
    //    public void insertDeskingWork(DeskingWork appendDeskingWork, Long datasetSeq, String regId) {
    //        // 1. 편집기사work 등록
    //        appendDeskingWork.setDatasetSeq(datasetSeq);
    //        appendDeskingWork.setRegId(regId);
    //        appendDeskingWork.setRegDt(McpDate.now());
    //        DeskingWork saved = deskingWorkRepository.save(appendDeskingWork);
    //        Long appendSeq = saved.getSeq();  // seq -> deskingSeq로 등록
    //        if (saved.getDeskingSeq() == null) {
    //            saved.setDeskingSeq(appendSeq);
    //            deskingWorkRepository.save(saved);
    //        }
    //        log.debug("DESKING WORK APPEND seq: {}", appendSeq);
    //
    //        // 2. 편집기사work 조회(JPQL)
    //        DeskingWorkSearchDTO search = DeskingWorkSearchDTO.builder()
    //                                                          .datasetSeq(datasetSeq)
    //                                                          .regId(regId)
    //                                                          .build();
    //        List<DeskingWork> deskingList = deskingWorkRepository.findAllDeskingWork(search);
    //        List<DeskingWorkVO> deskingVOList = modelMapper.map(deskingList, DeskingWorkVO.TYPE); // DeskingWork -> DeskingWorkVO

    // 편집기사work 목록 정렬변경
    //        boolean rel = !(appendDeskingWork.getParentTotalId() == null);  // 관련기사 여부
    //        for (DeskingWorkVO deskingWorkVO : deskingVOList) {
    //            DeskingWork deskingWork = modelMapper.map(deskingWorkVO, DeskingWork.class);
    //            if (rel) {
    //                int appendRelOrd = appendDeskingWork.getRelOrd();    // 관련기사 추가된 순번
    //                int relOrd = deskingWork.getRelOrd();
    //                if (appendDeskingWork.getParentTotalId()
    //                                     .equals(deskingWork.getParentTotalId()) && !appendSeq.equals(deskingWork.getSeq()) && relOrd >= appendRelOrd) {
    //                    deskingWork.setRelOrd(relOrd + 1);
    //                    deskingWork.setRegDt(McpDate.now());
    //                    deskingWork.setRegId(regId);
    //                    deskingWorkRepository.save(deskingWork);
    //                    log.debug("DESKING WORK RELATION RESORT seq: {} contentOrd: {}", deskingWork.getSeq(), deskingWork.getContentOrd());
    //                }
    //            } else {
    //                int appendContentsOrd = appendDeskingWork.getContentOrd();    // 주기사 추가된 순번
    //                int contentsOrd = deskingWork.getContentOrd();
    //                if (contentsOrd >= appendContentsOrd && !appendSeq.equals(deskingWork.getSeq())) {
    //                    deskingWork.setContentOrd(contentsOrd + 1);
    //                    deskingWork.setRegDt(McpDate.now());
    //                    deskingWork.setRegId(regId);
    //                    deskingWorkRepository.save(deskingWork);
    //                    log.debug("DESKING WORK RESORT seq: {} contentOrd: {}", deskingWork.getSeq(), deskingWork.getContentOrd());
    //                }
    //            }
    //        }
    //    }

    @Override
    @Transactional
    public void insertDeskingWorkList(List<DeskingWorkDTO> insertdeskingList, Long datasetSeq, String regId) {
        // 1. 편집기사work 등록
        Integer maxContentOrd = 1;
        Integer maxRelOrd = 1;
        for (DeskingWorkDTO vo : insertdeskingList) {
            DeskingWork appendDeskingWork = modelMapper.map(vo, DeskingWork.class);
            appendDeskingWork.setDatasetSeq(datasetSeq);
            appendDeskingWork.setRegId(regId);
            appendDeskingWork.setRegDt(McpDate.now());
            DeskingWork saved = deskingWorkRepository.save(appendDeskingWork);
            Long appendSeq = saved.getSeq();  // seq -> deskingSeq로 등록
            if (saved.getDeskingSeq() == null) {
                saved.setDeskingSeq(appendSeq);
                deskingWorkRepository.save(saved);
            }
            maxContentOrd = appendDeskingWork.getContentOrd() > maxContentOrd ? appendDeskingWork.getContentOrd() : maxContentOrd;
            maxRelOrd = appendDeskingWork.getRelOrd() > maxRelOrd ? appendDeskingWork.getRelOrd() : maxRelOrd;

            log.debug("DESKING WORK APPEND seq: {}", appendSeq);
        }

        // 2. 편집기사work 조회(JPQL)
        DeskingWorkSearchDTO search = DeskingWorkSearchDTO.builder()
                                                          .datasetSeq(datasetSeq)
                                                          .regId(regId)
                                                          .build();
        List<DeskingWork> deskingList = deskingWorkRepository.findAllDeskingWork(search);
        List<DeskingWorkVO> deskingVOList = modelMapper.map(deskingList, DeskingWorkVO.TYPE); // DeskingWork -> DeskingWorkVO

        // 4. 순번조정 및 삭제
        resortDeskingWorkList(deskingVOList, deskingVOList, regId, maxContentOrd, maxRelOrd);
    }

    @Override
    @Transactional
    public void deleteDeskingWorkList(List<DeskingWorkVO> deleteDeksingList, Long datasetSeq, String regId) {

        // 1. 삭제된 순번목록 조회
        List<Long> deleteList = deleteDeksingList.stream()
                                                 .map(DeskingWorkVO::getSeq)
                                                 .collect(Collectors.toList());

        // 2. 원본 편집목록조회
        List<DeskingWorkVO> deskingVOList = this.findAllDeskingWork(datasetSeq, regId);

        // 3. 삭제할 기사 제거한 편집목록 생성
        for (DeskingWorkVO vo : deskingVOList) {
            if (deleteList.contains(vo.getSeq()) && vo.getRelSeqs() != null && vo.getRelSeqs()
                                                                                 .size() > 0) {   // 관련기사가 있는 주기사일 경우, 관련기사도 삭제
                deleteList.addAll(vo.getRelSeqs());
            }
        }
        List<DeskingWorkVO> filterList = deskingVOList.stream()
                                                      .filter(vo -> !deleteList.contains(vo.getSeq()))
                                                      .collect(Collectors.toList());

        // 4. 순번조정 및 삭제
        resortDeskingWorkList(deskingVOList, filterList, regId, 1, 1);
    }

    @Override
    @Transactional
    public void resortDeskingWorkList(List<DeskingWorkVO> deskingVOList, List<DeskingWorkVO> filterList, String regId, Integer maxContentOrd,
            Integer maxRelOrd) {

        // 1. 수정할 순번목록
        List<Long> updateList = new ArrayList<Long>();

        // 2. contentOrd 수정
        List<DeskingWorkVO> contentOrdList = new ArrayList<DeskingWorkVO>();
        Integer contentOrd = 0;
        boolean master = true; // 주기사
        for (DeskingWorkVO vo : filterList) {
            master = (vo.getParentTotalId() == null);

            // 주기사라면
            if (master) {
                contentOrd++;
            }

            // 주기사의 오더가 잘못됐다면
            if (!vo.getContentOrd()
                   .equals(contentOrd) && maxContentOrd > vo.getContentOrd()) {
                vo.setContentOrd(contentOrd);
                updateList.add(vo.getSeq());    // 순번수정
            }

            contentOrdList.add(vo);
        }

        // 3. relOrd 수정
        List<DeskingWorkVO> relOrdList = new ArrayList<DeskingWorkVO>();
        Integer relOrd = 1;
        boolean rel = false; // 관련기사
        Long prevParentTotalId = (long) 0; // 이전 부모키
        for (DeskingWorkVO vo : contentOrdList) {
            rel = !(vo.getParentTotalId() == null);

            // 같은 부모이고, 관련기사 순번이 안 맞을 경우
            if (vo.getParentTotalId() != null && vo.getParentTotalId()
                                                   .equals(prevParentTotalId) && !vo.getRelOrd()
                                                                                    .equals(relOrd) && maxRelOrd > vo.getRelOrd()) {
                vo.setRelOrd(relOrd);
                updateList.add(vo.getSeq());    // 순번수정
            }

            // 주기사라면
            if (!rel) {
                prevParentTotalId = vo.getTotalId();
                relOrd = 1;
            } else {
                relOrd++;
            }

            relOrdList.add(vo);
        }

        // 4. 디비수정
        for (DeskingWorkVO orgVO : deskingVOList) {
            DeskingWork deskingWork = modelMapper.map(orgVO, DeskingWork.class);
            Long orgSeq = deskingWork.getSeq();
            Optional<DeskingWorkVO> newVo = relOrdList.stream()
                                                      .filter(d -> d.getSeq()
                                                                    .equals(orgSeq))
                                                      .findFirst();
            if (newVo.isPresent()) {
                // contentOrd, relOrd가 다를 경우 업데이트
                if (updateList.contains(orgSeq)) {
                    deskingWork.setContentOrd(newVo.get()
                                                   .getContentOrd());
                    deskingWork.setRelOrd(newVo.get()
                                               .getRelOrd());
                    deskingWork.setRegDt(McpDate.now());
                    deskingWork.setRegId(regId);
                    deskingWorkRepository.save(deskingWork);
                    log.debug("resort seq: {} TotalId: {} parentTotalId : {} contentOrd: {}, relOrd: {} title: {} ", deskingWork.getSeq(),
                              deskingWork.getTotalId(), deskingWork.getParentTotalId(), deskingWork.getContentOrd(), deskingWork.getRelOrd(),
                              deskingWork.getTitle());
                }
            } else {
                // seq가 없다면, 삭제
                deskingWorkRepository.deleteById(orgSeq);
            }
        }
    }

    //    @Override
    //    public void sortDeskingWork(List<Long> deskingWorkSeqList, Long datasetSeq, String regId) {
    //        // 편집기사work 조회(JPQL)
    //        DeskingWorkSearchDTO search = DeskingWorkSearchDTO.builder()
    //                                                          .datasetSeq(datasetSeq)
    //                                                          .regId(regId)
    //                                                          .build();
    //        List<DeskingWork> deskingList = deskingWorkRepository.findAllDeskingWork(search);
    //        List<DeskingWorkVO> deskingVOList = modelMapper.map(deskingList, DeskingWorkVO.TYPE); // DeskingWork -> DeskingWorkVO
    //
    //        // 주기사 오더링
    //        Integer ordering = 1;
    //        for (DeskingWorkVO deskingWorkVO : deskingVOList) {
    //            boolean rel = !(deskingWorkVO.getParentTotalId() == null);  // 관련기사 여부
    //            DeskingWork deskingWork = modelMapper.map(deskingWorkVO, DeskingWork.class);
    //
    //            // 주기사
    //            if (!rel) {
    //                // 원본오더가 변경할 오더와 다르다면 => 오더 수정.
    //                if (!ordering.equals(deskingWork.getContentOrd())) {
    //                    deskingWork.setContentOrd(ordering);
    //                    deskingWork.setRegDt(McpDate.now());
    //                    deskingWork.setRegId(regId);
    //                    deskingWorkRepository.save(deskingWork);
    //                }
    //                ordering++;
    //            }
    //        }
    //
    //        //관련기사 오더링
    //        ordering = 1;
    //        Long prevParentTotalId = (long) 0;
    //        for (DeskingWorkVO deskingWorkVO : deskingVOList) {
    //            boolean rel = !(deskingWorkVO.getParentTotalId() == null);  // 관련기사 여부
    //            Long seq = deskingWorkVO.getSeq();
    //            DeskingWork deskingWork = modelMapper.map(deskingWorkVO, DeskingWork.class);
    //
    //            // 관련기사
    //            if (rel) {
    //                // 같은 부모이고, 관련기사 순번이 안 맞을 경우
    //                if (deskingWork.getParentTotalId()
    //                               .equals(prevParentTotalId) && !deskingWork.getRelOrd()
    //                                                                        .equals(ordering)) {
    //                    deskingWork.setRelOrd(ordering);
    //                    deskingWork.setRegDt(McpDate.now());
    //                    deskingWork.setRegId(regId);
    //                    deskingWorkRepository.save(deskingWork);
    //                }
    //                ordering++;
    //            } else {
    //                ordering = 1;
    //                prevParentTotalId = deskingWork.getTotalId();
    //            }
    //        }
    //    }

    //    @Override
    //    public void sortBeforeDeleteDeskingWork(List<Long> deskingWorkSeqList, Long datasetSeq, String regId) {
    //        // 편집기사work 조회(JPQL)
    //        DeskingWorkSearchDTO search = DeskingWorkSearchDTO.builder()
    //                                                          .datasetSeq(datasetSeq)
    //                                                          .regId(regId)
    //                                                          .build();
    //        List<DeskingWork> deskingList = deskingWorkRepository.findAllDeskingWork(search);
    //        List<DeskingWorkVO> deskingVOList = modelMapper.map(deskingList, DeskingWorkVO.TYPE); // DeskingWork -> DeskingWorkVO
    //
    //        // 주기사 오더링
    //        Integer ordering = 1;
    //        for (DeskingWorkVO deskingWorkVO : deskingVOList) {
    //            boolean rel = !(deskingWorkVO.getParentTotalId() == null);  // 관련기사 여부
    //            Long seq = deskingWorkVO.getSeq();
    //            DeskingWork deskingWork = modelMapper.map(deskingWorkVO, DeskingWork.class);
    //
    //            // 주기사 이면서, 삭제된 목록이 아니고,
    //            if (!rel && !deskingWorkSeqList.contains(seq)) {
    //                // 원본오더가 변경할 오더와 다르다면 => 오더 수정.
    //                if (!ordering.equals(deskingWork.getContentOrd())) {
    //                    deskingWork.setContentOrd(ordering);
    //                    deskingWork.setRegDt(McpDate.now());
    //                    deskingWork.setRegId(regId);
    //                    deskingWorkRepository.save(deskingWork);
    //                }
    //                ordering++;
    //            }
    //        }
    //
    //        // 관련기사 오더링
    ////        ordering = 1;
    ////        for (DeskingWorkVO deskingWorkVO : deskingVOList) {
    ////            boolean rel = !(deskingWorkVO.getParentTotalId() == null);  // 관련기사 여부
    ////            Long seq = deskingWorkVO.getSeq();
    ////            DeskingWork deskingWork = modelMapper.map(deskingWorkVO, DeskingWork.class);
    ////
    ////            // 주기사 이면서, 삭제된 목록이 아니고,
    ////            if (rel && !deskingWorkSeqList.contains(seq)) {
    ////                // 원본오더가 변경할 오더와 다르다면 => 오더 수정.
    ////                if (!ordering.equals(deskingWork.getContentOrd())) {
    ////                    deskingWork.setContentOrd(ordering);
    ////                    deskingWork.setRegDt(McpDate.now());
    ////                    deskingWork.setRegId(regId);
    ////                    deskingWorkRepository.save(deskingWork);
    ////                }
    ////                ordering++;
    ////            }
    ////        }
    //
    //    }



    @Override
    public List<DeskingWorkVO> updateDeskingWorkPriority(Long datasetSeq, List<DeskingWorkVO> deskingWorks, String regId,
            DeskingWorkSearchDTO search) {
        for (DeskingWorkVO deskingWorkVO : deskingWorks) {
            DeskingWork deskingWork = modelMapper.map(deskingWorkVO, DeskingWork.class);
            if (deskingWork.getDatasetSeq() == null) {
                deskingWork.setDatasetSeq(datasetSeq);
            }
            if (deskingWork.getDeskingSeq() != null) {
                deskingWork.setRegDt(McpDate.now());
                deskingWork.setRegId(regId);
                deskingWorkRepository.save(deskingWork);
            }
        }
        List<DeskingWork> deskingList = deskingWorkRepository.findAllDeskingWork(search);
        List<DeskingWorkVO> deskingVOList = modelMapper.map(deskingList, DeskingWorkVO.TYPE); // DeskingWork -> DeskingWorkVO
        return deskingVOList;
    }

    @Override
    public void moveDeskingWork(DeskingWorkDTO deskingWork, Long tgtDatasetSeq, Long srcDatasetSeq, Long editionSeq, String creator) {
        List<DeskingWorkDTO> deskingWorkDTOList = new ArrayList<DeskingWorkDTO>();
        deskingWorkDTOList.add(deskingWork);

        insertDeskingWorkList(deskingWorkDTOList, tgtDatasetSeq, creator);

    }

    //    @Override
    //    public List<Desking> hasOtherSaved(Long datasetSeq, int interval, String creator) {
    //
    //        java.util.Date dt = McpDate.minuteMinus(new Date(), interval);
    //        return deskingRepository.findByOtherCreator(datasetSeq, McpDate.dateTimeStr(dt), creator);
    //    }

    @Override
    @Transactional
    public DeskingWork updateDeskingWork(DeskingWork deskingWork) {
        return deskingWorkRepository.save(deskingWork);
    }

    @Override
    @Transactional
    public DeskingHist updateDeskingHist(DeskingHist deskingHist) {
        DeskingHist result = deskingHistRepository.save(deskingHist);
        entityManager.flush();
        return result;
    }


    @Override
    public Optional<DeskingWork> findDeskingWorkBySeq(Long seq) {
        return deskingWorkRepository.findById(seq);
    }

    @Override
    public String saveDeskingWorkImage(DeskingWork deskingWork, MultipartFile thumbnail)
            throws Exception {
        String extension = McpFile.getExtension(thumbnail.getOriginalFilename())
                                  .toLowerCase();

        // 볼륨 패스를 가져오기 위해 도메인을 찾는다
        // 데이터셋을 쓰는 컴포넌트 찾기 -> 도메인 가져오기
        Component component = componentService.findComponentByDataTypeAndDataset_DatasetSeq(TpsConstants.DATATYPE_DESK, deskingWork.getDatasetSeq())
                                              .orElseThrow(() -> new NoDataException(messageByLocale.get("tps.common.error.no-data")));
        //        String volumeId = component.getDomain().getVolumeId();
        //        Volume volume = volumeService.findVolume(volumeId).orElseThrow(
        //                () -> new NoDataException(messageByLocale.get("tps.volume.error.noContent")));

        // 파일명 생성
        String nowTime = McpDate.nowStr();
        String[] fileNames = {deskingWork.getTotalId().toString(), String.valueOf(deskingWork.getDatasetSeq()), nowTime};
        String fileName = String.join("_", fileNames) + "." + extension;

        // 경로 생성
        String[] paths = {"crop", nowTime.substring(0, 4), nowTime.substring(4, 6), nowTime.substring(6, 8), fileName};
        String returnPath = String.join("/", paths);
        String realPath = uploadFileHelper.getRealPath(deskingImagePath, returnPath);

        // 파일 저장
        if (uploadFileHelper.saveFile(realPath, thumbnail)) {
            log.debug("Save desking work thumbnail");
            return returnPath;
        }

        return "";
    }

    //    @Override
    //    public List<DeskingHistGroupVO> findDeskingHistGroup(DeskingHistSearchDTO search) {
    //        return deskingWorkMapper.findHistGroup(search,
    //                getRowBounds(search.getPage(), search.getSize()));
    //    }
    //
    //    @Override
    //    public Long countByHistGroup(DeskingHistSearchDTO search) {
    //        return deskingWorkMapper.countByHistGroup(search);
    //    }
    //
    //    @Override
    //    public List<EditionVO> getEditionList(Long pageSeq) {
    //        return componentWorkMapper.findEditionAll(pageSeq);
    //    }
    //
    //    @Override
    //    public List<DeskingHistVO> findDeskingHistDetail(DeskingHistSearchDTO search) {
    //        return deskingWorkMapper.findHistDetail(search);
    //    }
    //
    //    @Override
    //    public List<DeskingHistGroupVO> findAllDeskingHistGroup(DeskingHistSearchDTO search,
    //            Long pageSeq) {
    //
    //        // 데이터셋이 포함된 히스토리들
    //        List<DeskingHistGroupVO> groups = deskingWorkMapper.findAllHistGroup(search,
    //                getRowBounds(search.getPage(), search.getSize()));
    //        return groups;
    //    }
    //
    //    @Override
    //    public void importDeskingWorkHistory(DeskingHistSearchDTO search) {
    //        // desking rel work 삭제
    //        deskingRelWorkRepository.deleteByDatasetSeq(search.getDatasetSeq(), search.getCreator());
    //
    //        // desking work 삭제
    //        deskingWorkRepository.deleteByDatasetSeq(search.getDatasetSeq(), search.getCreator());
    //
    //        // 등록
    //        deskingWorkMapper.importDeskingWorkFromHist(search);
    //        deskingWorkMapper.importDeskingRelWorkFromHist(search);
    //    }

}


