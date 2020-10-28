package jmnet.moka.core.tps.exception;

import jmnet.moka.core.common.exception.MokaException;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.exception
 * ClassName : DuplicateIdException
 * Created : 2020-10-26 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-26 09:14
 */
public class DuplicateIdException extends MokaException {

    private static final long serialVersionUID = 6869325291938412284L;

    public DuplicateIdException(String message) {
        super(message);
    }

    public DuplicateIdException(String message, Throwable t) {
        super(message, t);
    }

}
