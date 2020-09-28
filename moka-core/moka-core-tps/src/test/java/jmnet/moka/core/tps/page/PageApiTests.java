package jmnet.moka.core.tps.page;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.aspectj.lang.annotation.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import com.fasterxml.jackson.databind.ObjectMapper;
import jmnet.moka.core.tps.mvc.page.dto.PageDTO;

/**
 * 페이지 rest api 테스트
 * 
 * @author ohtah
 *
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
public class PageApiTests {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    MockMvc mockMvc;

    @Before(value = "")
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).build();
    }


    @WithMockUser("superadmin")
    @Test
    public void putTest() throws Exception {
        PageDTO pageDto = PageDTO.builder().pageSeq((long) 1)
                // .domainInfo
                .pageServiceName("s1").pageDisplayName("홈").pageType("text/html").pageUrl("/")
                .pageName("홈")
                // .parent
                // .pageOrder("1")
                .kwd("메인").description("").useYn("Y").pageBody("내용")
                // .createDt("20200227000000").modifyDt("20200318180704")
                // .creator("superadmin").modifier("superadmin")
                .build();
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(pageDto);

        // MethodArgumentNotValidException에버발생 테스트.
        mockMvc.perform(put("/api/pages/1").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isOk()).andDo(print());
    }

}
