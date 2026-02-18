import { initMainCalendar } from './calendar.js';

const formContainer = document.getElementById('form-container');
const formTitle = document.querySelector('.header-form .section-title');
const taskForm = document.getElementById('task-form');
const formContent = document.getElementById('form-content');
const btnSubmit = document.getElementById('btn-add');
const taskInputName = document.getElementById('task-title');
const inputWrapper = document.querySelector('.input-wrapper');
const priorityContainer = document.getElementById('priority-selector');
const resetTaskButton = document.getElementById('btn-reset');
const priorityInputs = document.querySelectorAll('input[name="priority"]');

const fp = initMainCalendar();

let isEditMode = false;
let currentEditTaskId = null;

export function getFormState() {
  return {
    isEditMode,
    currentEditTaskId,
  };
}

/**
 * Captura os dados do formulário HTML e retorna um objeto de tarefa.
 * @returns {Object|undefined} O objeto da tarefa ou undefined se o título estiver vazio.
 */
export function getTaskData() {
  const inputDateTime = document.getElementById('task-datetime');
  const selectedPriorityInput = document.querySelector(
    'input[name="priority"]:checked'
  );
  const selectedCategoryInput = document.querySelector(
    'input[name="category"]:checked'
  );

  const title = taskInputName.value.trim();

  if (title.length === 0) return null;

  return {
    id: Date.now(),
    title,
    dateTime: inputDateTime.value,
    categoryLabel: selectedCategoryInput
      ? selectedCategoryInput.dataset.label
      : 'Pessoal',
    categoryValue: selectedCategoryInput
      ? selectedCategoryInput.value
      : 'personal',
    priorityLabel: selectedPriorityInput
      ? selectedPriorityInput.dataset.label
      : 'Nenhuma',
    priorityValue: selectedPriorityInput ? selectedPriorityInput.value : 'none',
    completed: false,
  };
}

export function openEditForm(task) {
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

export function resetFormState() {
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
  inputWrapper.classList.remove('has-error');
}

export function toggleFormVisibility() {
  inputWrapper.classList.remove('has-error');
  formContainer.classList.toggle('open');
}

function updatePriorityVisuals() {
  const selected = document.querySelector('input[name="priority"]:checked');

  if (selected && priorityContainer) {
    priorityContainer.setAttribute('data-selected', selected.value);
  }
}

export function setInputError(hasError) {
  if (hasError) inputWrapper.classList.add('has-error');
  else inputWrapper.classList.remove('has-error');
}

function handleCloseByUX() {
  toggleFormVisibility();
  if (isEditMode) resetFormState();
}

priorityInputs.forEach((input) => {
  input.addEventListener('change', () => {
    updatePriorityVisuals();
  });
});

if (resetTaskButton) {
  resetTaskButton.addEventListener('click', () => {
    resetTaskButton.classList.add('is-spinning');
    resetFormState();
    toggleFormVisibility();

    setTimeout(() => {
      resetTaskButton.classList.remove('is-spinning');
    }, 500);

    if (taskInputName) taskInputName.focus();
  });
}

taskInputName.addEventListener('focus', () => {
  inputWrapper.classList.remove('has-error');
});

formContainer.addEventListener('click', (e) => {
  if (e.target === formContainer) {
    handleCloseByUX();
  }
});

let touchStartY = 0;

if (formContent) {
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
      const touchEndY = e.changedTouches[0].screenY;
      const swipeDistance = touchEndY - touchStartY;

      if (swipeDistance > 100) {
        handleCloseByUX();
      }
    },
    { passive: true }
  );
}

updatePriorityVisuals();
