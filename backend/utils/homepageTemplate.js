const fs = require('fs').promises;
const path = require('path');

class HomepageTemplate {
  constructor() {
    this.templatePath = path.join(__dirname, '../public/index.html');
  }

  // Helper function to escape HTML entities
  escapeHtml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  async generateHomepage(homepageData) {
    try {
      // Read the original template
      let template = await fs.readFile(this.templatePath, 'utf8');

      // Replace hero section content
      if (homepageData.hero) {
        console.log('Replacing hero content:', homepageData.hero.description);
        
        // Replace main hero headlines
        if (homepageData.hero.headline1) {
          template = template.replace(
            /<h1 class="heading-style-xl">We Invest IN<\/h1>/,
            `<h1 class="heading-style-xl">${this.escapeHtml(homepageData.hero.headline1)}</h1>`
          );
        }
        
        if (homepageData.hero.headline2) {
          template = template.replace(
            /<h1 class="heading-style-xl">Bold Founders<\/h1>/,
            `<h1 class="heading-style-xl">${this.escapeHtml(homepageData.hero.headline2)}</h1>`
          );
        }
        
        // Replace hero description
        template = template.replace(
          /<p class="text-size-small text-color-white text-align-center">Let&#x27;s journey together into[\s\S]*?industries with unbounded growth potential\.<\/p>/,
          `<p class="text-size-small text-color-white text-align-center">${this.escapeHtml(homepageData.hero.description)}</p>`
        );
      }

      // Replace logo section content
      if (homepageData.logoSection) {
        console.log('Replacing logo section content');
        template = template.replace(
          /<h2 class="heading-style-h1">We understand<br \/>VCs are tough<\/h2>/,
          `<h2 class="heading-style-h1">${homepageData.logoSection.title}</h2>`
        );
        
        template = template.replace(
          /<p class="text-size-regular text-color-white">We are dedicated to finding the most tenacious[\s\S]*?and ambitious minds in four key industries\.<\/p>/,
          `<p class="text-size-regular text-color-white">${this.escapeHtml(homepageData.logoSection.description)}</p>`
        );

        template = template.replace(
          /<div class="text-size-tiny text-style-allcaps">View Our Verticles<\/div>/g,
          `<div class="text-size-tiny text-style-allcaps">${this.escapeHtml(homepageData.logoSection.buttonText)}</div>`
        );

        // Replace company logos
        if (homepageData.logoSection.logos && homepageData.logoSection.logos.length > 0) {
          console.log('Replacing company logos');
          
          // Generate the logos HTML from CMS data
          const logosHtml = homepageData.logoSection.logos.map(logo => `
            <div class="home-logo-item">
              <div class="home-logo-holder">
                <div class="home-logo-base">
                  <img src="${this.escapeHtml(logo.image)}" loading="lazy" alt="${this.escapeHtml(logo.alt)}" class="home-logo-image">
                </div>
              </div>
            </div>
          `).join('');

          // Replace the entire logos grid with CMS data
          template = template.replace(
            /<div id="w-node-_0b0c344d-7d3b-65b8-0fa5-2db7567289fa-ae360d93" class="home-logos-grid">[\s\S]*?<\/div>(?=\s*<\/div>\s*<\/div>\s*<\/div>)/,
            `<div id="w-node-_0b0c344d-7d3b-65b8-0fa5-2db7567289fa-ae360d93" class="home-logos-grid">
              ${logosHtml}
            </div>`
          );
        }
      }

      // Replace benefits section
      if (homepageData.benefitsSection) {
        console.log('Replacing benefits section content');
        template = template.replace(
          /<h2 class="heading-style-h1">We understand our founders<\/h2>/,
          `<h2 class="heading-style-h1">${this.escapeHtml(homepageData.benefitsSection.title)}</h2>`
        );

        template = template.replace(
          /<p class="text-size-regular dual-paragraph">Bold Capital is on a mission[\s\S]*?massive growth potential\.<\/p>/,
          `<p class="text-size-regular dual-paragraph">${this.escapeHtml(homepageData.benefitsSection.description)}</p>`
        );
      }

      // Replace process cards
      if (homepageData.processCards && homepageData.processCards.length >= 4) {
        // Replace card 1
        template = template.replace(
          /<div class="heading-style-h2">01<\/div>/,
          `<div class="heading-style-h2">${homepageData.processCards[0].number}</div>`
        );
        template = template.replace(
          /<h3 class="heading-style-h3">Pre-Seed<\/h3>/,
          `<h3 class="heading-style-h3">${homepageData.processCards[0].title}</h3>`
        );
        template = template.replace(
          /<p class="text-size-small text-color-white">We invest at the pre-seed stage, providing up to \$750k in capital to help founders grow to the next level\. <\/p>/,
          `<p class="text-size-small text-color-white">${homepageData.processCards[0].description}</p>`
        );

        // Replace card 2
        template = template.replace(
          /<div class="heading-style-h2">02<\/div>/,
          `<div class="heading-style-h2">${homepageData.processCards[1].number}</div>`
        );
        template = template.replace(
          /<h3 class="heading-style-h3">Unicorns<\/h3>/,
          `<h3 class="heading-style-h3">${homepageData.processCards[1].title}</h3>`
        );
        template = template.replace(
          /<p class="text-size-small text-color-white">Our portfolio companies have reached unicorn status, and our founders maintain a large amount of equity\.<\/p>/,
          `<p class="text-size-small text-color-white">${homepageData.processCards[1].description}</p>`
        );

        // Replace card 3
        template = template.replace(
          /<div class="heading-style-h2">03<\/div>/,
          `<div class="heading-style-h2">${homepageData.processCards[2].number}</div>`
        );
        template = template.replace(
          /<h3 class="heading-style-h3">Process<\/h3>/,
          `<h3 class="heading-style-h3">${homepageData.processCards[2].title}</h3>`
        );
        template = template.replace(
          /<p class="text-size-small text-color-white">Our transparent and open investment process ensures you always know where you are in our process\.<\/p>/,
          `<p class="text-size-small text-color-white">${homepageData.processCards[2].description}</p>`
        );

        // Replace card 4
        template = template.replace(
          /<div class="heading-style-h2">04<\/div>/,
          `<div class="heading-style-h2">${homepageData.processCards[3].number}</div>`
        );
        template = template.replace(
          /<h3 class="heading-style-h3">\$400k\+<\/h3>/,
          `<h3 class="heading-style-h3">${homepageData.processCards[3].title}</h3>`
        );
        template = template.replace(
          /<p class="text-size-small text-color-white">We&#x27;re passionate about helping founders grow fast, and our average initial cheque size is \$400k\.<\/p>/,
          `<p class="text-size-small text-color-white">${homepageData.processCards[3].description}</p>`
        );
      }

      // Replace portfolio section
      if (homepageData.portfolioSection) {
        template = template.replace(
          /<h2 class="heading-style-h1 text-align-center">Our investments are top-tier<\/h2>/,
          `<h2 class="heading-style-h1 text-align-center">${homepageData.portfolioSection.title}</h2>`
        );

        template = template.replace(
          /<p class="text-size-small text-align-center">Most of our portfolio companies have achieved unicorn exits with our founders holding majority equity\.<\/p>/,
          `<p class="text-size-small text-align-center">${homepageData.portfolioSection.description}</p>`
        );

        template = template.replace(
          /<div class="text-size-tiny text-style-allcaps">View Our Portfolio<\/div>/g,
          `<div class="text-size-tiny text-style-allcaps">${homepageData.portfolioSection.buttonText}</div>`
        );

        if (homepageData.portfolioSection.image) {
          template = template.replace(
            /src="images\/venture-008\.webp"/,
            `src="${homepageData.portfolioSection.image}"`
          );
        }
      }

      // Replace team section
      if (homepageData.teamSection) {
        template = template.replace(
          /<h2 class="heading-style-h1">We found the<br \/>best tallent<\/h2>/,
          `<h2 class="heading-style-h1">${homepageData.teamSection.title}</h2>`
        );

        template = template.replace(
          /<p class="text-size-regular text-color-white">Our team is passionate about working with founders who break through barriers\.<\/p>/,
          `<p class="text-size-regular text-color-white">${homepageData.teamSection.description}</p>`
        );

        template = template.replace(
          /<div class="text-size-tiny text-style-allcaps">Read our story<\/div>/g,
          `<div class="text-size-tiny text-style-allcaps">${homepageData.teamSection.buttonText}</div>`
        );
      }

      return template;
    } catch (error) {
      console.error('Error generating homepage:', error);
      throw error;
    }
  }
}

module.exports = HomepageTemplate;
