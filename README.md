# Lista de Tarefas (Task List)

Este é um projeto de gerenciamento de tarefas, onde você pode criar, editar, excluir e organizar suas tarefas de forma eficiente. O projeto é desenvolvido utilizando React no front-end, Node.js no back-end e PostgreSQL como banco de dados. O sistema inclui funcionalidades como drag-and-drop, edição de tarefas, validação de data limite, e muito mais!

## Tecnologias Utilizadas
- **React:** Framework JavaScript para construção da interface do usuário.
- **Node.js:** Ambiente de execução JavaScript no back-end.
- **PostgreSQL:** Banco de dados relacional utilizado para armazenar as tarefas.
- **Sequelize:** ORM para facilitar a comunicação com o banco de dados.
- **React-Bootstrap:** Biblioteca de componentes UI responsivos.
- **@dnd-kit/core:** Biblioteca para implementar a funcionalidade de drag-and-drop nas tarefas.
- **Axios:** Biblioteca para realizar requisições HTTP no front-end.

## Funcionalidades
- **Criar Tarefa:** Adicione novas tarefas com nome, custo e data limite.
- **Editar Tarefa:** Altere o nome, custo e data limite de uma tarefa existente.
- **Excluir Tarefa:** Remova tarefas que não são mais necessárias.
- **Drag-and-Drop:** Organize as tarefas na lista com drag-and-drop utilizando a biblioteca @dnd-kit/core.
- **Validação de Data:** Não é possível adicionar ou editar tarefas com datas passadas.
- **Ordenação:** Organize as tarefas movendo-as para cima ou para baixo.