package jmnet.moka.web.wms.util;

import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.core.tps.helper.DynamicFormHelper;
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
 * Package : jmnet.moka.web.wms.util
 * ClassName : XmlTest
 * Created : 2020-10-23 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-23 19:14
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
public class EditFormTest {

    @Autowired
    private DynamicFormHelper dynamicFormHelper;

    @Test
    public void initFormData()
            throws MokaException {

        dynamicFormHelper.mapping("joongang", "15re_home_bottom");

        System.out.println(dynamicFormHelper.getPart("joongang", "15re_home_bottom.xml", "bottom_photo_vod"));
    }

    public static void grouping() {

    }
}
