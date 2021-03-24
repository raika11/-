package jmnet.moka.web.push.sender;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.web.push.mvc.board.entity.Board;
import jmnet.moka.web.push.mvc.board.repository.BoardRepository;
import jmnet.moka.web.push.mvc.sender.dto.PushAppTokenSearchDTO;
import jmnet.moka.web.push.mvc.sender.entity.PushApp;
import jmnet.moka.web.push.mvc.sender.entity.PushAppToken;
import jmnet.moka.web.push.mvc.sender.entity.PushAppTokenStatus;
import jmnet.moka.web.push.mvc.sender.entity.PushContents;
import jmnet.moka.web.push.support.message.FcmMessage;
import jmnet.moka.web.push.support.message.Notification;
import jmnet.moka.web.push.support.sender.AbstractPushSender;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * <pre>
 * 게시판 답변 등록 알림 전송
 * Project : moka
 * Package : jmnet.moka.web.push.sender
 * ClassName : BoardReplySender
 * Created : 2021-03-23 ince
 * </pre>
 *
 * @author ince
 * @since 2021-03-23 10:56
 */

@Slf4j
@Service
public class BoardReplySender extends AbstractPushSender {

    @Autowired
    private BoardRepository boardRepository;

    @Override
    protected FcmMessage makePushMessage(PushContents pushContents, PushApp pushApp)
            throws Exception {
        String title = null;
        String content = null;
        String pushImgUrl = null;

        Board board = boardRepository
                .findById(pushContents.getRelContentId())
                .orElseThrow(() -> new NoDataException());

        try {
            title = pushContents.getTitle();
            content = pushContents.getContent();
            pushImgUrl = pushContents.getPushImgUrl();
        } catch (Exception e) {
            log.debug(e.toString());
        }

        if (pushApp
                .getAppOs()
                .equals("iOS")) {
            Notification notification = new Notification();
            notification.setTitle(title);
            notification.setBody(content);
            notification.setContent_available("true");
            notification.setMutable_content("true");
            notification.setUrl("http://dn.joongdo.co.kr");
            notification.setKey3(153);
            notification.setImage_url(pushImgUrl);

            return FcmMessage
                    .builder()
                    .notification(notification)
                    .build();
        } else {
            Map<String, String> data = new HashMap<>();
            data.put("key1", title);
            data.put("key2", content);
            data.put("key3", "http://dn.joongdo.co.kr");
            data.put("img_name", pushImgUrl);

            return FcmMessage
                    .builder()
                    .to(board.getToken())
                    .data(data)
                    .build();
        }
    }

    @Override
    protected List<PushAppToken> findAllToken(PushAppTokenSearchDTO pushAppTokenSearch)
            throws Exception {

        List<PushAppToken> tokens = new ArrayList<>();
        tokens.add(PushAppToken
                .builder()
                .token(pushAppTokenSearch
                        .getPushMessage()
                        .getTo())
                .build());
        return tokens;
    }

    @Override
    protected PushAppTokenStatus findAppTokenStatus(Integer appSeq, Long contentSeq) {
        // 질문 작성자 한명한테만 쏜다.
        return PushAppTokenStatus
                .builder()
                .totalCount(1L)
                .lastTokenSeq(1L)
                .build();
    }
}
