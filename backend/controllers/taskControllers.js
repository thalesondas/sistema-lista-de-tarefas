const Task = require('../models/Task');

module.exports = {

  async getAllTasks(req, res) {
    try {
      const tasks = await Task.find().sort({ order: 1 }); // Ordena pela propriedade 'order'
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Falha ao buscar tarefas" });
    }
  },

  // Criar tarefa
  async createTask(req, res) {
    try {
      const { name, cost, deadline } = req.body;

      // Encontrar o maior valor de 'order' existente
      const maxOrder = await Task.findOne().sort({ order: -1 }); // Pega a tarefa com o maior valor de 'order'
      const order = maxOrder ? maxOrder.order + 1 : 1; // Se não houver tarefa, começa com 1

      const task = new Task({ name, cost, deadline, order });
      await task.save();
      
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: "Falha ao criar tarefa" });
    }
  },

  // Atualizar tarefa
  async updateTask(req, res) {
    try {
      const { _id } = req.params;
      const { name, cost, deadline } = req.body;

      const task = await Task.findById(_id);
      if (!task) return res.status(404).json({ error: "Tarefa não encontrada" });

      task.name = name;
      task.cost = cost;
      task.deadline = deadline;

      await task.save();
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Falha ao atualizar tarefa" });
    }
  },

  // Deletar tarefa
  async deleteTask(req, res) {
    try {
      const { _id } = req.params;
      
      const task = await Task.findByIdAndDelete(_id);
      
      if (!task) {
          return res.status(404).json({ error: "Tarefa não encontrada" });
      }

      res.json({ message: "Sucesso ao deletar tarefa" });
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      res.status(500).json({ error: "Falha ao deletar tarefa" });
    }
  },

  // Atualizar ordem
  async updateOrder(req, res) {
    const { currentId, targetId } = req.body;

    if (!currentId || !targetId) {
      return res.status(400).json({ error: 'IDs inválidos' });
    }

    try {
      // Encontrar as tarefas
      const currentTask = await Task.findById(currentId);
      const targetTask = await Task.findById(targetId);

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
      console.error('Erro ao atualizar ordem:', error);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
  },

  // Atualizar ordem via drag-and-drop
  async updateOrderDragAndDrop(req, res) {
    const tasks = req.body; // Array de tarefas com as ordens atualizadas

    if (!tasks || !Array.isArray(tasks)) {
        return res.status(400).json({ error: 'Dados inválidos' });
    }

    try {
        // Atualiza a ordem de todas as tarefas
        const updatePromises = tasks.map(task => {
            return Task.findByIdAndUpdate(task._id, { order: task.order });
        });

        // Aguarda todas as atualizações
        await Promise.all(updatePromises);

        res.status(200).json({ message: 'Ordens atualizadas com sucesso.' });
    } catch (error) {
        console.error('Erro ao atualizar as ordens:', error);
        res.status(500).json({ error: 'Erro ao atualizar as ordens no servidor.' });
    }
  }
};