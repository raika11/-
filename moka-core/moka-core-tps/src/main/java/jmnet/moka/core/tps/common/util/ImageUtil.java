package jmnet.moka.core.tps.common.util;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import javax.imageio.ImageIO;
import org.springframework.web.multipart.MultipartFile;

public class ImageUtil {

    public static final String JPG_EXTENSTION = "jpg";

    /**
     * <pre>
     * MultipartFile이 이미지인지 확인한다
     * </pre>
     * 
     * @param file MultipartFile
     * @return 이미지 여부
     */
    public static boolean isImage(MultipartFile file) {
        if (file.getContentType().startsWith("image")) {
            return true;
        }
        return false;
    }
    
    /**
     * <pre>
     * 이미지 리사이즈
     * </pre>
     * 
     * @param inputStream InputStream
     * @param width 가로사이즈
     * @param height 세로사이즈
     * @return buffered Image
     * @throws IOException 입출력예외
     */
    public static BufferedImage resize(InputStream inputStream, int width, int height)
            throws IOException {
        BufferedImage inputImage = ImageIO.read(inputStream);

        BufferedImage outputImage =
                new BufferedImage(width, height, inputImage.getType());

        Graphics2D graphics2D = outputImage.createGraphics();
        graphics2D.drawImage(inputImage, 0, 0, width, height, null);
        graphics2D.dispose();

        return outputImage;
    }
    
    /**
     * <pre>
     * 이미지 리사이즈(가로사이즈만 사용)
     * </pre>
     * 
     * @param inputStream InputStream
     * @param width 가로사이즈
     * @return buffered Image
     * @throws IOException 입출력예외
     */
    public static BufferedImage resize(InputStream inputStream, int maxWidth)
            throws IOException {
        BufferedImage inputImage = ImageIO.read(inputStream);
        int newWidth = inputImage.getWidth();
        int newHeight = inputImage.getHeight();
        
        if (newWidth > maxWidth) {
            newWidth = maxWidth;
            newHeight = inputImage.getHeight() * maxWidth / inputImage.getWidth();
        }

        BufferedImage outputImage =
                new BufferedImage(newWidth, newHeight, inputImage.getType());

        Graphics2D graphics2D = outputImage.createGraphics();
        graphics2D.drawImage(inputImage, 0, 0, newWidth, newHeight, null);
        graphics2D.dispose();

        return outputImage;
    }
}
