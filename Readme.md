fcm-node-push
========
A Node.JS simple interface for test push notification with FCM


## Installation

    $ git clone 
    $ yarn
    $ cp .env.example .env
    replace ```{YOURKEY}``` with your FIREBASE_KEY

## Usage
#### Terminal

```
	$ npm start
```


#### Postman
url: http://localhost:8088/

header:

```
{
  "key":"Content-Type",
  "value":"application/json"
}
```

raw body:

```json
{
  "token": "{FCM Token}",
  "title": "title here",
  "msg": "message here",
  "badge": 0,
  "click_action": "DEFAULT_ACTION",
  "data": {
    "pushData": {
      "section": "SECTION_NAME",
      "studentId": "123456"
    }
  }
}
```

![postman](http://i.imgur.com/KuExlGk.png)
