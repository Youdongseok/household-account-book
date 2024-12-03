const userText = document.getElementById("user-text");
const userMoney = document.getElementById("user-money");
const inBtn = document.getElementById("in-btn");
const outBtn = document.getElementById("out-btn");
const userDate = document.getElementById("user-date");
const userTime = document.getElementById("user-time");
let taskList = [];
let getList = [];
let outList=[];
let mode="allThing";
let selectedInOutFilter = "allThing";
let selectedDate = null;
//tab이동
const tabs = document.querySelectorAll(".tab div");

const filter = (event) => {
    selectedInOutFilter = event.target.id; // 선택된 필터 저장
    mode = selectedInOutFilter;

    // 현재 선택된 날짜가 있다면 해당 날짜로 필터링
    if (selectedDate) {
        let filteredList = taskList.filter(task => {
            const matchesDate = task.taskDate === selectedDate;
            const matchesInOut = 
                mode === "allThing" ||
                (mode === "getThing" && task.inout === "get") ||
                (mode === "outThing" && task.inout === "out");
            return matchesDate && matchesInOut;
        });
        render(filteredList);
    } else {
        // 날짜가 선택되지 않은 경우, 기존 로직 수행
        if (mode === "allThing") {
            render();
        } else if (mode === "getThing") {
            getList = taskList.filter(task => task.inout === "get");
            render(getList);
        } else if (mode === "outThing") {
            outList = taskList.filter(task => task.inout === "out");
            render(outList);
        }
    }
};

for(i=1;i<tabs.length;i++){
    tabs[i].addEventListener("click",function(event){
        filter(event)
    });
}

const getMoney = () => {
    let task = {
        id: randomId(),
        inout: "get",
        text: userText.value,
        money: userMoney.value,
        changeText:randomId(),
        changeMoney:randomId(),
        taskDate:userDate.value,
        taskTime:userTime.value
    }
   
    taskList.push(task);
    getList.push(task);
    console.log(task, taskList);
    console.log(userDate.value);
    render();
    
    
};
inBtn.addEventListener("click", getMoney);

const payMoney = () => {
    let task = {
        id: randomId(),
        inout: "out",
        text: userText.value,
        money: userMoney.value,
        changeText:randomId(),
        changeMoney:randomId(),
        taskDate:userDate.value,
        taskTime:userTime.value
    }

    taskList.push(task);
    outList.push(task);
    console.log(task, taskList);
    render();
}

outBtn.addEventListener("click", payMoney);

//수정
const updateTask = (id) => {
    for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].id === id) {
            const selectedInOut = document.querySelector(`input[name="inout-${id}"]:checked`); // 선택된 라디오 버튼
            const afterText = document.getElementById(`${taskList[i].changeText}`);
            const afterMoney = document.getElementById(`${taskList[i].changeMoney}`);
            const taskDiv = document.getElementById(`task-${id}`); // 해당 태스크의 div 요소

            if (selectedInOut) {
                taskList[i].inout = selectedInOut.value; // 선택된 라디오 버튼의 값으로 변경
                // 클래스 변경
                if (selectedInOut.value === "get") {
                    taskDiv.classList.remove("red");
                    taskDiv.classList.add("green");
                } else if (selectedInOut.value === "out") {
                    taskDiv.classList.remove("green");
                    taskDiv.classList.add("red");
                }
            }

            if (afterText) {
                taskList[i].text = afterText.value; // 변경된 텍스트 값 적용
            }
            if (afterMoney) {
                taskList[i].money = afterMoney.value; // 변경된 금액 값 적용
            }
            break;
        }
    }

    render(); // 변경된 상태에 맞게 다시 렌더링
};




const deleteTask = (id) => {
    if(mode=="allThing"){
        for (i = 0; i <taskList.length; i++) {
            if (taskList[i].id == id) {
                taskList.splice(i,1);
                console.log(taskList);
                break;
            }         
        }
    }else if(mode=="getThing"){
        for (i = 0; i <getList.length; i++) {
            if (getList[i].id ==id) {
                for(j=0;j<taskList.length;j++){
                    if (taskList[j].id == id){
                        taskList.splice(j,1);
                        break;
                    }
                }
                getList.splice(i,1);
                console.log(getList);
                break;
            }          
        }
    }else if(mode=="outThing"){
        for (i = 0; i <outList.length; i++) {
            if (outList[i].id == id) {
                for(j=0;j<taskList.length;j++){
                    if (taskList[j].id == id){
                        taskList.splice(j,1);
                        break;
                    }
                }
                outList.splice(i,1);
                console.log(outList);
                break;
            }         
        }
    }
    render();
}



const render = (filteredList = null) => {
    list = [];
    if (filteredList) {
        list = filteredList;
    } else {
        if (mode == "allThing") {
            list = taskList;
        } else if (mode == "getThing") {
            list = getList;
        } else if (mode == "outThing") {
            list = outList;
        }
    }

    let resultHTML = "";

    for (i = 0; i < list.length; i++) {
        if (list[i].inout == "get") {
            resultHTML += `<div class="task green" id="task-${list[i].id}">
                <div id="task-inout-${list[i].id}">입금</div>
                <div id="textId-${list[i].id}">
                    ${list[i].text}
                </div>
                <div id="moneyId-${list[i].id}">
                    ${list[i].money}원
                </div>
                <div id="dateNTime-${list[i].id}"> 
                    ${list[i].taskDate} ${list[i].taskTime}
                </div>
                <div>
                    <p class="d-inline-flex gap-1">
                    <button type="button" id="change-btn-${list[i].id}" data-bs-toggle="collapse" data-bs-target="#${list[i].id}" aria-expanded="false" aria-controls="${list[i].id}">
                     수정
                    </button>
                    </p>
                    <div class="collapse" id="${list[i].id}">
                        <div class="card card-body">
                        <div class="update-btn">
                        <input type="radio" name="inout-${list[i].id}" value="get" />입금
                        <input type="radio" name="inout-${list[i].id}" value="out" />출금
                        <input type="text" id="${list[i].changeText}" placeholder="${list[i].text}" value=""/>
                        <input type="number" id="${list[i].changeMoney}" placeholder=" ${list[i].money}원"/>
                        <button id="save-btn" onclick="updateTask('${list[i].id}')">저장</button>
                        <button id="cancel-btn" onclick="render()">취소</button>
                        </div>
                    </div>
                    </div>
                    <button id="del-btn-${list[i].id}" onclick="deleteTask('${list[i].id}')">삭제</button>
                </div>
            </div>`;
        } else {
            resultHTML += `<div class="task red" id="task-${list[i].id}">
                <div id="task-inout-${list[i].id}">출금</div>
               <div id="textId-${list[i].id}">
                    ${list[i].text}
                </div>
                <div id="moneyId-${list[i].id}">
                    ${list[i].money}원
                </div>
                <div id="dateNTime-${list[i].id}"> 
                    ${list[i].taskDate} ${list[i].taskTime}
                </div>
                <div>
                <p class="d-inline-flex gap-1">
                <button type="button" id="change-btn-${list[i].id}" data-bs-toggle="collapse" data-bs-target="#${list[i].id}" aria-expanded="false" aria-controls="${list[i].id}">
                 수정
                </button>
                </p>
                <div class="collapse" id="${list[i].id}">
                    <div class="card card-body">
                    <div class="update-btn">
                    <input type="radio" name="inout-${list[i].id}" value="get" />입금
                    <input type="radio" name="inout-${list[i].id}" value="out" />출금
                    <input type="text" id="${list[i].changeText}" placeholder="${list[i].text}" value=""/>
                    <input type="number" id="${list[i].changeMoney}" placeholder=" ${list[i].money}원"/>
                    <button id="save-btn" onclick="updateTask('${list[i].id}')">저장</button>
                    <button id="cancel-btn" onclick="render()">취소</button>
                    </div>
                    </div>
                </div>
                <button id="del-btn-${list[i].id}" onclick="deleteTask('${list[i].id}')">삭제</button>
            </div>
        </div>`;
        }
    }

    document.getElementById("task-board").innerHTML = resultHTML;

    // 동적 버튼 이벤트 추가
    list.forEach(task => {
        const changeBtn = document.getElementById(`change-btn-${task.id}`);
        const delBtn = document.getElementById(`del-btn-${task.id}`);
        const taskInOut = document.getElementById(`task-inout-${task.id}`);
        const textId = document.getElementById(`textId-${task.id}`);
        const moneyId = document.getElementById(`moneyId-${task.id}`);
        const dateNTime = document.getElementById(`dateNTime-${task.id}`);
    
        changeBtn.addEventListener("click", () => {
            // 숨길 요소들의 스타일 변경
            taskInOut.style.display = "none";
            textId.style.display = "none";
            moneyId.style.display = "none";
            dateNTime.style.display = "none";
    
            // 수정 버튼과 삭제 버튼도 숨김
            changeBtn.style.display = "none";
            delBtn.style.display = "none";
        });
    });
    

    saveToLocalStorage();
};


const randomId = () => {
    return '_' + Math.random().toString(36).substring(2, 9);
}

sumBtn =  document.getElementById("sum-btn");
aboutSum = document.getElementById("about-Sum")
const sumThing = () => {
    let allOfSum = 0;
    let allOfPlus = 0;
    let allOfMinus = 0;

    // 선택된 날짜에 따라 필터링
    const filteredList = selectedDate 
        ? taskList.filter(task => task.taskDate === selectedDate) 
        : taskList;

    for (let i = 0; i < filteredList.length; i++) {
        if (filteredList[i].inout === "get") {
            allOfSum += Number(filteredList[i].money);
            allOfPlus += Number(filteredList[i].money);
        } else {
            allOfSum -= Number(filteredList[i].money);
            allOfMinus -= Number(filteredList[i].money);
        }
    }

    aboutSum.textContent = 
        "합계 : " + allOfSum + "원 | " + 
        "총 수익 : " + allOfPlus + "원 | " + 
        "총 지출 : " + allOfMinus + "원";

    console.log("합계", allOfSum, "총 수익", allOfPlus, "총 지출", allOfMinus);
};

sumBtn.addEventListener("click",sumThing);





const cal = document.getElementById("wrapper");
const dateSelect = document.getElementById("chooseDate");
const dateFilter = () => {
    if (cal.style.display === "none") {
        cal.style.display = "block";
        console.log("달력 보여주기");
    } else {
        cal.style.display = "none";
        console.log("달력 숨기기");
        selectedDate = null;
    filter({ target: { id: selectedInOutFilter } });
    }
};

const daysTag = document.querySelector(".days"),
    currentDate = document.querySelector(".current-date"),
    prevNextIcon = document.querySelectorAll(".icons span");

// getting new date, current year and month
let date = new Date(),
    currYear = date.getFullYear(),
    currMonth = date.getMonth();

// storing full name of all months in array
const months = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
];

const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), // getting first day of month
        lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), // getting last date of month
        lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), // getting last day of month
        lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); // getting last date of previous month
    let liTag = "";

    for (let i = firstDayofMonth; i > 0; i--) { // creating li of previous month last days
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) { // creating li of all days of current month
        // adding active class to li if the current day, month, and year matched
        let isToday = i === date.getDate() && currMonth === new Date().getMonth()
            && currYear === new Date().getFullYear() ? "active" : "";
        liTag += `<li class="${isToday}" data-date="${currYear}-${currMonth + 1}-${i}">${i}</li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) { // creating li of next month first days
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
    }
    currentDate.innerText = `${months[currMonth]} ${currYear}`; // passing current mon and yr as currentDate text
    daysTag.innerHTML = liTag;

    // 날짜 클릭 이벤트 추가
    function handleDayClick(event) {
        const day = event.currentTarget; 
        selectedDate = day.getAttribute("data-date"); // 선택한 날짜 저장
    
        console.log("선택한 날짜:", selectedDate);
    
        // 날짜와 입출금 상태로 필터링
        let filteredList = taskList.filter(task => {
            const matchesDate = task.taskDate === selectedDate;
            const matchesInOut = 
                selectedInOutFilter === "allThing" ||
                (selectedInOutFilter === "getThing" && task.inout === "get") ||
                (selectedInOutFilter === "outThing" && task.inout === "out");
            return matchesDate && matchesInOut;
        });
    // 필터링된 데이터로 렌더링
    render(filteredList);

       
        
       
        
        // 기존 선택된 날짜의 'selected' 클래스 제거
        document.querySelectorAll(".days li.selected").forEach(selected => {
            selected.classList.remove("selected");
        });
    
        // 현재 클릭된 요소에 'selected' 클래스 추가
        day.classList.add("selected");
    }
    
    // 모든 활성화된 <li> 요소에 이벤트 등록
    function attachEventListeners() {
        const allDays = document.querySelectorAll(".days li:not(.inactive)");
        allDays.forEach(day => {
            day.addEventListener("click", handleDayClick); // 핸들러 등록
        });
    }
    
    // 함수 실행
    attachEventListeners();
};

renderCalendar();

prevNextIcon.forEach(icon => { // getting prev and next icons
    icon.addEventListener("click", () => { // adding click event on both icons
        // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if (currMonth < 0 || currMonth > 11) { // if current month is less than 0 or greater than 11
            // creating a new date of current year & month and pass it as date value
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear(); // updating current year with new date year
            currMonth = date.getMonth(); // updating current month with new date month
        } else {
            date = new Date(); // pass the current date as date value
        }
        renderCalendar(); // calling renderCalendar function
    });
});


//웹 스토리지
const saveToLocalStorage = () => {
    localStorage.setItem("taskList", JSON.stringify(taskList));
    localStorage.setItem("getList", JSON.stringify(getList));
    localStorage.setItem("outList", JSON.stringify(outList));
};
//데이터 저장
window.onload = () => {
    const savedTaskList = localStorage.getItem("taskList");
    const savedGetList = localStorage.getItem("getList");
    const savedOutList = localStorage.getItem("outList");

    // 데이터 복원
    if (savedTaskList) taskList = JSON.parse(savedTaskList);
    if (savedGetList) getList = JSON.parse(savedGetList);
    if (savedOutList) outList = JSON.parse(savedOutList);

    // 복원 후 렌더링
    render();
};


document.getElementById("user-date").addEventListener("input", function () {
    if (this.value) {
      this.classList.add("has-value");
      //값이 존재하면 .has-value 클래스를 추가하여 텍스트 색상을 보이게 설정
    } else {
      this.classList.remove("has-value");
      //값이 없으면 .has-value 클래스를 제거하여 숨김
    }
  });
  document.getElementById("user-time").addEventListener("input", function () {
    if (this.value) {
      this.classList.add("has-value");
    } else {
      this.classList.remove("has-value");
    }
  });
//input 이벤트는 값이 실시간으로 변경될 때마다 발생
//사용자가 시간을 선택한 즉시 값이 보이도록 적용


