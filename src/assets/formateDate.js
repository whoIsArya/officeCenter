
  function timestampToDate(timestamp) {
    let date = new Date(timestamp);
    let Y = date.getFullYear();
    let M = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1;
    let D = date.getDate() < 10 ? '0'+date.getDate() : date.getDate();
    return Y+'/'+M+'/'+D;
  }
  function timestampToTime(timestamp) {
    let h = Math.floor(timestamp/3600)<10 ? '0'+Math.floor(timestamp/3600) : Math.floor(timestamp/3600);
    let m = Math.floor(timestamp/60)%60<10 ? '0'+Math.floor(timestamp/60)%60 : Math.floor(timestamp/60)%60;
    return h+":"+m;
  }



export {
  timestampToDate,
  timestampToTime
}
