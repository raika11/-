/**
 * moka-core-tps DTODateTimeFormat.java 2020. 10. 14. 오전 11:26:30 ince
 */
package jmnet.moka.core.common.dto;

import com.fasterxml.jackson.annotation.JacksonAnnotationsInside;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonFormat.Shape;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import jmnet.moka.core.common.MokaConstants;

/**
 * DTO 전용 날짜 변환 Annotation Request의 문자열을 Date형으로 Converting 한다. Response로 전달되는 Date형을 문자열로 Converting한다.
 * <pre>
 * 2020. 10. 14. ince 최초생성
 * </pre>
 *
 * @author ince
 * @since 2020. 10. 14. 오전 11:26:30
 */
@Target({ElementType.FIELD, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@JacksonAnnotationsInside
@JsonFormat(shape = Shape.STRING, pattern = MokaConstants.JSON_DATE_FORMAT, timezone = MokaConstants.JSON_DATE_TIME_ZONE)
public @interface DTODateTimeFormat {

}
