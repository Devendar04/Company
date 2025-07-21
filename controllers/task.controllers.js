import task from '../models/Task.models.js';
import User from '../models/User.models.js';
export const getAllTasks = async (req, res) => {
    try {
        const tasks = await task.find()
        res.status(200).json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export const createTask = async (req, res) => {

    const { title, description, assignedTo  } = req.body;
    if (!title || !description || !assignedTo) {
        return res.status(400).json({ message: 'Bad request, somrthimg is missing' });
    }
    try {
        const newTask = await task.create({ title, description, assignedTo });
        res.status(201).json(newTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}


export const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTask = await task.findByIdAndDelete(id);
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, assignedTo, status } = req.body;
    try {
           if (!assignedTo || assignedTo.trim() === "") {
            assignedTo = null; // or undefined, or don't include it at all
        }
        const updatedTask = await task.findByIdAndUpdate(id, { title, description, assignedTo, status }, { new: true });
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(updatedTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export const completedTask = async (req, res) => {
    const { id } = req.params;
    try {
        const completedTask = await task.findByIdAndUpdate(id, { status: 'completed' }, { new: true });
        if (!completedTask) {  
            return res.status(404).json({ message: 'Task not found' }); 
        }

        res.status(200).json(completedTask);
    } catch (err) { 
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}


export const changeRole = async (req, res) => {
  const { role } = req.body;
  const { id } = req.params;

  try {
    const user = await User.findById(id);   
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const validRoles = ['admin', 'manager', 'teamlead', 'employee'];
    const userRole = validRoles.indexOf(user.role); 
    const targetRole = validRoles.indexOf(role);

    if (targetRole < userRole) {
      return res.status(403).json({ message: 'Cannot change to a lower role' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ message: 'Role updated successfully', user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
