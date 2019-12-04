export function getCurrentPosition(options = {}) {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve, reject, options);
        }
        else {
            resolve();
        }
    });
}