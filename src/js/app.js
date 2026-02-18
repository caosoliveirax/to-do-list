import {
  getTasksFromStorage,
  addTaskToStorage,
  removeTaskFromStorage,
  toggleTaskCompletionInStorage,
  updateTaskInStorage,
} from './storage.js';
import { getTaskData, createTaskItem } from './tasks.js';
import {
  updateHeaderDate,
  toggleEmptyState,
  updatePriorityVisuals,
  updateAllCountdowns,
} from './ui.js';
import { initMainCalendar, initQuickRescheduleCalendar } from './calendar.js';

let isEditMode = false;
let currentEditTaskId = null;
let currentRescheduleTaskId = null;

const taskList = document.getElementById('todo-list');
const openButtonSection = document.getElementById('btn-open-form');
const closeButtonSection = document.getElementById('close-form');
const formTitle = document.querySelector('.header-form .section-title');
const taskForm = document.getElementById('task-form');
const taskInputName = document.getElementById('task-title');
const inputWrapper = document.querySelector('.input-wrapper');
const resetTaskButton = document.getElementById('btn-reset');
const priorityContainer = document.getElementById('priority-selector');
const priorityInputs = priorityContainer.querySelectorAll(
  'input[name="priority"]'
);
const btnSubmit = document.getElementById('btn-add');
const formContent = document.getElementById('form-content');
const formContainer = document.getElementById('form-container');

updateHeaderDate();

const localTasks = getTasksFromStorage();
localTasks.forEach((task) => {
  const taskElement = createTaskItem(task);
  const firstTask = taskList.firstChild;
  taskList.insertBefore(taskElement, firstTask);
});

toggleEmptyState(taskList);

const quickFp = initQuickRescheduleCalendar(() => currentRescheduleTaskId);
const fp = initMainCalendar();

function openEditForm(task) {
  isEditMode = true;
  currentEditTaskId = task.id;

  taskInputName.value = task.title;
  fp.setDate(task.dateTime);

  const catInput = document.querySelector(
    `input[name="category"][value="${task.categoryValue}"]`
  );
  if (catInput) catInput.checked = true;

  const prioInput = document.querySelector(
    `input[name="priority"][value="${task.priorityValue}"]`
  );
  if (prioInput) prioInput.checked = true;

  updatePriorityVisuals();

  formTitle.textContent = 'Editar Tarefa';
  btnSubmit.innerHTML = `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"/></svg> Salvar Alterações`;
  formContainer.classList.add('open');
}

function resetFormState() {
  isEditMode = false;
  currentEditTaskId = null;
  formTitle.textContent = 'Nova Tarefa';
  btnSubmit.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
      <path d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z" />
    </svg> Adicionar tarefa`;

  taskForm.reset();
  fp.clear();
  updatePriorityVisuals();
  formContainer.classList.remove('open');
  toggleEmptyState(taskList);
}

taskInputName.addEventListener('focus', () => {
  inputWrapper.classList.remove('has-error');
});

priorityInputs.forEach((input) => {
  input.addEventListener('change', updatePriorityVisuals);
});

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const taskData = getTaskData();

  if (!taskData) {
    inputWrapper.classList.add('has-error');
    return;
  }

  if (isEditMode) {
    const tasks = getTasksFromStorage();
    const originalTask = tasks.find((t) => t.id === currentEditTaskId);

    taskData.id = currentEditTaskId;
    taskData.completed = originalTask ? originalTask.completed : false;

    updateTaskInStorage(taskData);
    location.reload();
  } else {
    const taskSaved = addTaskToStorage(taskData);
    if (taskSaved) {
      const taskElement = createTaskItem(taskData);
      const firstTask = taskList.firstChild;
      taskList.insertBefore(taskElement, firstTask);
    }
  }
  resetFormState();
});

taskList.addEventListener('click', (e) => {
  const targetElement = e.target;
  const taskItem = targetElement.closest('.task-item');
  if (!taskItem) return;
  const taskId = taskItem.dataset.id;

  const editBtn = targetElement.closest('.edit-button');
  if (editBtn) {
    const tasks = getTasksFromStorage();
    const taskToEdit = tasks.find((t) => t.id === Number(taskId));
    if (taskToEdit) openEditForm(taskToEdit);
    return;
  }

  const rescheduleBtn = targetElement.closest('.reschedule-button');
  if (rescheduleBtn) {
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
    removeTaskFromStorage(taskId);
    taskItem.remove();
    toggleEmptyState(taskList);
    return;
  }
});

openButtonSection.addEventListener('click', (e) => {
  e.preventDefault();
  inputWrapper.classList.remove('has-error');
  formContainer.classList.toggle('open');
});

formContainer.addEventListener('click', (e) => {
  if (e.target === formContainer) {
    formContainer.classList.remove('open');
    if (isEditMode) resetFormState();
  }
});

closeButtonSection.addEventListener('click', (e) => {
  e.preventDefault();
  formContainer.classList.remove('open');
  if (isEditMode) resetFormState();
});

resetTaskButton.addEventListener('click', () => {
  inputWrapper.classList.remove('has-error');
  resetTaskButton.classList.add('is-spinning');
  taskForm.reset();
  fp.clear();
  updatePriorityVisuals();
  setTimeout(() => {
    resetTaskButton.classList.remove('is-spinning');
  }, 500);
  taskInputName.focus();
});

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
    const swipeDistance = touchEndY - touchStartY;
    if (swipeDistance > 200) {
      formContainer.classList.remove('open');
      if (isEditMode) resetFormState();
    }
  },
  { passive: true }
);

updatePriorityVisuals();
setInterval(updateAllCountdowns, 60000);
updateAllCountdowns();
