/**
 * moka-web-wms DTOStringToDateConverter.java 2020. 10. 14. 오전 11:26:30 ince
 */
package jmnet.moka.web.wms.config;

import java.text.SimpleDateFormat;
import java.util.Date;
import jmnet.moka.core.common.MokaConstants;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

/**
 * <pre>
 *
 * 2020. 10. 14. ince 최초생성
 * 날짜형 문자열을 Date 클래스로 변환한다.
 * </pre>
 *
 * @since 2020. 10. 14. 오후 11:26:30
 * @author ince
 */
@Component
public class DTOStringToDateConverter implements Converter<String, Date> {

    @Override
    public Date convert(final String source) {
        SimpleDateFormat sdf = new SimpleDateFormat(MokaConstants.JSON_DATE_FORMAT);
        try {
            return sdf.parse(source);
        } catch(java.text.ParseException pe) {
            return new Date();
        }
    }

}
