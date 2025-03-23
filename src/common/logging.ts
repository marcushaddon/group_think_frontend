type Log = {
    type: 'info' | 'error',
    msg: string,
    ctx?: Record<string, any>
}

const logs: Log[] = [];

export const error = (msg: string, ctx: Record<string, any> = {}) => {
    console.error(msg, ctx);
    alert(msg);

    logs.push({
        type: 'error',
        msg,
        ctx
    });
};

export const log = (msg: string, ctx: Record<string, any> = {}) => {
    console.log(msg, ctx);

    logs.push({
        type: 'info',
        msg,
        ctx
    });
};

export const assert = (cond: boolean, msg: string, extra?: any): true => {
    if (cond) {
        return true;
    }

    const message = `ASSERTION: ${msg}`;
    error(message, extra);

    throw new Error(msg);
}

export const saveLogs = () => {
    const json = JSON.stringify(logs, null, 2);
    const blob = new Blob([json], { type: 'octet/stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'logs.json';
    a.click();
    window.URL.revokeObjectURL(url);
}
