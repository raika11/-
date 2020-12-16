/**
 * msp-tps ScreenServiceImpl.java 2020. 5. 13. 오후 1:34:20 ssc
 */
package jmnet.moka.core.tps.mvc.desking.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.persistence.EntityManager;
import javax.transaction.Transactional;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpFile;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.ftp.FtpHelper;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.code.EditStatusCode;
import jmnet.moka.core.tps.common.dto.HistPublishDTO;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.helper.UploadFileHelper;
import jmnet.moka.core.tps.mvc.area.entity.Area;
import jmnet.moka.core.tps.mvc.area.service.AreaService;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.component.entity.ComponentHist;
import jmnet.moka.core.tps.mvc.component.service.ComponentHistService;
import jmnet.moka.core.tps.mvc.component.service.ComponentService;
import jmnet.moka.core.tps.mvc.dataset.entity.Dataset;
import jmnet.moka.core.tps.mvc.desking.dto.DeskingHistSearchDTO;
import jmnet.moka.core.tps.mvc.desking.dto.DeskingOrdDTO;
import jmnet.moka.core.tps.mvc.desking.dto.DeskingWorkDTO;
import jmnet.moka.core.tps.mvc.desking.dto.DeskingWorkSearchDTO;
import jmnet.moka.core.tps.mvc.desking.entity.ComponentWork;
import jmnet.moka.core.tps.mvc.desking.entity.Desking;
import jmnet.moka.core.tps.mvc.desking.entity.DeskingHist;
import jmnet.moka.core.tps.mvc.desking.entity.DeskingWork;
import jmnet.moka.core.tps.mvc.desking.mapper.ComponentWorkMapper;
import jmnet.moka.core.tps.mvc.desking.mapper.DeskingMapper;
import jmnet.moka.core.tps.mvc.desking.repository.DeskingHistRepository;
import jmnet.moka.core.tps.mvc.desking.repository.DeskingRepository;
import jmnet.moka.core.tps.mvc.desking.repository.DeskingWorkRepository;
import jmnet.moka.core.tps.mvc.desking.vo.ComponentHistVO;
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
    private DeskingMapper deskingMapper;

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
    private AreaService areaService;

    @Autowired
    private FtpHelper ftpHelper;

    @Value("${wimage.url}")
    private String wimageUrl;

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
        if (search
                .getReturnValue()
                .intValue() > 0 && listMap.size() >= 2) {

            List<ComponentWorkVO> componentList = modelMapper.map(listMap.get(0), ComponentWorkVO.TYPE);
            List<DeskingWorkVO> deskingAllList = modelMapper.map(listMap.get(1), DeskingWorkVO.TYPE);

            if (componentList.size() > 0) {
                for (int i = 0; i < componentList.size(); i++) {
                    Long datasetSeq = componentList
                            .get(i)
                            .getDatasetSeq();
                    Long componentSeq = componentList
                            .get(i)
                            .getComponentSeq();
                    List<DeskingWorkVO> deskingList = deskingAllList
                            .stream()
                            .filter(d -> d
                                    .getDatasetSeq()
                                    .equals(datasetSeq))
                            .sorted((prev, next) -> {
                                //정렬순서: contentOrd asc, relOrd asc
                                if (prev
                                        .getContentOrd()
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
                    deskingList
                            .stream()
                            .forEach(desking -> desking.setComponentSeq(componentSeq));

                    // 컴포넌트에 편집기사 연결
                    componentList
                            .get(i)
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
            String parentContentId = deskingList
                    .get(idx)
                    .getParentContentId();
            if (McpString.isNotEmpty(parentContentId)) {

                // 관련기사여부 설정
                deskingList
                        .get(idx)
                        .setRel(true);
            } else {
                // 자식목록 설정
                String thisContentId = deskingList
                        .get(idx)
                        .getContentId();
                List<Long> relSeqs = deskingList
                        .stream()
                        .filter(d -> d.getParentContentId() != null && thisContentId.equals(d.getParentContentId()))
                        .sorted(Comparator.comparingInt(DeskingWorkVO::getRelOrd))
                        .map(DeskingWorkVO::getSeq)
                        .collect(Collectors.toList());
                if (relSeqs.size() > 0) {
                    deskingList
                            .get(idx)
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
            deskingVOList
                    .stream()
                    .forEach(desking -> desking.setComponentSeq(componentWorkVO.getComponentSeq()));

            // 컴포넌트에 편집기사 연결
            componentWorkVO.setDeskingWorks(deskingVOList);
        }

        return componentWorkVO;
    }

    @Override
    public List<DeskingWorkVO> findAllDeskingWork(Long datasetSeq, String regId) {
        DeskingWorkSearchDTO search = DeskingWorkSearchDTO
                .builder()
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
    public void save(ComponentWorkVO componentWorkVO, String regId, Long templateSeq)
            throws Exception {

        HistPublishDTO histPublishDTO = HistPublishDTO
                .builder()
                .status(EditStatusCode.SAVE)
                .approvalYn(MokaConstants.NO)
                .build();

        // 컴포넌트 히스토리만 추가
        ComponentHist componentHist = this.insertComponentHist(componentWorkVO, regId, histPublishDTO, templateSeq);

        // 편집기사 히스토리 추가
        insertDeskingHist(componentHist, componentWorkVO.getDeskingWorks(), regId);
    }


    @Override
    @Transactional
    public void publish(ComponentWorkVO componentWorkVO, String regId, Long templateSeq)
            throws Exception {

        HistPublishDTO histPublishDTO = HistPublishDTO
                .builder()
                .status(EditStatusCode.PUBLISH)
                .approvalYn(MokaConstants.YES)
                .build();

        // 컴포넌트 수정
        Component component = this.updateComponent(componentWorkVO, regId, histPublishDTO, templateSeq);

        // 편집기사 등록
        updateDesking(component, componentWorkVO.getDeskingWorks(), regId, histPublishDTO);

    }

    @Override
    @Transactional
    public void reserve(ComponentWorkVO componentWorkVO, String regId, Date reserveDt, Long templateSeq)
            throws Exception {

        HistPublishDTO histPublishDTO = HistPublishDTO
                .builder()
                .status(EditStatusCode.PUBLISH)
                .approvalYn(MokaConstants.NO)
                .reserveDt(reserveDt)
                .build();

        // 기존예약 삭제
        deleteReserveHist(componentWorkVO);

        // 컴포넌트 히스토리만 추가
        ComponentHist componentHist = this.insertComponentHist(componentWorkVO, regId, histPublishDTO, templateSeq);

        // 편집기사 히스토리 추가
        insertDeskingHist(componentHist, componentWorkVO.getDeskingWorks(), regId);

    }

    private void deleteReserveHist(ComponentWorkVO workVO)
            throws Exception {
        // 예약 편집기사 삭제
        Map<String, Object> paramMap = new HashMap<String, Object>();
        Integer returnValue = TpsConstants.PROCEDURE_SUCCESS;
        paramMap.put("datasetSeq", workVO.getDatasetSeq());
        paramMap.put("returnValue", returnValue);
        deskingMapper.deleteByReserveDatasetSeq(paramMap);
        if ((int) paramMap.get("returnValue") < 0) {
            log.debug("DELETE FAIL RESERVE DATASET : {} ", returnValue);
            throw new Exception("Failed to delete RESERVE DATASET error code: " + returnValue);
        }

        // 예약 컴포넌트 삭제제
        componentHistService.deleteByReserveComponentSeq(workVO.getComponentSeq());
    }

    @Override
    @Transactional
    public void deleteReserve(ComponentWorkVO componentWorkVO)
            throws Exception {
        // 기존예약 삭제
        deleteReserveHist(componentWorkVO);
    }

    //    @Override
    //    public boolean existReserve(ComponentWorkVO workVO) {
    //        // 컴포넌트 히스토리 예약여부
    //        boolean exist = componentHistService.existsReserveComponentSeq(workVO.getComponentSeq());
    //        if (!exist) {
    //            exist = deskingHistRepository.existsReserveDatasetSeq(workVO.getDatasetSeq());
    //        }
    //        return exist;
    //    }

    @Override
    public ComponentHist insertComponentHist(ComponentWorkVO workVO, String regId, HistPublishDTO histPublishDTO, Long templateSeq)
            throws Exception {
        String messageC = messageByLocale.get("tps.common.error.no-data");
        Component component = componentService
                .findComponentBySeq(workVO.getComponentSeq())
                .orElseThrow(() -> new NoDataException(messageC));

        if (templateSeq != null) {
            String messageT = messageByLocale.get("tps.common.error.no-data");
            Template template = templateService
                    .findTemplateBySeq(workVO.getTemplateSeq())
                    .orElseThrow(() -> new NoDataException(messageT));
            component.setTemplate(template);
        }

        component.setSnapshotYn(workVO.getSnapshotYn());
        component.setSnapshotBody(workVO.getSnapshotBody());

        component.setPerPageCount(workVO.getPerPageCount());
        component.setViewYn(workVO.getViewYn());
        //        component.setZone(workVO.getZone());
        //        component.setMatchZone(workVO.getMatchZone());
        component.setModDt(McpDate.now());
        component.setModId(regId);

        ComponentHist componentHist = componentHistService.insertComponentHist(component, histPublishDTO);
        log.debug("[COMPONENT HISTORY INSERT] seq: {}", component.getComponentSeq());

        return componentHist;

    }

    @Override
    public Component updateComponent(ComponentWorkVO workVO, String regId, HistPublishDTO histPublishDTO, Long templateSeq)
            throws Exception {
        String messageC = messageByLocale.get("tps.common.error.no-data");
        Component component = componentService
                .findComponentBySeq(workVO.getComponentSeq())
                .orElseThrow(() -> new NoDataException(messageC));

        if (templateSeq != null) {
            String messageT = messageByLocale.get("tps.common.error.no-data");
            Template template = templateService
                    .findTemplateBySeq(workVO.getTemplateSeq())
                    .orElseThrow(() -> new NoDataException(messageT));
            component.setTemplate(template);
        }
        component.setSnapshotYn(workVO.getSnapshotYn());
        component.setSnapshotBody(workVO.getSnapshotBody());
        //        component.setTemplate(template);
        component.setPerPageCount(workVO.getPerPageCount());
        component.setViewYn(workVO.getViewYn());
        //        component.setZone(workVO.getZone());
        //        component.setMatchZone(workVO.getMatchZone());
        component.setModDt(McpDate.now());
        component.setModId(regId);

        return componentService.updateComponent(component, histPublishDTO);

    }

    @Override
    @Transactional
    public void insertDeskingHist(ComponentHist componentHist, List<DeskingWorkVO> deskingWorkList, String regId) {

        Long datasetSeq = componentHist
                .getDataset()
                .getDatasetSeq();
        Dataset dataset = componentHist.getDataset();
        Date sendDt = McpDate.now();   // 전송시간

        // 편집기사 히스토리 등록
        for (DeskingWorkVO deskingVO : deskingWorkList) {

            deskingVO.setDatasetSeq(datasetSeq);    // 데이타셋순번이 매칭이 안된 데이타가 있을경우 고려해서 세팅

            DeskingHist deskingHist = modelMapper.map(deskingVO, DeskingHist.class);
            deskingHist.setComponentHist(componentHist);    // 컴포넌트 히스토리와 연결
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
        Long datasetSeq = component
                .getDataset()
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
            Optional<ComponentHist> componentHist = componentHistService.findComponentHistBySeq(histPublishDTO.getSeq());

            DeskingHist deskingHist = modelMapper.map(deskingVO, DeskingHist.class);

            deskingHist.setComponentHist(componentHist.get());    // 컴포넌트 히스토리와 연결
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
        boolean rel = false;
        if (insertdeskingList.size() > 0) {
            String parentContentId = insertdeskingList
                    .get(0)
                    .getParentContentId();
            rel = McpString.isNotEmpty(parentContentId);
        }

        // 1. 순서변경할 목록 조회
        List<DeskingOrdDTO> ordDTOList = resortBeforeInsert(rel, insertdeskingList, datasetSeq, regId);

        // 2. 편집기사work 등록
        for (DeskingWorkDTO vo : insertdeskingList) {
            DeskingWork appendDeskingWork = modelMapper.map(vo, DeskingWork.class);
            appendDeskingWork.setDatasetSeq(datasetSeq);    // 이동할 경우, target의 datasetSeq값임.
            appendDeskingWork.setRegId(regId);
            appendDeskingWork.setRegDt(McpDate.now());
            DeskingWork saved = deskingWorkRepository.save(appendDeskingWork);
            Long appendSeq = saved.getSeq();  // seq -> deskingSeq로 등록
            if (saved.getDeskingSeq() == null) {
                saved.setDeskingSeq(appendSeq);
                deskingWorkRepository.save(saved);
            }
            log.debug("DESKING WORK APPEND seq: {}", appendSeq);
        }

        // 3. 순서변경
        updateOrder(ordDTOList, regId);
    }

    private List<DeskingOrdDTO> resortBeforeInsert(boolean rel, List<DeskingWorkDTO> insertdeskingList, Long datasetSeq, String regId) {
        List<DeskingOrdDTO> returnOrdList = new ArrayList<>();
        List<DeskingWorkVO> deskingVOList = this.findAllDeskingWork(datasetSeq, regId);

        if (rel) {
            // 관련기사
            Integer minRelOrd = 1;
            String parentContentId = null;
            Optional<DeskingWorkDTO> findMin = insertdeskingList
                    .stream()
                    .min(Comparator.comparing(DeskingWorkDTO::getRelOrd));
            if (findMin.isPresent()) {
                minRelOrd = findMin
                        .get()
                        .getRelOrd();
                parentContentId = findMin
                        .get()
                        .getParentContentId();
            }

            for (DeskingWorkVO vo : deskingVOList) {
                Integer relOrd = vo.getRelOrd();
                if (parentContentId.equals(vo.getParentContentId()) && minRelOrd <= relOrd) {
                    DeskingOrdDTO ord = DeskingOrdDTO
                            .builder()
                            .seq(vo.getSeq())
                            .contentOrd(vo.getContentOrd())
                            .relOrd(relOrd + insertdeskingList.size())
                            .title(vo.getTitle())
                            .build();
                    returnOrdList.add(ord);
                }
            }
        } else {
            // 주기사
            Integer minContentOrd = 1;
            Optional<DeskingWorkDTO> findMin = insertdeskingList
                    .stream()
                    .min(Comparator.comparing(DeskingWorkDTO::getContentOrd));
            if (findMin.isPresent()) {
                minContentOrd = findMin
                        .get()
                        .getContentOrd();
            }

            for (DeskingWorkVO vo : deskingVOList) {
                Integer contentOrd = vo.getContentOrd();
                if (minContentOrd <= contentOrd) {
                    DeskingOrdDTO ord = DeskingOrdDTO
                            .builder()
                            .seq(vo.getSeq())
                            .contentOrd(contentOrd + insertdeskingList.size())
                            .relOrd(vo.getRelOrd())
                            .title(vo.getTitle())
                            .build();
                    returnOrdList.add(ord);
                }
            }
        }

        return returnOrdList;
    }

    private void updateOrder(List<DeskingOrdDTO> ordDTOList, String regId) {
        for (DeskingOrdDTO dto : ordDTOList) {
            Optional<DeskingWork> deskingWork = deskingWorkRepository.findById(dto.getSeq());
            if (deskingWork.isPresent()) {
                deskingWork
                        .get()
                        .setContentOrd(dto.getContentOrd());
                deskingWork
                        .get()
                        .setRelOrd(dto.getRelOrd());
                deskingWork
                        .get()
                        .setRegId(regId);
                deskingWork
                        .get()
                        .setRegDt(McpDate.now());
                deskingWorkRepository.save(deskingWork.get());
            }
        }
    }

    @Override
    @Transactional
    public void deleteDeskingWorkList(List<DeskingWorkVO> deleteDeksingList, Long datasetSeq, String regId) {
        List<Long> deleteIdList = deleteDeksingList
                .stream()
                .map(DeskingWorkVO::getSeq)
                .collect(Collectors.toList());

        // 삭제
        if (deleteDeksingList != null && deleteDeksingList.size() > 0) {
            for (DeskingWorkVO vo : deleteDeksingList) {
                // 주기사삭제시, 관련기사도 삭제
                if (vo.getRelSeqs() != null && vo
                        .getRelSeqs()
                        .size() > 0) {
                    for (Long relSeq : vo.getRelSeqs()) {
                        if (!deleteIdList.contains(relSeq)) {
                            deskingWorkRepository.deleteById(relSeq);
                        }
                    }
                }
                deskingWorkRepository.deleteById(vo.getSeq());
            }
        }

        // 정렬조회
        List<DeskingOrdDTO> updateOrdList = resortAfterDelete(datasetSeq, regId);

        // 정렬수정
        updateOrder(updateOrdList, regId);
    }

    @Override
    @Transactional
    public List<DeskingOrdDTO> resortAfterDelete(Long datasetSeq, String regId) {
        List<DeskingWorkVO> deskingVOList = this.findAllDeskingWork(datasetSeq, regId);

        // 1. 수정할 순번목록
        List<Long> updateList = new ArrayList<Long>();

        // 2. contentOrd 수정
        List<DeskingWorkVO> contentOrdList = new ArrayList<DeskingWorkVO>();
        Integer contentOrd = 0;
        boolean master = true; // 주기사
        for (DeskingWorkVO vo : deskingVOList) {
            master = McpString.isEmpty(vo.getParentContentId());

            // 주기사라면
            if (master) {
                contentOrd++;
            }

            // 주기사의 오더가 잘못됐다면
            if (!vo
                    .getContentOrd()
                    .equals(contentOrd)) {
                vo.setContentOrd(contentOrd);
                updateList.add(vo.getSeq());    // 순번수정
            }

            contentOrdList.add(vo);
        }

        // 3. relOrd 수정
        List<DeskingWorkVO> relOrdList = new ArrayList<DeskingWorkVO>();
        Integer relOrd = 1;
        boolean rel = false; // 관련기사
        String prevParentContentId = ""; // 이전 부모키
        for (DeskingWorkVO vo : contentOrdList) {
            rel = McpString.isNotEmpty(vo.getParentContentId());

            // 같은 부모이고, 관련기사 순번이 안 맞을 경우
            if (rel && vo
                    .getParentContentId()
                    .equals(prevParentContentId)) {
                if (!vo
                        .getRelOrd()
                        .equals(relOrd)) {
                    vo.setRelOrd(relOrd);
                    updateList.add(vo.getSeq());    // 순번수정
                }
            }

            // 주기사라면
            if (!rel) {
                prevParentContentId = vo.getContentId();
                relOrd = 1;
            } else {
                relOrd++;
            }

            relOrdList.add(vo);
        }

        // 4. 수정목록 조회
        List<DeskingOrdDTO> returnOrdList = new ArrayList<>();
        for (DeskingWorkVO orgVO : deskingVOList) {
            DeskingWork deskingWork = modelMapper.map(orgVO, DeskingWork.class);
            Long orgSeq = deskingWork.getSeq();
            Optional<DeskingWorkVO> newVo = relOrdList
                    .stream()
                    .filter(d -> d
                            .getSeq()
                            .equals(orgSeq))
                    .findFirst();
            if (newVo.isPresent()) {
                // contentOrd, relOrd가 다를 경우 추가
                if (updateList.contains(orgSeq)) {
                    DeskingOrdDTO ord = DeskingOrdDTO
                            .builder()
                            .seq(deskingWork.getSeq())
                            .contentOrd(newVo
                                    .get()
                                    .getContentOrd())
                            .relOrd(newVo
                                    .get()
                                    .getRelOrd())
                            .build();
                    returnOrdList.add(ord);
                }
            }
        }

        return returnOrdList;
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
    public void updateDeskingWorkSort(Long datasetSeq, List<DeskingWorkVO> deskingWorks, String regId) {
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
    }

    @Override
    public void moveDeskingWork(DeskingWorkDTO deskingWork, Long tgtDatasetSeq, Long srcDatasetSeq, String creator) {
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
    public String saveDeskingWorkImage(Long areaSeq, DeskingWork deskingWork, MultipartFile thumbnail)
            throws Exception {

        Area area = areaService
                .findAreaBySeq(areaSeq)
                .orElseThrow(() -> new NoDataException(messageByLocale.get("tps.common.error.no-data")));

        // 파일명 생성 : {contentId}_{datasetSeq}_{yyyyMMddHHmmss}.확장자
        String extension = McpFile
                .getExtension(thumbnail.getOriginalFilename())
                .toLowerCase();

        String nowTime = McpDate.dateStr(new Date(), "yyyyMMddHHmmss");
        String[] fileNames = {deskingWork.getContentId(), String.valueOf(deskingWork.getDatasetSeq()), nowTime};
        String fileName = String.join("_", fileNames) + "." + extension;

        // 경로 생성. 루트일경우 index, 그 외의 페이지는 2depth의 서비스명을 사용한다.
        // https://stg-wimage.joongang.co.kr/1000/index/202001/
        String yyyyMM = McpDate.yearStr() + McpDate.monthStr();
        Optional<String> twoDepthName = Arrays
                .stream(area
                        .getPage()
                        .getPageUrl()
                        .split("/"))
                .findFirst();
        String serviceName = "index";
        if (twoDepthName.isPresent()) {
            serviceName = twoDepthName
                    .get()
                    .toString();
        }

        String remotePath = "/" + String.join("/", area
                .getDomain()
                .getDomainId(), serviceName, yyyyMM);

        // 파일 저장
        boolean upload = ftpHelper.upload(FtpHelper.WIMAGE, fileName, thumbnail.getInputStream(), remotePath);
        if (upload) {
            log.debug("SAVE DESKING WORK THUMBNAIL");
            String path = wimageUrl + remotePath + "/" + fileName;
            return path;
        } else {
            log.debug("SAVE FAIL DESKING WORK THUMBNAIL");
        }

        return "";
    }

    @Override
    public List<ComponentHistVO> findAllComponentHist(DeskingHistSearchDTO search) {
        return deskingMapper.findAllComponentHistByDesking(search);
    }

    @Override
    public List<DeskingHist> findAllDeskingHist(Long componentHistSeq) {
        return deskingHistRepository.findAllDeskingHist(componentHistSeq);
    }

    @Override
    @Transactional
    public void importDeskingWorkHistory(Long componentWorkSeq, Long componentHistSeq, String regId)
            throws Exception {

        // component work 수정
        Optional<ComponentHist> componentHist = componentHistService.findComponentHistBySeq(componentHistSeq);
        if (componentHist.isPresent()) {
            ComponentWork componentWork = componentWorkService.updateComponentWork(componentWorkSeq, componentHist.get());

            Long datasetSeq = componentWork
                    .getDataset()
                    .getDatasetSeq();

            // desking work 삭제 및  등록
            Map<String, Object> paramMap = new HashMap<String, Object>();
            Integer returnValue = TpsConstants.PROCEDURE_SUCCESS;
            paramMap.put("datasetSeq", datasetSeq);
            paramMap.put("componentHistSeq", componentHistSeq);
            paramMap.put("regId", regId);
            paramMap.put("returnValue", returnValue);
            deskingMapper.importDeskingWorkFromHist(paramMap);
            if ((int) paramMap.get("returnValue") < 0) {
                log.debug("INSERT FAIL DESKING WORK : {} ", returnValue);
                throw new Exception("Failed to insert DESKING WORK error code: " + returnValue);
            }
        }
    }

    @Override
    public List<Desking> findByDatasetSeq(Long datasetSeq) {
        return deskingRepository.findByDatasetSeq(datasetSeq);
    }

    @Override
    public ComponentWork updateComponentWorkTemplate(Long componentWorkSeq, Long templateSeq, String regId)
            throws Exception {
        return componentWorkService.updateComponentWorkTemplate(componentWorkSeq, templateSeq, regId);
    }
}


