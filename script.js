const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const themeToggle = document.getElementById('theme-toggle');
const finishBtn = document.getElementById('finish-day-btn');
const progressFill = document.getElementById('progress-fill');
const progressPercent = document.getElementById('progress-percent');

document.addEventListener('DOMContentLoaded', () => {
    updateDate();
    loadTheme();
    loadTasks();
    updateProgressBar();
});

function updateDate() {
    const now = new Date();
    document.getElementById('current-day').textContent = now.toLocaleDateString('en-US', { weekday: 'long' });
    document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function updateProgressBar() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    progressFill.style.height = `${percent}%`;
    progressPercent.textContent = `${percent}%`;
}

function addTask() {
    const text = input.value.trim();
    if (!text) return;
    const task = { id: Date.now(), text, completed: false };
    createTaskElement(task);
    saveTask(task);
    input.value = "";
    updateProgressBar();
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    li.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
        <span class="text ${task.completed ? 'completed' : ''}">${task.text}</span>
        <span class="delete-btn">✕</span>
    `;

    li.querySelector('.task-checkbox').addEventListener('change', (e) => {
        const span = li.querySelector('.text');
        span.classList.toggle('completed');
        updateTaskData(task.id, e.target.checked);
        updateProgressBar();
    });

    li.querySelector('.delete-btn').addEventListener('click', () => {
        li.remove();
        deleteTask(task.id);
        updateProgressBar();
    });

    todoList.appendChild(li);
}

// Data Handlers
function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskData(id, isCompleted) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks = tasks.map(t => t.id === id ? {...t, completed: isCompleted} : t);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    localStorage.setItem('tasks', JSON.stringify(tasks.filter(t => t.id !== id)));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.forEach(createTaskElement);
}

finishBtn.addEventListener('click', () => {
    if (confirm("End your day and clear all tasks?")) {
        todoList.innerHTML = "";
        localStorage.removeItem('tasks');
        updateProgressBar();
    }
});

function loadTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
});

addBtn.addEventListener('click', addTask);
input.addEventListener('keypress', (e) => { if(e.key === 'Enter') addTask(); });