export function resizeImage(file: File, maxResolution: number = 1000): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    reader.onerror = (error) => reject(error);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxResolution) {
          height = Math.round((height * maxResolution) / width);
          width = maxResolution;
        }
      } else {
        if (height > maxResolution) {
          width = Math.round((width * maxResolution) / height);
          height = maxResolution;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(new File([blob], file.name, {type: file.type}));
        } else {
          reject(new Error("Canvas is empty"));
        }
      }, file.type);
    };

    reader.readAsDataURL(file);
  });
}
