# Node.JS

# 처리과정
웹서버에서 주로 이루어지는 일은 서버에서 파일을 연 후 클라이언트에게 내용을 반환해주는 형식이다.

Node.js가 파일 요청을 실행하는 순서
1. 컴퓨터의 파일 시스템으로 일을 보낸다.
2. 다음 요청을 처리할 준비를 한다.
3. 파일 시스템이 열리고 파일을 읽을 대, 서버는 클라이언트에게 내용들을 반환한다.

# 특징
- Single-Thread
- Non-Blocking
- Asynchronous Programming
- Memory Efficient

# Do
- 동적 페이지 내용 생성 가능
- 서버에서 파일들을 만들고, 열고, 읽고, 쓰고, 지우고, 끄는 것이 가능
- 데이터 수집
- 데이터베이스 안에 데이터를 추가하고, 지우고, 수정 가능하다.
