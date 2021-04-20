package jmnet.moka.web.wms.mvc.newsletter;

import static org.junit.Assert.assertNotNull;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Date;
import java.util.Set;
import jmnet.moka.core.tps.mvc.newsletter.dto.NewsletterInfoDTO;
import jmnet.moka.core.tps.mvc.newsletter.dto.NewsletterProductDTO;
import jmnet.moka.core.tps.mvc.newsletter.dto.NewsletterSearchDTO;
import jmnet.moka.core.tps.mvc.newsletter.entity.NewsletterInfo;
import jmnet.moka.core.tps.mvc.newsletter.entity.NewsletterSend;
import jmnet.moka.core.tps.mvc.newsletter.repository.NewsletterInfoRepository;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.wms.mvc.newsletter
 * ClassName : NewsletterTest
 * Created : 2021-04-16 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-04-16 오후 4:34
 */
@Slf4j
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
public class NewsletterTest {

    @Autowired
    private NewsletterInfoRepository newsletterInfoRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ModelMapper modelMapper;

    @Test
    public void selectNewsletterInfo()
            throws JsonProcessingException {
        NewsletterSearchDTO search = NewsletterSearchDTO.builder()
                                                        //                .startDt(new Date())
                                                        .build();
        search.setDefaultSort("letterSeq");
        Page<NewsletterInfo> result = newsletterInfoRepository.findAllNewsletterInfo(search);
        //        log.debug(objectMapper
        //                .writerWithDefaultPrettyPrinter()
        //                .writeValueAsString(result.getContent()));
        Converter<Set, Long> getSubscribeCount = ctx -> ctx.getSource() == null
                ? null
                : Long.valueOf(ctx
                        .getSource()
                        .size());
        Converter<Set<NewsletterSend>, Date> getLastSendDt = ctx -> ctx.getSource() == null || ctx
                .getSource()
                .size() == 0
                ? null
                : ctx
                        .getSource()
                        .stream()
                        .map(NewsletterSend::getSendDt)
                        .max(Date::compareTo)
                        .get();
        ModelMapper countModelMapper = new ModelMapper();
        countModelMapper
                .typeMap(NewsletterInfo.class, NewsletterProductDTO.class)
                .addMappings(mapper -> mapper
                        .using(getSubscribeCount)
                        .map(NewsletterInfo::getNewsletterSubscribes, NewsletterProductDTO::setSubscribeCount))
                .addMappings(mapping -> mapping
                        .using(getLastSendDt)
                        .map(NewsletterInfo::getNewsletterSends, NewsletterProductDTO::setLastSendDt));

        //        result
        //                .getContent()
        //                .forEach(item -> log.debug("size  {}", item
        //                        .getNewsletterSubscribes()
        //                        .size()));

        log.debug("{}", objectMapper
                .writerWithDefaultPrettyPrinter()
                .writeValueAsString(countModelMapper.map(result.getContent(), NewsletterProductDTO.TYPE)));
    }

    @Test
    public void insertNewsLetterInfo() {
        NewsletterInfoDTO dto = NewsletterInfoDTO
                .builder()
                .sendType("E")
                .letterType("E")
                .status("P")
                .channelType("")
                .channelId(1000L)
                .channelDateId(2L)
                .sendPeriod("C")
                .sendBaseCnt(1L)
                .senderName("test")
                .senderEmail("test@test.com")
                .letterTitle("Test letter title")
                .build();

        NewsletterInfo info = modelMapper.map(dto, NewsletterInfo.class);
        NewsletterInfo result = newsletterInfoRepository.save(info);
        assertNotNull(result);
    }
}
