import { getTaskData, createTaskItem } from "./tasks.js";
import { getTasksFromStorage, addTaskToStorage, removeTaskFromStorage, toggleTaskCompletionInStorage } from "./storage.js";

const taskForm = document.getElementById('task-form');
const taskInputName = document.getElementById('task-title');
const taskList = document.getElementById('todo-list');

const localTasks = getTasksFromStorage();
localTasks.forEach(task => {
    const taskElement = createTaskItem(task);
    const firstTask = taskList.firstChild;

    taskList.insertBefore(taskElement, firstTask);
})

taskInputName.addEventListener('focus', () => {
    taskInputName.classList.remove('input-error');

    const errorMessage = document.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
})

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const taskData = getTaskData();

    if(!taskData) { 
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
})

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
    }
    })  
