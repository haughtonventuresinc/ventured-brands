const fs = require('fs').promises;
const path = require('path');

class JSONDatabase {
  constructor() {
    this.dataDir = path.join(__dirname, '../data');
    this.usersFile = path.join(this.dataDir, 'users.json');
    this.pagesFile = path.join(this.dataDir, 'pages.json');
    this.init();
  }

  async init() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
      
      // Initialize users file if it doesn't exist
      try {
        await fs.access(this.usersFile);
      } catch {
        await fs.writeFile(this.usersFile, JSON.stringify([], null, 2));
      }

      // Initialize pages file if it doesn't exist
      try {
        await fs.access(this.pagesFile);
      } catch {
        await fs.writeFile(this.pagesFile, JSON.stringify([], null, 2));
      }
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  }

  async readFile(filePath) {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading file:', error);
      return [];
    }
  }

  async writeFile(filePath, data) {
    try {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Error writing file:', error);
      return false;
    }
  }

  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // User operations
  async getUsers() {
    return await this.readFile(this.usersFile);
  }

  async getUserById(id) {
    const users = await this.getUsers();
    return users.find(user => user.id === id);
  }

  async getUserByEmail(email) {
    const users = await this.getUsers();
    return users.find(user => user.email === email);
  }

  async createUser(userData) {
    const users = await this.getUsers();
    const newUser = {
      id: this.generateId(),
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    users.push(newUser);
    await this.writeFile(this.usersFile, users);
    return newUser;
  }

  async updateUser(id, updateData) {
    const users = await this.getUsers();
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) return null;
    
    users[userIndex] = {
      ...users[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    await this.writeFile(this.usersFile, users);
    return users[userIndex];
  }

  async deleteUser(id) {
    const users = await this.getUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    
    if (users.length === filteredUsers.length) return false;
    
    await this.writeFile(this.usersFile, filteredUsers);
    return true;
  }

  // Page operations
  async getPages() {
    return await this.readFile(this.pagesFile);
  }

  async getPageById(id) {
    const pages = await this.getPages();
    return pages.find(page => page.id === id);
  }

  async getPageBySlug(slug) {
    const pages = await this.getPages();
    return pages.find(page => page.slug === slug);
  }

  async createPage(pageData) {
    const pages = await this.getPages();
    const newPage = {
      id: this.generateId(),
      ...pageData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    
    pages.push(newPage);
    await this.writeFile(this.pagesFile, pages);
    return newPage;
  }

  async updatePage(id, updateData) {
    const pages = await this.getPages();
    const pageIndex = pages.findIndex(page => page.id === id);
    
    if (pageIndex === -1) return null;
    
    pages[pageIndex] = {
      ...pages[pageIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    
    await this.writeFile(this.pagesFile, pages);
    return pages[pageIndex];
  }

  async deletePage(id) {
    const pages = await this.getPages();
    const filteredPages = pages.filter(page => page.id !== id);
    
    if (pages.length === filteredPages.length) return false;
    
    await this.writeFile(this.pagesFile, filteredPages);
    return true;
  }

  // Verticals operations
  async getVerticals() {
    const verticalsFile = path.join(this.dataDir, 'verticals.json');
    try {
      const data = await this.readFile(verticalsFile);
      return data;
    } catch (error) {
      // Return default structure if file doesn't exist or is corrupted
      const defaultVerticals = {
        lastUpdated: new Date().toISOString(),
        sections: [
          {
            id: "live",
            title: "Live",
            shortDescription: "Changing lives",
            longDescription: "Licensing brands that make daily living better, cleaner, and easier."
          },
          {
            id: "work",
            title: "Work", 
            shortDescription: "Boosting growth",
            longDescription: "Creating plug-and-play business models that help owners scale fast."
          },
          {
            id: "play",
            title: "Play",
            shortDescription: "Reinventing fun",
            longDescription: "Building nostalgic and exciting brands customers can't resist."
          },
          {
            id: "learn",
            title: "Learn",
            shortDescription: "Pushing minds",
            longDescription: "Designing businesses that teach, train, and inspire at scale."
          }
        ]
      };
      await this.writeFile(verticalsFile, defaultVerticals);
      return defaultVerticals;
    }
  }

  async updateVerticals(verticalsData) {
    const verticalsFile = path.join(this.dataDir, 'verticals.json');
    const updatedData = {
      ...verticalsData,
      lastUpdated: new Date().toISOString()
    };
    
    const success = await this.writeFile(verticalsFile, updatedData);
    return success ? updatedData : null;
  }

  // Portfolio operations
  async getPortfolio() {
    const portfolioFile = path.join(this.dataDir, 'portfolio.json');
    try {
      const data = await this.readFile(portfolioFile);
      return data;
    } catch (error) {
      // Return default structure if file doesn't exist or is corrupted
      const defaultPortfolio = {
        lastUpdated: new Date().toISOString(),
        hero: {
          title: "Explore our work",
          description: "Sixteen of our companies have reached unicorn exits, with our founders holding a majority of the equity in their company."
        },
        projects: [
          {
            id: "slack",
            title: "Slack",
            category: "Work",
            date: "10.23.2021",
            url: "/work/slack",
            isActive: true
          },
          {
            id: "asana",
            title: "Asana",
            category: "Work",
            date: "09.15.2021",
            url: "/work/asana",
            isActive: true
          },
          {
            id: "airbnb",
            title: "Airbnb",
            category: "Live",
            date: "08.12.2021",
            url: "/work/airbnb",
            isActive: true
          },
          {
            id: "square",
            title: "Square",
            category: "Work",
            date: "07.08.2021",
            url: "/work/square",
            isActive: true
          },
          {
            id: "pendo",
            title: "Pendo",
            category: "Learn",
            date: "06.22.2021",
            url: "/work/pendo",
            isActive: true
          },
          {
            id: "zoom",
            title: "Zoom",
            category: "Work",
            date: "05.18.2021",
            url: "/work/zoom",
            isActive: true
          },
          {
            id: "gusto",
            title: "Gusto",
            category: "Work",
            date: "04.14.2021",
            url: "/work/gusto",
            isActive: true
          },
          {
            id: "docusign",
            title: "DocuSign",
            category: "Work",
            date: "03.10.2021",
            url: "/work/docusign",
            isActive: true
          },
          {
            id: "zapier",
            title: "Zapier",
            category: "Work",
            date: "02.25.2021",
            url: "/work/zapier",
            isActive: true
          },
          {
            id: "dribbble",
            title: "Dribbble",
            category: "Play",
            date: "01.30.2021",
            url: "/work/dribbble",
            isActive: true
          }
        ]
      };
      await this.writeFile(portfolioFile, defaultPortfolio);
      return defaultPortfolio;
    }
  }

  async updatePortfolio(portfolioData) {
    const portfolioFile = path.join(this.dataDir, 'portfolio.json');
    const updatedData = {
      ...portfolioData,
      lastUpdated: new Date().toISOString()
    };
    
    const success = await this.writeFile(portfolioFile, updatedData);
    return success ? updatedData : null;
  }
}

module.exports = new JSONDatabase();
