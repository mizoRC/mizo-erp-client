export const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

export const reduceBase64Size = (base64) => {
    return new Promise((resolve, reject) => {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        canvas.width = 120; // target width
        canvas.height = 120; // target height

        let image = new Image();

        image.onload = function() {
            ctx.drawImage(image, 
                0, 0, image.width, image.height, 
                0, 0, canvas.width, canvas.height
            );
            const resizedBase64 = canvas.toDataURL();

            resolve(resizedBase64);
        }

        image.src = base64;
    })
}