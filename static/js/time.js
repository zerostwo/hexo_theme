function show_date_time() {
    window.setTimeout("show_date_time()", 1000);
    BirthDay = new Date("11/23/2018 23:56:24"); //这个日期是可以修改的
    today = new Date();
    timeold = (today.getTime() - BirthDay.getTime()); //其实仅仅改了这里
    sectimeold = timeold / 1000
    secondsold = Math.floor(sectimeold);
    msPerDay = 24 * 60 * 60 * 1000
    e_daysold = timeold / msPerDay
    daysold = Math.floor(e_daysold);
    e_hrsold = (e_daysold - daysold) * 24;
    hrsold = Math.floor(e_hrsold);
    e_minsold = (e_hrsold - hrsold) * 60;
    minsold = Math.floor((e_hrsold - hrsold) * 60);
    seconds = Math.floor((e_minsold - minsold) * 60);
    span_dt_dt.innerHTML = "网站已经运行" + daysold + "天" + hrsold + "小时" + minsold + "分钟" + seconds + "秒";
}
show_date_time();