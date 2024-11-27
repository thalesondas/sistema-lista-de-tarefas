# Link do Site

[https://sistema-lista-de-tarefas-nine.vercel.app/](https://sistema-lista-de-tarefas-nine.vercel.app/)

# Lista de Tarefas (Task List)

Este é um projeto de gerenciamento de tarefas, onde você pode criar, editar, excluir e organizar suas tarefas de forma eficiente. O projeto é desenvolvido utilizando React no front-end, Node.js no back-end e PostgreSQL como banco de dados. O sistema inclui funcionalidades como drag-and-drop, edição de tarefas, validação de data limite, e muito mais!

## Tecnologias Utilizadas
- **React:** Framework JavaScript para construção da interface do usuário.
- **Node.js:** Ambiente de execução JavaScript no back-end.
- **MongoDB:** Banco de dados NoSQL utilizado para armazenar as tarefas.
- **Mongoose:** Biblioteca para modelagem de dados no MongoDB.
- **React-Bootstrap:** Biblioteca de componentes UI responsivos.
- **Axios:** Biblioteca para realizar requisições HTTP no front-end.
- **@dnd-kit/core:** Biblioteca para implementar a funcionalidade de drag-and-drop nas tarefas.
- **AOS:** Biblioteca para animações ao rolar a página.

## Funcionalidades
- **Criar Tarefa:** Adicione novas tarefas com nome, custo e data limite.
- **Editar Tarefa:** Altere o nome, custo e data limite de uma tarefa existente.
- **Excluir Tarefa:** Remova tarefas que não são mais necessárias.
- **Ordenação:** Organize as tarefas movendo-as para cima ou para baixo.
- **Drag-and-Drop:** Organize as tarefas na lista com drag-and-drop utilizando a biblioteca @dnd-kit/core.
- **Validação de Data:** Não é possível adicionar ou editar tarefas com datas passadas.
- **Validação de Nomes Repetidos:** Não é possivel adicionar ou editar o nome da tarefa caso já tenha outra com o mesmo nome.