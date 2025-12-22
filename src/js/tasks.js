export function getTaskData() {
    const inputTask = document.getElementById('task-title');
    const selectCategory = document.getElementById('category');
    const selectPriority = document.getElementById('priority');

    const title = inputTask.value
    const category = selectCategory.options[selectCategory.selectedIndex].text
    const priorityValue = selectPriority.value
    const priorityLabel = selectPriority.options[selectPriority.selectedIndex].text

    if (title.length > 0) {
        return {
            title,
            category,
            priorityValue,
            priorityLabel
        }
    }

}

export function createTaskItem(task) {

    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item');

    const taskCategory = document.createElement('span');
    taskItem.appendChild(taskCategory)
    
    const taskTitle = document.createElement('p');
    taskItem.appendChild(taskTitle)
    
    const priorityIcons = {
        'none': './images/tiers/none.svg',
        'low': './images/tiers/low.svg',
        'medium': './images/tiers/medium.svg',
        'high': './images/tiers/high.svg'
    };

    const taskPriority = document.createElement('img');
    taskPriority.src = priorityIcons[task.priorityValue];
    taskPriority.alt = task.priorityLabel;
    taskItem.appendChild(taskPriority)
    
    const taskCheckbox = document.createElement('input');
    taskCheckbox.type = 'checkbox'
    taskCheckbox.id = 'task-checkbox'
    taskCheckbox.name = 'task-checkbox'

    taskItem.appendChild(taskCheckbox)

    taskTitle.textContent = task.title
    taskCategory.textContent = task.category

    return taskItem
}