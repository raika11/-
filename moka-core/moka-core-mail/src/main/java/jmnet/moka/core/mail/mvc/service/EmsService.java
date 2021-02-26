package jmnet.moka.core.mail.mvc.service;

import jmnet.moka.core.mail.mvc.dto.EmsSendDTO;

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
public interface EmsService {

    EmsSendDTO send(EmsSendDTO emsSend);
}
