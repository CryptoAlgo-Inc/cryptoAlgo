window.onload = function() {
    document.body.classList.add('focused');
}
window.onfocus = function() {
    if (document.body.classList.contains('no-focus')) {
        document.body.classList.add('focused');
        document.body.classList.remove('no-focus');
    }
}
window.onblur = function() {
    if (document.body.classList.contains('focused')) {
        document.body.classList.add('no-focus');
        document.body.classList.remove('focused');
    }
}