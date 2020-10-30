/**
 * msp-tps MessageByLocale.java 2019. 11. 29. 오후 3:05:34 ssc
 */
package jmnet.moka.core.common.mvc;

import javax.servlet.http.HttpServletRequest;
import jmnet.moka.core.common.util.HttpHelper;
import org.springframework.context.MessageSource;
import org.springframework.web.servlet.LocaleResolver;

/**
 * <pre>
 *
 * 2019. 11. 29. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2019. 11. 29. 오후 3:05:34
 */
public class MessageByLocale {

    private MessageSource messageSource;
    private LocaleResolver localeResolver;

    public MessageByLocale(MessageSource messageSource, LocaleResolver localeResolver) {
        this.messageSource = messageSource;
        this.localeResolver = localeResolver;
    }

    /**
     * <pre>
     * 코드에 해당하는 메시지를 가져온다.
     * </pre>
     *
     * @param code      메시지 파일에 정의된 코드
     * @param request   httpRequest
     * @param parameter 파라메터가 있는 메시지일 경우 사용
     * @return 메시지 내용
     */
    public String get(String code, HttpServletRequest request, Object... parameter) {
        return messageSource.getMessage(code, parameter, localeResolver.resolveLocale(request));
    }

    /**
     * <pre>
     * 코드에 해당하는 메시지를 가져온다
     * </pre>
     *
     * @param code      메시지 파일에 정의된 코드
     * @param parameter 파라메터가 있는 메시지일 경우 사용
     * @return 메시지 내용
     */
    public String get(String code, Object... parameter) {
        return messageSource.getMessage(code, parameter, HttpHelper.getLocale());
    }
}
