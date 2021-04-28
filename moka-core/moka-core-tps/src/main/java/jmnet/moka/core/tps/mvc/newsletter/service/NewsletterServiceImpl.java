package jmnet.moka.core.tps.mvc.newsletter.service;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import javax.transaction.Transactional;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.newsletter.dto.NewsletterSearchDTO;
import jmnet.moka.core.tps.mvc.newsletter.entity.NewsletterExcel;
import jmnet.moka.core.tps.mvc.newsletter.entity.NewsletterInfo;
import jmnet.moka.core.tps.mvc.newsletter.entity.NewsletterInfoHist;
import jmnet.moka.core.tps.mvc.newsletter.entity.NewsletterSend;
import jmnet.moka.core.tps.mvc.newsletter.repository.NewsletterExcelRepository;
import jmnet.moka.core.tps.mvc.newsletter.repository.NewsletterInfoHistRepository;
import jmnet.moka.core.tps.mvc.newsletter.repository.NewsletterInfoRepository;
import jmnet.moka.core.tps.mvc.newsletter.repository.NewsletterSendRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.newsletter.service
 * ClassName : NewsletterServiceImpl
 * Created : 2021-04-16 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-04-16 오후 4:39
 */
@Service
@Slf4j
public class NewsletterServiceImpl implements NewsletterService {

    private final NewsletterInfoRepository newsletterInfoRepository;

    private final NewsletterSendRepository newsletterSendRepository;

    private final NewsletterExcelRepository newsletterExcelRepository;

    private final NewsletterInfoHistRepository newsletterInfoHistRepository;

    public NewsletterServiceImpl(NewsletterInfoRepository newsletterInfoRepository, NewsletterSendRepository newsletterSendRepository,
            NewsletterExcelRepository newsletterExcelRepository, NewsletterInfoHistRepository newsletterInfoHistRepository) {
        this.newsletterInfoRepository = newsletterInfoRepository;
        this.newsletterSendRepository = newsletterSendRepository;
        this.newsletterExcelRepository = newsletterExcelRepository;
        this.newsletterInfoHistRepository = newsletterInfoHistRepository;
    }

    @Override
    public Page<NewsletterInfo> findAll(NewsletterSearchDTO search) {
        return newsletterInfoRepository.findAllNewsletterInfo(search);
    }

    @Override
    public Optional<NewsletterInfo> findByLetterSeq(Long letterSeq) {
        return newsletterInfoRepository.findById(letterSeq);
    }

    @Override
    public Page<NewsletterInfoHist> findAllNewsletterInfoHistByLetterSeq(Long letterSeq, NewsletterSearchDTO search) {
        return newsletterInfoHistRepository.findByLetterSeq(letterSeq, search.getPageable());
    }

    @Override
    public List<NewsletterInfoHist> findTop2ByLetterSeqAndHistSeq(Long histSeq) {
        List<NewsletterInfoHist> list = new LinkedList<>();
        newsletterInfoHistRepository
                .findById(histSeq)
                .ifPresent(hist -> {
                    list.addAll(newsletterInfoHistRepository.findTop2ByLetterSeqAndHistSeqLessThanEqualOrderByHistSeqDesc(hist.getLetterSeq(),
                            hist.getHistSeq()));
                });
        return list;
    }


    @Override
    public List<Long> findChannelIdByChannelType(String channelType) {
        return newsletterInfoRepository.findAllChannelIdByChannelType(channelType);
    }

    @Transactional
    @Override
    public NewsletterInfo insertNewsletterInfo(NewsletterInfo newsletterInfo) {
        // 저장
        NewsletterInfo result = newsletterInfoRepository.save(newsletterInfo);
        // 히스토리저장
        insertNewsletterInfoHist(result, TpsConstants.WORKTYPE_INSERT);
        return result;
    }

    @Transactional
    @Override
    public NewsletterInfo updateNewsletterInfo(NewsletterInfo newsletterInfo) {
        // 저장
        NewsletterInfo result = newsletterInfoRepository.save(newsletterInfo);
        // 히스토리 저장
        insertNewsletterInfoHist(result, TpsConstants.WORKTYPE_UPDATE);
        return result;
    }

    /**
     * 히스토리를 등록한다.
     *
     * @param newsletterInfo 뉴스레터 상품
     * @param workType       작업유형
     */
    private void insertNewsletterInfoHist(NewsletterInfo newsletterInfo, String workType) {
        // 히스토리저장
        newsletterInfoHistRepository.save(NewsletterInfoHist
                .builder()
                .letterSeq(newsletterInfo.getLetterSeq())
                .sendType(newsletterInfo.getSendType())
                .letterType(newsletterInfo.getLetterType())
                .status(newsletterInfo.getStatus())
                .channelType(newsletterInfo.getChannelType())
                .channelId(newsletterInfo.getChannelId())
                .channelDateId(newsletterInfo.getChannelDateId())
                .sendPeriod(newsletterInfo.getSendPeriod())
                .sendDay(newsletterInfo.getSendDay())
                .sendTime(newsletterInfo.getSendTime())
                .sendMaxCnt(newsletterInfo.getSendMaxCnt())
                .sendMinCnt(newsletterInfo.getSendMinCnt())
                .sendOrder(newsletterInfo.getSendOrder())
                .scbYn(newsletterInfo.getScbYn())
                .scbLinkYn(newsletterInfo.getScbLinkYn())
                .senderName(newsletterInfo.getSenderName())
                .senderEmail(newsletterInfo.getSenderEmail())
                .sendStartDt(newsletterInfo.getSendStartDt())
                .containerSeq(newsletterInfo.getContainerSeq())
                .formSeq(newsletterInfo.getFormSeq())
                .headerImg(newsletterInfo.getHeaderImg())
                .editLetterType(newsletterInfo.getLetterType())
                .abtestYn(newsletterInfo.getAbtestYn())
                .memo(newsletterInfo.getMemo())
                .lastSendDt(newsletterInfo.getLastSendDt())
                .category(newsletterInfo.getCategory())
                .titleType(newsletterInfo.getTitleType())
                .letterTitle(newsletterInfo.getLetterTitle())
                .letterName(newsletterInfo.getLetterName())
                .letterEngName(newsletterInfo.getLetterEngName())
                .letterImg(newsletterInfo.getLetterImg())
                .letterDesc(newsletterInfo.getLetterDesc())
                .workType(workType)
                .build());
    }

    @Override
    public Page<NewsletterSend> findAllNewsletterSend(NewsletterSearchDTO search) {
        return newsletterSendRepository.findAllNewsletterSend(search);
    }

    @Override
    public Optional<NewsletterSend> findNewsletterSendBySendSeq(Long sendSeq) {
        return newsletterSendRepository.findById(sendSeq);
    }

    @Transactional
    @Override
    public NewsletterSend insertNewsletterSend(NewsletterSend newsletterSend, List<NewsletterExcel> emailList) {
        NewsletterSend result = newsletterSendRepository.save(newsletterSend);
        // 추가
        emailList
                .stream()
                .map(email -> email
                        .toBuilder()
                        .letterSeq(result.getLetterSeq())
                        .sendSeq(result.getSendSeq())
                        .memSeq(0L)
                        .build())
                .forEach(newsletterExcelRepository::save);
        return result;
    }

    @Transactional
    @Override
    public NewsletterSend updateNewsletterSend(NewsletterSend newsletterSend, List<NewsletterExcel> emailList) {
        NewsletterSend result = newsletterSendRepository.save(newsletterSend);
        // 삭제
        newsletterExcelRepository
                .findBySendSeq(result.getSendSeq())
                .forEach(newsletterExcelRepository::delete);
        // 추가
        emailList
                .stream()
                .map(email -> email
                        .toBuilder()
                        .letterSeq(result.getLetterSeq())
                        .sendSeq(result.getSendSeq())
                        .memSeq(0L)
                        .build())
                .forEach(newsletterExcelRepository::save);
        return result;
    }
}
