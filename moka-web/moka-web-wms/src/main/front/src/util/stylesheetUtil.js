export const changeThemeStyle = (name, id) => {
    detachStylesheets();
    insertStylesheet('/css/' + name + '.css', id);
};

export const detachStylesheets = () => {
    const target = document.querySelectorAll('link[rel="stylesheet"]');
    Array.from(target).forEach((style) => {
        style.parentNode.removeChild(style);
    });
};

export const insertStylesheet = (href, id) => {
    let link = document.createElement('link');
    link.href = href;
    if (id) link.id = id;
    link.type = 'text/css';
    link.rel = 'stylesheet';
    document.getElementsByTagName('head')[0].appendChild(link);
};
