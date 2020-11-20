/**
 * msp-tps ScreenServiceImpl.java 2020. 5. 13. 오후 1:34:20 ssc
 */
package jmnet.moka.core.tps.mvc.desking.service;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.persistence.EntityManager;
import javax.transaction.Transactional;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpFile;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.helper.UploadFileHelper;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.component.service.ComponentService;
import jmnet.moka.core.tps.mvc.dataset.entity.Dataset;
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
import jmnet.moka.core.tps.mvc.desking.vo.DeskingComponentWorkVO;
import jmnet.moka.core.tps.mvc.desking.vo.DeskingWorkVO;
import jmnet.moka.core.tps.mvc.template.entity.Template;
import jmnet.moka.core.tps.mvc.template.service.TemplateService;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
public class DeskingServiceImpl implements DeskingService {
    private static final Logger logger = LoggerFactory.getLogger(DeskingServiceImpl.class);

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

    public List<DeskingComponentWorkVO> findAllComponentWork(DeskingWorkSearchDTO search) {

        // 1. 기존의 작업용 데이타(componentWork,deskingWork) 삭제
        // 2. 편집영역의 수동컴포넌트를 작업자용 컴포넌트로 일괄 등록
        // 3. 편집영역의 편집기사를 작업자용 편집기사로 일괄
        // 4. 조회
        List<List<Object>> listMap = componentWorkMapper.findAllComponentWork(search);

        if (search.getReturnValue()
                  .intValue() > 0) {

            List<DeskingComponentWorkVO> componentList = modelMapper.map(listMap.get(0), DeskingComponentWorkVO.TYPE);
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

                    for (int idx = 0; idx < deskingList.size(); idx++) {
                        deskingList.get(idx)
                                   .setComponentSeq(componentSeq);

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
                            //                        deskingList.get(idx).addRel(deskingList.get(idx).getSeq());
                        }
                    }
                    componentList.get(i)
                                 .setDeskingWorks(deskingList);
                }
            }

            return componentList;
        } else {
            return null;
        }
    }

    @Override
    public DeskingComponentWorkVO findComponentWorkBySeq(Long seq, boolean includeDesking) {
        DeskingComponentWorkVO componentVO = componentWorkMapper.findComponentWorkBySeq(seq);

        if (componentVO != null && includeDesking == true) {
            DeskingWorkSearchDTO search = DeskingWorkSearchDTO.builder()
                                                              .datasetSeq(componentVO.getDatasetSeq())
                                                              .regId(componentVO.getRegId())
                                                              .build();

            //            Long componentSeq = componentVO.getComponentSeq();
            //            Long datasetSeq = componentVO.getDatasetSeq();
            //            String regId = componentVO.getRegId();
            List<DeskingWork> deskingList = deskingWorkRepository.findAllDeskingWork(search);
            List<DeskingWorkVO> deskingVOList = modelMapper.map(deskingList, DeskingWorkVO.TYPE);
            for (int idx = 0; idx < deskingVOList.size(); idx++) {
                deskingVOList.get(idx)
                             .setComponentSeq(componentVO.getComponentSeq());
            }
            componentVO.setDeskingWorks(deskingVOList);
        }

        return componentVO;
    }

    @Override
    @Transactional
    public void updateDesking(Component component, List<DeskingWorkVO> deskingWorks, String regId) {

        Long datasetSeq = component.getDataset()
                                   .getDatasetSeq();
        Dataset dataset = component.getDataset();
        Date sendDt = McpDate.now();   // 전송시간

        // 1. 기존데이타 삭제(관련기사도 삭제되는지 확인필요)
        deleteDesking(datasetSeq);

        // 2. 편집기사(+관련편집기사) 등록
        for (DeskingWorkVO deskingVO : deskingWorks) {

            deskingVO.setDatasetSeq(datasetSeq);    // 데이타셋순번이 매칭이 안된 데이타가 있을경우 고려해서 세팅
            Long deskingSeq = deskingVO.getDeskingSeq();

            Desking desking = modelMapper.map(deskingVO, Desking.class);
            desking.setDatasetSeq(dataset.getDatasetSeq());
            desking.setRegDt(sendDt); // 전송시간
            desking.setDeskingDt(deskingVO.getRegDt()); // 작업자의 편집시간.
            // wms_desking_work.create_ymdt ==
            // wms_desking.desking_ymdt
            desking.setRegId(regId);  // 전송자
            desking.setDeskingSeq(null); // 편집기사추가를 위해 null세팅
            Desking saveDesking = deskingRepository.save(desking);

            // 3. 데이타 히스토리등록
            insertDeskingHist(saveDesking, sendDt);
        }

    }

    /**
     * <pre>
     * 데이타셋별로 편집기사(+관련편집기사)를 삭제
     * </pre>
     *
     * @param datasetSeq 데이타셋순번
     */
    private void deleteDesking(Long datasetSeq) {
        deskingRepository.deleteByDatasetSeq(datasetSeq);
    }

    /**
     * <pre>
     * 히스토리등록
     * </pre>
     *
     * @param saveDesking 편집기사(+관련편집기사)
     * @param sendDt      편집등록일(데이타셋별로 작업일자 그룹지어짐)
     */
    private void insertDeskingHist(Desking saveDesking, Date sendDt) {
        DeskingHist deskingHist = modelMapper.map(saveDesking, DeskingHist.class);
        deskingHist.setDeskingDt(saveDesking.getDeskingDt());
        deskingHist.setRegDt(sendDt);
        deskingHist.setDatasetSeq(saveDesking.getDatasetSeq());
        deskingHistRepository.save(deskingHist);
    }

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
        return deskingWorkMapper.findDeskingWork(search);
    }

    @Override
    @Transactional
    public void insertDeskingWork(DeskingWork appendDeskingWork, Long datasetSeq, Long editionSeq, String regId) {
        appendDeskingWork.setDatasetSeq(datasetSeq);
        appendDeskingWork.setRegId(regId);
        appendDeskingWork.setRegDt(McpDate.now());
        DeskingWork saved = deskingWorkRepository.save(appendDeskingWork);
        Long appendSeq = saved.getSeq();  // seq -> deskingSeq로 등록
        if (saved.getDeskingSeq() == null) {
            saved.setDeskingSeq(appendSeq);
            deskingWorkRepository.save(saved);
        }
        logger.debug("desking work append: {}", appendDeskingWork.getContentOrd(), appendDeskingWork.getTitle());

        // work편집기사목록 정렬변경
        boolean rel = !(appendDeskingWork.getParentTotalId() == null);

        DeskingWorkSearchDTO search = DeskingWorkSearchDTO.builder()
                                                          .datasetSeq(datasetSeq)
                                                          //.editionSeq(editionSeq)
                                                          .regId(regId)
                                                          .build();
        List<DeskingWork> deskingList = deskingWorkRepository.findAllDeskingWork(search);
        List<DeskingWorkVO> deskingVOList = modelMapper.map(deskingList, DeskingWorkVO.TYPE);

        for (DeskingWorkVO deskingWorkVO : deskingVOList) {
            DeskingWork deskingWork = modelMapper.map(deskingWorkVO, DeskingWork.class);
            if (rel) {
                int appendRelOrd = appendDeskingWork.getRelOrd();    // 관련기사 추가된 순번
                int relOrd = deskingWork.getRelOrd();
                if (appendDeskingWork.getParentTotalId()
                                     .equals(deskingWork.getParentTotalId()) && !appendSeq.equals(deskingWork.getSeq()) && relOrd >= appendRelOrd) {
                    deskingWork.setContentOrd(relOrd + 1);
                    deskingWork.setRegDt(McpDate.now());
                    deskingWork.setRegId(regId);
                    deskingWorkRepository.save(deskingWork);
                    logger.debug("desking work relation resort: {}", deskingWork.getContentOrd(), deskingWork.getTitle());
                }
            } else {
                int appendContentsOrd = appendDeskingWork.getContentOrd();    // 주기사 추가된 순번
                int contentsOrd = deskingWork.getContentOrd();
                if (contentsOrd >= appendContentsOrd && !appendSeq.equals(deskingWork.getSeq())) {
                    deskingWork.setContentOrd(contentsOrd + 1);
                    deskingWork.setRegDt(McpDate.now());
                    deskingWork.setRegId(regId);
                    deskingWorkRepository.save(deskingWork);
                    logger.debug("desking work resort: {}", deskingWork.getContentOrd(), deskingWork.getTitle());
                }
            }

        }
    }

    @Override
    public void moveDeskingWork(DeskingWork deskingWork, Long tgtDatasetSeq, Long srcDatasetSeq, Long editionSeq, String creator) {
        insertDeskingWork(deskingWork, tgtDatasetSeq, editionSeq, creator);

    }

    //    @Override
    //    public List<Desking> hasOtherSaved(Long datasetSeq, int interval, String creator) {
    //
    //        java.util.Date dt = McpDate.minuteMinus(new Date(), interval);
    //        return deskingRepository.findByOtherCreator(datasetSeq, McpDate.dateTimeStr(dt), creator);
    //    }

    @Override
    public Component updateComponent(DeskingComponentWorkVO workVO, String regId)
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
        //        component.setZone(workVO.getZone());
        component.setMatchZone(workVO.getMatchZone());
        component.setModDt(McpDate.now());
        component.setModId(regId);

        return componentService.updateComponent(component);

    }

    @Override
    public ComponentWork updateComponentWork(DeskingComponentWorkVO workVO, String regId)
            throws Exception {
        String messageC = messageByLocale.get("tps.common.error.no-data");
        ComponentWork componentWork = componentWorkService.findComponentWorkBySeq(workVO.getComponentSeq())
                                                          .orElseThrow(() -> new NoDataException(messageC));

        String messageT = messageByLocale.get("tps.common.error.no-data");
        Template template = templateService.findTemplateBySeq(workVO.getTemplateSeq())
                                           .orElseThrow(() -> new NoDataException(messageT));

        componentWork.setSnapshotYn(workVO.getSnapshotYn());
        componentWork.setSnapshotBody(workVO.getSnapshotBody());
        componentWork.setTemplate(template);
        componentWork.setZone(workVO.getZone());
        componentWork.setMatchZone(workVO.getMatchZone());
        componentWork.setViewYn(workVO.getViewYn());
        componentWork.setPerPageCount(workVO.getPerPageCount());

        return componentWorkService.updateComponentWork(componentWork);

    }

    @Override
    @Transactional
    public void send(DeskingComponentWorkVO workVO, String regId)
            throws Exception {

        // 컴포넌트 수정
        Component component = updateComponent(workVO, regId);

        // 편집데이타 등록
        updateDesking(component, workVO.getDeskingWorks(), regId);

    }

    @Override
    @Transactional
    public void preSend(DeskingComponentWorkVO workVO, String regId)
            throws Exception {

        //        // 컴포넌트 수정
        //        ComponentHist componentHist = updateComponentHist(workVO, regId);
        //
        //        // 편집데이타 등록
        //        for (DeskingWorkVO deskingWorkVO : workVO.getDeskingWorks()) {
        //            DeskingHist deskingHist = modelMapper.map(deskingWorkVO, DeskingHist.class);
        //            updateDeskingHist(deskingHist);
        //        }
    }


    @Override
    public ComponentWork updateComponentWorkSnapshot(Long componentWorkSeq, String snapshotYn, String snapshotBody, String creator)
            throws NoDataException, Exception {

        String messageC = messageByLocale.get("tps.common.error.no-data");
        ComponentWork componentWork = componentWorkService.findComponentWorkBySeq(componentWorkSeq)
                                                          .orElseThrow(() -> new NoDataException(messageC));

        componentWork.setSnapshotYn(snapshotYn);
        componentWork.setSnapshotBody(snapshotBody);

        return componentWorkService.updateComponentWork(componentWork);
    }

    @Override
    public ComponentWork updateComponentWorkTemplate(Long componentWorkSeq, Long templateSeq, String creator)
            throws NoDataException, Exception {

        String messageC = messageByLocale.get("tps.common.error.no-data");
        ComponentWork componentWork = componentWorkService.findComponentWorkBySeq(componentWorkSeq)
                                                          .orElseThrow(() -> new NoDataException(messageC));

        String messageT = messageByLocale.get("tps.co.error.no-data");
        Template template = templateService.findTemplateBySeq(templateSeq)
                                           .orElseThrow(() -> new NoDataException(messageT));

        componentWork.setTemplate(template);

        return componentWorkService.updateComponentWork(componentWork);

    }

    //    @Override
    //    @Transactional
    //    public void deleteDeskingWorkList(List<DeskingWorkVO> deskingWorkVOList, Long datasetSeq,
    //            Long editionSeq, String creator) {
    //
    //        // 삭제된 순번목록
    //        List<Long> deleteList =
    //                deskingWorkVOList.stream().map(DeskingWorkVO::getSeq).collect(Collectors.toList());
    //
    //        // 삭제 전 정렬
    //        sortBeforeDeleteDeskingWork(deleteList, datasetSeq, editionSeq,creator);
    //
    //        // work편집기사 삭제
    //        for (DeskingWorkVO vo : deskingWorkVOList) {
    //            deskingRelWorkRepository.deleteByDeskingSeqAndCreator(vo.getDeskingSeq(),
    //                    vo.getCreator());
    //            deskingWorkRepository.deleteById(vo.getSeq());
    //        }
    //    }

    @Override
    public void sortBeforeDeleteDeskingWork(List<Long> deskingWorkSeqList, Long datasetSeq, Long editionSeq, String creator) {
        // work편집기사목록 정렬변경
        DeskingWorkSearchDTO search = DeskingWorkSearchDTO.builder()
                                                          .datasetSeq(datasetSeq)
                                                          //                                            .editionSeq(editionSeq)
                                                          .regId(creator)
                                                          .build();
        List<DeskingWorkVO> deskingWorks = deskingWorkMapper.findDeskingWork(search);

        Integer ordering = 1;
        for (DeskingWorkVO deskingWorkVO : deskingWorks) {
            DeskingWork deskingWork = modelMapper.map(deskingWorkVO, DeskingWork.class);
            Long seq = deskingWork.getSeq();
            // 삭제된 목록이 아니고,
            if (!deskingWorkSeqList.contains(seq)) {
                // 원본오더가 변경할 오더와 다르다면 => 오더 수정.
                if (!ordering.equals(deskingWork.getContentOrd())) {
                    deskingWork.setContentOrd(ordering);
                    deskingWork.setRegDt(McpDate.now());
                    deskingWork.setRegId(creator);
                    deskingWorkRepository.save(deskingWork);
                }
                ordering++;
            }
        }
    }

    //    @Override
    //    @Transactional
    //    public List<DeskingRelWork> updateDeskingRelWorks(List<DeskingRelWork> newDeskingRelWorks) {
    //
    //        DeskingRelWork first = newDeskingRelWorks.get(0);
    //
    //        if (first != null) {
    //            return this.updateDeskingRelWorks(first.getDeskingSeq(), first.getCreator(),
    //                    newDeskingRelWorks);
    //        }
    //
    //        // 새 목록을 저장한다
    //        List<DeskingRelWork> result = deskingRelWorkRepository.saveAll(newDeskingRelWorks);
    //
    //        return result;
    //    }
    //
    //    @Override
    //    @Transactional
    //    public List<DeskingRelWork> updateDeskingRelWorks(Long deskingSeq, String creator,
    //            List<DeskingRelWork> newDeskingRelWorks) {
    //        List<DeskingRelWork> result = new ArrayList<DeskingRelWork>();
    //
    //        // 기존에 있던 릴레이션 워크 목록을 제거한다
    //        deskingRelWorkRepository.deleteByDeskingSeqAndCreator(deskingSeq, creator);
    //        logger.debug("Delete origin desking relation works");
    //
    //        // 새 목록을 저장한다
    //        if (newDeskingRelWorks.size() > 0) {
    //            result = deskingRelWorkRepository.saveAll(newDeskingRelWorks);
    //            logger.debug("Insert new desking relation works");
    //        }
    //
    //        return result;
    //    }
    //
    //    @Override
    //    @Transactional
    //    public void deleteDeskingRelWork(DeskingRelWork deskingRelWork) {
    //        if (deskingRelWork.getSeq() != null) {
    //            deskingRelWorkRepository.deleteById(deskingRelWork.getSeq());
    //        } else {
    //            deskingRelWorkRepository.deleteByContentsIdAndrelContentsId(deskingRelWork);
    //        }
    //    }

    @Override
    @Transactional
    public DeskingWork updateDeskingWork(DeskingWork deskingWork) {
        DeskingWork result = deskingWorkRepository.save(deskingWork);
        entityManager.flush();
        return result;
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
            logger.debug("Save desking work thumbnail");
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


