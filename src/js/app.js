import {
  getTasksFromStorage,
  addTaskToStorage,
  removeTaskFromStorage,
  toggleTaskCompletionInStorage,
  updateTaskInStorage,
} from './storage.js';
import { sortTasksIntelligently } from './utils.js';
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

let currentFilter = 'all';

const filterCycle = [
  {
    id: 'all',
    label: 'Todas',
  },
  {
    id: 'pending',
    label: 'Pendentes',
  },
  {
    id: 'completed',
    label: 'Concluídas',
  },
];

updateHeaderDate();

export function renderTasks() {
  const allTasks = getTasksFromStorage();
  let tasksToRender = allTasks;

  if (currentFilter === 'pending') {
    tasksToRender = allTasks.filter((task) => !task.completed);
  } else if (currentFilter === 'completed') {
    tasksToRender = allTasks.filter((task) => task.completed);
  }

  taskList.innerHTML = '';

  const sortedTasks = sortTasksIntelligently(tasksToRender);

  sortedTasks.forEach((task, index) => {
    const taskElement = createTaskItem(task);
    taskElement.style.animationDelay = `${index * 0.25}s`;
    taskList.appendChild(taskElement);
  });

  const badgeElement = document.querySelector('.filter-count-badge');
  if (badgeElement) {
    badgeElement.textContent = tasksToRender.length;
  }
  toggleEmptyState(taskList);
}

renderTasks();

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
    addTaskToStorage(taskData);
    renderTasks();
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

    if (taskItem.dataset.timerId) {
      clearTimeout(Number(taskItem.dataset.timerId));
    }

    const timerId = setTimeout(() => {
      renderTasks();
      updateAllCountdowns();
    }, 2200);

    taskItem.dataset.timerId = timerId;

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

const filterBtn = document.querySelector('.filter-tab');

if (filterBtn) {
  filterBtn.addEventListener('click', () => {
    let currentIndex = filterCycle.findIndex((f) => f.id === currentFilter);

    currentIndex = (currentIndex + 1) % filterCycle.length;
    const nextState = filterCycle[currentIndex];
    currentFilter = nextState.id;
    filterBtn.dataset.filter = nextState.id;
    filterBtn.querySelector('.filter-label').textContent = nextState.label;

    renderTasks();
  });
}

setInterval(updateAllCountdowns, 60000);
updateAllCountdowns();
