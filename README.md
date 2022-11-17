# 너 쌩배지! / Dodge-Alarm

<img src='https://user-images.githubusercontent.com/50083131/198163308-cca3d3e8-0036-4adf-ac04-c17177661cb6.png' width='300'/>

> Dodge-Alarm은 기존 League of Legends의 멀티서치를 위한 데스크톱 어플리케이션의 단점을 보완하고, <br>
필요한 정보만 컴팩트하게 자동으로 분석하기 위해 고안되었습니다.

<br>

[download](https://github.com/gomiseki/Dodge-Alarm/releases/download/v1.0.0-beta/Dodge-Alarm.Setup.1.0.0-beta.exe)

##  🛠 Tech

<br>

![ReactJS](https://img.shields.io/badge/ReactJS-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Styled-Components](https://img.shields.io/badge/StyledComponents-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
<br>
![Electron](https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)

<br>

## 🔗 프로젝트 구조

<br>

![구조도](https://user-images.githubusercontent.com/50083131/199162280-06b4a8e0-f831-4457-8f43-169b96d2f7b0.png)

<br>

프로그램은 크게 각각의 리덕스 스토어를 가진 세 가지 주체가 상호작용합니다.<br>
세 리덕스 스토어는 액션이 발생할 때 마다 IPC(Inter Process Communication)를 통해 동기화됩니다.

<br>

### 1. Electron을 실행하는 Main Process

<br>

NodeIntegration이 false임에 따라 Node API, 네이티브 모듈, 기타 등등의 역할을 수행합니다.

<br>

- LCU(league client update) API를 통해 유저 프로필, 게임 내 픽창 진입과 같은 팀 유저 등 파악
- Axios를 통해 같은 팀 유저의 전적 검색
- 미리 저장된 algorithm state에 따른 전적의 점수환산
- fs 모듈을 통해 사용자 알고리즘을 json 파일로 저장

<br>

### 2. Renderer Process에서 실행되는 React 기반의 Ready Window

<br>

- Main Process의 LCU를 통해 얻은 정보(프로필, 전적 세부정보)를 표시
- 사용자 지정 알고리즘을 편집해 Main Process로 전달

<br>

### 3. Renderer Process에서 실행되어 electron-overlay-window를 통해 League of Legends클라이언트에 오버레이되는 Main Window 

<br>

- Main Process에서 계산된 전적 점수를 각 유저의 초상화 위에 표시

<br>

## 📜 Usage(사용 설명서)

<br>

- ### 최초 실행 시

League of Legends 클라이언트의 실행 유무에 따라 다른 창이 나타납니다.

<img src='https://user-images.githubusercontent.com/50083131/198165131-806e2054-a549-4f4d-9ce9-b795b8661980.png' width='300'/>

클라이언트 미실행 시 다음과 같은 창을 볼 수 있습니다.

![image](https://user-images.githubusercontent.com/50083131/198165024-17234df7-5a1d-4038-ae17-921d17a68d5d.png)

클라이언트 실행 시 자동으로 클라이언트에 overlay됩니다. 하얀 글씨를 눌러 위의 창을 띄울 수 있습니다.

<br>

- ### 알고리즘 편집

<img src='https://user-images.githubusercontent.com/50083131/198165669-c47f228c-9da0-460c-b166-e902e7dde59b.png' width='300'/>

알고리즘 탭을 통해 나만의 알고리즘을 편집할 수 있습니다.<br>
분석게임 수를 지정한 나의 알고리즘을 만들지 않으면 프로그램이 작동하지 않습니다.<br>
'New'를 선택한 뒤 'New'외의 이름으로 바꾸고 아래의 여러 항목들의 평가 여부, 위험도, 반영비를 조절합니다. <br>
체크박스를 통해 해당 항목을 평가할지를 결정합니다.<br>
위험도는 각 항목에 대해 '이정도 수치를 가진 유저라면 안전하다'라고 느끼는 값에 safe를,<br>
'이정도 수치를 가진 유저와 게임하고 싶지 않다'라고 느낀 값에 danger를 부여합니다.<br>
평가 할 항목의 반영비에 총 100포인트를 투자해야만 +버튼을 눌러 등록할 수 있습니다.(- 버튼으로 삭제)


<br>

- ### 멀티서치

![image](https://user-images.githubusercontent.com/50083131/198172310-8c87c399-6f6a-4c35-8a7e-ab7516e8dde3.png)

게임이 시작되면 다음과 같이 자동으로 멀티서치 후<br>
알고리즘에 따라 계산된 스코어와 포꼬, 꼴픽 등의 필수정보가 나타납니다.

<br>

<img src='https://user-images.githubusercontent.com/50083131/198173326-0e2c214d-8eb1-4926-ab60-95acde1ead03.png' width='300'/>

챔피언 초상화를 눌러 다음과 같은 상세정보를 열람할 수 있습니다.

<br>

## 기타

클라이언트 API오류로 직접적인 쌩배 검출은 거의 불가능한 것으로 보입니다.<br>
가급적이면 레벨 등의 간접적인 지표를 활용해야 할 것 같습니다 ㅠㅠ


![image](https://user-images.githubusercontent.com/50083131/198173549-4dd282b4-6202-4440-b713-d711082929b6.png)

또한 어플리케이션이 제작 중에 사형선고를 받아 디벨롭 할 의지를 잃었습니다.....
