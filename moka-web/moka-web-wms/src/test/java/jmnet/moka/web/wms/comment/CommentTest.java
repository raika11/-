package jmnet.moka.web.wms.comment;

import jmnet.moka.core.comment.mvc.comment.entity.Comment;
import jmnet.moka.core.comment.mvc.comment.entity.CommentPk;
import jmnet.moka.core.comment.mvc.comment.repository.CommentRepository;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.web.wms.comment
 * ClassName : CommentTest
 * Created : 2020-12-28 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-28 09:21
 */

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Slf4j
public class CommentTest {

    @Autowired
    private CommentRepository commentRepository;

    @Test
    public void selectComment() {
        Comment comment = commentRepository
                .findById(CommentPk
                        .builder()
                        .commentSeq(6187671)
                        .psn(6187671)
                        .build())
                .get();
        log.debug(comment.getCont());
    }
}
