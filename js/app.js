import { getTaskData, createTaskItem } from "./tasks.js";

const formTask = document.getElementById('task-form');
const taskInputName = document.getElementById('task-title');

taskInputName.addEventListener('focus', () => {
    taskInputName.classList.remove('input-error');

    const errorMessage = document.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }

})

formTask.addEventListener('submit', (e) => {
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

    const taskElement = createTaskItem(taskData);
    const taskList = document.getElementById('todo-list');
    const firstTask = taskList.firstChild;

    taskList.insertBefore(taskElement, firstTask);
})