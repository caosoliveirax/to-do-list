/**
 * Calcula o tempo restante e verifica se está atrasado.
 * @param {string} deadline - Data limite.
 * @returns {Object|null} { text: "1d 2h", isOverdue: boolean }
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

  return { text: text.trim(), isOverdue: false };
}

/**
 * Formata a data para exibição amigável.
 * Se for o ano atual, omite o ano para reduzir ruído visual.
 * Ex: "24 de Outubro, 15:30" (ano atual) vs "18 de Março de 2027, 12:00" (outro ano)
 */
export function formatTaskDate(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString.replace(/-/g, '/'));

  const currentYear = new Date().getFullYear();
  const taskYear = date.getFullYear();

  const day = date.getDate();
  let month = date
    .toLocaleDateString('pt-BR', { month: 'short' })
    .replace('.', '');
  month = month.charAt(0).toUpperCase() + month.slice(1);

  const time = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (taskYear !== currentYear) {
    return `${day} de ${month} de ${time}, ${taskYear}`;
  }
  return `${day} de ${month}, ${time}`;
}

export function sortTasksIntelligently(tasks) {
  const priorityWeights = { none: 0, low: 1, medium: 2, high: 3 };

  return tasks.sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;

    const timeA = a.dateTime ? new Date(a.dateTime).getTime() : null;
    const timeB = b.dateTime ? new Date(b.dateTime).getTime() : null;

    if (timeA && timeB) {
      if (timeA !== timeB) return timeA - timeB;
    } else if (timeA && !timeB) {
      return -1;
    } else if (!timeA && timeB) {
      return 1;
    }

    const prioA = priorityWeights[a.priorityValue] || 0;
    const prioB = priorityWeights[b.priorityValue] || 0;

    return prioB - prioA;
  });
}
