# Docker 를 활용한 CI/CD

- Docker

컨테이너 기반의 오픈소스 가상화 플랫폼

- Container

다양한 프로그램, 실행환경을 추상화하고 동일한 인터페이스를 제공해 프로그램의 배포 및 관리를 단순하게 해줌.

가상화 기술의 하나이며 격리된 공간에서 프로세스가 동작하는 기술

기존 가상화 방식 - OS를 가상화 (호스트 OS 위에 게스트 OS 전체를 가상화하여 사용하는 방식), 무겁고 느려서 운영환경에서 사용불가

CPU의 가상화 기술(HVM)을 이용한 KVM(Kernel-based VM), 반가상화(Paravirtualization) 방식의 Xen 등장 -> 호스트형 가상화 방식에 비해 성능 향상

프로세스를 격리하는 방식 등장 - 리눅스 컨테이너라고 부름. 딱 프로세스가 필요한 만큼만 추가로 CPU, 메모리 소비

```text
Docker의 기본 네트워크 모드는 Bridge 모드로 약간의 성능 손실, 네트워크 성능이 중요한 프로그램의 경우 --net=host 옵션 고려
```

컨테이너 개념은 도커가 처음 만든 것은 아니지만, 가장 잘 쓰이고 있음.

- Image

컨테이너 실행에 필요한 파일과 설정값등을 포함하고 있음. 상태값을 가지지 않고 변하지 않는다.

컨테이너는 이미지를 실행한 상태, 추가되거나 변화하는 값은 컨테이너에 저장.

- Layer 저장방식

도커 이미지는 용량이 크기 때문에 Layer라는 개념을 사용, 유니온 파일 시스템을 이용해서 여러개의 레이어를 하나의 파일 시스템으로 사용할 수 있게 해줌.

이미지는 여러개의 read only 레이어로 구성되고 파일이 추가되거나 수정되면 새로운 레이어 생성

컨테이너 생성 시에도 레이어 방식, 기존의 이미지 레이어 위에 read write 레이어 추가

- 이미지 경로: url방식으로 관리하며 태그를 붙일 수 있음.
- Dockerfile: 이미지 만들기 위해 Dockerfile 파일 자체 DSL(Domain-specific language) 언어 이용해 이미지 생성 과정 적음.
- Command, API: 쉽고, http 기반의 REST API wldnjs

클라이언트와 서버 역할 각각 할 수 있고, 도커 커맨드를 입력하면 도커 클라이언트가 도커 서버가 명령을 전송하고 결과를 받아 터미널에 출력함.

기본값이 도커 서버의 소켓을 바라보고 있음. (mac이나 windows의 터미널에서 명령어 입력 시 가상 서버에 설치된 도커가 동작.)

컨테이너 삭제시 유지해야하는 데이터는 반드시 컨테이너 내부가 아닌 외부 스토리지에 저장 (Data Volumes or AWS S3)

Ex) 
```shell script
# after
docker run -d -p 3306:3306 \
  -e MYSQL_ALLOW_EMPTY_PASSWORD=true \
  --name mysql \
  -v /my/own/datadir:/var/lib/mysql \ # <- volume mount
  mysql:5.7
```

- Docker Compose

YAML 방식 설정 파일 이용한 Docker Compose로 컨테이너 생성 쉽게 가능.

- Docker 설치 (Linux 기준)
```shell script
curl -fsSL https://get.docker.com/ | sudo sh
sudo usermod -aG docker your-user # your-user 사용자에게 권한주기
```

- Docker 명령어
```shell script
docker ps
docker images
docker search [검색할이미지명]
docker pull [다운받을이미지명]
docker run [image name]  //forground 로 컨테이너 실행
docker run -d [image name] //backgorund 로 컨테이너 실행
docker exec -it [image name || container name] /bin/bash
docker exec -it -u root [image name || container name] /bin/bash         //루트권한으로 들어가기
```

- Docker compose

다른 기능의 컨테이너지만 같이 실행할 필요성이 있을 경우 (다양한 컨테이너를 관리 할 경우)

YAML 파일을 이용해 어떤 이미지를 사용해 어떤 컨테이너를 어떻게 실행시킬 것인지 기술함.

Ex) Maria DB, Apache 컨테이너 할 경우
```shell script
[root@localhost testuser]# docker run \
--name mdb \
-e MYSQL_ROOT_PASSWORD='1234' \
-d mariadb:latest
da6943f279767932259d28dfd6d0f92cb3c90499569c3907a6e08594e58b8b54

[root@localhost testuser]# docker run \
--name web \
-it \
-p 80:80 \
--link mdb:mdb docker_img
 * Restarting OpenBSD Secure Shell server sshd
 root@2ae7ab2da8df:/#
```
=> Docker File (탭 인식을 못하므로 스페이스 두칸으로 구분함. 나만의 Container image Build 가능하게 함)
```dockerfile
FROM httpd:latest
MAINTAINER chhan <chhan@osci.kr>

RUN echo "<html><body><h1>Docker File Test Page</h1></body></html>" > /usr/local/apache2/htdocs/index.html

EXPOSE 80
```

=> Docker compose 파일
```yaml
version: '3'
services:
  mdb:
    image: mariadb:latest
    environment:
      MYSQL_ROOT_PASSWORD: 1234
  web:
    build: ./dockerfile
    image: apache_df:web
    ports:
      - "80:80"
    links:
      - mdb:mdb
```
version: YAML 파일 포멧 버전

services: 생성될 컨테이너의 정보. services 바로 아래에 서비스 명 기술하고 mdb, web 이 그러함.

image: docker images 명령어 실행 시 노출되는 repository 명

environment: docker run 명령어 옵션 -e 와 같으며 컨테이너 생성 시 들어갈 환경 변수 지정

build: 지정된 경로 내에 존재하는 도커 파일 실행해 이미지로 만들고 이미지로 컨테이너 생성

ports: docker run -p 옵션과 같고 오픈할 포트번호 지정

links: docker un --link 와 같고 연결할 서비스 명을 입력해 해당서비스로 접근

```shell script
docker-compose up -d
```

특징
1. 단일 호스트에 여러 개의 격리된 환경 (프로젝트 이름을 사용해 서로 환경 분리)

2. 컨테이너를 만들 때 볼륨 데이터 보존. (이전 실행에서 컨테이너 찾으면 이 전 컨테이너의 볼륨을 새 컨테이너로 복사.)

3. 변경된 컨테이너만 다시 작성. (Compose 가 컨테이너만 다시 작성함)

4. 환경 간 구성 변수 및 이동 (Compose Files 에서 변수 지원, 다른 환경 또는 다른 사용자에 대한 Compose 사용자 정의 가능)
- 개발환경
- 자동화된 테스트 환경 ```$ docker-compose up -d$ ./run_tests$ docker-compose down```
- 단일 host 개발 
