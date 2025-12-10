export function getTaskData() {
    const inputTask = document.getElementById('task-title');
    const selectCategory = document.getElementById('category');
    const selectPriority = document.getElementById('priority');

    const title = inputTask.value
    const category = selectCategory.options[selectCategory.selectedIndex].text
    const priority = selectPriority.options[selectPriority.selectedIndex].text

    if (title.length > 0) {
        return {
            title,
            category,
            priority
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
    
    const taskPriority = document.createElement('span');
    taskItem.appendChild(taskPriority)
    
    const taskCheckbox = document.createElement('input');
    taskCheckbox.type = 'checkbox'
    taskCheckbox.id = 'task-checkbox'
    taskCheckbox.name = 'task-checkbox'

    taskItem.appendChild(taskCheckbox)

    taskTitle.textContent = task.title
    taskCategory.textContent = task.category
    taskPriority.textContent = task.priority

    return taskItem
}