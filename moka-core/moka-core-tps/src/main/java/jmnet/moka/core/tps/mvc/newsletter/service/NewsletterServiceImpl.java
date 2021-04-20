package jmnet.moka.core.tps.mvc.newsletter.service;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.newsletter.dto.NewsletterSearchDTO;
import jmnet.moka.core.tps.mvc.newsletter.entity.NewsletterInfo;
import jmnet.moka.core.tps.mvc.newsletter.entity.NewsletterSend;
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

    public NewsletterServiceImpl(NewsletterInfoRepository newsletterInfoRepository, NewsletterSendRepository newsletterSendRepository) {
        this.newsletterInfoRepository = newsletterInfoRepository;
        this.newsletterSendRepository = newsletterSendRepository;
    }

    @Override
    public Page<NewsletterInfo> findAll(NewsletterSearchDTO search) {
        return newsletterInfoRepository.findAllNewsletterInfo(search);
    }

    @Override
    public Optional<NewsletterInfo> findByletterSeq(Long letterSeq) {
        return newsletterInfoRepository.findById(letterSeq);
    }

    @Override
    public NewsletterInfo insertNewsletterInfo(NewsletterInfo newsletterInfo) {
        return newsletterInfoRepository.save(newsletterInfo);
    }

    @Override
    public NewsletterInfo updateNewsletterInfo(NewsletterInfo newsletterInfo) {
        return newsletterInfoRepository.save(newsletterInfo);
    }

    @Override
    public NewsletterSend insertNewsletterSend(NewsletterSend newsletterSend) {
        return newsletterSendRepository.save(newsletterSend);
    }

    @Override
    public NewsletterSend updateNewsletterSend(NewsletterSend newsletterSend) {
        return newsletterSendRepository.save(newsletterSend);
    }
}
