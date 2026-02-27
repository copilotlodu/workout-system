let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    let completedCount = 0;

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = task.done ? "completed" : "";

        li.innerHTML = `
            <span onclick="toggleTask(${index})">${task.text}</span>
            <button onclick="deleteTask(${index})">x</button>
        `;

        if (task.done) completedCount++;
        list.appendChild(li);
    });

    updateWeeklyProgress(completedCount);
}

function addTask() {
    const input = document.getElementById("taskInput");
    if (input.value.trim() === "") return;

    tasks.push({ text: input.value, done: false });
    input.value = "";
    saveTasks();
    renderTasks();
}

function toggleTask(index) {
    tasks[index].done = !tasks[index].done;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function updateWeeklyProgress(completed) {
    let percent = tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);
    document.getElementById("progress").style.width = percent + "%";
    document.getElementById("percentage").innerText = percent + "% Completed";
}

function requestNotificationPermission() {
    if ("Notification" in window) {
        Notification.requestPermission();
    }
}

function remindUnfinishedTasks() {
    const unfinished = tasks.filter(task => !task.done);
    if (unfinished.length > 0 && Notification.permission === "granted") {
        new Notification("Unfinished Tasks", {
            body: "You have pending tasks today."
        });
    }
}

setInterval(remindUnfinishedTasks, 3600000);

requestNotificationPermission();
renderTasks();