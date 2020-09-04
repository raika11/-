package jmnet.moka.common.data.support;

import java.nio.charset.Charset;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

/**
 * Byte수 최대길이 Validation 체크 클래스
 * 
 * @author ince
 *
 */
public class MaxByteLengthValidator implements ConstraintValidator<MaxByteLength, String> {
    private int max;

    public void initialize(MaxByteLength constraintAnnotation) {
        this.max = constraintAnnotation.max();
    }

    public boolean isValid(String object, ConstraintValidatorContext constraintContext) {
        return object == null || object.getBytes(Charset.forName("UTF-8")).length <= this.max;
    }
}

