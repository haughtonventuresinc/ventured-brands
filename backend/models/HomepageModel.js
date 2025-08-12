const fs = require('fs').promises;
const path = require('path');

class HomepageModel {
  constructor() {
    this.dataPath = path.join(__dirname, '../data/homepage.json');
    this.initializeData();
  }

  async initializeData() {
    try {
      await fs.access(this.dataPath);
    } catch (error) {
      // File doesn't exist, create default data
      const defaultData = {
        hero: {
          title: "Ventured Brands",
          subtitle: "Building Tomorrow's Brands Today",
          description: "We are a venture studio that creates, launches, and scales innovative brands across multiple industries."
        },
        logoSection: {
          title: "We understand<br />VCs are tough",
          description: "We are dedicated to finding the most tenacious and ambitious minds in four key industries.",
          buttonText: "View Our Verticles"
        },
        benefitsSection: {
          title: "We understand our founders",
          description: "Bold Capital is on a mission to back the boldest founders changing industries across four verticals. Our portfolio companies have reached unicorn exits, with our founders maintaining a large amount of equity. We're here to help our founders achieve their goals and break into industries with massive growth potential."
        },
        processCards: [
          {
            number: "01",
            title: "Pre-Seed",
            description: "We invest at the pre-seed stage, providing up to $750k in capital to help founders grow to the next level."
          },
          {
            number: "02", 
            title: "Unicorns",
            description: "Our portfolio companies have reached unicorn status, and our founders maintain a large amount of equity."
          },
          {
            number: "03",
            title: "Process", 
            description: "Our transparent and open investment process ensures you always know where you are in our process."
          },
          {
            number: "04",
            title: "$400k+",
            description: "We're passionate about helping founders grow fast, and our average initial cheque size is $400k."
          }
        ],
        portfolioSection: {
          title: "Our investments are top-tier",
          description: "Most of our portfolio companies have achieved unicorn exits with our founders holding majority equity.",
          buttonText: "View Our Portfolio",
          image: "images/venture-008.webp"
        },
        teamSection: {
          title: "We found the<br />best tallent",
          description: "Our team is passionate about working with founders who break through barriers.",
          buttonText: "Read our story"
        },
        logos: [
          { name: "Washology", image: "images/Washology.png", alt: "Washology logo" },
          { name: "Swim Studs", image: "images/Swim Studs.png", alt: "Swim Studs logo" },
          { name: "InspectorWiz", image: "images/InspectorWiz™ NoBG.png", alt: "InspectorWiz logo" },
          { name: "Slack", image: "images/slack-light.svg", alt: "Slack logo" },
          { name: "Stripe", image: "images/stripe-light.svg", alt: "Stripe logo" },
          { name: "Upwork", image: "images/upwork-light.svg", alt: "Upwork logo" },
          { name: "Gusto", image: "images/gusto-light.svg", alt: "Gusto logo" },
          { name: "Attentive", image: "images/attentive-light.svg", alt: "Attentive logo" },
          { name: "Dribbble", image: "images/dribbble-light.svg", alt: "Dribbble logo" }
        ],
        updatedAt: new Date().toISOString()
      };
      
      await this.save(defaultData);
    }
  }

  async getContent() {
    try {
      const data = await fs.readFile(this.dataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading homepage data:', error);
      throw error;
    }
  }

  async updateContent(content) {
    try {
      const currentData = await this.getContent();
      const updatedData = {
        ...currentData,
        ...content,
        updatedAt: new Date().toISOString()
      };
      
      await this.save(updatedData);
      return updatedData;
    } catch (error) {
      console.error('Error updating homepage data:', error);
      throw error;
    }
  }

  async save(data) {
    try {
      await fs.writeFile(this.dataPath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error saving homepage data:', error);
      throw error;
    }
  }

  async updateSection(sectionName, sectionData) {
    try {
      const currentData = await this.getContent();
      currentData[sectionName] = { ...currentData[sectionName], ...sectionData };
      currentData.updatedAt = new Date().toISOString();
      
      await this.save(currentData);
      return currentData;
    } catch (error) {
      console.error('Error updating homepage section:', error);
      throw error;
    }
  }
}

module.exports = HomepageModel;
