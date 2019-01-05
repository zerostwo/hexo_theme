jQuery.ajax({
    type: "POST",
    url: "/aip/AipFace.py",
    success: function (msg) {
        alert("Data Saved: " + msg);
    }
 });