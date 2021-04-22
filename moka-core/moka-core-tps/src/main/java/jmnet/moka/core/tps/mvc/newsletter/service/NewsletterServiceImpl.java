package jmnet.moka.core.tps.mvc.newsletter.service;

import java.util.List;
import java.util.Optional;
import javax.transaction.Transactional;
import jmnet.moka.core.tps.mvc.newsletter.dto.NewsletterSearchDTO;
import jmnet.moka.core.tps.mvc.newsletter.entity.NewsletterExcel;
import jmnet.moka.core.tps.mvc.newsletter.entity.NewsletterInfo;
import jmnet.moka.core.tps.mvc.newsletter.entity.NewsletterSend;
import jmnet.moka.core.tps.mvc.newsletter.repository.NewsletterExcelRepository;
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

    public NewsletterServiceImpl(NewsletterInfoRepository newsletterInfoRepository, NewsletterSendRepository newsletterSendRepository,
            NewsletterExcelRepository newsletterExcelRepository) {
        this.newsletterInfoRepository = newsletterInfoRepository;
        this.newsletterSendRepository = newsletterSendRepository;
        this.newsletterExcelRepository = newsletterExcelRepository;
    }

    @Override
    public Page<NewsletterInfo> findAll(NewsletterSearchDTO search) {
        return newsletterInfoRepository.findAllNewsletterInfo(search);
    }

    @Override
    public Optional<NewsletterInfo> findByletterSeq(Long letterSeq) {
        return newsletterInfoRepository.findById(letterSeq);
    }

    @Transactional
    @Override
    public NewsletterInfo insertNewsletterInfo(NewsletterInfo newsletterInfo) {
        return newsletterInfoRepository.save(newsletterInfo);
    }

    @Transactional
    @Override
    public NewsletterInfo updateNewsletterInfo(NewsletterInfo newsletterInfo) {
        return newsletterInfoRepository.save(newsletterInfo);
    }

    @Override
    public Page<NewsletterSend> findAllNewsletterSend(NewsletterSearchDTO search) {
        return newsletterSendRepository.findAllNewsletterSend(search);
    }

    @Transactional
    @Override
    public NewsletterSend insertNewsletterSend(NewsletterSend newsletterSend, List<NewsletterExcel> emailList) {
        return newsletterSendRepository.save(newsletterSend);
    }

    @Transactional
    @Override
    public NewsletterSend updateNewsletterSend(NewsletterSend newsletterSend, List<NewsletterExcel> emailList) {
        return newsletterSendRepository.save(newsletterSend);
    }
}
