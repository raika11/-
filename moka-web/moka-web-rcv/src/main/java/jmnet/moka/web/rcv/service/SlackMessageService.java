package jmnet.moka.web.rcv.service;

import java.util.Date;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.rcv.service
 * ClassName : SmsUtilService
 * Created : 2021-01-13 013 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-01-13 013 오후 5:10
 */
public interface SlackMessageService {
    void sendSms(String title, String message);
    void pause();
    Date getPauseTime();
}
