// Função para adicionar tarefa na lista geral
document.getElementById('add-task').addEventListener('click', function () {
    addTask('new-task', 'task-list'); 
});

// Função genérica para adicionar uma tarefa em uma lista específica
function addTask(taskInputId, taskListId) {
    const taskText = document.getElementById(taskInputId).value;

    if (taskText !== "") {
        const taskList = document.getElementById(taskListId);
        const newTask = document.createElement('li');
        newTask.textContent = taskText;
        newTask.classList.add('task-item'); // Adiciona a classe .task-item para estilização

        // Configuração de arrastar e soltar
        newTask.draggable = true;
        newTask.addEventListener('dragstart', dragStart);
        newTask.addEventListener('dragover', dragOver);
        newTask.addEventListener('drop', drop);
        newTask.addEventListener('dragend', dragEnd);

        // Adicionar botão de exclusão
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', function () {
            taskList.removeChild(newTask);
        });

        // Marcar tarefa como concluída ao clicar, com animação
        newTask.addEventListener('click', function () {
            newTask.classList.toggle('completed');
            if (newTask.classList.contains('completed')) {
                newTask.classList.add('completed-animated');
            } else {
                newTask.classList.remove('completed-animated');
            }
        });

        // Adicionar o botão de exclusão à tarefa
        newTask.appendChild(deleteButton);

        taskList.appendChild(newTask);
        document.getElementById(taskInputId).value = "";  // Limpar campo de input
    } else {
        alert("Por favor, insira uma tarefa.");
    }
}

// Função para adicionar tarefas em cada matéria usando uma função reutilizável
function setupSubjectTask(subjectId, taskInputId, taskListId) {
    document.getElementById(subjectId).addEventListener('click', function () {
        addTask(taskInputId, taskListId);
    });
}

// Configurar cada matéria com a função genérica
setupSubjectTask('add-task-java', 'new-task-java', 'task-list-java');
setupSubjectTask('add-task-python', 'new-task-python', 'task-list-python');
setupSubjectTask('add-task-js', 'new-task-js', 'task-list-js');
setupSubjectTask('add-task-html', 'new-task-html', 'task-list-html');
setupSubjectTask('add-task-css', 'new-task-css', 'task-list-css');
setupSubjectTask('add-task-cpp', 'new-task-cpp', 'task-list-cpp');

// Funções Drag-and-Drop com efeito visual
function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
    event.target.classList.add('dragging');
    event.target.style.opacity = "0.5";
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const draggedItem = document.querySelector('.dragging');
    const dropZone = event.target.closest('li');
    if (dropZone && dropZone !== draggedItem) {
        dropZone.parentNode.insertBefore(draggedItem, dropZone.nextSibling);
    }
}

function dragEnd(event) {
    event.target.classList.remove('dragging');
    event.target.style.opacity = "1";
}

// Função para tornar os itens da lista de tarefas arrastáveis
function makeTasksDraggable(taskListId) {
    const taskList = document.getElementById(taskListId);
    let draggedItem = null;

    taskList.addEventListener('dragstart', function(e) {
        draggedItem = e.target;
        e.target.classList.add('dragging');
    });

    taskList.addEventListener('dragend', function(e) {
        e.target.classList.remove('dragging');
    });

    taskList.addEventListener('dragover', function(e) {
        e.preventDefault();
        const afterElement = getDragAfterElement(taskList, e.clientY);
        if (afterElement == null) {
            taskList.appendChild(draggedItem);
        } else {
            taskList.insertBefore(draggedItem, afterElement);
        }
    });
}

// Função para determinar a posição de inserção
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Chamando a função para cada lista de tarefas
makeTasksDraggable('task-list'); // Lista geral de tarefas
makeTasksDraggable('task-list-java'); // Exemplo para a lista de Java
makeTasksDraggable('task-list-python');
makeTasksDraggable('task-list-js');
makeTasksDraggable('task-list-html');
makeTasksDraggable('task-list-css');
makeTasksDraggable('task-list-cpp');

// Variáveis do modal e botão
const modal = document.getElementById("language-modal");
const openModalButton = document.getElementById("change-language-grade");
const closeModalButton = document.querySelector(".close-button");
const confirmChangeButton = document.getElementById("confirm-change");

// Abre o modal ao clicar no botão
openModalButton.addEventListener("click", () => {
    modal.style.display = "block";
});

// Fecha o modal ao clicar no "x" ou fora do conteúdo
closeModalButton.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Função para confirmar a troca de linguagem
confirmChangeButton.addEventListener("click", () => {
    const currentLanguage = document.getElementById("current-language").value;
    const newLanguage = document.getElementById("new-language").value.trim();

    if (newLanguage) {
        // Encontra o elemento de título e o campo de entrada da linguagem atual e atualiza ambos
        const languageTitles = document.querySelectorAll(".programming-section h3");
        const taskInputs = document.querySelectorAll(".programming-section .task-input input");

        languageTitles.forEach((title, index) => {
            if (title.textContent === currentLanguage) {
                title.textContent = newLanguage; // Atualiza o título da linguagem
                taskInputs[index].placeholder = `Adicionar tarefa de ${newLanguage}...`; // Atualiza o placeholder
            }
        });

        // Fecha o modal e limpa o campo de entrada
        modal.style.display = "none";
        document.getElementById("new-language").value = "";
    } else {
        alert("Por favor, insira o nome da nova linguagem.");
    }
});

