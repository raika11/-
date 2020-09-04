package jmnet.moka.common.data.support;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.core.annotation.AliasFor;

/**
 * SearchDTO를 위한 Parameter Annotation
 * 
 * @author ince
 *
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface SearchParam {
    /**
     * Alias for {@link #name}.
     */
    @AliasFor("name")
    String value() default "";

    /**
     * The name of the model attribute to bind to.
     * <p>
     * The default model attribute name is inferred from the declared attribute type (i.e. the
     * method parameter type or method return type), based on the non-qualified class name: e.g.
     * "orderAddress" for class "mypackage.OrderAddress", or "orderAddressList" for
     * "List&lt;mypackage.OrderAddress&gt;".
     * 
     * @since 4.3
     */
    @AliasFor("value")
    String name() default "";

    /**
     * Allows declaring data binding disabled directly on an {@code @ModelAttribute} method
     * parameter or on the attribute returned from an {@code @ModelAttribute} method, both of which
     * would prevent data binding for that attribute.
     * <p>
     * By default this is set to {@code true} in which case data binding applies. Set this to
     * {@code false} to disable data binding.
     * 
     * @since 4.3
     */
    boolean binding() default true;
}
