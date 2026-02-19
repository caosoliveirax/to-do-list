import {
  getTasksFromStorage,
  addTaskToStorage,
  removeTaskFromStorage,
  toggleTaskCompletionInStorage,
  updateTaskInStorage,
} from './storage.js';
import { createTaskItem } from './tasks.js';
import {
  updateHeaderDate,
  toggleEmptyState,
  updateAllCountdowns,
} from './ui.js';
import { initQuickRescheduleCalendar } from './calendar.js';
import { showToast } from './toast.js';
import * as Form from './form.js';

const taskList = document.getElementById('todo-list');
const openButtonSection = document.getElementById('btn-open-form');
const closeButtonSection = document.getElementById('close-form');
const taskForm = document.getElementById('task-form');

updateHeaderDate();

const localTasks = getTasksFromStorage();
localTasks.forEach((task) => {
  const taskElement = createTaskItem(task);
  taskList.prepend(taskElement);
});

toggleEmptyState(taskList);

let currentRescheduleTaskId = null;
const quickFp = initQuickRescheduleCalendar(() => currentRescheduleTaskId);

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const taskData = Form.getTaskData();

  if (!taskData) {
    Form.setInputError(true);
    return;
  }

  const { isEditMode, currentEditTaskId } = Form.getFormState();

  if (isEditMode) {
    const tasks = getTasksFromStorage();
    const originalTask = tasks.find((t) => t.id === currentEditTaskId);

    if (originalTask) {
      taskData.id = currentEditTaskId;
      taskData.completed = originalTask.completed;

      updateTaskInStorage(taskData);
      location.reload();
    }
  } else {
    const taskSaved = addTaskToStorage(taskData);
    if (taskSaved) {
      const taskElement = createTaskItem(taskData);
      taskList.prepend(taskElement);
    }
  }
  toggleEmptyState(taskList);
  Form.resetFormState();
});

openButtonSection.addEventListener('click', (e) => {
  e.preventDefault();
  Form.toggleFormVisibility();
});

closeButtonSection.addEventListener('click', (e) => {
  e.preventDefault();
  Form.resetFormState();
});

taskList.addEventListener('click', (e) => {
  const targetElement = e.target;
  const taskItem = targetElement.closest('.task-item');

  if (!taskItem) return;

  const taskId = Number(taskItem.dataset.id);

  if (targetElement.closest('.edit-button')) {
    const tasks = getTasksFromStorage();
    const taskToEdit = tasks.find((t) => t.id === Number(taskId));
    if (taskToEdit) Form.openEditForm(taskToEdit);
    return;
  }

  if (targetElement.closest('.reschedule-button')) {
    currentRescheduleTaskId = taskId;
    const tasks = getTasksFromStorage();
    const task = tasks.find((t) => t.id === Number(taskId));

    if (task) {
      quickFp.setDate(task.dateTime || new Date());
      quickFp.open();
    }
    return;
  }

  if (targetElement.classList.contains('task-checkbox')) {
    taskItem.classList.toggle('completed');
    if (taskItem.classList.contains('completed')) {
      taskItem.classList.remove('overdue');
    }
    toggleTaskCompletionInStorage(taskId);
    updateAllCountdowns();
    return;
  }

  const removeBtn = targetElement.closest('.remove-button');
  if (removeBtn) {
    taskItem.style.display = 'none';
    toggleEmptyState(taskList);

    showToast(
      () => {
        removeTaskFromStorage(taskId);
        taskItem.remove();
        toggleEmptyState(taskList);
      },
      () => {
        taskItem.style.display = '';
        toggleEmptyState(taskList);
      }
    );
    return;
  }
});

setInterval(updateAllCountdowns, 60000);
updateAllCountdowns();
