import { findUserById, updateUserById, deleteUserById } from '../models/userModels.js';

export const getUser = async (req, res) => {
    const { id } = req.params;
    const { role } = req.query; 

    if (!role || !['applicant', 'employer'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role provided' });
    }

    try {
        const user = await findUserById(id, role);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { role } = req.query; 
    const updates = req.body;

    try {
        const updatedUser = await updateUserById(id, updates, role);

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', updatedUser });

    } catch (error) {
        console.log("Error khaiyo!")
        res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
      await deleteUserById(id);
      res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
