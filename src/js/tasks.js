export function getTaskData() {
    const inputTask = document.getElementById('task-title');
    const inputDateTime = document.getElementById('task-datetime');
    const selectCategory = document.getElementById('category');
    const selectPriority = document.getElementById('priority');

    const title = inputTask.value
    const dateTime = inputDateTime.value;
    const category = selectCategory.options[selectCategory.selectedIndex].text
    const priorityValue = selectPriority.value
    const priorityLabel = selectPriority.options[selectPriority.selectedIndex].text

    if (title.length > 0) {
        return {
            title,
            dateTime,
            category,
            priorityValue,
            priorityLabel,
            completed: false
        }
    }

}

export function createTaskItem(task) {
    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item');

    const taskCategory = document.createElement('span');
    taskItem.appendChild(taskCategory);
    
    const taskTitle = document.createElement('p');
    taskItem.appendChild(taskTitle);

    const taskDateTime = document.createElement('span');
    taskItem.appendChild(taskDateTime);

    if (task.dateTime) {
    const dateObj = new Date(task.dateTime);
    const formattedDate = dateObj.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).replace(',', ' às'); 

    taskDateTime.textContent = formattedDate;
} else {
    taskDateTime.textContent = '';
}

    const priorityIcons = {
        'none': './assets/images/tiers/none.svg',
        'low': './assets/images/tiers/low.svg',
        'medium': './assets/images/tiers/medium.svg',
        'high': './assets/images/tiers/high.svg'
    };

    const taskPriority = document.createElement('img');
    taskPriority.classList.add('priority-icon')
    taskPriority.src = priorityIcons[task.priorityValue];
    taskPriority.alt = task.priorityLabel;
    taskItem.appendChild(taskPriority)
    
    const taskCheckbox = document.createElement('input');
    taskCheckbox.type = 'checkbox'
    taskCheckbox.name = 'task-checkbox'
    taskCheckbox.classList.add('task-checkbox')
    taskItem.appendChild(taskCheckbox)

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button'
    removeBtn.classList.add('remove-button')
    taskItem.appendChild(removeBtn)
    const removeIcon = document.createElement('img');
    removeIcon.src = './assets/remove.svg'
    removeIcon.alt = 'Remover tarefa'
    removeBtn.appendChild(removeIcon)

    taskTitle.textContent = task.title
    taskCategory.textContent = task.category

    if (task.completed) {
        taskItem.classList.add('completed');
        taskCheckbox.checked = true;
    }

    return taskItem
}