package jmnet.moka.web.rcv.util;

import java.awt.Color;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import javax.imageio.ImageIO;
import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.util
 * ClassName : RcvImageUtil
 * Created : 2020-11-05 005 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-05 005 오전 11:11
 */
@Slf4j
public class RcvImageUtil {
    public static boolean combineWatermarkImage(String targetImage, String imageUrl, String watermarkUrl) {
        try {
            File file = new File(targetImage);
            if (file.exists()) {
                if (!file.delete()) {
                    return false;
                }
            }

            BufferedImage image = ImageIO.read(new URL(imageUrl));
            BufferedImage waterMark = ImageIO.read(new URL(watermarkUrl));

            final int x = 0;
            final int y = image.getHeight() - waterMark.getHeight();

            Graphics g = image.getGraphics();
            g.drawImage(waterMark, x, y, null);
            g.dispose();

            ImageIO.write(image, "JPG", file);
            return true;
        } catch (IOException e) {
            return false;
        }
    }

    public static boolean downloadImage(String sourceUrl, String targetFilename) {
        FileOutputStream fos = null;
        InputStream is = null;
        try {
            fos = new FileOutputStream(targetFilename);

            URL url = new URL(sourceUrl);
            URLConnection urlConnection = url.openConnection();
            is = urlConnection.getInputStream();
            byte[] buffer = new byte[1024];
            int readBytes;
            while ((readBytes = is.read(buffer)) != -1) {
                fos.write(buffer, 0, readBytes);
            }
            return true;
        } catch (IOException e) {
            return false;
        } finally {
            try {
                if (fos != null) {
                    fos.close();
                }
                if (is != null) {
                    is.close();
                }
            } catch (IOException e) {
                // no
            }
        }
    }

    public static boolean resizeMaxWidthHeight(String targetImage, String sourceUrl, int maxWidth, int maxHeight) {
        try {
            File file = new File(targetImage);
            if (file.exists()) {
                if (!file.delete()) {
                    return false;
                }
            }
            BufferedImage image = ImageIO.read(new URL(sourceUrl));

            final double ratioWidth = (double) maxWidth / image.getWidth();
            final double ratioHeight = (double) maxHeight / image.getHeight();

            int newWidth;
            int newHeight;
            if (ratioWidth < ratioHeight) {
                newWidth = maxWidth;
                newHeight = (int) (image.getHeight() * ratioWidth + 0.5);
            } else {
                newWidth = (int) (image.getWidth() * ratioHeight + 0.5);
                newHeight = maxHeight;
            }

            BufferedImage output = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_RGB);
            Graphics g = output.createGraphics();
            //g.drawImage(image, 0, 0, newWidth, newHeight, null);
            g.drawImage( image, 0, 0, newWidth, newHeight, Color.WHITE, null);
            g.dispose();

            ImageIO.write(output, "JPG", file);
            return true;

        } catch (Exception e) {
            log.error(e.getMessage());
            return false;
        }
    }
}
