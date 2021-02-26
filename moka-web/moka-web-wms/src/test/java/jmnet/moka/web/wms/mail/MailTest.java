package jmnet.moka.web.wms.mail;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.core.mail.mvc.dto.EmsSendDTO;
import jmnet.moka.core.mail.mvc.service.EmsService;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
public class MailTest {

    @Autowired
    private EmsService emsService;

    @Autowired
    private JavaMailSender mailSender;

    @Test
    public void emsSend() {
        EmsSendDTO emsSendDTO = emsService.send(EmsSendDTO
                .builder()
                .legacyid("ssc01")
                .mailtype("01")
                .email("ince@ssc.co.kr")
                .name("인스")
                .sendtime(McpDate.now())
                .fromaddress("root@joins.com")
                .fromname("조인스")
                .title("테스트")
                .tag1("https://news.jtbc.joins.com/article/ArticleSubscribe.aspx?news_id=NB10379475&email=alicekid@naver.com&rep_seq=275")
                .build());
        Assert.assertNotNull(emsSendDTO);
    }

    @Test
    public void send()
            throws MessagingException {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("root@joongang.co.kr");
        message.setTo("csinpgs@gmail.com");
        message.setSubject("테스트");
        message.setText("text");

        mailSender.send(message);
    }

    @Test
    public void sendMimeMail()
            throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        helper.addTo("csinpgs@gmail.com");
        helper.setFrom("root@joongang.co.kr");
        helper.setSubject("테스트");
        helper.setText("<html><body><h1>test</h1></body></html>", true);

        mailSender.send(helper.getMimeMessage());
    }


}
