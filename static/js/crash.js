var OriginTitle = document.title;
var titleTime;
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        $('[rel="icon"]').attr('href', "/favicon.png");
        document.title = '╭(°A°`)╮ 页面崩溃啦 ~';
        clearTimeout(titleTime);
    } else {
        $('[rel="icon"]').attr('href', "/favicon.png");
        document.title = '(ฅ>ω