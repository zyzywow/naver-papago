const express = require("express");
const morgan = require("morgan");
const axios = require("axios");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv").config();
const NAVER_ID = process.env.NAVER_ID;
const NAVER_SECRET_ID = process.env.NAVER_SECRET_ID;

app.set("port", process.env.PORT || 8099);
// process.env.PORT ->서버에서 이미 정해진 포트, 그포트가있으면 그것을 사용하거나 || 아니면 8099포트를 사용하겠다.

const port = app.get("port");
app.use(morgan("dev"));
// ()자세히 ,("dev")간략히
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// post로 데이터받을땐 위 두줄 작성
// post로 받은 데이터는 body로받아야하고 urlencoded작성해야함
// 클라이언트에서 method를 post로 보내면 app.post로받아야하고 받은데이터는 req.body로 받아야함
// get은 용량제한있어서 많은데이터불가 ,post는 용량이큼

app.get("/", (req, res) => {
  res.send("hello express");
});
app.post("/papago", (req, res) => {
  console.log(req.body.txt);
  const txt = req.body.txt;
  const language = req.body.language;
  axios({
    url: "https://openapi.naver.com/v1/papago/n2mt",
    method: "POST", // default는get
    params: {
      source: "ko",
      target: language,
      text: txt,
    },
    headers: {
      "X-Naver-Client-Id": NAVER_ID,
      "X-Naver-Client-Secret": NAVER_SECRET_ID,
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  })
    .then((response) => {
      console.log(response.data.message.result.translatedText);
      res.json({ result: response.data.message.result.translatedText });
    })
    .catch((error) => {
      res.send(error);
    });
});
app.listen(port, () => {
  console.log(`${port}번에서 서버 대기중`);
});
