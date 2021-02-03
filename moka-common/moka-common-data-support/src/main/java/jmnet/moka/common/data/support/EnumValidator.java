package jmnet.moka.common.data.support;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import jmnet.moka.common.utils.EnumCode;

/**
 * <pre>
 * Enum 형의 validation 처리
 * Project : moka
 * Package : jmnet.moka.common.data.support
 * ClassName : EnumValidator
 * Created : 2020-11-19 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-19 09:25
 */
public class EnumValidator implements ConstraintValidator<EnumValid, EnumCode> {
    private EnumValid annotation;

    @Override
    public void initialize(EnumValid constraintAnnotation) {
        this.annotation = constraintAnnotation;
    }

    @Override
    public boolean isValid(EnumCode value, ConstraintValidatorContext context) {

        if (value == null) {
            if (this.annotation.required()) {
                return false;
            } else {
                return true;
            }
        }

        boolean result = false;

        Object[] enumValues = this.annotation
                .enumClass()
                .getEnumConstants();
        if (enumValues != null) {
            for (Object enumValue : enumValues) {
                if (value
                        .getCode()
                        .equals(enumValue.toString()) || (this.annotation.ignoreCase() && value
                        .getCode()
                        .equalsIgnoreCase(enumValue.toString()))) {
                    result = true;
                    break;
                }
            }
        }
        return result;
    }
}
