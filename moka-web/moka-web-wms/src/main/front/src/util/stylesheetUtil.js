export const changeThemeStyle = (name) => {
    detachStylesheets();
    insertStylesheet('/css/' + name + '.css');
};

export const detachStylesheets = () => {
    Array.from(document.querySelectorAll('link[rel="stylesheet"]')).forEach((style) => {
        style.parrentNode.removeChild(style);
    });
};

export const insertStylesheet = (href) => {
    let link = document.createElement('link');
    link.href = href;
    link.type = 'text/css';
    link.rel = 'stylesheet';
    document.getElementsByTagName('head')[0].appendChild(link);
};
