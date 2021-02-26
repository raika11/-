package jmnet.moka.core.mail.mvc.service;

import javax.mail.MessagingException;
import jmnet.moka.core.mail.mvc.dto.SmtpSendDTO;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.mail.mvc.service
 * ClassName : MailService
 * Created : 2021-02-25 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-25 11:47
 */
public interface SmtpService {

    boolean IS_HTML = true;

    /**
     * smtp 메일 발송
     *
     * @param from  발신주소
     * @param to    수신주소
     * @param title 제목
     * @param body  본문
     * @throws MessagingException 메일 메세지 오류처리
     */
    void send(String from, String to, String title, String body)
            throws MessagingException;

    /**
     * smtp 메일 발송
     *
     * @param from  발신주소
     * @param to    수신주소
     * @param title 제목
     * @param body  본문
     * @throws MessagingException 메일 메세지 오류처리
     */
    void send(String from, String[] to, String title, String body)
            throws MessagingException;

    /**
     * smtp 메일 발송
     *
     * @param stmpSend 메일 발송 정보
     * @throws MessagingException 메일 메세지 오류처리
     */
    void send(SmtpSendDTO stmpSend)
            throws MessagingException;

}
