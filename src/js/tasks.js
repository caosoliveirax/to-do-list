export function getTaskData() {
    const inputTask = document.getElementById('task-title');
    const inputDateTime = document.getElementById('task-datetime');
    const selectedPriorityInput = document.querySelector('input[name="priority"]:checked');
    const selectedCategoryInput = document.querySelector('input[name="category"]:checked');

    const category = selectedCategoryInput ? selectedCategoryInput.dataset.label : 'Geral';
    const title = inputTask.value;
    const dateTime = inputDateTime.value;

    const priorityValue = selectedPriorityInput.value;
    const priorityLabel =
        selectedPriorityInput.dataset.label;

    if (title.length > 0) {
        return {
            title,
            dateTime,
            category,
            priorityValue,
            priorityLabel,
            completed: false,
        };
    }
}

export function getCountdownText(deadline) {
    if (!deadline) return null;

    const now = new Date().getTime();
    const targetTime = new Date(deadline).getTime();
    const timeDifference = targetTime - now;

    if (timeDifference <= 0) {
        return { text: 'Expirado!', isOverdue: true };
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
        (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );

    let text = 'Restam: ';
    if (days > 0) text += `${days}d `;
    if (hours > 0) text += `${hours}h `;
    text += `${minutes}m`;

    return { text, isOverdue: false };
}

export function createTaskItem(task) {
    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item');

    const taskCategory = document.createElement('span');
    taskItem.appendChild(taskCategory);
    taskCategory.textContent = task.category;

    const taskTitle = document.createElement('p');
    taskItem.appendChild(taskTitle);
    taskTitle.textContent = task.title;

    const taskDateTime = document.createElement('span');
    taskItem.appendChild(taskDateTime);

    if (task.dateTime) {
        taskItem.dataset.deadline = task.dateTime;
    }

    const taskCountdown = document.createElement('span');
    taskCountdown.classList.add('task-countdown');

    if (task.dateTime) {
        const countdownData = getCountdownText(task.dateTime);
        taskCountdown.textContent = countdownData.text;

        if (countdownData.isOverdue) {
            taskItem.classList.add('overdue');
        }
    }
    taskItem.appendChild(taskCountdown);

    if (task.dateTime) {
        const dateObj = new Date(task.dateTime);
        const formattedDate = dateObj
            .toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            })
            .replace(',', ' às');

        taskDateTime.textContent = formattedDate;
    } else {
        taskDateTime.textContent = '';
    }

    const priorityIcons = {
        none: './src/assets/none.svg',
        low: './src/assets/low.svg',
        medium: './src/assets/medium.svg',
        high: './src/assets/high.svg',
    };

    const taskPriority = document.createElement('img');
    taskPriority.classList.add('priority-icon');
    taskPriority.src = priorityIcons[task.priorityValue];
    taskPriority.alt = task.priorityLabel;
    taskItem.appendChild(taskPriority);

    const taskCheckbox = document.createElement('input');
    taskCheckbox.type = 'checkbox';
    taskCheckbox.name = 'task-checkbox';
    taskCheckbox.classList.add('task-checkbox');
    taskItem.appendChild(taskCheckbox);

    const menuContainer = document.createElement('div');
    menuContainer.classList.add('task-menu');

    const menuTrigger = document.createElement('button');
    menuTrigger.type = 'button';
    menuTrigger.classList.add('btn-action-trigger');
    menuTrigger.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M112,60a16,16,0,1,1,16,16A16,16,0,0,1,112,60Zm16,52a16,16,0,1,0,16,16A16,16,0,0,0,128,112Zm0,68a16,16,0,1,0,16,16A16,16,0,0,0,128,180Z"/></svg>
    `

    const menuDropdown = document.createElement('div');
    menuDropdown.classList.add('task-menu-dropdown', 'hidden');

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.classList.add('remove-button');
    removeBtn.alt = 'Excluir tarefa';
    removeBtn.innerHTML = `
    <img src="./src/assets/trash.svg" alt="">
    <span>Excluir</span>
`;

    menuDropdown.appendChild(removeBtn);
    menuContainer.appendChild(menuTrigger);
    menuContainer.appendChild(menuDropdown);
    taskItem.appendChild(menuContainer);

    if (task.completed) {
        taskItem.classList.add('completed');
        taskCheckbox.checked = true;
    }
    return taskItem;
}
