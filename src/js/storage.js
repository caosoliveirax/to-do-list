export function getTasksFromStorage() {
    const tasks = JSON.parse(localStorage.getItem('myTasks'));
    return tasks ? tasks : [];
}

export function addTaskToStorage(task) {
    let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
    const existingTask = tasks.find((t) => t.title === task.title);

    if(!existingTask) {
        tasks.push(task);
        localStorage.setItem('myTasks', JSON.stringify(tasks));
        return true
    } else {
        return false
    }
}

export function removeTaskFromStorage(title) {
    let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
    tasks = tasks.filter( task => task.title !== title);
    localStorage.setItem('myTasks', JSON.stringify(tasks));
}

export function toggleTaskCompletionInStorage(title) {
    let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
    
    tasks = tasks.map(task => {
        if (task.title === title) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });

    localStorage.setItem('myTasks', JSON.stringify(tasks));
}