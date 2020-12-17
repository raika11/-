/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package jmnet.moka.core.tps.mvc.desking.service;

import java.util.Optional;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.component.entity.ComponentHist;
import jmnet.moka.core.tps.mvc.desking.entity.ComponentWork;
import jmnet.moka.core.tps.mvc.desking.repository.ComponentWorkRepository;
import jmnet.moka.core.tps.mvc.desking.vo.ComponentWorkVO;
import jmnet.moka.core.tps.mvc.template.entity.Template;
import jmnet.moka.core.tps.mvc.template.service.TemplateService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * ComponentWorkServiceImpl
 *
 * @author jeon0525
 */

@Service
@Slf4j
public class ComponentWorkServiceImpl implements jmnet.moka.core.tps.mvc.desking.service.ComponentWorkService {
    @Autowired
    private ComponentWorkRepository componentWorkRepository;

    @Autowired
    private MessageByLocale messageByLocale;

    @Autowired
    private TemplateService templateService;

    @Override
    public Optional<ComponentWork> findComponentWorkBySeq(Long seq) {
        return componentWorkRepository.findById(seq);
    }

    @Override
    public ComponentWork updateComponentWork(ComponentWorkVO workVO)
            throws NoDataException, Exception {
        String messageC = messageByLocale.get("tps.common.error.no-data");
        ComponentWork componentWork = this
                .findComponentWorkBySeq(workVO.getSeq())
                .orElseThrow(() -> new NoDataException(messageC));

        //        String messageT = messageByLocale.get("tps.common.error.no-data");
        //        Template template = templateService.findTemplateBySeq(workVO.getTemplateSeq())
        //                                           .orElseThrow(() -> new NoDataException(messageT));

        //        componentWork.setTemplate(template);
        //        componentWork.setZone(workVO.getZone());
        //        componentWork.setMatchZone(workVO.getMatchZone());
        componentWork.setViewYn(workVO.getViewYn());
        componentWork.setPerPageCount(workVO.getPerPageCount());

        // 컴포넌트 업데이트
        ComponentWork saved = componentWorkRepository.save(componentWork);
        log.debug("[COMPONENT WORK UPDATE] seq: {}", saved.getSeq());

        return saved;
    }

    @Override
    public ComponentWork updateComponentWorkSnapshot(Long componentWorkSeq, String snapshotYn, String snapshotBody, String regId)
            throws NoDataException, Exception {

        String messageC = messageByLocale.get("tps.common.error.no-data");
        ComponentWork componentWork = this
                .findComponentWorkBySeq(componentWorkSeq)
                .orElseThrow(() -> new NoDataException(messageC));

        componentWork.setSnapshotYn(snapshotYn);
        componentWork.setSnapshotBody(snapshotBody);

        // 컴포넌트 업데이트
        ComponentWork saved = componentWorkRepository.save(componentWork);
        log.debug("[COMPONENT WORK SNAPSHOT UPDATE] seq: {}", saved.getSeq());

        return saved;
    }

    @Override
    public ComponentWork updateComponentWorkTemplate(Long componentWorkSeq, Long templateSeq, String regId)
            throws NoDataException, Exception {

        String messageC = messageByLocale.get("tps.common.error.no-data");
        ComponentWork componentWork = this
                .findComponentWorkBySeq(componentWorkSeq)
                .orElseThrow(() -> new NoDataException(messageC));

        String messageT = messageByLocale.get("tps.common.error.no-data");
        Template template = templateService
                .findTemplateBySeq(templateSeq)
                .orElseThrow(() -> new NoDataException(messageT));

        componentWork.setTemplate(template);

        // 컴포넌트 업데이트
        ComponentWork saved = componentWorkRepository.save(componentWork);
        log.debug("[COMPONENT WORK TEMPLATE UPDATE] seq: {}", saved.getSeq());

        return saved;
    }

    @Override
    public ComponentWork updateComponentWork(Long componentWorkSeq, ComponentHist componentHist, String updateTemplateYn)
            throws NoDataException {
        String messageC = messageByLocale.get("tps.common.error.no-data");
        ComponentWork componentWork = this
                .findComponentWorkBySeq(componentWorkSeq)
                .orElseThrow(() -> new NoDataException(messageC));

        componentWork.setSnapshotYn(componentHist.getSnapshotYn());
        componentWork.setSnapshotBody(componentHist.getSnapshotBody());
        if (updateTemplateYn != null && updateTemplateYn.equals(MokaConstants.YES)) {
            componentWork.setTemplate(componentHist.getTemplate());
        }
        //        componentWork.setZone(componentHist.getZone());
        //        componentWork.setMatchZone(componentHist.getMatchZone());
        componentWork.setViewYn(componentHist.getViewYn());
        componentWork.setPerPageCount(componentHist.getPerPageCount());

        // 컴포넌트 업데이트
        ComponentWork saved = componentWorkRepository.save(componentWork);
        log.debug("[COMPONENT WORK FROM HIST UPDATE] seq: {}", saved.getSeq());

        return saved;
    }

}
