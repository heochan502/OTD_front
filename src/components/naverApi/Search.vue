<!-- <script setup>
// // 네이버 검색 API 예제 - 블로그 검색
// var express = require('express');
// var app = express();
// var client_id = '';
// var client_secret = '';
// app.get('/search/local', function (req, res) {

//    var api_url = 'https://openapi.naver.com/v1/search/local?query=' + encodeURI(req.query.query); // JSON 결과
// //   var api_url = 'https://openapi.naver.com/v1/search/blog.xml?query=' + encodeURI(req.query.query); // XML 결과
//    var request = require('request');
//    var options = {
//        url: api_url,
//        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
//     };
//    request.get(options, function (error, response, body) {
//      if (!error && response.statusCode == 200) {
//        res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
//        res.end(body);
//      } else {
//        res.status(response.statusCode).end();
//        console.log('error = ' + response.statusCode);
//      }
//    });
//  });


//  app.listen(3000, function () {
//    console.log('http://127.0.0.1:3000/search/blog?query=검색어 app listening on port 3000!');
//  });


import { ref } from "vue";
import axios from "axios";

const result = ref(null);

const search = async () => {
  try {
    const res = await axios.get("http://localhost:3000/search/local", {
      params: { query: "맛집" },
    });
    result.value = res.data;
  } catch (e) {
    console.error(e);
  }
};

</script>

<template>
    <h1>검색하는곳  </h1>
    

</template>

!-->

<script setup>
import axios from "axios";
import { ref } from "vue";

const results = ref([]);

const searchLocal = async (keyword) => {
  try {
    const res = await axios.get(`/api/search/local`, {
      params: { query: keyword }
    });
    results.value = res.data.items;
  } catch (err) {
    console.error(err);
  }
};
</script>

<template>
  <div>
    <input type="text" @keyup.enter="searchLocal($event.target.value)" placeholder="검색어 입력" />
    <ul>
      <li v-for="item in results" :key="item.title">{{ item.title }}</li>
    </ul>
  </div>
</template>


<style scoped>

</style> 