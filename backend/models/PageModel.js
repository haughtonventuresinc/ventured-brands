const database = require('../utils/database');

class Page {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.slug = data.slug;
    this.title = data.title;
    this.description = data.description;
    this.htmlFile = data.htmlFile;
    this.contentBlocks = data.contentBlocks || [];
    this.isPublished = data.isPublished !== undefined ? data.isPublished : true;
    this.lastModified = data.lastModified;
    this.modifiedBy = data.modifiedBy;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Update lastModified on save
  updateLastModified() {
    this.lastModified = new Date().toISOString();
  }

  // Save page to database
  async save() {
    this.updateLastModified();
    
    if (this.id) {
      // Update existing page
      const updated = await database.updatePage(this.id, {
        name: this.name,
        slug: this.slug,
        title: this.title,
        description: this.description,
        htmlFile: this.htmlFile,
        contentBlocks: this.contentBlocks,
        isPublished: this.isPublished,
        lastModified: this.lastModified,
        modifiedBy: this.modifiedBy
      });
      return updated ? new Page(updated) : null;
    } else {
      // Create new page
      const created = await database.createPage({
        name: this.name,
        slug: this.slug,
        title: this.title,
        description: this.description,
        htmlFile: this.htmlFile,
        contentBlocks: this.contentBlocks,
        isPublished: this.isPublished,
        lastModified: this.lastModified,
        modifiedBy: this.modifiedBy
      });
      return new Page(created);
    }
  }

  // Static methods
  static async findById(id) {
    const pageData = await database.getPageById(id);
    return pageData ? new Page(pageData) : null;
  }

  static async findBySlug(slug) {
    const pageData = await database.getPageBySlug(slug);
    return pageData ? new Page(pageData) : null;
  }

  static async find() {
    const pagesData = await database.getPages();
    return pagesData.map(pageData => new Page(pageData));
  }

  static async create(pageData) {
    const page = new Page(pageData);
    return await page.save();
  }

  static async findByIdAndDelete(id) {
    return await database.deletePage(id);
  }

  static async findOne(query) {
    const pages = await database.getPages();
    let foundPage = null;

    if (query.slug) {
      foundPage = pages.find(page => page.slug === query.slug);
    } else if (query.name) {
      foundPage = pages.find(page => page.name === query.name);
    }

    return foundPage ? new Page(foundPage) : null;
  }

  // Populate method simulation (for compatibility with existing code)
  async populate(field, select) {
    if (field === 'modifiedBy' && this.modifiedBy) {
      const User = require('./UserModel');
      const user = await User.findById(this.modifiedBy);
      if (user) {
        this.modifiedBy = select === 'email' ? { email: user.email } : user.toJSON();
      }
    }
    return this;
  }
}

module.exports = Page;
