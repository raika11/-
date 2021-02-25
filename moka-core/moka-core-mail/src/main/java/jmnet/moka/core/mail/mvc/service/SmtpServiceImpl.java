package jmnet.moka.core.mail.mvc.service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import jmnet.moka.core.mail.mvc.dto.SmtpSendDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.mail.mvc.service
 * ClassName : SmtpMailServiceImpl
 * Created : 2021-02-25 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-25 11:48
 */
@Service(value = "smtp")
public class SmtpServiceImpl implements SmtpService {

    @Autowired
    private JavaMailSender mailSender;


    /**
     * smtp로 메일 전송
     *
     * @param from   발신주소
     * @param to     수신주소
     * @param title  제목
     * @param body   본문
     * @param isHtml 본문 html여부
     * @throws MessagingException 메일 메세지 오류처리
     */
    private void send(String from, String[] to, String title, String body, boolean isHtml)
            throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        helper.setFrom(from);
        helper.setTo(to);

        helper.setSubject("테스트");
        helper.setText("<html><body><h1>test</h1></body></html>", true);

        mailSender.send(helper.getMimeMessage());
    }

    @Override
    public void send(String from, String to, String title, String body)
            throws MessagingException {
        send(from, new String[] {to}, title, body, IS_HTML);
    }

    @Override
    public void send(String from, String[] to, String title, String body)
            throws MessagingException {
        send(from, to, title, body, IS_HTML);
    }

    @Override
    public void send(SmtpSendDTO stmpSend)
            throws MessagingException {
        send(stmpSend.getFrom(), stmpSend.getTo(), stmpSend.getTitle(), stmpSend.getBody(), stmpSend.isHtml());
    }
}
