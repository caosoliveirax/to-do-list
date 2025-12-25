import { getTaskData, createTaskItem } from "./tasks.js";

const taskForm = document.getElementById('task-form');
const taskInputName = document.getElementById('task-title');
const taskList = document.getElementById('todo-list');

const initialTasks = [
    {
        title: 'Participar da reunião da empresa', 
        category: 'Trabalho', 
        priorityValue: 'high',
        priorityLabel: 'Prioridade alta'
    },
    {
        title: 'Comprar uma geladeira nova', 
        category: 'Compras', 
        priorityValue: 'medium',
        priorityLabel: 'Prioridade média'
    },
    {
        title: 'Lavar a louça', 
        category: 'Casa', 
        priorityValue: 'low',
        priorityLabel: 'Prioridade baixa'
    },
    {
        title: 'Assistir Superman', 
        category: 'Entretenimento', 
        priorityValue: 'none',
        priorityLabel: 'Sem prioridade'
    }
]

function init() {
    initialTasks.forEach( task => {
        const taskElement = createTaskItem(task);
        taskList.appendChild(taskElement);
    })
}

init();

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

    const taskElement = createTaskItem(taskData);

    const firstTask = taskList.firstChild;

    taskList.insertBefore(taskElement, firstTask);
})

taskList.addEventListener('click', (e) => {
    const targetElement = e.target;
    const taskItem = targetElement.closest('.task-item');

    if (!taskItem) return;

    if (targetElement.classList.contains('task-checkbox')) {
        taskItem.classList.toggle('completed');
    }

    const removeBtn = targetElement.closest('.remove-button');

    if (removeBtn) {
        taskItem.remove()
    }
    })  
