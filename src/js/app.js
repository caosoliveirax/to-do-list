import { getTaskData, createTaskItem, getCountdownText } from './tasks.js';
import {
  getTasksFromStorage,
  addTaskToStorage,
  removeTaskFromStorage,
  toggleTaskCompletionInStorage,
} from './storage.js';

const openButtonSection = document.getElementById('btn-open-form');
const closeButtonSection = document.getElementById('close-form');
const containerForm = document.querySelector('.form-container');
const taskForm = document.getElementById('task-form');
const taskInputName = document.getElementById('task-title');
const inputWrapper = document.querySelector('.input-wrapper');
const resetTaskButton = document.getElementById('btn-reset');
const taskList = document.getElementById('todo-list');
const emptyStateMessage = document.getElementById('empty-state');

function toggleEmptyState() {
  const hasTasks = taskList.children.length > 0;

  if (hasTasks) {
    emptyStateMessage.classList.add('hidden');
  } else {
    emptyStateMessage.classList.remove('hidden');
  }
}

const dateElement = document.getElementById('today');
if (dateElement) {
  const now = new Date();

  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  const dateString = now.toLocaleDateString('pt-BR', options);
  const formattedDate =
    dateString.charAt(0).toUpperCase() + dateString.slice(1);

  dateElement.textContent = formattedDate;
  dateElement.setAttribute('datetime', now.toISOString().split('T')[0]);
}

const localTasks = getTasksFromStorage();
localTasks.forEach((task) => {
  const taskElement = createTaskItem(task);
  const firstTask = taskList.firstChild;

  taskList.insertBefore(taskElement, firstTask);
});

toggleEmptyState();

document.addEventListener('click', (e) => {
  const isDropdown = e.target.closest('.task-menu');
  if (!isDropdown) {
    document.querySelectorAll('.task-menu-dropdown').forEach((el) => {
      el.classList.add('hidden');
    });
  }
});

taskInputName.addEventListener('focus', () => {
  inputWrapper.classList.remove('has-error');
});

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const taskData = getTaskData();

  if (!taskData) {
    inputWrapper.classList.add('has-error');
    return;
  }

  const taskSaved = addTaskToStorage(taskData);
  if (taskSaved) {
    const taskElement = createTaskItem(taskData);
    const firstTask = taskList.firstChild;
    taskList.insertBefore(taskElement, firstTask);
    taskForm.reset();
    fp.clear();
    containerForm.classList.remove('open');
  }
  toggleEmptyState();
});

taskList.addEventListener('click', (e) => {
  const targetElement = e.target;
  const taskItem = targetElement.closest('.task-item');
  const taskId = taskItem.dataset.id;

  if (!taskItem) return;

  const menuTrigger = targetElement.closest('.btn-action-trigger');
  if (menuTrigger) {
    const dropdown = menuTrigger.nextElementSibling;
    document.querySelectorAll('.task-menu-dropdown').forEach((el) => {
      if (el !== dropdown) {
        el.classList.add('hidden');
      }
    });
    dropdown.classList.toggle('hidden');
    return;
  }

  if (targetElement.classList.contains('task-checkbox')) {
    taskItem.classList.toggle('completed');
    toggleTaskCompletionInStorage(taskId);
    return;
  }

  const removeBtn = targetElement.closest('.remove-button');
  if (removeBtn) {
    removeTaskFromStorage(taskId);
    taskItem.remove();
    toggleEmptyState();
    return;
  }
});

openButtonSection.addEventListener('click', (e) => {
  e.preventDefault();
  inputWrapper.classList.remove('has-error');
  containerForm.classList.toggle('open');
});

containerForm.addEventListener('click', (e) => {
  if (e.target === containerForm) {
    containerForm.classList.remove('open');
  }
});

closeButtonSection.addEventListener('click', (e) => {
  e.preventDefault();
  containerForm.classList.remove('open');
});

const formContent = document.getElementById('form-content');
const formContainer = document.getElementById('form-container');

let touchStartY = 0;
let touchEndY = 0;

formContent.addEventListener(
  'touchstart',
  (e) => {
    touchStartY = e.changedTouches[0].screenY;
  },
  { passive: true }
);

formContent.addEventListener(
  'touchend',
  (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
  },
  { passive: true }
);

function handleSwipe() {
  const swipeDistance = touchEndY - touchStartY;

  if (swipeDistance > 200) {
    formContainer.classList.remove('open');
  }
}

const fp = flatpickr('#task-datetime', {
  enableTime: true,
  dateFormat: 'Y-m-d H:i',
  altInput: true,
  altFormat: 'j \\de F, H:i',
  locale: 'pt',
  time_24hr: true,
  disableMobile: 'true',
});

resetTaskButton.addEventListener('click', () => {
  inputWrapper.classList.remove('has-error');
  resetTaskButton.classList.add('is-spinning');
  taskForm.reset();
  fp.clear();
  setTimeout(() => {
    resetTaskButton.classList.remove('is-spinning');
  }, 500);

  taskInputName.focus();
});

function updateAllCountdowns() {
  const allTasks = document.querySelectorAll('.task-item');

  allTasks.forEach((taskItem) => {
    const deadline = taskItem.dataset.deadline;

    if (!deadline || taskItem.classList.contains('completed')) return;

    const countdownData = getCountdownText(deadline);
    const countdownElement = taskItem.querySelector('.task-countdown');

    if (countdownElement && countdownData) {
      countdownElement.textContent = countdownData.text;

      if (countdownData.isOverdue) {
        taskItem.classList.add('overdue');
      } else {
        taskItem.classList.remove('overdue');
      }
    }
  });
}

setInterval(updateAllCountdowns, 60000);
updateAllCountdowns();
