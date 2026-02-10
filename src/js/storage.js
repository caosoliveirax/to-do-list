export function getTasksFromStorage() {
  const tasks = JSON.parse(localStorage.getItem('myTasks'));
  return tasks ? tasks : [];
}

export function addTaskToStorage(task) {
  let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];

  tasks.push(task);
  localStorage.setItem('myTasks', JSON.stringify(tasks));
  return true;
}

export function removeTaskFromStorage(id) {
  let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
  tasks = tasks.filter((task) => task.id !== Number(id));
  localStorage.setItem('myTasks', JSON.stringify(tasks));
}

export function toggleTaskCompletionInStorage(id) {
  let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];

  tasks = tasks.map((task) => {
    if (task.id === Number(id)) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });

  localStorage.setItem('myTasks', JSON.stringify(tasks));
}
