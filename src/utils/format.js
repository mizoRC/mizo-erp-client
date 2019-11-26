import { format } from 'date-fns';

export const formatDate = date => {
    try {
        const correctUnix = parseInt(date / 1000);
        const dateFormated = format(new Date(correctUnix * 1000), 'dd/MM/yyyy HH:mm:ss');
        return dateFormated
    } catch (error) {
        return "";
    }
}

export const formatOnlyDate = date => {
    try {
        const correctUnix = parseInt(date / 1000);
        const dateFormated = format(new Date(correctUnix * 1000), 'dd/MM/yyyy');
        return dateFormated
    } catch (error) {
        return "";
    }
}

export const formatOnlyTime = date => {
    try {
        const correctUnix = parseInt(date / 1000);
        const dateFormated = format(new Date(correctUnix * 1000), 'HH:mm:ss');
        return dateFormated
    } catch (error) {
        return "";
    }
}

export const formatSearchDate = date => {
    try {
        const correctUnix = parseInt(date / 1000);
        const dateFormated = format(new Date(correctUnix * 1000), 'yyyy-MM-dd');
        return dateFormated
    } catch (error) {
        return "";
    }
}