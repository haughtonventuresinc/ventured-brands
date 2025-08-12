const bcrypt = require('bcryptjs');
const database = require('../utils/database');

class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role || 'editor';
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.lastLogin = data.lastLogin;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Hash password before saving
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  // Compare password
  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Remove password from JSON output
  toJSON() {
    const user = { ...this };
    delete user.password;
    return user;
  }

  // Save user to database
  async save() {
    if (this.id) {
      // Update existing user
      const updated = await database.updateUser(this.id, {
        email: this.email,
        password: this.password,
        role: this.role,
        isActive: this.isActive,
        lastLogin: this.lastLogin
      });
      return updated ? new User(updated) : null;
    } else {
      // Create new user
      await this.hashPassword();
      const created = await database.createUser({
        email: this.email,
        password: this.password,
        role: this.role,
        isActive: this.isActive,
        lastLogin: this.lastLogin
      });
      return new User(created);
    }
  }

  // Static methods
  static async findById(id) {
    const userData = await database.getUserById(id);
    return userData ? new User(userData) : null;
  }

  static async findByEmail(email) {
    const userData = await database.getUserByEmail(email);
    return userData ? new User(userData) : null;
  }

  static async find() {
    const usersData = await database.getUsers();
    return usersData.map(userData => new User(userData));
  }

  static async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  static async findByIdAndDelete(id) {
    return await database.deleteUser(id);
  }
}

module.exports = User;
