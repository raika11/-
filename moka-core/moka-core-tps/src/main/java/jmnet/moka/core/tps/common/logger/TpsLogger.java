package jmnet.moka.core.tps.common.logger;

import javax.servlet.http.HttpServletRequest;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.logger.ActionLogger;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.util.HttpHelper;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.editlog.entity.EditLog;
import jmnet.moka.core.tps.mvc.editlog.service.EditLogService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.common.logger
 * ClassName : TpsLogger
 * Created : 2020-10-19 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-19 13:15
 */
@Component
@Slf4j
public class TpsLogger {

    private final ActionLogger actionLogger;

    private final EditLogService editLogService;

    public TpsLogger(ActionLogger actionLogger, EditLogService editLogService) {
        this.actionLogger = actionLogger;
        this.editLogService = editLogService;
    }

    /**
     * 성공 로그 생성
     */
    public void success() {
        success(null, null, false);
    }

    /**
     * 성공 로그 생성
     *
     * @param msg 에러 메세지
     */
    public void success(String msg) {
        success(null, msg, false);
    }

    /**
     * 성공 로그 생성
     *
     * @param msg            에러 메세지
     * @param isEditLogWrite 편집 로그 출력 여부
     */
    public void success(String msg, boolean isEditLogWrite) {
        success(null, msg, isEditLogWrite);
    }

    /**
     * 성공 로그 생성
     *
     * @param actionType 액션 유형
     */
    public void success(ActionType actionType) {
        success(actionType, null, false);
    }


    /**
     * 성공 로그 생성
     *
     * @param isEditLogWrite 편집 로그 출력 여부
     */
    public void success(boolean isEditLogWrite) {
        success(null, null, isEditLogWrite);
    }


    /**
     * 성공 로그 생성
     *
     * @param actionType 액션 유형
     * @param msg        에러 메세지
     */
    public void success(ActionType actionType, String msg) {
        success(actionType, msg, false);
    }

    /**
     * 성공 로그 생성
     *
     * @param actionType     액션 유형
     * @param isEditLogWrite 편집 로그 출력 여부
     */
    public void success(ActionType actionType, boolean isEditLogWrite) {
        success(actionType, null, false);
    }

    /**
     * 성공 로그 생성
     *
     * @param actionType     액션 유형
     * @param msg            에러 메세지
     * @param isEditLogWrite 편집 로그 출력 여부
     */
    public void success(ActionType actionType, String msg, boolean isEditLogWrite) {
        EditLog editLog = makeEditLog(actionType, MokaConstants.YES, msg);
        actionLogger.success(editLog.getMemberId(), editLog.getAction(), editLog.getExecutedTime(), msg);
        try {
            if (isEditLogWrite) {
                editLogService.insertEditLog(editLog);
            }
        } catch (Exception ex) {
            log.error("[TPS LOGGER ERROR] : {}", ex.toString());
        }
    }

    /**
     * 실패 로그 생성
     *
     * @param msg 에러 메세지
     */
    public void fail(String msg) {
        fail(null, msg, false);
    }

    /**
     * 실패 로그 생성
     *
     * @param msg            에러 메세지
     * @param isEditLogWrite isEditLogWrite 편집 로그 출력 여부
     */
    public void fail(String msg, boolean isEditLogWrite) {
        fail(null, msg, isEditLogWrite);
    }

    /**
     * 실패 로그 생성
     *
     * @param actionType 액션 유형
     * @param msg        에러 메세지
     */
    public void fail(ActionType actionType, String msg) {
        fail(actionType, msg, false);
    }

    /**
     * 실패 로그 생성
     *
     * @param actionType     액션 유형
     * @param msg            에러 메세지
     * @param isEditLogWrite 편집 로그 출력 여부
     */
    public void fail(ActionType actionType, String msg, boolean isEditLogWrite) {
        EditLog editLog = makeEditLog(actionType, MokaConstants.NO, msg);
        actionLogger.fail(editLog.getMemberId(), editLog.getAction(), editLog.getExecutedTime(), msg);
        try {
            if (isEditLogWrite) {
                editLogService.insertEditLog(editLog);
            }
        } catch (Exception ex) {
            log.error("[TPS LOGGER ERROR] : {}", ex.toString());
        }
    }

    /**
     * 스킵 로그 생성
     *
     * @param msg 액션 유형
     */
    public void skip(String msg) {
        skip(null, msg);
    }

    /**
     * 스킵 로그 생성
     *
     * @param actionType 액션 유형
     * @param msg        에러 메세지
     */
    public void skip(ActionType actionType, String msg) {
        EditLog editLog = makeEditLog(actionType, MokaConstants.NO, msg);
        actionLogger.skip(editLog.getMemberId(), editLog.getAction(), editLog.getExecutedTime(), msg);
    }

    /**
     * 에러 로그 생성
     *
     * @param msg 에러 메세지
     */
    public void error(String msg) {
        error(null, msg, null, false);
    }

    /**
     * 에러 로그 생성
     *
     * @param msg            에러 메세지
     * @param isEditLogWrite 편집 로그 출력 여부
     */
    public void error(String msg, boolean isEditLogWrite) {
        error(null, msg, null, isEditLogWrite);
    }

    /**
     * 에러 로그 생성
     *
     * @param actionType 액션 유형
     * @param msg        에러 메세지
     */
    public void error(ActionType actionType, String msg) {
        error(actionType, msg, null, false);
    }

    /**
     * 에러 로그 생성
     *
     * @param actionType     액션 유형
     * @param msg            에러 메세지
     * @param isEditLogWrite 편집 로그 출력 여부
     */
    public void error(ActionType actionType, String msg, boolean isEditLogWrite) {
        error(actionType, msg, null, isEditLogWrite);
    }

    /**
     * 에러 로그 생성
     *
     * @param t Throwable
     */
    public void error(Throwable t) {
        error(null, null, t, false);
    }

    /**
     * 에러 로그 생성
     *
     * @param t              Throwable
     * @param isEditLogWrite 편집 로그 출력 여부
     */
    public void error(Throwable t, boolean isEditLogWrite) {
        error(null, null, t, isEditLogWrite);
    }

    /**
     * 에러 로그 생성
     *
     * @param msg 에러 메세지
     * @param t   Throwable
     */
    public void error(String msg, Throwable t) {
        error(null, msg, t, false);
    }

    /**
     * @param msg            에러 메세지 * @param t   Throwable
     * @param isEditLogWrite 편집 로그 출력 여부
     */
    public void error(String msg, Throwable t, boolean isEditLogWrite) {
        error(null, msg, t, isEditLogWrite);
    }

    /**
     * 에러 로그 생성
     *
     * @param actionType 액션 유형
     * @param t          Throwable
     */
    public void error(ActionType actionType, Throwable t) {
        error(actionType, null, t, false);
    }

    /**
     * 에러 로그 생성
     *
     * @param actionType     액션 유형
     * @param msg            에러 메세지
     * @param t              Throwable
     * @param isEditLogWrite 편집 로그 출력 여부
     */
    public void error(ActionType actionType, String msg, Throwable t, boolean isEditLogWrite) {
        String errorMsg = McpString.defaultValue(msg) + (t != null ? t.getMessage() : "");
        EditLog editLog = makeEditLog(actionType, MokaConstants.NO, errorMsg);
        actionLogger.error(editLog.getMemberId(), editLog.getAction(), editLog.getExecutedTime(), msg, t);
        try {
            if (isEditLogWrite) {
                editLogService.insertEditLog(editLog);
            }
        } catch (Exception ex) {
            log.error("[TPS LOGGER ERROR] : {}", ex.toString());
        }
    }

    /**
     * HttpServletRequest와 Authentication로 편집 로그 정보를 생성한다.
     *
     * @param actionType 행위
     * @param successYn  성공 여부
     * @param errorMsg   에러 메세지
     * @return EditLog
     */
    private EditLog makeEditLog(ActionType actionType, String successYn, String errorMsg) {

        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();
        String memberId = auth != null ? (String) auth.getPrincipal() : MokaConstants.USER_UNKNOWN;

        HttpServletRequest req = RequestContextHolder.getRequestAttributes() != null
                ? ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest()
                : null;
        if (actionType == null && req != null) {
            actionType = getAction(req.getMethod());
        }
        Long processStartTime =
                req != null ? System.currentTimeMillis() - Long.parseLong(McpString.defaultValue(req.getAttribute("processStartTime"), "0")) : 0;
        String url = req != null ? McpString.defaultValue(req.getRequestURI(), MokaConstants.UNKNOWN) : MokaConstants.IP_UNKNOWN;
        String menuId =
                req != null ? McpString.defaultValue(req.getHeader(TpsConstants.HEADER_MENU_ID), MokaConstants.IP_UNKNOWN) : MokaConstants.IP_UNKNOWN;
        String param = req != null ? McpString.defaultValue(HttpHelper.getParamString(req, "&"), MokaConstants.IP_UNKNOWN) : MokaConstants.IP_UNKNOWN;
        String remoteAddr = req != null ? McpString.defaultValue(HttpHelper.getRemoteAddr(req), MokaConstants.IP_UNKNOWN) : MokaConstants.IP_UNKNOWN;


        return EditLog
                .builder()
                .action(actionType)
                .memberId(memberId)
                .menuId(menuId)
                .successYn(successYn)
                .param(param)
                .regIp(remoteAddr)
                .executedTime(processStartTime)
                .apiPath(url)
                .errMsg(errorMsg)
                .build();
    }

    public ActionType getAction(String method) {
        ActionType actionType;
        switch (method.toUpperCase()) {
            case "GET":
                actionType = ActionType.SELECT;
                break;
            case "POST":
                actionType = ActionType.INSERT;
                break;
            case "PUT":
                actionType = ActionType.UPDATE;
                break;
            case "DELETE":
                actionType = ActionType.DELETE;
                break;
            default:
                actionType = ActionType.UNKNOWN;
        }

        return actionType;
    }

}
