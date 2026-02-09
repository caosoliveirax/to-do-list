export function getTaskData() {
    const inputTask = document.getElementById('task-title');
    const inputDateTime = document.getElementById('task-datetime');
    const selectedPriorityInput = document.querySelector('input[name="priority"]:checked');
    const selectedCategoryInput = document.querySelector('input[name="category"]:checked');

    const title = inputTask.value;
    const dateTime = inputDateTime.value;
    const category = selectedCategoryInput ? selectedCategoryInput.dataset.label : 'Pessoal';
    const categoryValue = selectedCategoryInput ? selectedCategoryInput.value : 'personal';

    const priorityValue = selectedPriorityInput.value;
    const priorityLabel =
        selectedPriorityInput.dataset.label;

    if (title.length > 0) {
        return {
            id: Date.now(),
            title,
            dateTime,
            category,
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
        return { text: 'Expirado!', isOverdue: true };
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
        (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );

    let text = 'Restam: ';
    if (days > 0) text += `${days}d `;
    if (hours > 0) text += `${hours}h `;
    text += `${minutes}m`;

    return { text, isOverdue: false };
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
 * @param {string} task.category - O rótulo da categoria (ex: "Trabalho").
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
      study: './src/assets/study.svg'
    };

    const taskCategory = document.createElement('img');
    taskHeader.appendChild(taskCategory);
    taskCategory.classList.add('category-icon');
    taskCategory.src = categoryIcons[task.categoryValue];

    const menuContainer = document.createElement('div');
    menuContainer.classList.add('task-menu');

    const menuTrigger = document.createElement('button');
    menuTrigger.type = 'button';
    menuTrigger.classList.add('btn-action-trigger');
    menuTrigger.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M112,60a16,16,0,1,1,16,16A16,16,0,0,1,112,60Zm16,52a16,16,0,1,0,16,16A16,16,0,0,0,128,112Zm0,68a16,16,0,1,0,16,16A16,16,0,0,0,128,180Z"/></svg>
    `

    const menuDropdown = document.createElement('div');
    menuDropdown.classList.add('task-menu-dropdown', 'hidden');

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.classList.add('remove-button');
    removeBtn.alt = 'Excluir tarefa';
    removeBtn.innerHTML = `
    <img src="./src/assets/trash.svg" alt="">
    <span>Excluir</span>
`;

    menuDropdown.appendChild(removeBtn);
    menuContainer.appendChild(menuTrigger);
    menuContainer.appendChild(menuDropdown);
    taskHeader.appendChild(menuContainer);

    const taskTitle = document.createElement('p');
    taskTitle.classList.add('task-title');
    taskItem.appendChild(taskTitle);
    taskTitle.textContent = task.title;

    const taskDateTime = document.createElement('span');
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
        const dateObj = new Date(task.dateTime);
        const formattedDate = dateObj
            .toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            })
            .replace(',', ' às');

        taskDateTime.textContent = formattedDate;
    } else {
        taskDateTime.textContent = '';
    }

    const footerTask = document.createElement('div');
    footerTask.classList.add('task-footer');
    taskItem.appendChild(footerTask);

    const priorityContainer = document.createElement('div');
    priorityContainer.classList.add('priority-container');
    priorityContainer.setAttribute('aria-label', `Prioridade: ${task.priorityLabel}`)

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

    footerTask.appendChild(priorityContainer);

    const taskCheckbox = document.createElement('input');
    taskCheckbox.type = 'checkbox';
    taskCheckbox.name = 'task-checkbox';
    taskCheckbox.classList.add('task-checkbox');
    footerTask.appendChild(taskCheckbox);

    if (task.completed) {
        taskItem.classList.add('completed');
        taskCheckbox.checked = true;
    }
    return taskItem;
}
