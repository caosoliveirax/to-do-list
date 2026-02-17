export function getTaskData() {
  const inputTask = document.getElementById('task-title');
  const inputDateTime = document.getElementById('task-datetime');
  const selectedPriorityInput = document.querySelector(
    'input[name="priority"]:checked'
  );
  const selectedCategoryInput = document.querySelector(
    'input[name="category"]:checked'
  );

  const title = inputTask.value.trim();
  const dateTime = inputDateTime.value;
  const categoryLabel = selectedCategoryInput
    ? selectedCategoryInput.dataset.label
    : 'Pessoal';
  const categoryValue = selectedCategoryInput
    ? selectedCategoryInput.value
    : 'personal';

  const priorityLabel = selectedPriorityInput
    ? selectedPriorityInput.dataset.label
    : 'Nenhuma';
  const priorityValue = selectedPriorityInput
    ? selectedPriorityInput.value
    : 'none';

  if (title.length > 0) {
    return {
      id: Date.now(),
      title,
      dateTime,
      categoryLabel,
      categoryValue,
      priorityValue,
      priorityLabel,
      completed: false,
    };
  }
}

/**
 * Calcula o tempo restante até o prazo final (deadline) e retorna o texto formatado.
 *    @param {string} deadline - A data e hora do prazo (no formato aceito pelo construtor Date).
 * @returns {Object|null} Objeto com a contagem ou null caso o prazo seja inválido.
 * @property {string} text - O texto formatado para exibição (ex: "Restam: 1d 5h 30m").
 * @property {boolean} isOverdue - Define se a tarefa está atrasada (prazo expirado).
 */
export function getCountdownText(deadline) {
  if (!deadline) return null;

  const now = new Date().getTime();
  const targetTime = new Date(deadline).getTime();
  const timeDifference = targetTime - now;

  if (timeDifference <= 0) {
    return { text: 'Expirado', isOverdue: true };
  }

  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

  let text = '';
  if (days > 0) text += `${days}d `;
  if (hours > 0) text += `${hours}h `;
  text += `${minutes}m`;

  return { text, isOverdue: false };
}

function formatTaskDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString.replace(/-/g, '/'));
  const currentYear = new Date().getFullYear();
  const taskYear = date.getFullYear();
  const options = {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  };
  if (taskYear !== currentYear) {
    options.year = 'numeric';
  }
  return date.toLocaleDateString('pt-BR', options);
}

/**
 * Cria o elemento HTML (item de lista) para representar uma tarefa no DOM.
 * Esta função é responsável por construir toda a estrutura visual de uma tarefa,
 * incluindo os badges de categoria, título, data formatada, contador regressivo,
 * ícone de prioridade, checkbox de conclusão e o menu de ações (context menu).
 * @param {Object} task - O objeto contendo todos os dados da tarefa.
 * @param {number} task.id - O identificador único (Timestamp).
 * @param {string} task.title - O texto descritivo da tarefa.
 * @param {string} task.dateTime - A string de data/hora no formato ISO ou formatada.
 * @param {string} task.categoryValue - O valor técnico da categoria (ex: "work").
 * @param {string} task.categoryLabel - O rótulo da categoria (ex: "Trabalho").
 * @param {string} task.priorityValue - O valor técnico da prioridade (ex: "high").
 * @param {string} task.priorityLabel - O texto amigável da prioridade (ex: "Alta").
 * @param {boolean} task.completed - O estado atual de conclusão da tarefa.
 * @returns {HTMLLIElement} O elemento <li> pronto para ser inserido na <ul> da lista.
 */
export function createTaskItem(task) {
  const taskItem = document.createElement('li');
  taskItem.classList.add('task-item');

  if (task.categoryValue) {
    taskItem.classList.add(`category-${task.categoryValue}`);
  }

  taskItem.dataset.id = task.id;

  const taskHeader = document.createElement('div');
  taskHeader.classList.add('task-header');
  taskItem.appendChild(taskHeader);

  const categoryIcons = {
    personal: './src/assets/personal.svg',
    entertainment: './src/assets/entertainment.svg',
    home: './src/assets/home.svg',
    health: './src/assets/health.svg',
    shopping: './src/assets/shopping.svg',
    work: './src/assets/work.svg',
    study: './src/assets/study.svg',
  };

  const taskCategory = document.createElement('img');
  taskHeader.appendChild(taskCategory);
  taskCategory.classList.add('category-icon');
  taskCategory.src = categoryIcons[task.categoryValue];

  const priorityContainer = document.createElement('div');
  priorityContainer.classList.add('priority-container');
  priorityContainer.setAttribute(
    'aria-label',
    `Prioridade: ${task.priorityLabel}`
  );

  const starsCount = {
    none: 0,
    low: 1,
    medium: 2,
    high: 3,
  };

  const count = starsCount[task.priorityValue] || 0;

  for (let i = 0; i < count; i++) {
    const starIcon = document.createElement('span');
    starIcon.classList.add('star-icon');
    starIcon.setAttribute('aria-hidden', 'true');
    priorityContainer.appendChild(starIcon);
  }

  taskHeader.appendChild(priorityContainer);

  const taskTitle = document.createElement('p');
  taskTitle.classList.add('task-title');
  taskItem.appendChild(taskTitle);
  taskTitle.textContent = task.title;

  const taskDateTime = document.createElement('span');
  taskDateTime.classList.add('task-datetime');
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
    taskDateTime.textContent = formatTaskDate(task.dateTime);
  } else {
    taskDateTime.textContent = '';
  }

  const footerTask = document.createElement('div');
  footerTask.classList.add('task-footer');
  taskItem.appendChild(footerTask);

  const actionsContainer = document.createElement('div');
  actionsContainer.classList.add('actions-container');
  footerTask.appendChild(actionsContainer);

  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.classList.add('btn-action', 'edit-button');
  editBtn.alt = 'Editar tarefa';
  editBtn.innerHTML = `
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"/></svg>
`;
  actionsContainer.appendChild(editBtn);

  const rescheduleBtn = document.createElement('button');
  rescheduleBtn.type = 'button';
  rescheduleBtn.classList.add('btn-action', 'reschedule-button');
  rescheduleBtn.alt = 'Reagendar tarefa';
  rescheduleBtn.innerHTML = `
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"/></svg>
`;
  actionsContainer.appendChild(rescheduleBtn);

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.classList.add('btn-action', 'remove-button');
  removeBtn.alt = 'Excluir tarefa';
  removeBtn.innerHTML = `
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M216,48H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM192,208H64V64H192ZM80,24a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H88A8,8,0,0,1,80,24Z"/></svg>
`;
  actionsContainer.appendChild(removeBtn);

  const taskCheckbox = document.createElement('input');
  taskCheckbox.type = 'checkbox';
  taskCheckbox.name = 'task-checkbox';
  taskCheckbox.classList.add('task-checkbox');
  footerTask.appendChild(taskCheckbox);

  if (task.completed) {
    taskItem.classList.add('completed');
    taskItem.classList.remove('overdue');
    taskCheckbox.checked = true;
  }
  return taskItem;
}
