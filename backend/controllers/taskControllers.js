const { Task } = require('../models');

module.exports = {

  async getAllTasks(req, res) {
    try {
      const tasks = await Task.findAll({ order: [["order", "ASC"]] });
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Falha ao buscar tarefas" });
    }
  },

  async createTask(req, res) {
    try {
      const { name, cost, deadline } = req.body;
      
      // Encontrar o maior valor de 'order' existente e definir o próximo
      const maxOrder = await Task.max('order'); // Pega o maior valor de 'order'
      const order = await maxOrder ? maxOrder + 1 : 1; // Se não houver valor, começa com 1

      const task = await Task.create({ name, cost, deadline, order });
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: "Falha ao criar tarefa" });
    }
  },

  async updateTask(req, res) {
    try {
      const { id } = req.params;
      const { name, cost, deadline } = req.body;
      const task = await Task.findByPk(id);
      if (!task) return res.status(404).json({ error: "Tarefa não encontrada" });

      await task.update({ name, cost, deadline });
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Falha ao atualizar tarefa" });
    }
  },

  async deleteTask(req, res) {
    try {
      const { id } = req.params;
      const task = await Task.findByPk(id);
      if (!task) return res.status(404).json({ error: "Tarefa não encontrada" });

      await task.destroy();
      res.json({ message: "Sucesso ao deletar tarefa" });
    } catch (error) {
      res.status(500).json({ error: "Falha ao deletar tarefa" });
    }
  },

  async updateOrder(req, res) {
    const { currentId, targetId } = req.body;

    if (!currentId || !targetId) {
        return res.status(400).json({ error: 'IDs inválidos' });
    }

    try {
        // Encontrar as tarefas
        const currentTask = await Task.findByPk(currentId);
        const targetTask = await Task.findByPk(targetId);

        if (!currentTask || !targetTask) {
            return res.status(404).json({ error: 'Tarefa(s) não encontrada(s)' });
        }

        // Trocar as ordens
        const tempOrder = currentTask.order;
        currentTask.order = targetTask.order;
        targetTask.order = tempOrder;

        // Salvar as atualizações
        await currentTask.save();
        await targetTask.save();
        
        return res.status(200).json({ message: 'Ordem atualizada com sucesso' });
    } catch (error) {
        await transaction.rollback(); // Reverter alterações em caso de erro
        console.error('Erro ao atualizar ordem:', error);
        return res.status(500).json({ error: 'Erro no servidor' });
    }
  }
};