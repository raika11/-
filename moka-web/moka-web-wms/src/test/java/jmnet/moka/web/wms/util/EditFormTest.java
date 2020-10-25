package jmnet.moka.web.wms.util;

import jmnet.moka.core.tps.helper.EditFormHelper;

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
//@RunWith(SpringRunner.class)
//@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
//@AutoConfigureMockMvc
public class EditFormTest {
    //@Autowired
    //private ObjectMapper objectMapper;

    //@Test
    public static void main(String[] args)
            throws Exception {
        String filePath = "C:\\box\\edit_form\\xml\\15re_home_bottom.xml";

        EditFormHelper.mapping(filePath);

        System.out.println(EditFormHelper.getPart("15re_home_bottom.xml", "bottom_photo_vod"));
    }



    public static void grouping() {

    }
}
