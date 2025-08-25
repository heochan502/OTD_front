<script setup>
import { onMounted } from 'vue';
// 0izjxf2cko


onMounted(() => {
  // // 이미 스크립트가 추가되었는지 확인
  // if (!document.querySelector("#naver-map-script")) {
  //   const script = document.createElement("script");
  //   script.id = "naver-map-script";
  //   script.src =
  //     "https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=0izjxf2cko";
  //   script.async = true;
  //   script.defer = true;
  //   document.head.appendChild(script);

  //   script.onload = () => {
  //     initMap();
  //   };
  // } else {
  //   initMap();
  // }

  // function initMap() {
  //   const mapOptions = {
  //     center: new naver.maps.LatLng(37.3595704, 127.105399),
  //     zoom: 10, 
  //   };
  //   new naver.maps.Map("map", mapOptions);
  // }
});
const script = document.createElement("script");
 script.src = "https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=0izjxf2cko"; 
script.async = true; script.defer = true; document.head.appendChild(script); script.onload = () => 
{ new naver.maps.Map("map", { center: new naver.maps.LatLng(37.5670135, 126.978374), zoom: 10, }); };


</script>

<template>


    <!-- <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
    <title>간단한 지도 표시하기</title> -->
    <div  style="width:100%; height:600px;">
    <div id="map"  style="width:100%; height:100%;">  <span>f</span> </div>
    </div>
    <h1>이거 불러지는 거에요 ?</h1>

    
</template>

<style scoped>
#map{
  
}

</style>