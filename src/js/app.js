import { getTaskData, createTaskItem, getCountdownText } from './tasks.js';
import {
    getTasksFromStorage,
    addTaskToStorage,
    removeTaskFromStorage,
    toggleTaskCompletionInStorage,
} from './storage.js';

const taskForm = document.getElementById('task-form');
const taskInputName = document.getElementById('task-title');
const taskList = document.getElementById('todo-list');

const emptyStateMessage = document.getElementById('empty-state');

function toggleEmptyState() {
    const hasTasks = taskList.children.length > 0;

    if (hasTasks) {
        emptyStateMessage.classList.add('hidden');
    } else {
        emptyStateMessage.classList.remove('hidden');
    }
}

const dateElement = document.getElementById('today');
if (dateElement) {
    const now = new Date();

    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateString = now.toLocaleDateString('pt-BR', options);
    const formattedDate =
        dateString.charAt(0).toUpperCase() + dateString.slice(1);

    dateElement.textContent = formattedDate;
}

const localTasks = getTasksFromStorage();
localTasks.forEach((task) => {
    const taskElement = createTaskItem(task);
    const firstTask = taskList.firstChild;

    taskList.insertBefore(taskElement, firstTask);
});

toggleEmptyState();

taskInputName.addEventListener('focus', () => {
    taskInputName.classList.remove('input-error');

    const errorMessage = document.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
});

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const taskData = getTaskData();

    if (!taskData) {
        taskInputName.classList.add('input-error');

        const errorMessage = document.createElement('p');

        errorMessage.textContent = 'Por favor, preencha o nome da tarefa';
        errorMessage.classList.add('error-message');
        taskInputName.insertAdjacentElement('afterend', errorMessage);

        return;
    }

    const taskSaved = addTaskToStorage(taskData);

    if (taskSaved) {
        const taskElement = createTaskItem(taskData);
        const firstTask = taskList.firstChild;
        taskList.insertBefore(taskElement, firstTask);
    } else {
        alert('Esta tarefa já existe.');
    }

    toggleEmptyState();
});

taskList.addEventListener('click', (e) => {
    const targetElement = e.target;
    const taskItem = targetElement.closest('.task-item');

    if (!taskItem) return;

    if (targetElement.classList.contains('task-checkbox')) {
        taskItem.classList.toggle('completed');

        const taskTitle = taskItem.querySelector('p').textContent;
        toggleTaskCompletionInStorage(taskTitle);
    }

    const removeBtn = targetElement.closest('.remove-button');

    if (removeBtn) {
        const taskTitle = taskItem.querySelector('p').textContent;
        removeTaskFromStorage(taskTitle);
        taskItem.remove();
        toggleEmptyState();
    }
});

function updateAllCountdowns() {
    const allTasks = document.querySelectorAll('.task-item');

    allTasks.forEach((taskItem) => {
        const deadline = taskItem.dataset.deadline;

        if (!deadline || taskItem.classList.contains('completed')) return;

        const countdownData = getCountdownText(deadline);
        const countdownElement = taskItem.querySelector('.task-countdown');

        if (countdownElement && countdownData) {
            countdownElement.textContent = countdownData.text;

            if (countdownData.isOverdue) {
                taskItem.classList.add('overdue');
            } else {
                taskItem.classList.remove('overdue');
            }
        }
    });
}

setInterval(updateAllCountdowns, 60000);
updateAllCountdowns();
