export class LocalStorageHelpers {

  public static Keys = {
    backgroundImageKey: 'backgroundImage',
  };

  public static saveImage = (file: Blob): Promise<{}> => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.addEventListener('load', () => {
        try {
          localStorage.setItem(LocalStorageHelpers.Keys.backgroundImageKey, reader.result as string);
          resolve();
        } catch(e) {
          reject(e);
        }
      });
      reader.readAsDataURL(file);
    });
  }

  public static clearImage = (): void => {
    localStorage.setItem(LocalStorageHelpers.Keys.backgroundImageKey, '');
  }

  public static getImageUrl = (): string => {
    return localStorage.getItem(LocalStorageHelpers.Keys.backgroundImageKey);
  }
}
