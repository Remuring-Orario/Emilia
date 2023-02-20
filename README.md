# 레무링 오라리오 - 에밀리아

## ❓ 에밀리아 봇

에밀리아 봇은 [레무링 오라리오](https://rem-guilds.xyz) 서버의 관리봇입니다!  
Node.js, Discord.js, MongoDB를 사용하여 제작된 봇입니다.  
코드 사용시  ⭐ 눌러주세요!
  
  
## ❗기능들

서버를 관리하기 위한 슬래시 커멘드로 명령어가 구성되어있어요!  

*  관리 명령어 `/금지어` - `/닫기` - `/뮤트` - `/밴`- `/채택순위` - `/청소` - `/킥`
*  로깅 명령어 `메시지 삭제로그`, `메시지 수정로그`, `금지어 감지`, `스레드 생성`

## 📝 사용법

node 16 이상 버전과 Discord.js 13.4 버전을 사용하셔야 합니다.  
봇 사용전 `config.json`을 수정해야 합니다.  
```json
{
    "token": "디스코드 봇 토큰",
    "mongooseURL": "몽고DB URL",
    "guildId": "서버 아이디",
    "channelId": "스레드가 생성될 채널 ID",
    "welcomeChannelId": "입장 로그 채널 ID",
    "byeChannelId": "퇴장 로그 채널 ID",
    "botPath": "봇 파일 경로", # 예시 C:\Users\user\Downloads/emilia
    "logChannelId": "메시지 수정 / 삭제로그 ID"
}
```

MongoDB의 URL은 [이곳](https://youtu.be/u-XiI28XRh4) 에서 확인하실 수 있습니다.

> 모듈설치
```shell
$ npm install
```


## 📖 라이센스

해당 프로젝트는 AGPL-3.0 License 약관을 따릅니다.  
소스코드 사용시 반드시 라이센스를 지켜주세요.

## 📜 오픈소스

에밀리아 봇에는 아래와 같은 오픈소스를 사용했습니다.

* **[대찌 유튜브](https://www.youtube.com/watch?v=L_pB0g4i0_M)** - 30강. 금지어 추가 ,삭제 , 감지
