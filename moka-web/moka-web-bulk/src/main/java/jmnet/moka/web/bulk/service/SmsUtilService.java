package jmnet.moka.web.bulk.service;

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
public interface SmsUtilService {
    void sendSms(String message);
    void pause();
}
