document.getElementById('add-task-btn').addEventListener('click', addTask);
document.getElementById('all-tasks-btn').addEventListener('click', () => filterTasks('all'));
document.getElementById('completed-tasks-btn').addEventListener('click', () => filterTasks('completed'));
document.getElementById('incomplete-tasks-btn').addEventListener('click', () => filterTasks('incomplete'));

document.addEventListener('DOMContentLoaded', loadTasks);

function addTask() {
    const taskInput = document.getElementById('new-task');
    const taskText = taskInput.value.trim();

    if (taskText) {
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false
        };
        saveTask(task);
        displayTask(task);
        taskInput.value = '';
    }
}

function deleteTask(button) {
    const taskElement = button.parentElement.parentElement;
    removeTask(taskElement.dataset.id);
    taskElement.remove();
}

function editTask(button) {
    const taskElement = button.parentElement.parentElement;
    const taskText = taskElement.querySelector('span').textContent;
    const newTaskText = prompt("Edit task:", taskText);

    if (newTaskText !== null) {
        taskElement.querySelector('span').textContent = newTaskText.trim();
        updateTask(taskElement.dataset.id, { text: newTaskText.trim() });
    }
}

function toggleComplete(checkbox) {
    const taskElement = checkbox.parentElement.parentElement;
    taskElement.classList.toggle('completed');
    updateTask(taskElement.dataset.id, { completed: checkbox.checked });
}

function saveTask(task) {
    const tasks = getTasksFromStorage();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTask(id) {
    const tasks = getTasksFromStorage();
    const updatedTasks = tasks.filter(task => task.id != id);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

function updateTask(id, updates) {
    const tasks = getTasksFromStorage();
    const taskIndex = tasks.findIndex(task => task.id == id);
    if (taskIndex > -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function getTasksFromStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function loadTasks() {
    const tasks = getTasksFromStorage();
    tasks.forEach(task => displayTask(task));
}

function displayTask(task) {
    const taskList = document.getElementById('task-list');
    const taskElement = document.createElement('li');
    taskElement.dataset.id = task.id;
    taskElement.classList.toggle('completed', task.completed);

    taskElement.innerHTML = `
        <span>${task.text}</span>
        <div>
            <button class="edit-btn" onclick="editTask(this)">Edit</button>
            <button onclick="deleteTask(this)">Delete</button>
            <input type="checkbox" onclick="toggleComplete(this)" ${task.completed ? 'checked' : ''}>
        </div>
    `;

    taskList.appendChild(taskElement);
}

function filterTasks(filter) {
    const tasks = document.querySelectorAll('#task-list li');
    tasks.forEach(task => {
        switch (filter) {
            case 'all':
                task.style.display = '';
                break;
            case 'completed':
                task.style.display = task.classList.contains('completed') ? '' : 'none';
                break;
            case 'incomplete':
                task.style.display = !task.classList.contains('completed') ? '' : 'none';
                break;
        }
    });
}
