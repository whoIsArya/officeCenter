
  function timestampToDate(timestamp,format) {
    let date = new Date(timestamp);
    let Y = date.getFullYear();
    let M = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1;
    let D = date.getDate() < 10 ? '0'+date.getDate() : date.getDate();
    let H = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    let m = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes();
    let s = date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds();
    if(format === '-'){
      return Y+'-'+M+'-'+D
    }else if(format === 'all'){
      return Y+'/'+M+'/'+D+ ' '+H+":"+m+":"+s
    }else if(format === 'zi'){
      return Y+'年'+M+'月'
    }else{
      return Y+'/'+M+'/'+D
    }
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
