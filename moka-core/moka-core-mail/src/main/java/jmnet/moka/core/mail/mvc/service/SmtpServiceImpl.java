package jmnet.moka.core.mail.mvc.service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import jmnet.moka.common.utils.BeanConverter;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.mail.mvc.dto.SmtpSendDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

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
@Service
public class SmtpServiceImpl implements SmtpService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private SpringTemplateEngine templateEngine;


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

        helper.setSubject(title);
        helper.setText(body, isHtml);

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
            throws Exception {
        if (McpString.isNotEmpty(stmpSend.getTemplateName()) && stmpSend.getContext() != null) {
            Context context = new Context();
            context.setVariables(BeanConverter.toMap(stmpSend.getContext()));
            String body = templateEngine.process(stmpSend.getTemplateName(), context);
            stmpSend.setBody(body);
        }
        send(stmpSend.getFrom(), stmpSend.getTo(), stmpSend.getTitle(), stmpSend.getBody(), stmpSend.isHtml());
    }

    @Override
    public String getMailBody(SmtpSendDTO stmpSend)
            throws Exception {
        Context context = new Context();
        context.setVariables(BeanConverter.toMap(stmpSend.getContext()));
        return templateEngine.process(stmpSend.getTemplateName(), context);
    }
}
