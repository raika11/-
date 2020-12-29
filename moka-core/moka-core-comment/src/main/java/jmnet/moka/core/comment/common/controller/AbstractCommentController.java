package jmnet.moka.core.comment.common.controller;

import jmnet.moka.core.comment.common.logger.CommentLogger;
import jmnet.moka.core.common.mvc.MessageByLocale;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.comment.common.controller
 * ClassName : AbstractCommentController
 * Created : 2020-11-09 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-09 14:16
 */
public abstract class AbstractCommentController {

    @Autowired
    protected ModelMapper modelMapper;

    @Autowired
    protected MessageByLocale messageByLocale;

    @Autowired
    protected CommentLogger logger;

    /**
     * 시스템 메세지를 간편하게
     *
     * @param messageKey 메세지 키
     * @return 메세지
     */
    protected String msg(String messageKey) {
        return messageByLocale.get(messageKey);
    }

    /**
     * 시스템 메세지를 간편하게
     *
     * @param messageKey 메세지 키
     * @param parameters 메세지 파라미터들
     * @return 메세지
     */
    protected String msg(String messageKey, Object... parameters) {
        return messageByLocale.get(messageKey, parameters);
    }
}
