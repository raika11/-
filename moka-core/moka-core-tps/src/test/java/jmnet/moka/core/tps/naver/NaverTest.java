/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.naver;

import java.io.File;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.commons.io.FileUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2020-12-15
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
public class NaverTest {

    @Test
    public void getDomain()
            throws Exception {

        String path = "C:\\box\\static\\newsStand\\Joongang_v4.html";
        String html = FileUtils.readFileToString(new File(path), "UTF-8");

        Pattern pattern1 = Pattern.compile("<a href=\\\"(?<entry>.*?)\\\"");
        Pattern pattern2 = Pattern.compile("src=\\\"(?<entry>.*?)\\\"");
        Pattern pattern3 = Pattern.compile("src='(?<entry>.*?)'");

        Matcher matcher1 = pattern1.matcher(html);
        int i = 0;
        while (matcher1.find()) {
            i++;
            System.out.println(matcher1.group());
        }
    }
}
