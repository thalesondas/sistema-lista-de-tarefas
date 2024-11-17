const { Task } = require("../models");

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
      const order = await Task.count() + 1;
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
};