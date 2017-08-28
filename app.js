const FCM = require("fcm-node");
const dotenv = require("dotenv");
const http = require("http");
const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

// For test in local (accept key in chrome first)
const privateKey = fs.readFileSync("./cert/server-key.pem", "utf8");
const certificate = fs.readFileSync("./cert/server-cert.pem", "utf8");

// in production (use your real cert.)
// const privateKey = fs.readFileSync('/etc/letsencrypt/live/{yourdomain}/privkey.pem', 'utf8')
// const certificate = fs.readFileSync('/etc/letsencrypt/live/{yourdomain}/cert.pem', 'utf8')

const credentials = { key: privateKey, cert: certificate };

const app = express();
dotenv.load();

const jsonParser = bodyParser.json();

app.post("/", jsonParser, function(req, res) {
  if (!req.body) return res.status(400).send({ error: "Bad Input" });
  if (!req.body.token)
    return res.status(422).send({ error: "Bad Input (missing token)" });

  const payload = {
    to: req.body.token,
    priority: "high",
    content_available: true,
    notification: {
      title: req.body.title || "default title",
      body: req.body.msg,
      sound: "default",
      badge: req.body.badge || 0,
      click_action: req.body.click_action || ""
    },
    data: req.body.data || { key: "value" }
  };

  if (payload.to.length) {
    const serverKey = process.env.FIREBASE_KEY;
    const fcm = new FCM(serverKey);

    fcm.send(payload, function(err, response) {
      if (err) return res.status(400).send(err);

      const fcmResponse = JSON.parse(response);
      return fcmResponse.success
        ? res.status(200).send({ status: "Success" })
        : res.status(400).send({ response: fcmResponse });
    });
  }
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(8088);
httpsServer.listen(8448);
