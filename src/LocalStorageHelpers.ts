export class LocalStorageHelpers {

  public static QuotaLength = 5 * 1000 * 1000; // For strings

  public static Keys = {
    backgroundImageKey: 'backgroundImage',
  };

  public static saveBackgroundImage = (file: Blob): Promise<string> => {
    const error = {
      message: 'The image size is too big. Please try a smaller image.',
    };

    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.addEventListener('load', () => {
        const image = new Image();
        image.addEventListener('load', () => {
          const canvas = document.createElement('canvas');

          let scale = 1.0;
          let quality = 1.0;

          let dataURL = reader.result as string;

          if (dataURL.length > LocalStorageHelpers.QuotaLength) {
            // JPEG compression is really good while retaining good quality, so we try that first.
            quality = 0.92;
            LocalStorageHelpers.drawImage(canvas, image, scale);
            dataURL = LocalStorageHelpers.getDataURL(canvas, quality);
          }

          let counter = 1;
          while (dataURL.length > LocalStorageHelpers.QuotaLength) {
            // By scaling each dimension by 0.7, we shrink the entire image by 0.7 * 0.7 = 0.49
            // which is roughly half.
            scale *= 0.7;

            LocalStorageHelpers.drawImage(canvas, image, scale);
            dataURL = LocalStorageHelpers.getDataURL(canvas, quality);

            counter += 1;
            if (counter > 10) {
              // Now, we've shrunk the 0.92 compressed jpg image 2^10 times.
              // If the image is still too big at this point, then I don't know what to say.
              return reject(error);
            }
          }

          // console.log(`original image size: ${(reader.result as string).length / 1000 / 1000}MB`);
          // console.log('scale', scale, 'quality', quality, 'size', `${dataURL.length / 1000 / 1000}MB`);

          try {
            localStorage.setItem(LocalStorageHelpers.Keys.backgroundImageKey, dataURL);
            return resolve(dataURL);
          } catch(error) {
            // If we're ever here, then probably the QuotaLength changed from 5MB to something else...
            // This would be pretty concerning.
            return reject(error);
          }
        });

        const readerResult = reader.result as string;
        if (readerResult.length > 10 * LocalStorageHelpers.QuotaLength) {
          // Reject super large image uploads.
          return reject(error);
        }
        image.src = readerResult;
      });
      reader.readAsDataURL(file);
    });
  }

  public static saveBackgroundImageRaw(dataURL: string): Promise<{}> {
    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem(LocalStorageHelpers.Keys.backgroundImageKey, dataURL);
        return resolve();
      } catch(error) {
        // If we're ever here, then probably the QuotaLength changed from 5MB to something else...
        // This would be pretty concerning.
        return reject(error);
      }
    });
  }

  public static clearBackgroundImage = (): void => {
    localStorage.setItem(LocalStorageHelpers.Keys.backgroundImageKey, '');
  }

  public static getBackgroundImageUrl = (): string => {
    return localStorage.getItem(LocalStorageHelpers.Keys.backgroundImageKey);
  }

  private static drawImage = (canvas: HTMLCanvasElement, image: HTMLImageElement, scale: number): void => {
    const width = Math.floor(image.width * scale);
    const height = Math.floor(image.height * scale);

    canvas.width = width;
    canvas.height = height;

    canvas.getContext('2d').drawImage(image, 0, 0, width, height);
  }

  private static getDataURL = (canvas: HTMLCanvasElement, quality: number): string => {
    return canvas.toDataURL('image/jpeg', quality) as string;
  }
}
